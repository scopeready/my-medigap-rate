#!/usr/bin/env node
/**
 * Build the filing-verification worklist, grouped the way the work is actually
 * done: one row per carrier per state, not one per queue item.
 *
 * The raw queue lists an item per scenario — plan letter crossed with age — so
 * one carrier's filing in one state can appear eight times. A SERFF search is
 * per company per state, and a single Medigap rate filing usually covers a
 * carrier's whole portfolio there. Collapsing on that turns 1,395 licensed
 * items into roughly 300 lookups, which is the difference between a project
 * that gets started and one that does not.
 *
 * Output is Markdown, written into the git-ignored kit because carrier names,
 * NAIC codes and filed percentages are all vendor-derived. It never leaves that
 * directory and must not be committed.
 *
 *   node scripts/verification-worksheet.mjs           # all licensed states
 *   node scripts/verification-worksheet.mjs NV        # one state
 *   node scripts/verification-worksheet.mjs --top 25  # highest-value only
 */
import fs from "node:fs";
import path from "node:path";

const DIR = process.env.CSG_DATA_DIR ?? path.join(process.cwd(), "data", "csg", "ecos-csg");
const QUEUE = path.join(DIR, "recon", "serff_queue.json");
const OUT = path.join(DIR, "recon", "VERIFICATION_WORKSHEET.md");

const LICENSED = new Set([
  "NV", "CA", "UT", "AZ", "NM", "CO", "MN", "OH", "WA", "GA", "TX", "TN", "FL", "SC", "NC",
]);

/**
 * Where each state's filings are searched. SERFF Filing Access is the common
 * front door; a few states run their own portal or publish a rate table that
 * is quicker to read and still citable.
 */
const PORTALS = {
  AZ: ["Arizona Department of Insurance and Financial Institutions", "https://filingaccess.serff.com/sfa/home/AZ"],
  CA: ["California Department of Insurance", "https://interactive.web.insurance.ca.gov/apex/f?p=400:1"],
  CO: ["Colorado Division of Insurance", "https://filingaccess.serff.com/sfa/home/CO"],
  FL: ["Florida Office of Insurance Regulation", "https://filingaccess.serff.com/sfa/home/FL"],
  GA: ["Georgia Office of Commissioner of Insurance", "https://filingaccess.serff.com/sfa/home/GA"],
  MN: ["Minnesota Department of Commerce", "https://filingaccess.serff.com/sfa/home/MN"],
  NC: ["North Carolina Department of Insurance", "https://filingaccess.serff.com/sfa/home/NC"],
  NM: ["New Mexico Office of Superintendent of Insurance", "https://filingaccess.serff.com/sfa/home/NM"],
  NV: ["Nevada Division of Insurance", "https://filingaccess.serff.com/sfa/home/NV"],
  OH: ["Ohio Department of Insurance", "https://filingaccess.serff.com/sfa/home/OH"],
  SC: ["South Carolina Department of Insurance", "https://filingaccess.serff.com/sfa/home/SC"],
  TN: ["Tennessee Department of Commerce and Insurance", "https://filingaccess.serff.com/sfa/home/TN"],
  TX: ["Texas Department of Insurance", "https://filingaccess.serff.com/sfa/home/TX"],
  UT: ["Utah Insurance Department", "https://filingaccess.serff.com/sfa/home/UT"],
  WA: ["Washington State Office of the Insurance Commissioner", "https://filingaccess.serff.com/sfa/home/WA"],
};

const args = process.argv.slice(2);
const topIdx = args.indexOf("--top");
const top = topIdx === -1 ? undefined : Number(args[topIdx + 1]);
const wantState = args.find((a) => /^[A-Za-z]{2}$/.test(a))?.toUpperCase();

if (!fs.existsSync(QUEUE)) {
  console.log(`No queue at ${path.relative(process.cwd(), QUEUE)} — nothing to do.`);
  process.exit(0);
}

const queue = JSON.parse(fs.readFileSync(QUEUE, "utf8"));
const scope = queue.filter(
  (q) => LICENSED.has(q.state) && (!wantState || q.state === wantState),
);

