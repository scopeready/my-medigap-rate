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

export interface RateRecord extends EvidenceEnvelope {
  /** USPS state abbreviation. */
  state: string;
  /** Plan letter as filed, e.g. "G", "N", "HDG". */
  plan: string;
  /** Issuer's marketed name. */
  carrier: string;
  /** NAIC company code, when the export carries one. */
  naic?: string;
  /** Effective date of the filed rate action, ISO. */
  effectiveDate?: string;
  /** Filed rate change as a decimal fraction, e.g. 0.078 for 7.8%. */
  ratePercent?: number;
  /** Monthly premium in dollars for the quoted scenario. */
  premium?: number;
  /** Issue age the premium belongs to. */
  age?: number;
  /** Rating method: attained-age, issue-age or community. */
  ratingMethod?: string;
}

export interface QueueItem {
  state: string;
  plan: string;
  carrier: string;
  /** Verification priority; rank 1 is worked first. */
  rank: number;
  note?: string;
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

function citation(v: unknown): SourceCitation | null {
  if (!v || typeof v !== "object") return null;
  const c = v as Record<string, unknown>;
  const filingNumber = str(c.filingNumber) ?? str(c.filing_number) ?? str(c.serff_number);
  const url = str(c.url);
  const regulator = str(c.regulator) ?? str(c.state_regulator);
  if (!filingNumber || !url || !regulator) return null;
  return {
    filingNumber,
    url,
    regulator,
    accessed: str(c.accessed) ?? str(c.accessed_at) ?? "",
    exhibit: str(c.exhibit),
  };
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

  return {
    state,
    plan,
    carrier,
    naic: str(r.naic) ?? str(r.naic_code),
    effectiveDate: str(r.effectiveDate) ?? str(r.effective_date),
    ratePercent: num(r.ratePercent) ?? num(r.rate_percent) ?? num(r.rate_change),
    premium: num(r.premium) ?? num(r.monthly_premium) ?? num(r.rate),
    age: num(r.age),
    ratingMethod: str(r.ratingMethod) ?? str(r.rating_method),
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
  const rank = num(r.rank) ?? num(r.priority) ?? 99;
  if (!state || !carrier) return null;
  return { state, plan, carrier, rank, note: str(r.note) ?? str(r.reason) };
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
