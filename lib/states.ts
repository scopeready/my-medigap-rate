import { switchingRule, type SwitchingKind } from "./switching-rules";

export interface StateInfo {
  /** URL slug, e.g. "nevada". */
  slug: string;
  /** USPS abbreviation. */
  abbr: string;
  /** Display name. */
  name: string;
  /**
   * Shape of the state's switching rights, used for page structure (chiefly
   * whether the federal plan letters apply here at all).
   *
   * The wording shown to a reader does NOT come from this field — it comes from
   * `lib/switching-rules.ts`, where each state's rule is recorded as its own
   * regulator states it, with a citation. A one-word category cannot carry the
   * facts that decide whether somebody can actually move: Illinois caps its
   * birthday rule at 65-75 and confines it to the existing insurer, Nevada's
   * reaches only open blocks, Maine's is one insurer-chosen month for Plan A.
   */
  rules: SwitchingKind;
  /**
   * Whether the agency is licensed to write business in the state.
   *
   * Exactly fifteen are true: NV, CA, UT, AZ, NM, CO, MN, OH, WA, GA, TX, TN,
   * FL, SC, NC. Never New York. This list drives the agent call-to-action, so
   * a state marked true here is a representation that we can sell there —
   * do not add one without confirming the producer licence is current.
   */
  licensed: boolean;
}

/**
 * `rules` values:
 *   standard          — federal baseline; medical underwriting outside GI windows
 *   birthday          — annual birthday window to switch to equal/lesser benefits
 *   anniversary       — annual window tied to the policy anniversary
 *   continuous        — year-round guaranteed issue
 *   waiver            — year-round switching between plans of equal/lesser benefit
 *   state-standardized— MA, MN and WI use their own plan sets, not A-N
 */
