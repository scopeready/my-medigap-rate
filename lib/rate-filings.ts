import "server-only";
import { gate, type GateResult, type SourceCitation } from "./evidence";
import { loadSnapshot, recordsFor, type RateRecord } from "./csg-data";

/**
 * Rate-filing view model.
 *
 * Everything a page renders about a filing comes from here, already gated. A
 * page component cannot reach a raw premium or rate change without going
 * through one of these functions, which is the point.
 */

export interface FilingRow {
  carrier: string;
  naic?: string;
  effectiveDate?: string;
  /** Gated rate change, as a decimal fraction. */
  ratePercent: GateResult<number>;
  citation?: SourceCitation;
}

export interface StatePlanFilings {
  stateAbbr: string;
  planLetters: readonly string[];
  /** Every row we hold, published or withheld. */
  rows: FilingRow[];
  /** How many rows cleared the evidence gate. */
  publishedCount: number;
  /** How many rows exist at all. */
  totalCount: number;
  /** True when the reconciliation kit was available to this build. */
  datasetPresent: boolean;
}

function toRow(r: RateRecord): FilingRow {
  const g = gate(r, r.ratePercent);
  return {
    carrier: r.carrier,
    naic: r.naic,
    effectiveDate: r.effectiveDate,
    ratePercent: g,
    citation: g.published && g.provenance.kind === "filing" ? g.provenance.citation : undefined,
  };
}

export function getFilings(stateAbbr: string, planLetters: readonly string[]): StatePlanFilings {
  const snapshot = loadSnapshot();
  // The queue carries one record per age scenario, but a rate action belongs to
  // the block, not to an age — the same filing appears identically at 65 and
  // 70. Rendering both makes one increase look like several, which is exactly
  // the kind of overstatement this site exists not to make.
  const seen = new Set<string>();
  const rows = recordsFor(stateAbbr, planLetters)
    .map(toRow)
    .filter((r) => {
      const pct = r.ratePercent.published ? r.ratePercent.value : "withheld";
      const k = `${r.naic ?? r.carrier}|${r.effectiveDate ?? ""}|${pct}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => (b.effectiveDate ?? "").localeCompare(a.effectiveDate ?? ""));

  return {
    stateAbbr: stateAbbr.toUpperCase(),
    planLetters,
    rows,
    publishedCount: rows.filter((r) => r.ratePercent.published).length,
    totalCount: rows.length,
    datasetPresent: snapshot.present,
  };
}

/** Verification queue for a state, highest priority first. */
export function getQueue(stateAbbr: string, limit = 10) {
  return loadSnapshot()
    .queue.filter((q) => q.state === stateAbbr.toUpperCase())
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
}

/** Site-wide coverage counters, used on the methodology page. */
export function getCoverage() {
  const { records, queue, present } = loadSnapshot();
  const published = records.filter((r) => gate(r, true).published).length;
  return {
    datasetPresent: present,
    totalRecords: records.length,
    publishedRecords: published,
    queueLength: queue.length,
    statesWithPublished: new Set(
      records.filter((r) => gate(r, true).published).map((r) => r.state),
    ).size,
  };
}
