#!/usr/bin/env node
/**
 * The go-and-find-it list.
 *
 * Two kinds of hole, in one worklist:
 *
 *   1. SUPPRESSED — a value we hold but will not publish, because it is a
 *      known or suspected defect. Written by `npm run data:build`.
 *   2. MISSING — a scenario where the research panel has rates but no
 *      analytics, or nothing at all. Read from the kit's own register.
 *
 * The point is that neither category is silent. A figure that vanishes without
 * a reason is indistinguishable from a bug, and "no increase on record" is not
 * the same claim as "no increase happened".
 *
 * Output is Markdown so it can be worked through away from a terminal.
 */
import fs from "node:fs";
import path from "node:path";

const KIT = process.env.CSG_DATA_DIR ?? path.join(process.cwd(), "data", "csg", "ecos-csg");
const SUPPRESSED = path.join(process.cwd(), "data", "published", "suppressed.json");
const MISSING = path.join(KIT, "recon", "missing_data.json");
const OUT = path.join(process.cwd(), "data", "published", "DATA_GAPS.md");

const read = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);

const suppressed = read(SUPPRESSED);
if (!suppressed) {
  console.error(`No ${path.relative(process.cwd(), SUPPRESSED)} — run 'npm run data:build' first.`);
  process.exit(1);
}
const missing = read(MISSING) ?? [];

/** Human wording for each suppression reason, and what would resolve it. */
const REASONS = {
  implausible_premium: {
    label: "Premium implausibly high",
    fix: "Confirm the current monthly premium with the carrier or the state's filed rate table. One inflated premium can also distort the reported increase, so re-check both together.",
  },
  non_positive_premium: {
    label: "Premium zero or negative",
    fix: "Re-export the scenario. A zero here means the field did not populate, not that the policy is free.",
  },
  implausible_increase: {
    label: "Increase implausibly large",
    fix: "Read the approved filing for this block. If the increase is real it is a significant consumer story and worth publishing with the citation; if it is a feed defect it stays suppressed.",
  },
  incomplete_row: {
    label: "Increase missing its effective date",
    fix: "An increase without a date cannot be published — it cannot be placed in a sequence. Recover the date from the filing.",
  },
  known_suspect_carrier: {
    label: "Known or suspected vendor defect",
    fix: "Raised in the vendor support ticket. Resolve there, or confirm independently against the state's filing record.",
  },
  implausible_loss_ratio: {
    label: "Loss ratio outside the plausible range",
    fix: "Replace with the carrier's figure from the NAIC Medicare Supplement Experience Exhibit, which is public and is the better source for this metric anyway.",
  },
  naic_join_name_only: {
    label: "Carrier entity not established",
    fix: "The NAIC code was matched on carrier-name similarity, not an exact rate match. Confirm the legal entity in the state filing before this record can be published — every claim on this site is entity-level.",
  },
};

const byReason = new Map();
for (const s of suppressed) {
  if (!byReason.has(s.reason)) byReason.set(s.reason, []);
  byReason.get(s.reason).push(s);
}

const L = [];
L.push("# Data gaps — what to go and find");
L.push("");
L.push(`Generated ${new Date().toISOString().slice(0, 10)} by \`npm run data:gaps\`.`);
L.push("");
L.push(
  "Nothing here is on the website. Every row is either a value we hold and will not " +
    "publish, or a scenario where we hold nothing. Resolving a row either puts a figure " +
    "on a page or confirms that it should stay off.",
);
L.push("");
L.push(`**${suppressed.length} suppressed values · ${missing.length} incomplete scenarios**`);
L.push("");

L.push("## 1. Suppressed — held back as wrong or unproven");
L.push("");
for (const [reason, items] of [...byReason.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const meta = REASONS[reason] ?? { label: reason, fix: "" };
  L.push(`### ${meta.label} — ${items.length}`);
  L.push("");
  if (meta.fix) {
    L.push(`**How to resolve:** ${meta.fix}`);
    L.push("");
  }
  L.push("| State | Plan | NAIC | Carrier | Detail |");
  L.push("|---|---|---|---|---|");
  // Collapse to one line per carrier per state per field: the lookup is the
  // same regardless of how many scenario rows it touches.
  const seen = new Set();
  for (const it of items) {
    const k = `${it.state}|${it.plan}|${it.naic}|${it.field}`;
    if (seen.has(k)) continue;
    seen.add(k);
    const detail = String(it.detail ?? "").replace(/\|/g, "\\|");
    L.push(`| ${it.state} | ${it.plan} | ${it.naic} | ${it.carrier} | ${detail} |`);
  }
  L.push("");
}

L.push("## 2. Missing — scenarios with rates but no analytics, or nothing at all");
L.push("");
if (!missing.length) {
  L.push("_The kit's missing-data register was not readable; run this with the kit unzipped._");
} else {
  L.push("| State | Plan | Age | Licensed | What is missing | Recovery |");
  L.push("|---|---|---|---|---|---|");
  for (const m of missing) {
    const gap = Array.isArray(m.missing) ? m.missing.join("; ") : (m.missing ?? m.status ?? "");
    const paths = Array.isArray(m.recovery_paths)
      ? m.recovery_paths.map((p) => (typeof p === "string" ? p : p.path ?? p.source ?? "")).filter(Boolean).join(" · ")
      : (m.recovery ?? "");
    L.push(
      `| ${m.state ?? ""} | ${m.plan ?? ""} | ${m.age ?? ""} | ${m.licensed ? "yes" : "no"} | ` +
        `${String(gap).replace(/\|/g, "\\|")} | ${String(paths).replace(/\|/g, "\\|")} |`,
    );
  }
}
L.push("");

L.push("## 3. Known coverage limits — not defects, but gaps a reader would notice");
L.push("");
L.push("| Gap | Effect on the site | What would close it |");
L.push("|---|---|---|");
L.push(
  "| Premiums cover **female, non-tobacco only** | A male reader sees a premium that does not apply to him. Rate *history* is identical per block regardless of profile, so only the premium column is affected. | A male non-tobacco export at the same ages. |",
);
L.push(
  "| Premiums cover **ages 65 and 70 only** | The site's audience is switchers, who skew older than 70. A 78-year-old has no premium that speaks to them. | Exports at ages 75 and 80. |",
);
L.push(
  "| **One representative ZIP per state** | Premiums vary within a state by rating area. The figure is a like-for-like comparison between carriers, not a quote. | Nothing — this is a deliberate methodology choice and is disclosed on every page. |",
);
L.push(
  "| **Plan G and Plan N only** carry rate history | Plan F and High-Deductible G have premiums but no history anywhere, which is why neither has per-state pages. | Analytics exports for those plan letters, if the audience ever justifies it. |",
);
L.push(
  "| **Minnesota, Wisconsin, Massachusetts** | Waivered states with their own plan sets; federal plan letters do not map. MN is licensed and has nothing at all. | MN: export using Minnesota's own plan labels. WI/MA: not available from the panel in any format. |",
);
L.push("");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, L.join("\n"));

console.log(`Suppressed values   ${suppressed.length}`);
for (const [reason, items] of [...byReason.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${(REASONS[reason]?.label ?? reason).padEnd(38)} ${items.length}`);
}
console.log(`Incomplete scenarios ${missing.length}`);
console.log(`\nWorklist written to ${path.relative(process.cwd(), OUT)}`);
