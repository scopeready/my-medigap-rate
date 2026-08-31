#!/usr/bin/env node
/**
 * Fails the build when the published Medicare cost figures fall behind the
 * calendar year.
 *
 * The site hard-codes Part A and Part B amounts so the plan pages can actually
 * explain what a plan covers. That is only safe if going stale is loud. CMS
 * normally announces the next year's figures in November, so from 1 January
 * onward a site still publishing last year's numbers is publishing wrong ones.
 *
 * Grace period: this fails on 1 January, not before. If CMS has announced and
 * you want to ship early, bump CURRENT_FIGURE_YEAR — the check only cares that
 * the published year is not behind.
 */
import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "lib", "medicare-figures.ts");
const src = fs.readFileSync(file, "utf8");

const m = src.match(/export const CURRENT_FIGURE_YEAR\s*=\s*(\d{4})/);
if (!m) {
  console.error("Could not read CURRENT_FIGURE_YEAR from lib/medicare-figures.ts.");
  process.exit(1);
}

const published = Number(m[1]);
const current = new Date().getUTCFullYear();

// Every year in the table must carry a source and an accessed date.
const years = [...src.matchAll(/^\s{2}(\d{4}):\s*\{/gm)].map((x) => Number(x[1]));
const missingSource = years.filter((y) => {
  const block = src.slice(src.indexOf(`  ${y}: {`), src.indexOf("},", src.indexOf(`  ${y}: {`)));
  return !/sourceUrl:\s*"https:\/\//.test(block) || !/accessed:\s*"\d{4}-\d{2}-\d{2}"/.test(block);
});

console.log(`Published figure year   ${published}`);
console.log(`Current calendar year   ${current}`);
console.log(`Years on record         ${years.join(", ")}`);

if (missingSource.length) {
  console.error(
    `\n${missingSource.join(", ")}: every year needs an https sourceUrl and an accessed date.`,
  );
  process.exit(1);
}

if (published < current) {
  console.error(`\nMedicare figures are stale: the site publishes ${published}, it is ${current}.`);
  console.error("CMS announces the next year's premiums and deductibles each November.");
  console.error("Add the new year to lib/medicare-figures.ts, move CURRENT_FIGURE_YEAR, and");
  console.error("update the source URL and accessed date. Do not edit a past year's numbers.");
  process.exit(1);
}

console.log("\nMedicare figures are current for the calendar year.");
