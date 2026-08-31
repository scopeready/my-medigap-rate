#!/usr/bin/env node
/**
 * Record a completed filing verification against the reconciliation layer.
 *
 * This is the path OPEN_ISSUES #1 calls the thing that converts the database
 * into a website. Until a verification can be recorded safely, no amount of
 * SERFF work reaches a page.
 *
 * It exists so that nobody hand-edits a 10 MB JSON file. Four governance fields
 * have to move together — evidence_tier, verification_status, publishable and
 * source_citation — because gate() checks all four, and setting one alone does
 * nothing except look like progress. This writes all four or none.
 *
 * The citation is validated against the same rules gate() applies BEFORE
 * anything is written, so a mis-shaped verification fails here, loudly, rather
 * than silently rendering as withheld on a page that looks finished.
 *
 * Usage
 * -----
 *   node scripts/verify-record.mjs \
 *     --state AZ --naic 73288 [--plan N] [--rating-class "Standard"] \
 *     --tier A \
 *     --filing "HUMA-134567890" \
 *     --url "https://filingaccess.serff.com/sfa/..." \
 *     --regulator "Arizona Department of Insurance and Financial Institutions" \
 *     --accessed 2026-08-31 \
 *     [--exhibit "Rate schedule, p.4"] \
 *     [--dry-run]
 *
 * Omitting --plan verifies every plan for that carrier in that state, which is
 * usually right: one filing generally covers the carrier's whole Medigap
 * portfolio in a state. Use --plan when the filing genuinely covers one letter.
 *
 * Withdrawing a verification:
 *   node scripts/verify-record.mjs --state AZ --naic 73288 --revoke
 */
import fs from "node:fs";
import path from "node:path";

const DIR = process.env.CSG_DATA_DIR ?? path.join(process.cwd(), "data", "csg", "ecos-csg");
const LAYER = path.join(DIR, "recon", "reconciliation_layer.json");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const flag = (name) => process.argv.includes(`--${name}`);

const opts = {
  state: arg("state")?.toUpperCase(),
  naic: arg("naic"),
  plan: arg("plan")?.toUpperCase(),
  ratingClass: arg("rating-class"),
  tier: arg("tier")?.toUpperCase(),
  filing: arg("filing"),
  url: arg("url"),
  regulator: arg("regulator"),
  accessed: arg("accessed") ?? new Date().toISOString().slice(0, 10),
  exhibit: arg("exhibit"),
  revoke: flag("revoke"),
  dryRun: flag("dry-run"),
};

const die = (msg) => {
  console.error(`\n${msg}\n`);
  process.exit(1);
};

if (!opts.state || !opts.naic) die("--state and --naic are required.");
if (!fs.existsSync(LAYER)) die(`No reconciliation layer at ${path.relative(process.cwd(), LAYER)}.`);

if (!opts.revoke) {
  // These mirror gate() in lib/evidence.ts exactly. Anything it would refuse to
  // publish is refused here, at the point the mistake is cheap to fix.
  if (opts.tier !== "A" && opts.tier !== "B") {
    die(
      `--tier must be A or B.\n` +
        `  A = confirmed against the filing document itself\n` +
        `  B = confirmed against the filing's public summary or the state's rate table\n` +
        `  There is no A1/A2 here and C is never publishable — see DATA_DICTIONARY.md §2.`,
    );
  }
  if (!opts.filing?.trim()) die("--filing is required: the filing number as the regulator shows it.");
  if (!opts.url || !/^https?:\/\//.test(opts.url)) die("--url must be a public http(s) link to the filing.");
  if (!opts.regulator?.trim()) die("--regulator is required: the body that received the filing.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opts.accessed)) die("--accessed must be an ISO date, e.g. 2026-08-31.");
}

const records = JSON.parse(fs.readFileSync(LAYER, "utf8"));

const matches = records.filter(
  (r) =>
    String(r.state).toUpperCase() === opts.state &&
    String(r.naic) === opts.naic &&
    (!opts.plan || String(r.plan).toUpperCase() === opts.plan) &&
    (!opts.ratingClass || String(r.rating_class ?? "") === opts.ratingClass),
);

if (!matches.length) {
  die(
    `No records match state=${opts.state} naic=${opts.naic}` +
      (opts.plan ? ` plan=${opts.plan}` : "") +
      (opts.ratingClass ? ` rating_class=${opts.ratingClass}` : "") +
      `.\nRun scripts/verification-worksheet.mjs to see what is actually in the queue.`,
  );
}

console.log(`${opts.revoke ? "Revoking" : "Verifying"} ${matches.length} record(s):\n`);
for (const r of matches) {
  const hist = (r.increase_history ?? [])
    .map((h) => `${h.increase_pct}% eff ${h.effective_date}`)
    .join(", ");
  console.log(`  ${r.key}`);
  console.log(`    ${r.carrier}`);
  if (hist) console.log(`    filed: ${hist}`);
}

if (!opts.revoke) {
  console.log(`\nCitation to be written:`);
  console.log(`  tier       ${opts.tier}`);
  console.log(`  filing     ${opts.filing}`);
  console.log(`  regulator  ${opts.regulator}`);
  console.log(`  url        ${opts.url}`);
  console.log(`  accessed   ${opts.accessed}`);
  if (opts.exhibit) console.log(`  exhibit    ${opts.exhibit}`);
  console.log(
    `\nConfirm the filed percentages above appear in that filing as APPROVED, not\n` +
      `merely requested, before recording this. Requested is not approved.`,
  );
}

if (opts.dryRun) {
  console.log("\nDry run — nothing written.");
  process.exit(0);
}

for (const r of matches) {
  if (opts.revoke) {
    r.evidence_tier = "C";
    r.verification_status = "pending_serff";
    r.publishable = false;
    delete r.source_citation;
  } else {
    // All four move together, or the gate withholds anyway.
    r.evidence_tier = opts.tier;
    r.verification_status = "filing_confirmed";
    r.publishable = true;
    r.source_citation = {
      filingNumber: opts.filing.trim(),
      url: opts.url,
      regulator: opts.regulator.trim(),
      accessed: opts.accessed,
      ...(opts.exhibit ? { exhibit: opts.exhibit } : {}),
    };
  }
}

fs.writeFileSync(LAYER, JSON.stringify(records, null, 1));

const publishable = records.filter((r) => r.publishable === true).length;
console.log(`\nWritten. ${publishable} of ${records.length} records are now publishable.`);
console.log(`Run 'npm run verify:publishable' to confirm the gate agrees, then rebuild.`);
