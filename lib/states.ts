export interface StateInfo {
  /** URL slug, e.g. "nevada". */
  slug: string;
  /** USPS abbreviation. */
  abbr: string;
  /** Display name. */
  name: string;
  /**
   * How the state regulates Medigap underwriting outside a guaranteed-issue
   * window. Drives the copy on each state page.
   */
  rules: "standard" | "birthday" | "anniversary" | "continuous" | "waiver" | "state-standardized";
  /** Whether the agency is licensed to write business in the state. */
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
  { slug: "alabama", abbr: "AL", name: "Alabama", rules: "standard", licensed: true },
  { slug: "alaska", abbr: "AK", name: "Alaska", rules: "standard", licensed: false },
  { slug: "arizona", abbr: "AZ", name: "Arizona", rules: "standard", licensed: true },
  { slug: "arkansas", abbr: "AR", name: "Arkansas", rules: "standard", licensed: true },
  { slug: "california", abbr: "CA", name: "California", rules: "birthday", licensed: true },
  { slug: "colorado", abbr: "CO", name: "Colorado", rules: "standard", licensed: true },
  { slug: "connecticut", abbr: "CT", name: "Connecticut", rules: "continuous", licensed: false },
  { slug: "delaware", abbr: "DE", name: "Delaware", rules: "standard", licensed: false },
  { slug: "district-of-columbia", abbr: "DC", name: "District of Columbia", rules: "standard", licensed: false },
  { slug: "florida", abbr: "FL", name: "Florida", rules: "standard", licensed: true },
  { slug: "georgia", abbr: "GA", name: "Georgia", rules: "standard", licensed: true },
  { slug: "hawaii", abbr: "HI", name: "Hawaii", rules: "standard", licensed: false },
  { slug: "idaho", abbr: "ID", name: "Idaho", rules: "birthday", licensed: true },
  { slug: "illinois", abbr: "IL", name: "Illinois", rules: "birthday", licensed: true },
  { slug: "indiana", abbr: "IN", name: "Indiana", rules: "standard", licensed: true },
  { slug: "iowa", abbr: "IA", name: "Iowa", rules: "standard", licensed: true },
  { slug: "kansas", abbr: "KS", name: "Kansas", rules: "standard", licensed: true },
  { slug: "kentucky", abbr: "KY", name: "Kentucky", rules: "anniversary", licensed: true },
  { slug: "louisiana", abbr: "LA", name: "Louisiana", rules: "birthday", licensed: true },
  { slug: "maine", abbr: "ME", name: "Maine", rules: "continuous", licensed: false },
  { slug: "maryland", abbr: "MD", name: "Maryland", rules: "standard", licensed: true },
  { slug: "massachusetts", abbr: "MA", name: "Massachusetts", rules: "state-standardized", licensed: false },
  { slug: "michigan", abbr: "MI", name: "Michigan", rules: "standard", licensed: true },
  { slug: "minnesota", abbr: "MN", name: "Minnesota", rules: "state-standardized", licensed: false },
  { slug: "mississippi", abbr: "MS", name: "Mississippi", rules: "standard", licensed: true },
  { slug: "missouri", abbr: "MO", name: "Missouri", rules: "anniversary", licensed: true },
  { slug: "montana", abbr: "MT", name: "Montana", rules: "standard", licensed: false },
  { slug: "nebraska", abbr: "NE", name: "Nebraska", rules: "standard", licensed: true },
  { slug: "nevada", abbr: "NV", name: "Nevada", rules: "birthday", licensed: true },
  { slug: "new-hampshire", abbr: "NH", name: "New Hampshire", rules: "standard", licensed: false },
  { slug: "new-jersey", abbr: "NJ", name: "New Jersey", rules: "standard", licensed: false },
  { slug: "new-mexico", abbr: "NM", name: "New Mexico", rules: "standard", licensed: true },
  { slug: "new-york", abbr: "NY", name: "New York", rules: "continuous", licensed: false },
  { slug: "north-carolina", abbr: "NC", name: "North Carolina", rules: "standard", licensed: true },
  { slug: "north-dakota", abbr: "ND", name: "North Dakota", rules: "standard", licensed: false },
  { slug: "ohio", abbr: "OH", name: "Ohio", rules: "standard", licensed: true },
  { slug: "oklahoma", abbr: "OK", name: "Oklahoma", rules: "birthday", licensed: true },
  { slug: "oregon", abbr: "OR", name: "Oregon", rules: "birthday", licensed: true },
  { slug: "pennsylvania", abbr: "PA", name: "Pennsylvania", rules: "standard", licensed: true },
  { slug: "rhode-island", abbr: "RI", name: "Rhode Island", rules: "standard", licensed: false },
  { slug: "south-carolina", abbr: "SC", name: "South Carolina", rules: "standard", licensed: true },
  { slug: "south-dakota", abbr: "SD", name: "South Dakota", rules: "standard", licensed: false },
  { slug: "tennessee", abbr: "TN", name: "Tennessee", rules: "standard", licensed: true },
  { slug: "texas", abbr: "TX", name: "Texas", rules: "standard", licensed: true },
  { slug: "utah", abbr: "UT", name: "Utah", rules: "standard", licensed: true },
  { slug: "vermont", abbr: "VT", name: "Vermont", rules: "continuous", licensed: false },
  { slug: "virginia", abbr: "VA", name: "Virginia", rules: "standard", licensed: true },
  { slug: "washington", abbr: "WA", name: "Washington", rules: "waiver", licensed: false },
  { slug: "west-virginia", abbr: "WV", name: "West Virginia", rules: "standard", licensed: true },
  { slug: "wisconsin", abbr: "WI", name: "Wisconsin", rules: "state-standardized", licensed: false },
  { slug: "wyoming", abbr: "WY", name: "Wyoming", rules: "standard", licensed: false },
];

