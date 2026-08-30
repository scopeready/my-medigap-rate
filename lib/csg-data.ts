import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { EvidenceEnvelope, EvidenceTier, SourceCitation, VerificationStatus } from "./evidence";

/**
 * Build-time loader for the licensed reconciliation kit.
 *
 * The kit lives at `data/csg/ecos-csg/recon/` (git-ignored) and is read only on the
 * server, only at build time. It is never bundled into client code, never
 * copied into `public/`, and the vendor is never named on a public page.
 *
 * The loader is deliberately tolerant: when the directory is absent — which is
 * the case on Vercel, and will stay the case — every lookup returns nothing and
 * the site renders in its unverified state. The build must never fail because
 * the data is missing.
 */

/**
 * Kept statically rooted on purpose: a variable directory here makes the
 * bundler trace the entire project into the server output.
 */
const RECON_DIR = path.join(process.cwd(), "data", "csg", "ecos-csg", "recon");

type ReconFile = "reconciliation_layer.json" | "serff_queue.json";

/** One filed rate action against a single block. */
export interface RateIncrease {
  /** ISO date the action took effect. */
  effectiveDate: string;
  /** Change as a decimal fraction — 0.399 for 39.9%. See `pct()` below. */
  percent: number;
  /**
   * True when the action is dated after the snapshot was taken: filed and
   * announced, but not yet in effect. Requested is not approved, so these are
   * kept out of `ratePercent` and labelled wherever they are shown.
   */
  scheduled: boolean;
}

export interface RateRecord extends EvidenceEnvelope {
  /** Block identifier from the reconciler: state|plan|NAIC|rating-class|age. */
  key?: string;
  /** USPS state abbreviation. */
  state: string;
  /** Plan letter as filed, e.g. "G", "N", "HDG". */
  plan: string;
  /** Issuer's marketed name. */
  carrier: string;
  /** NAIC company code, when the export carries one. */
  naic?: string;
  /**
   * Rating class within the carrier's book, e.g. "Preferred", "Standard II".
   * Two classes from one issuer are separate blocks and never aggregate.
   */
  ratingClass?: string;
  /** Effective date of the most recent rate action already in force, ISO. */
  effectiveDate?: string;
  /** That action's change, as a decimal fraction. */
  ratePercent?: number;
  /**
   * Every filed action on this block, oldest first, scheduled ones included
   * and flagged. A single figure cannot show a trajectory, and the trajectory
   * is the point: two blocks of one brand in one state can run very
   * differently, which is why nothing here aggregates across blocks.
   */
  increaseHistory: RateIncrease[];
  /** Monthly premium in dollars for the quoted scenario. */
  premium?: number;
  /** Issue age the premium belongs to. */
  age?: number;
  /** Rating method: attained-age, issue-age or community. */
  ratingMethod?: string;
  /** Whether the agency is licensed to write business in this state. */
  licensedState: boolean;
}

export interface QueueItem {
  state: string;
  plan: string;
  carrier: string;
  naic?: string;
  /**
   * Position in the verification worklist. A unique ordinal over the whole
   * queue, not a priority tier: the reconciler sorts licensed states first,
   * then by largest filed increase, and numbers the result. Take the lowest
   * ranks; do not filter for a particular value.
   */
  rank: number;
  /** What to look for in the filing — the reason this block was queued. */
  flags: string[];
  /** Where to look, e.g. "NV DOI / SERFF filing search, NAIC 67059". */
  where?: string;
}

interface Snapshot {
  records: RateRecord[];
  queue: QueueItem[];
  /** True when the kit was found on disk. */
  present: boolean;
}

let cache: Snapshot | null = null;

function readJson(name: ReconFile): unknown {
  const file = path.join(RECON_DIR, name);
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    // A malformed or unreadable kit is treated exactly like an absent one.
    return null;
  }
}

function toArray(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  if (raw && typeof raw === "object") {
    for (const key of ["records", "items", "rows", "data", "queue"]) {
      const v = (raw as Record<string, unknown>)[key];
      if (Array.isArray(v)) return v as Record<string, unknown>[];
    }
  }
  return [];
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

const num = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/[$,%\s,]/g, "")) : NaN;
  return Number.isFinite(n) ? n : undefined;
};

/**
 * The kit stores rate changes as percentages (39.9 meaning 39.9%); the site
 * formats fractions (`percent()` in lib/format.ts renders 0.399 as "+39.9%").
 * The conversion happens here and only here — doing it twice, or not at all,
 * misstates every rate action on the site by two orders of magnitude.
 */
const pct = (v: unknown): number | undefined => {
  const n = num(v);
  return n === undefined ? undefined : n / 100;
};

