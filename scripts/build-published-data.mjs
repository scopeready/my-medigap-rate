#!/usr/bin/env node
/**
 * Build the committed, publish-safe rate dataset from the licensed kit.
 *
 * WHY THIS EXISTS
 * ---------------
 * `data/csg/` is git-ignored, so it does not reach Vercel — the production
 * build has no kit at all. Anything the site publishes has to physically ship
 * in the repository. This script is the one place where the licensed research
 * kit is turned into the much smaller file the pages actually read.
 *
 * WHAT IT STRIPS, AND WHY
 * -----------------------
 * The vendor is never named on a public page and its internals never leave
 * this machine. Dropped here and never written to the output:
 *
 *   - `source.file` / `source.page`   — vendor filenames identify the vendor
 *   - `carrier_excel`, `naic_join`    — join-audit fields, internal only
 *   - `age_curve`, `scheduled_*`      — not rendered; no reason to publish
 *   - national market_data            — state figures are the consumer-facing
 *                                       ones; a carrier can be healthy
 *                                       nationally and distressed in a state
 *
 * WHAT IT SUPPRESSES, AND WHY
 * ---------------------------
 * Publishing a figure known to be wrong is worse than publishing nothing. Each
 * rule below removes a value and records the reason; nothing is silently
 * dropped. `npm run data:gaps` prints every suppression as a worklist.
 *
 * Suppression is per-value, not per-record: a carrier with one bad history row
 * keeps its premium and its other rows.
 *
 * Run `npm run data:build` after any kit refresh, then commit the output.
 */
import fs from "node:fs";
import path from "node:path";

const KIT = process.env.CSG_DATA_DIR ?? path.join(process.cwd(), "data", "csg", "ecos-csg");
const LAYER = path.join(KIT, "recon", "reconciliation_layer.json");
const OUT_DIR = path.join(process.cwd(), "data", "published");
const OUT = path.join(OUT_DIR, "rates.json");
const GAPS = path.join(OUT_DIR, "suppressed.json");

/** A monthly premium at or above this is a feed defect, not a Medigap rate. */
const MAX_MONTHLY = 1500;
/** A single filed increase at or above this is a feed defect. */
const MAX_INCREASE_PCT = 100;
/** A state loss ratio outside this range is not a real reported ratio. */
const MAX_LOSS_RATIO = 300;

/**
 * Carriers whose values are known or suspected bad beyond what the numeric
 * bounds catch. Each entry says what we believe and why, because a future
 * reader needs to know whether to re-check it or leave it alone.
 */
const KNOWN_SUSPECT = [
  {
    state: "NC",
    naic: "79987",
    match: /medico corp life/i,
    scope: "premium",
    note: "Premium reads roughly 21x plausible ($3,007 where the market is near $140); the reported increase is consistent with it, implying one inflated current-premium value produced both symptoms. Scoped to the premium: the increase it distorted is removed by the percentage threshold anyway, and the older history rows predate the defect and look ordinary. Raised with the vendor.",
  },
  {
    state: "IA",
    match: /united of omaha/i,
    scope: "history",
    note: "107.6% at both ages, and the Plan N series for this carrier in this state is empty. Possibly an incomplete series rather than a wrong figure. Raised with the vendor.",
  },
  {
    state: "VT",
    match: /blue cross and blue shield of vermont/i,
    scope: "history",
    note: "189.8% on Plan N effective 2025-01-01 where Plan G for the same carrier and date shows 30.4%, and the Plan N series carries two rows against Plan G's six. Raised with the vendor.",
  },
  {
    state: "OK",
    match: /farm bureau/i,
    scope: "history",
    note: "100.0% may be genuine on a small block (3,747 lives): the carrier's own Plan N shows 29.9% on the same date and its other five states look ordinary. Withheld pending confirmation with the Oklahoma Insurance Department rather than dismissed.",
  },
];

const num = (v) => {
  const n = typeof v === "string" ? Number(v.replace(/[$,%\s]/g, "")) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};

if (!fs.existsSync(LAYER)) {
  console.error(`No reconciliation layer at ${path.relative(process.cwd(), LAYER)}.`);
  console.error("Unzip the kit to data/csg/ecos-csg/ first. This script only runs locally;");
  console.error("its committed output is what the site and Vercel actually read.");
  process.exit(1);
}

