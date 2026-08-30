import "server-only";
import { gate, type GateResult } from "./evidence";
import { recordsFor } from "./csg-data";

/**
 * Tennessee rate-action adapter.
 *
 * Tennessee publishes approved Medicare Supplement rate actions through the
 * Department of Commerce and Insurance rather than only through the shared
 * filing system, so the citation for a Tennessee figure points at a different
 * kind of document than it does elsewhere. This module keeps that difference in
 * one place instead of letting it leak into the page templates.
 *
 * It is the reference implementation for a per-state adapter: when another
 * state turns out to need its own source-of-truth handling, copy the shape here
 * rather than special-casing inside a page.
 */

export const TN_REGULATOR = "Tennessee Department of Commerce and Insurance";

export interface TnRateAction {
  carrier: string;
  planLetter: string;
  effectiveDate?: string;
  /** Gated approved rate change, as a decimal fraction. */
  approvedChange: GateResult<number>;
}

export function getTnRateActions(planLetters: readonly string[]): TnRateAction[] {
  return recordsFor("TN", planLetters)
    .map((r) => ({
      carrier: r.carrier,
      planLetter: r.plan,
      effectiveDate: r.effectiveDate,
      approvedChange: gate(r, r.ratePercent),
    }))
    .sort((a, b) => (b.effectiveDate ?? "").localeCompare(a.effectiveDate ?? ""));
}

/**
 * Tennessee-specific note rendered under the rate-history table. Kept here so
 * the template stays state-agnostic.
 */
export const TN_NOTE =
  "Tennessee approved rate actions are published by the state's insurance regulator. A figure on this page is cited to that publication, not to a carrier illustration.";