/** Reads a nested value, e.g. obj("premium").monthly, without throwing. */
function nested(r: Record<string, unknown>, key: string): Record<string, unknown> {
  const v = r[key];
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function citation(v: unknown): SourceCitation | null {
  if (!v || typeof v !== "object") return null;
  const c = v as Record<string, unknown>;
  const filingNumber = str(c.filingNumber) ?? str(c.filing_number) ?? str(c.serff_number) ?? str(c.filing_id);
  const url = str(c.url);
  const regulator = str(c.regulator) ?? str(c.state_regulator);
  if (!filingNumber || !url || !regulator) return null;
  return {
    filingNumber,
    url,
    regulator,
    accessed: str(c.accessed) ?? str(c.accessed_at) ?? str(c.retrieved) ?? "",
    exhibit: str(c.exhibit),
  };
}

/**
 * Builds the rate-action series for one block.
 *
 * Entries with a recorded 0% are kept: a filed action of zero is a real fact
 * about the block. What is never invented is the opposite — a block with no
 * recorded history yields an empty series, never a zero.
 */
function increases(r: Record<string, unknown>): RateIncrease[] {
  const raw = Array.isArray(r.increase_history) ? (r.increase_history as unknown[]) : [];
  const scheduledDates = new Set(
    (Array.isArray(r.scheduled_increases_after_export) ? r.scheduled_increases_after_export : [])
      .map((h) => str((h as Record<string, unknown>)?.effective_date))
      .filter((d): d is string => Boolean(d)),
  );

  return raw
    .map((h) => {
      const row = (h ?? {}) as Record<string, unknown>;
      const effectiveDate = str(row.effective_date) ?? str(row.effectiveDate);
      const percent = pct(row.increase_pct ?? row.percent);
      if (!effectiveDate || percent === undefined) return null;
      return { effectiveDate, percent, scheduled: scheduledDates.has(effectiveDate) };
    })
    .filter((h): h is RateIncrease => h !== null)
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
}

/** Normalize one raw row. Anything unrecognized becomes Tier C / not publishable. */
function normalizeRecord(r: Record<string, unknown>): RateRecord | null {
  const state = (str(r.state) ?? str(r.state_abbr) ?? str(r.st) ?? "").toUpperCase();
  const plan = (str(r.plan) ?? str(r.plan_letter) ?? "").toUpperCase();
  const carrier = str(r.carrier) ?? str(r.company) ?? str(r.issuer) ?? "";
  if (!state || !plan || !carrier) return null;

  const tierRaw = (str(r.evidence_tier) ?? "C").toUpperCase();
  const evidence_tier: EvidenceTier = tierRaw === "A" || tierRaw === "B" ? tierRaw : "C";

  const statusRaw = str(r.verification_status) ?? "unverified";
  const allowed: VerificationStatus[] = [
    "unverified", "in_review", "filing_confirmed", "superseded", "withdrawn",
  ];
  const verification_status = (allowed as string[]).includes(statusRaw)
    ? (statusRaw as VerificationStatus)
    : "unverified";

  const premiumObj = nested(r, "premium");
  const profile = nested(r, "profile");
  const increaseHistory = increases(r);
  // The headline figure is the latest action actually in force. A scheduled
  // one has been filed but not yet applied, so it does not become the record's
  // rate change; it stays in the series, flagged.
  const inForce = increaseHistory.filter((h) => !h.scheduled);
  const latest = inForce.length ? inForce[inForce.length - 1] : undefined;

  return {
    key: str(r.key),
    state,
    plan,
    carrier,
    naic: str(r.naic) ?? str(r.naic_code),
    ratingClass: str(r.rating_class),
    effectiveDate: latest?.effectiveDate ?? str(premiumObj.rate_effective_date) ?? str(r.effective_date),
    ratePercent: latest?.percent,
    increaseHistory,
    premium: num(premiumObj.monthly) ?? num(r.monthly_rate) ?? num(r.premium),
    age: num(profile.age) ?? num(r.age),
    ratingMethod: str(r.rate_type) ?? str(r.ratingMethod) ?? str(r.rating_method),
    licensedState: r.licensed_state === true,
    evidence_tier,
    verification_status,
    publishable: r.publishable === true,
    source_citation: citation(r.source_citation),
  };
}

function normalizeQueue(r: Record<string, unknown>): QueueItem | null {
  const state = (str(r.state) ?? str(r.state_abbr) ?? "").toUpperCase();
  const plan = (str(r.plan) ?? str(r.plan_letter) ?? "").toUpperCase();
  const carrier = str(r.carrier) ?? str(r.company) ?? str(r.issuer) ?? "";
  const rank = num(r.rank) ?? num(r.priority) ?? Number.MAX_SAFE_INTEGER;
  if (!state || !carrier) return null;
  const flags = (Array.isArray(r.verify) ? r.verify : Array.isArray(r.flags) ? r.flags : [])
    .map((f) => str(f))
    .filter((f): f is string => Boolean(f));
  return { state, plan, carrier, naic: str(r.naic), rank, flags, where: str(r.where) };
}

export function loadSnapshot(): Snapshot {
  if (cache) return cache;
  const rawRecords = readJson("reconciliation_layer.json");
  const rawQueue = readJson("serff_queue.json");
  const present = rawRecords !== null || rawQueue !== null;

  cache = {
    present,
    records: toArray(rawRecords).map(normalizeRecord).filter((r): r is RateRecord => r !== null),
    queue: toArray(rawQueue).map(normalizeQueue).filter((q): q is QueueItem => q !== null),
  };
  return cache;
}

export function recordsFor(stateAbbr: string, planLetters: readonly string[]): RateRecord[] {
  const want = new Set(planLetters.map((p) => p.toUpperCase()));
  return loadSnapshot().records.filter(
    (r) => r.state === stateAbbr.toUpperCase() && want.has(r.plan),
  );
}