/** Collapse to one entry per carrier per state — the unit of a filing search. */
const groups = new Map();
for (const q of scope) {
  const key = `${q.state}|${q.naic}`;
  let g = groups.get(key);
  if (!g) {
    g = {
      state: q.state,
      naic: q.naic,
      carrier: q.carrier,
      rank: q.rank,
      plans: new Set(),
      items: 0,
      increases: new Map(),
      otherFlags: new Set(),
    };
    groups.set(key, g);
  }
  g.rank = Math.min(g.rank, q.rank);
  g.items += 1;
  if (q.plan) g.plans.add(q.plan);
  for (const f of q.verify ?? []) {
    const m = f.match(/^double-digit increases on this block: (.+)$/);
    if (m) {
      // Same action shows up once per scenario; dedupe on the text.
      for (const part of m[1].split(", ")) g.increases.set(part, true);
    } else {
      g.otherFlags.add(f);
    }
  }
}

const rows = [...groups.values()].sort((a, b) => a.rank - b.rank);
const shown = top ? rows.slice(0, top) : rows;

const biggest = (g) =>
  Math.max(0, ...[...g.increases.keys()].map((s) => parseFloat(s) || 0));

const lines = [
  "# Filing-verification worksheet",
  "",
  "> Internal. Carrier names, NAIC codes and filed percentages here are",
  "> vendor-derived and licensed. Do not commit this file and do not publish",
  "> anything from it that has not been confirmed in the regulator's own record.",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)}.`,
  `${scope.length} queue items collapse to **${rows.length} carrier lookups**` +
    (wantState ? ` in ${wantState}` : " across the 15 licensed states") +
    (top ? `; showing the top ${shown.length}.` : "."),
  "",
  "One filing generally covers a carrier's whole Medigap portfolio in a state, so",
  "a single search clears every plan letter and both ages for that carrier. Work",
  "down the list — it is ordered by the size of the filed increase, which is both",
  "the strongest consumer story and the most likely to be worth a reader's time.",
  "",
  "## How to record a result",
  "",
  "```bash",
  "node scripts/verify-record.mjs \\",
  "  --state XX --naic NNNNN --tier A \\",
  '  --filing "TRACKING-NUMBER" \\',
  '  --url "https://…" \\',
  '  --regulator "Name of the department" \\',
  "  --accessed YYYY-MM-DD",
  "```",
  "",
  "Tier A is the filing document itself. Tier B is the filing's public summary or",
  "the state's published rate table. Confirm each percentage is the **approved**",
  "figure, not the requested one, before recording it.",
  "",
  "---",
  "",
];

// Ordered by priority, which interleaves states — so each entry carries its
// own regulator and search link rather than relying on a section heading.
for (const [n, g] of shown.entries()) {
  const incs = [...g.increases.keys()];
  const [reg, url] = PORTALS[g.state] ?? ["state insurance department", ""];
  lines.push(`## ${n + 1}. ${g.carrier} — ${g.state}`, "");
  lines.push(`- **NAIC** ${g.naic} — search by this, not by name`);
  lines.push(`- **Regulator** ${reg}`);
  if (url) lines.push(`- **Search** ${url}`);
  lines.push(`- **Plans covered** ${[...g.plans].sort().join(", ") || "—"} (${g.items} queue items clear together)`);
  if (incs.length) {
    lines.push(`- **Confirm these filed actions** — largest ${biggest(g).toFixed(1)}%:`);
    for (const i of incs) lines.push(`  - [ ] ${i}`);
  }
  for (const f of g.otherFlags) lines.push(`- ${f}`);
  lines.push("");
  lines.push("```bash");
  lines.push(
    `node scripts/verify-record.mjs --state ${g.state} --naic ${g.naic} --tier A \\\n` +
      `  --filing "" --url "" \\\n` +
      `  --regulator "${reg}" --accessed ${new Date().toISOString().slice(0, 10)}`,
  );
  lines.push("```");
  lines.push("");
}

fs.writeFileSync(OUT, lines.join("\n"));
console.log(`${scope.length} queue items -> ${rows.length} carrier lookups`);
if (top) console.log(`Wrote the top ${shown.length}.`);
console.log(`Worksheet: ${path.relative(process.cwd(), OUT)}`);