const BY_SLUG = new Map(STATES.map((s) => [s.slug, s]));
const BY_ABBR = new Map(STATES.map((s) => [s.abbr, s]));

export function getState(slug: string): StateInfo | undefined {
  return BY_SLUG.get(slug.toLowerCase());
}

export function getStateByAbbr(abbr: string): StateInfo | undefined {
  return BY_ABBR.get(abbr.toUpperCase());
}

export const RULE_LABEL: Record<StateInfo["rules"], string> = {
  standard: "Federal baseline rules",
  birthday: "Birthday rule state",
  anniversary: "Anniversary rule state",
  continuous: "Year-round guaranteed issue",
  waiver: "Year-round plan switching",
  "state-standardized": "State-standardized plan set",
};

export const RULE_NOTE: Record<StateInfo["rules"], string> = {
  standard:
    "Outside your Medigap open enrollment period or a federal guaranteed-issue right, an insurer here may ask health questions before it accepts you. That makes the premium you lock in at 65 worth getting right.",
  birthday:
    "This state gives existing Medigap policyholders an annual window around their birthday to move to a policy with equal or lesser benefits without medical underwriting. The exact window length and the plans you can move to are set by state law — confirm the current rule before acting.",
  anniversary:
    "This state gives existing Medigap policyholders an annual window tied to their policy anniversary to move to a policy with equal or lesser benefits without medical underwriting. Confirm the current rule before acting.",
  continuous:
    "This state requires Medigap issuers to accept applicants on a guaranteed-issue basis year-round, so a rate increase can be answered by switching carriers at any time.",
  waiver:
    "This state lets Medigap policyholders switch to a plan with equal or lesser benefits at any time, subject to the state's own conditions.",
  "state-standardized":
    "This state does not use the federal Plan A-N letters. It has its own standardized Medigap plan set, so plan letters from other states do not map across directly.",
};

/** Compact form of RULE_LABEL, for tight sidebar rows. */
export const RULE_SHORT: Record<StateInfo["rules"], string> = {
  standard: "Federal baseline",
  birthday: "Birthday rule",
  anniversary: "Anniversary rule",
  continuous: "Guaranteed issue",
  waiver: "Plan switching",
  "state-standardized": "State plan set",
};