const layer = JSON.parse(fs.readFileSync(LAYER, "utf8"));
const suppressed = [];
const note = (rec, field, reason, detail) =>
  suppressed.push({
    key: rec.key,
    state: rec.state,
    plan: rec.plan,
    naic: rec.naic,
    carrier: rec.carrier,
    field,
    reason,
    detail,
  });

const suspectHits = new Map(KNOWN_SUSPECT.map((k) => [k, 0]));

function suspectFor(rec) {
  const hit = KNOWN_SUSPECT.find(
    (k) =>
      k.state === rec.state &&
      (!k.naic || k.naic === String(rec.naic)) &&
      k.match.test(String(rec.carrier ?? "")),
  );
  if (hit) suspectHits.set(hit, suspectHits.get(hit) + 1);
  return hit;
}

const rows = [];
for (const rec of layer) {
  const suspect = suspectFor(rec);
  const premium = rec.premium ?? {};
  const profile = rec.profile ?? {};
  const stateMarket = (rec.market_data ?? {}).state ?? {};

  // ---- carrier identity -------------------------------------------------
  // Five records resolved their NAIC by name similarity alone. The whole site
  // rests on the claim that a figure belongs to a named legal entity, so a
  // record we cannot tie to an entity with confidence is not published.
  if (rec.naic_join === "name_only") {
    note(rec, "record", "naic_join_name_only", "NAIC matched by carrier-name similarity, not by an exact rate match. The entity behind the figure is not established, and every claim on this site is entity-level.");
    continue;
  }

  // ---- premium ----------------------------------------------------------
  let monthly = num(premium.monthly);
  if (monthly !== undefined && monthly >= MAX_MONTHLY) {
    note(rec, "premium", "implausible_premium", `$${monthly}/mo is at or above the $${MAX_MONTHLY} defect threshold.`);
    monthly = undefined;
  }
  if (monthly !== undefined && monthly <= 0) {
    note(rec, "premium", "non_positive_premium", `Reported as ${monthly}.`);
    monthly = undefined;
  }
  if (monthly !== undefined && suspect && (suspect.scope === "all" || suspect.scope === "premium")) {
    note(rec, "premium", "known_suspect_carrier", suspect.note);
    monthly = undefined;
  }

  // ---- increase history -------------------------------------------------
  const history = [];
  for (const h of rec.increase_history ?? []) {
    const pct = num(h.increase_pct);
    const date = h.effective_date;
    if (pct === undefined || !date) {
      note(rec, "increase", "incomplete_row", `Missing ${pct === undefined ? "percentage" : "effective date"}. An increase without its effective date is never published.`);
      continue;
    }
    if (Math.abs(pct) >= MAX_INCREASE_PCT) {
      note(rec, "increase", "implausible_increase", `${pct}% effective ${date} is at or above the ${MAX_INCREASE_PCT}% defect threshold.`);
      continue;
    }
    if (suspect && (suspect.scope === "all" || suspect.scope === "history")) {
      note(rec, "increase", "known_suspect_carrier", `${pct}% effective ${date}. ${suspect.note}`);
      continue;
    }
    history.push({ d: date, p: pct });
  }
  history.sort((a, b) => String(b.d).localeCompare(String(a.d)));

  // ---- loss ratio -------------------------------------------------------
  let lossRatio = num(stateMarket.loss_ratio_pct);
  if (lossRatio !== undefined && (lossRatio <= 0 || lossRatio > MAX_LOSS_RATIO)) {
    note(rec, "loss_ratio", "implausible_loss_ratio", `${lossRatio}% is outside the plausible range.`);
    lossRatio = undefined;
  }

  // Nothing left worth a row.
  if (monthly === undefined && history.length === 0 && lossRatio === undefined) continue;

  const row = {
    key: rec.key,
    state: rec.state,
    plan: rec.plan,
    naic: String(rec.naic ?? ""),
    carrier: rec.carrier,
    age: num(profile.age),
  };
  if (rec.parent_group) row.parent = rec.parent_group;
  if (rec.rate_type) row.rateType = rec.rate_type;
  if (rec.rating_class) row.ratingClass = rec.rating_class;
  if (num(rec.years_in_market) !== undefined) row.years = num(rec.years_in_market);
  if ((rec.am_best ?? {}).rating) row.amBest = rec.am_best.rating;
  if (monthly !== undefined) {
    row.monthly = monthly;
    if (num(premium.policy_fee) !== undefined) row.policyFee = num(premium.policy_fee);
    if (num(premium.hh_discount_pct) !== undefined) row.householdPct = num(premium.hh_discount_pct);
    if (premium.rate_effective_date) row.rateEffective = premium.rate_effective_date;
  }
  if (history.length) row.history = history;
  if (lossRatio !== undefined) row.lossRatio = lossRatio;
  if (num(stateMarket.lives) !== undefined) row.lives = num(stateMarket.lives);

  // Carry verification through. Without this the published dataset would be
  // research-only and a record cleared by `npm run data:verify` would silently
  // lose its citation on the site — the verification pass would do nothing
  // visible, which is the failure this project has already had once.
  // The test mirrors gate(): tier A or B, filing_confirmed, publishable, and a
  // citation carrying a filing number, an http(s) URL and a regulator.
  const c = rec.source_citation;
  const citedOk =
    c &&
    typeof c.filingNumber === "string" &&
    c.filingNumber.trim() &&
    typeof c.url === "string" &&
    /^https?:\/\//.test(c.url) &&
    typeof c.regulator === "string" &&
    c.regulator.trim();
  const tier = String(rec.evidence_tier ?? "C").toUpperCase();
  if (
    (tier === "A" || tier === "B") &&
    rec.verification_status === "filing_confirmed" &&
    rec.publishable === true &&
    citedOk
  ) {
    row.tier = tier;
    row.citation = {
      filingNumber: c.filingNumber.trim(),
      url: c.url,
      regulator: c.regulator.trim(),
      ...(c.accessed ? { accessed: c.accessed } : {}),
      ...(c.exhibit ? { exhibit: c.exhibit } : {}),
    };
  }

  rows.push(row);
}

