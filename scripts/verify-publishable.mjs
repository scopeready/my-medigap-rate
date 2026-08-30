#!/usr/bin/env node
/**
 * Pre-deploy guard: fail the build if unverified data could ship.
 *
 * The checks here mirror `gate()` in lib/evidence.ts exactly. A guard that is
 * weaker than the gate is worse than no guard, because it reports success on
 * records the site would refuse to render -- and, more dangerously, stays
 * quiet about records the site *would* render on incomplete evidence.
 *
 * When the kit is absent this exits 0 and says so. That is the production
 * condition: `data/csg/` is git-ignored, so Vercel builds without it and every
 * figure renders in its withheld state. The path it looked at is printed, so a
 * misconfigured root shows up as a wrong path rather than a silent pass.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = process.env.CSG_DATA_DIR ?? path.join(process.cwd(), "data", "csg", "ecos-csg");
const layerPath = path.join(DIR, "recon", "reconciliation_layer.json");
const rel = path.relative(process.cwd(), layerPath) || layerPath;

if (!fs.existsSync(layerPath)) {
  console.log(`No reconciliation kit at ${rel} — skipping the publishable check.`);
  console.log("This is the expected state in CI and on Vercel, where data/csg/ is git-ignored.");
  process.exit(0);
}

let blocks;
try {
  blocks = JSON.parse(fs.readFileSync(layerPath, "utf8"));
} catch (err) {
  console.error(`${rel} is not valid JSON: ${err.message}`);
  process.exit(1);
}
if (!Array.isArray(blocks)) {
  console.error(`${rel} did not parse to an array of records.`);
  process.exit(1);
}

/** Mirrors isCitation() in lib/evidence.ts. */
function hasCitation(c) {
  return Boolean(
    c &&
      typeof c === "object" &&
      typeof c.filingNumber === "string" &&
      c.filingNumber.trim() &&
      typeof c.url === "string" &&
      /^https?:\/\//.test(c.url) &&
      typeof c.regulator === "string" &&
      c.regulator.trim(),
  );
}

const claimed = blocks.filter((b) => b?.publishable === true);
const violations = [
  ["still Tier C", claimed.filter((b) => String(b.evidence_tier).toUpperCase() === "C")],
  [
    "not confirmed against a filing",
    claimed.filter((b) => b.verification_status !== "filing_confirmed"),
  ],
  ["missing or incomplete source_citation", claimed.filter((b) => !hasCitation(b.source_citation))],
];

const tiers = blocks.reduce((acc, b) => {
  const t = String(b?.evidence_tier ?? "C").toUpperCase();
  acc[t] = (acc[t] ?? 0) + 1;
  return acc;
}, {});

console.log(`Records            ${blocks.length}`);
console.log(`Marked publishable ${claimed.length}`);
console.log(
  `By tier            ${Object.entries(tiers)
    .sort()
    .map(([t, n]) => `${t}=${n}`)
    .join("  ")}`,
);

let failed = false;
for (const [label, bad] of violations) {
  if (!bad.length) continue;
  failed = true;
  console.error(`\n${bad.length} record(s) marked publishable but ${label}:`);
  for (const b of bad.slice(0, 10)) console.error(`   ${b.key ?? `${b.state}/${b.plan}/${b.carrier}`}`);
  if (bad.length > 10) console.error(`   ...and ${bad.length - 10} more`);
}

if (failed) {
  console.error("\nBuild blocked. Every published figure needs an independent regulator");
  console.error("citation: a filing number, an http(s) URL, and the regulator that received it.");
  process.exit(1);
}

console.log("\nNo unverified data is marked publishable.");
if (claimed.length === 0) {
  console.log("Note: zero records are publishable, so every data page renders its withheld");
  console.log("state. That is expected until the filing-verification pass begins.");
}
