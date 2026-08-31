#!/usr/bin/env node
/**
 * Local-only report on the reconciliation kit.
 *
 * Prints how many records exist, how many have cleared verification, and what
 * the top of each state's queue looks like. Run it before and after a
 * verification session:
 *
 *   npm run data:status
 *   npm run data:status -- NV
 *
 * It reads the git-ignored kit at data/csg/ecos-csg/ and prints nothing
 * identifying the vendor. If the kit is absent it says so and exits 0 — the
 * same condition the production build sees.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = process.env.CSG_DATA_DIR ?? path.join(process.cwd(), "data", "csg", "ecos-csg");
const want = (process.argv[2] ?? "").toUpperCase();

/** The fifteen states the agency is licensed in. Mirrors lib/states.ts. */
const LICENSED = new Set([
  "NV", "CA", "UT", "AZ", "NM", "CO", "MN", "OH", "WA", "GA", "TX", "TN", "FL", "SC", "NC",
]);
const isLicensed = (s) => LICENSED.has(String(s ?? "").toUpperCase());

function read(...parts) {
  const file = path.join(DIR, ...parts);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`  ! ${path.relative(process.cwd(), file)} is not valid JSON: ${err.message}`);
    return null;
  }
}

function rows(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    for (const k of ["records", "items", "rows", "data", "queue"]) {
      if (Array.isArray(raw[k])) return raw[k];
    }
  }
  return [];
}

const records = rows(read("recon", "reconciliation_layer.json"));
const queue = rows(read("recon", "serff_queue.json"));

if (records.length === 0 && queue.length === 0) {
  console.log(`No reconciliation kit found at ${DIR}.`);
  console.log("This is the same state the production build runs in: every figure renders as");
  console.log("unverified and no premium or rate change is published.");
  process.exit(0);
}

const publishable = records.filter(
  (r) =>
    r &&
    r.publishable === true &&
    String(r.evidence_tier).toUpperCase() !== "C" &&
    r.verification_status === "filing_confirmed" &&
    r.source_citation,
);

const byTier = records.reduce((acc, r) => {
  const t = String(r?.evidence_tier ?? "C").toUpperCase();
  acc[t] = (acc[t] ?? 0) + 1;
  return acc;
}, {});

console.log("Reconciliation status");
console.log("---------------------");
console.log(`Records            ${records.length}`);
console.log(`Publishable        ${publishable.length}`);
console.log(`Queue items        ${queue.length}`);
console.log(
  `By tier            ${Object.entries(byTier)
    .sort()
    .map(([t, n]) => `${t}=${n}`)
    .join("  ")}`,
);

// `rank` is a unique ordinal across the whole queue (1..N), not a priority
// tier -- the reconciler sorts licensed states first, then by largest filed
// increase, and numbers the result. So the worklist is the lowest ranks, and
// filtering for rank === 1 would only ever match a single row.
const scoped = want ? queue.filter((q) => String(q?.state).toUpperCase() === want) : queue;
const byRank = [...scoped].sort((a, b) => Number(a?.rank ?? Infinity) - Number(b?.rank ?? Infinity));
const licensedCount = scoped.filter((q) => isLicensed(q?.state)).length;

if (scoped.length) {
  console.log("");
  console.log(`Queue${want ? ` for ${want}` : ""}: ${scoped.length} items, ${licensedCount} in licensed states`);
  console.log("");
  console.log(`Next up (lowest rank first)`);
  console.log("--------------------------");
  for (const q of byRank.slice(0, 10)) {
    const flag = isLicensed(q?.state) ? "*" : " ";
    console.log(`  ${String(q.rank ?? "?").padStart(5)}${flag} ${String(q.state).padEnd(3)} ${String(q.plan ?? "").padEnd(4)} ${q.carrier ?? ""}`);
  }
  console.log("");
  console.log("  * licensed state");
}

if (publishable.length === 0) {
  console.log("");
  console.log("Nothing is publishable yet. Every page will render its unverified state.");
}
