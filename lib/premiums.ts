import "server-only";
import { gate, type GateResult } from "./evidence";
import { recordsFor } from "./csg-data";

/**
 * Premium view model. Same contract as rate-filings: nothing leaves this module
 * ungated, and a premium that has not been confirmed against a public filing is
 * returned as withheld rather than as a number.
 */

export interface PremiumRow {
  carrier: string;
  age?: number;
  ratingMethod?: string;
  /** Gated monthly premium in dollars. */
  monthly: GateResult<number>;
}

export interface PremiumBand {
  /** Lowest published monthly premium, or null when none is publishable. */
  low: number | null;
  /** Highest published monthly premium, or null when none is publishable. */
  high: number | null;
  /**
   * How many distinct carriers contributed a published figure.
   *
   * Distinct carriers, not rows: the dataset holds one row per age scenario,
   * so counting rows would double every carrier and overstate the breadth of
   * the comparison.
   */
  carriers: number;
  /** True only when every figure in the band is confirmed against a filing. */
  allFilingConfirmed: boolean;
}

export function getPremiums(stateAbbr: string, planLetters: readonly string[]): PremiumRow[] {
  return recordsFor(stateAbbr, planLetters)
    .map((r) => ({
      carrier: r.carrier,
      age: r.age,
      ratingMethod: r.ratingMethod,
      monthly: gate(r, r.premium),
    }))
    // Cheapest first, but a carrier's age rows stay adjacent: two prices for
    // one carrier scattered down a price-sorted table read as a duplicate-row
    // bug rather than as the same block quoted at two ages.
    .sort((a, b) => {
      const av = a.monthly.published ? a.monthly.value : Number.POSITIVE_INFINITY;
      const bv = b.monthly.published ? b.monthly.value : Number.POSITIVE_INFINITY;
      if (a.carrier === b.carrier) return (a.age ?? 0) - (b.age ?? 0);
      if (av !== bv) return av - bv;
      return a.carrier.localeCompare(b.carrier);
    });
}

/**
 * The published premium range for a state and plan.
 *
 * Returns an all-null band unless at least two carriers have confirmed,
 * citable figures — a "range" built from one filing is not a range, and a band
 * with a single contributor invites the reader to treat it as the market.
 */
export function getPremiumBand(stateAbbr: string, planLetters: readonly string[]): PremiumBand {
  const published = getPremiums(stateAbbr, planLetters).filter((p) => p.monthly.published);
  const values = published.map((p) => (p.monthly.published ? p.monthly.value : 0));
  const carriers = new Set(published.map((p) => p.carrier)).size;
  const allFilingConfirmed =
    published.length > 0 &&
    published.every((p) => p.monthly.published && p.monthly.provenance.kind === "filing");

  if (values.length < 2) return { low: null, high: null, carriers, allFilingConfirmed };
  return { low: Math.min(...values), high: Math.max(...values), carriers, allFilingConfirmed };
}
