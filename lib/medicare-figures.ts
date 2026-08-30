/**
 * Official Medicare cost figures, by calendar year.
 *
 * These are the only hard-coded dollar amounts on the site, and they exist
 * because a Medigap page that will not tell you the Part B deductible is an
 * incomplete product — Plan G is defined by that deductible, and Plan N by the
 * coinsurance it replaces with copays. Sending the reader elsewhere for the one
 * number that makes the plan comprehensible is a worse failure than the risk of
 * the figure going stale.
 *
 * The staleness risk is handled rather than avoided:
 *
 *  - Figures are keyed by year and every page renders the year alongside them.
 *  - Each year carries the CMS fact sheet it came from and the date we read it.
 *  - `npm run check:figures` fails once the published year is behind the
 *    current calendar year, so a stale figure breaks a build rather than
 *    quietly misinforming somebody. It is wired into `verify:publishable`.
 *
 * CMS normally announces the following year's amounts in November. When that
 * happens: add the new year below, move CURRENT_FIGURE_YEAR, and update the
 * source entry. Do not edit a past year's numbers.
 */

export interface MedicareYearFigures {
  year: number;
  /** Standard monthly Part B premium. Higher earners pay more (IRMAA). */
  partBPremiumMonthly: number;
  /** Annual Part B deductible — the one Plan G leaves you to pay. */
  partBDeductible: number;
  /** Part A inpatient hospital deductible, per benefit period. */
  partAHospitalDeductible: number;
  /** CMS fact sheet these came from. */
  sourceUrl: string;
  sourceTitle: string;
  /** ISO date we last read the source. */
  accessed: string;
  /** ISO date CMS announced them. */
  announced: string;
}

const FIGURES: Record<number, MedicareYearFigures> = {
  2025: {
    year: 2025,
    partBPremiumMonthly: 185.0,
    partBDeductible: 257,
    partAHospitalDeductible: 1676,
    sourceUrl: "https://www.cms.gov/newsroom/fact-sheets/2025-medicare-parts-b-premiums-and-deductibles",
    sourceTitle: "2025 Medicare Parts A & B Premiums and Deductibles",
    accessed: "2026-08-30",
    announced: "2024-11-08",
  },
  2026: {
    year: 2026,
    partBPremiumMonthly: 202.9,
    partBDeductible: 283,
    partAHospitalDeductible: 1736,
    sourceUrl: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
    sourceTitle: "2026 Medicare Parts A & B Premiums and Deductibles",
    accessed: "2026-08-30",
    announced: "2025-11-14",
  },
};

/** The plan year the site currently publishes. Move this when a new year lands. */
export const CURRENT_FIGURE_YEAR = 2026;

export const CURRENT_FIGURES: MedicareYearFigures = FIGURES[CURRENT_FIGURE_YEAR];

export function figuresFor(year: number): MedicareYearFigures | undefined {
  return FIGURES[year];
}

/** Years on record, oldest first — drives the year-over-year comparison. */
export const FIGURE_YEARS: number[] = Object.keys(FIGURES)
  .map(Number)
  .sort((a, b) => a - b);

/** The prior year, for showing the change rather than a bare number. */
export const PREVIOUS_FIGURES: MedicareYearFigures | undefined =
  figuresFor(CURRENT_FIGURE_YEAR - 1);

/** Whole dollars unless the value has cents, e.g. "$202.90" but "$283". */
export function dollars(n: number): string {
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  });
}