/**
 * The scenario every premium describes. It travels with the data rather than
 * living in a page, so no page can render a premium without it.
 */
const snapshot = {
  profile: "Female, non-tobacco",
  ages: [...new Set(rows.map((r) => r.age).filter(Boolean))].sort((a, b) => a - b),
  areaBasis: "One representative ZIP code per state, the most populous, selected from U.S. Census ZIP-to-county relationship files",
  quoteEffective: "2026-09-01",
  collected: "2026-08-24",
  reverified: "2026-08-26",
  sourceLabel: "a licensed industry rate database",
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ snapshot, rows }, null, 0));
fs.writeFileSync(GAPS, JSON.stringify(suppressed, null, 1));

const bytes = fs.statSync(OUT).size;
const withPremium = rows.filter((r) => r.monthly !== undefined).length;
const withHistory = rows.filter((r) => r.history?.length).length;
const withLoss = rows.filter((r) => r.lossRatio !== undefined).length;
const verified = rows.filter((r) => r.citation).length;

console.log(`Read      ${layer.length} records from the kit`);
console.log(`Published ${rows.length} rows  (${(bytes / 1e6).toFixed(2)} MB)`);
console.log(`  with a premium       ${withPremium}`);
console.log(`  with rate history    ${withHistory}`);
console.log(`  with a loss ratio    ${withLoss}`);
console.log(`  filing-confirmed     ${verified}  (the rest render as unverified)`);
console.log(`Suppressed ${suppressed.length} values -> ${path.relative(process.cwd(), GAPS)}`);

// A KNOWN_SUSPECT rule that matches no record is worse than no rule: it reads
// as protection that is not there. This is not hypothetical -- the NC Medico
// entry originally carried a guessed NAIC and silently matched nothing.
const dead = [...suspectHits.entries()].filter(([, n]) => n === 0);
if (dead.length) {
  console.error(`\n${dead.length} KNOWN_SUSPECT rule(s) matched no record:`);
  for (const [k] of dead) console.error(`   ${k.state} ${k.naic ?? ""} ${k.match}`);
  console.error("Fix the state, NAIC or pattern -- a rule that matches nothing protects nothing.");
  process.exit(1);
}
console.log(`\nCommit ${path.relative(process.cwd(), OUT)} — the site reads it, the kit never ships.`);
console.log(`Run 'npm run data:gaps' for the worklist of what was suppressed and what is missing.`);
