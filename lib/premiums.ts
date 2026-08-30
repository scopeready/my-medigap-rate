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
  /** How many carriers contributed a published figure. */
  carriers: number;
}

export function getPremiums(stateAbbr: string, planLetters: readonly string[]): PremiumRow[] {
  return recordsFor(stateAbbr, planLetters)
    .map((r) => ({
      carrier: r.carrier,
      age: r.age,
      ratingMethod: r.ratingMethod,
      monthly: gate(r, r.premium),
    }))
    .sort((a, b) => {
      if (a.monthly.published && b.monthly.published) return a.monthly.value - b.monthly.value;
      if (a.monthly.published) return -1;
      if (b.monthly.published) return 1;
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
  const values = getPremiums(stateAbbr, planLetters)
    .map((p) => (p.monthly.published ? p.monthly.value : null))
    .filter((v): v is number => v !== null);

  if (values.length < 2) return { low: null, high: null, carriers: values.length };
  return { low: Math.min(...values), high: Math.max(...values), carriers: values.length };
}