export const STATES: readonly StateInfo[] = [
  { slug: "alabama", abbr: "AL", name: "Alabama", rules: "federal-only", licensed: false },
  { slug: "alaska", abbr: "AK", name: "Alaska", rules: "federal-only", licensed: false },
  { slug: "arizona", abbr: "AZ", name: "Arizona", rules: "federal-only", licensed: true },
  { slug: "arkansas", abbr: "AR", name: "Arkansas", rules: "federal-only", licensed: false },
  { slug: "california", abbr: "CA", name: "California", rules: "birthday", licensed: true },
  { slug: "colorado", abbr: "CO", name: "Colorado", rules: "federal-only", licensed: true },
  { slug: "connecticut", abbr: "CT", name: "Connecticut", rules: "year-round", licensed: false },
  { slug: "delaware", abbr: "DE", name: "Delaware", rules: "federal-only", licensed: false },
  { slug: "district-of-columbia", abbr: "DC", name: "District of Columbia", rules: "federal-only", licensed: false },
  { slug: "florida", abbr: "FL", name: "Florida", rules: "federal-only", licensed: true },
  { slug: "georgia", abbr: "GA", name: "Georgia", rules: "federal-only", licensed: true },
  { slug: "hawaii", abbr: "HI", name: "Hawaii", rules: "federal-only", licensed: false },
  { slug: "idaho", abbr: "ID", name: "Idaho", rules: "birthday", licensed: false },
  { slug: "illinois", abbr: "IL", name: "Illinois", rules: "birthday", licensed: false },
  { slug: "indiana", abbr: "IN", name: "Indiana", rules: "federal-only", licensed: false },
  { slug: "iowa", abbr: "IA", name: "Iowa", rules: "federal-only", licensed: false },
  { slug: "kansas", abbr: "KS", name: "Kansas", rules: "federal-only", licensed: false },
  { slug: "kentucky", abbr: "KY", name: "Kentucky", rules: "birthday", licensed: false },
  { slug: "louisiana", abbr: "LA", name: "Louisiana", rules: "birthday", licensed: false },
  { slug: "maine", abbr: "ME", name: "Maine", rules: "annual-designated-month", licensed: false },
  { slug: "maryland", abbr: "MD", name: "Maryland", rules: "federal-only", licensed: false },
  { slug: "massachusetts", abbr: "MA", name: "Massachusetts", rules: "state-standardized", licensed: false },
  { slug: "michigan", abbr: "MI", name: "Michigan", rules: "federal-only", licensed: false },
  { slug: "minnesota", abbr: "MN", name: "Minnesota", rules: "state-standardized", licensed: true },
  { slug: "mississippi", abbr: "MS", name: "Mississippi", rules: "federal-only", licensed: false },
  { slug: "missouri", abbr: "MO", name: "Missouri", rules: "anniversary", licensed: false },
  { slug: "montana", abbr: "MT", name: "Montana", rules: "federal-only", licensed: false },
  { slug: "nebraska", abbr: "NE", name: "Nebraska", rules: "federal-only", licensed: false },
  { slug: "nevada", abbr: "NV", name: "Nevada", rules: "birthday", licensed: true },
  { slug: "new-hampshire", abbr: "NH", name: "New Hampshire", rules: "federal-only", licensed: false },
  { slug: "new-jersey", abbr: "NJ", name: "New Jersey", rules: "federal-only", licensed: false },
  { slug: "new-mexico", abbr: "NM", name: "New Mexico", rules: "federal-only", licensed: true },
  { slug: "new-york", abbr: "NY", name: "New York", rules: "year-round", licensed: false },
  { slug: "north-carolina", abbr: "NC", name: "North Carolina", rules: "federal-only", licensed: true },
  { slug: "north-dakota", abbr: "ND", name: "North Dakota", rules: "federal-only", licensed: false },
  { slug: "ohio", abbr: "OH", name: "Ohio", rules: "federal-only", licensed: true },
  { slug: "oklahoma", abbr: "OK", name: "Oklahoma", rules: "birthday", licensed: false },
  { slug: "oregon", abbr: "OR", name: "Oregon", rules: "birthday", licensed: false },
  { slug: "pennsylvania", abbr: "PA", name: "Pennsylvania", rules: "federal-only", licensed: false },
  { slug: "rhode-island", abbr: "RI", name: "Rhode Island", rules: "federal-only", licensed: false },
  { slug: "south-carolina", abbr: "SC", name: "South Carolina", rules: "federal-only", licensed: true },
  { slug: "south-dakota", abbr: "SD", name: "South Dakota", rules: "federal-only", licensed: false },
  { slug: "tennessee", abbr: "TN", name: "Tennessee", rules: "federal-only", licensed: true },
  { slug: "texas", abbr: "TX", name: "Texas", rules: "federal-only", licensed: true },
  { slug: "utah", abbr: "UT", name: "Utah", rules: "federal-only", licensed: true },
  { slug: "vermont", abbr: "VT", name: "Vermont", rules: "federal-only", licensed: false },
  { slug: "virginia", abbr: "VA", name: "Virginia", rules: "federal-only", licensed: false },
  { slug: "washington", abbr: "WA", name: "Washington", rules: "year-round", licensed: true },
  { slug: "west-virginia", abbr: "WV", name: "West Virginia", rules: "federal-only", licensed: false },
  { slug: "wisconsin", abbr: "WI", name: "Wisconsin", rules: "state-standardized", licensed: false },
  { slug: "wyoming", abbr: "WY", name: "Wyoming", rules: "federal-only", licensed: false },
];

const BY_SLUG = new Map(STATES.map((s) => [s.slug, s]));
const BY_ABBR = new Map(STATES.map((s) => [s.abbr, s]));

export function getState(slug: string): StateInfo | undefined {
  return BY_SLUG.get(slug.toLowerCase());
}

export function getStateByAbbr(abbr: string): StateInfo | undefined {
  return BY_ABBR.get(abbr.toUpperCase());
}

/**
 * Display helpers. These delegate to lib/switching-rules.ts so that a page can
 * never render a rule description that has not been checked against the state.
 */
export const ruleLabel = (s: StateInfo): string => switchingRule(s.abbr).label;
export const ruleNote = (s: StateInfo): string => switchingRule(s.abbr).summary;
export const ruleSource = (s: StateInfo) => switchingRule(s.abbr).source;

/** Compact label for tight sidebar rows. */
export function ruleShort(s: StateInfo): string {
  const l = switchingRule(s.abbr).label;
  return l.includes("—") ? l.split("—")[0].trim() : l;
}
