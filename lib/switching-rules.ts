/**
 * State Medigap switching rights, verified against the state's own source.
 *
 * Federal law gives one six-month open enrollment window and a defined set of
 * guaranteed issue rights. Some states give residents more. Those state rules
 * are the difference between a policyholder who can leave a bad block and one
 * who cannot, so getting them right matters more here than almost anything
 * else editorial on the site.
 *
 * The same standard applies as to a rate figure: a rule is stated as fact only
 * when it has been read in the state's own material and cited. A state without
 * a `source` renders as unverified, and the page says so rather than implying
 * we checked.
 *
 * What the verification pass found, and why generic descriptions are dangerous:
 *
 *  - Illinois caps its birthday rule at ages 65-75 AND restricts it to the
 *    policyholder's existing insurer. A generic "you can switch companies on
 *    your birthday" is simply false in Illinois.
 *  - Kentucky is a birthday rule, not an anniversary rule as previously
 *    classified here.
 *  - Maine is not year-round guaranteed issue. Each insurer picks one month a
 *    year, and only Plan A must be offered in it.
 *  - Nevada's rule reaches only carriers with open blocks of business, which
 *    is precisely the population most likely to want out.
 *
 * Windows differ too: 30 days in Oregon, 45 in Illinois, 60 in Nevada and
 * Oklahoma, 63 in Idaho and Louisiana. None of that survives a generic label.
 */

export type SwitchingKind =
  | "federal-only"
  | "birthday"
  | "anniversary"
  | "year-round"
  | "annual-designated-month"
  | "state-standardized";

export interface RuleSource {
  publisher: string;
  title: string;
  url: string;
  /** ISO date the wording was read. */
  accessed: string;
}

export interface SwitchingRule {
  kind: SwitchingKind;
  /** Short label for a table cell or card heading. */
  label: string;
  /**
   * One or two sentences a policyholder can act on: how long the window is,
   * what it lets them move to, and any limit that would surprise them.
   */
  summary: string;
  /** Present when the rule has been read in the state's own material. */
  source?: RuleSource;
}

const MEDICARE_GUIDE: RuleSource = {
  publisher: "Centers for Medicare & Medicaid Services",
  title: "Choosing a Medigap Policy — the official government guide",
  url: "https://www.medicare.gov/publications/02110-choosing-a-medigap-policy.pdf",
  accessed: "2026-08-30",
};

const FEDERAL_ONLY: SwitchingRule = {
  kind: "federal-only",
  label: "Federal rules only",
  summary:
    "We have not identified a state rule here that goes beyond the federal floor. Outside your one-time six-month open enrollment window, and without a federal guaranteed issue right, an insurer may use medical underwriting and may decline you.",
};

/**
 * Keyed by USPS abbreviation. A state absent from this map falls back to
 * FEDERAL_ONLY, which claims nothing beyond the federal baseline.
 */
const RULES: Record<string, SwitchingRule> = {
  CA: {
    kind: "birthday",
    label: "Birthday rule — 60 days",
    summary:
      "If you already hold a Medigap policy, you get a 60-day window each year following your birthday to buy a new one without medical screening or a new waiting period. The new policy must carry the same or lesser benefits than the one you hold.",
    source: {
      publisher: "California Department of Insurance",
      title: "Medicare Supplement Insurance (Medigap)",
      url: "https://www.insurance.ca.gov/01-consumers/105-type/75-medsupp/",
      accessed: "2026-08-30",
    },
  },
  NV: {
    kind: "birthday",
    label: "Birthday rule — 60 days",
    summary:
      "Established by Assembly Bill 250 and effective 1 January 2022. Existing Medigap enrollees get at least 60 days, starting the first day of their birthday month, to switch to a plan with the same or lesser benefits. Note the limit that matters most: it reaches carriers with open blocks of business, so it may not help you move out of a closed one.",
    source: {
      publisher: "Nevada Division of Insurance",
      title: "AB 250 Medicare Supplement “Birthday Rule” guidance",
      url: "https://doi.nv.gov/uploadedFiles/doi.nv.gov/Content/Insurers/Life_and_Health/AB%20250%20Guidance.pdf",
      accessed: "2026-08-30",
    },
  },
  OR: {
    kind: "birthday",
    label: "Birthday rule — 30 days",
    summary:
      "You may compare and apply starting 30 days before your birthday. The right to change runs from your birthday and ends 30 days later, and the new policy must have the same or lesser benefits. Within that window the change is guaranteed regardless of your health.",
    source: {
      publisher: "Oregon SHIBA / Division of Financial Regulation",
      title: "When can you switch Medigap plans — birthday rule fact sheet",
      url: "https://shiba.oregon.gov/Documents/4845-ins-birthday-rule-2023.pdf",
      accessed: "2026-08-30",
    },
  },
  ID: {
    kind: "birthday",
    label: "Birthday rule — 63 days",
    summary:
      "Current policyholders get an annual 63-day guaranteed issue window beginning on their birthday, and may take similar or lesser coverage from their existing company or from a different one, without underwriting.",
    source: {
      publisher: "Idaho Department of Insurance",
      title: "Recent changes to Medicare Supplement law and rules",
      url: "https://doi.idaho.gov/shiba/new-to-medicare/medicare-supplement-medigap/recent-changes-to-medicare-supplement-law-and-rules/",
      accessed: "2026-08-30",
    },
  },
  IL: {
    kind: "birthday",
    label: "Birthday rule — 45 days, ages 65–75, same insurer",
    summary:
      "Narrower than most, in two ways worth knowing before you plan around it. The 45-day window from your birthday is open only to policyholders aged 65 through 75, and it lets you move to a policy of equal or lesser benefits with the same insurer — not to a different company. Inside it, the insurer cannot decline you or price you on your health.",
    source: {
      publisher: "Illinois Department of Insurance",
      title: "Medicare Supplement — Illinois Department of Insurance",
      url: "https://idoi.illinois.gov/content/dam/soi/en/web/insurance/sites/insurance/companies/documents/medicare-supplement.pdf",
      accessed: "2026-08-30",
    },
  },
  LA: {
    kind: "birthday",
    label: "Birthday rule — 63 days",
    summary:
      "Existing policyholders get an annual 63-calendar-day open enrollment window beginning on their birthday. Confirm the benefit limits that apply with the department before relying on the width of it.",
    source: {
      publisher: "Louisiana State Legislature",
      title: "Act 71 (2023 Regular Session), House Bill 235",
      url: "https://legis.la.gov/legis/ViewDocument.aspx?d=1331582",
      accessed: "2026-08-30",
    },
  },
  OK: {
    kind: "birthday",
    label: "Birthday rule — 60 days",
    summary:
      "Issuers provide an annual 60-day open enrollment window beginning on your birthday. You may move to a policy of equal or lesser benefits with the same carrier or a different one, provided you have had no gap in coverage greater than 90 days.",
    source: {
      publisher: "Oklahoma Insurance Department",
      title: "Medicare Supplement Open Enrollment FAQs",
      url: "https://www.oid.ok.gov/medicare-supplement-open-enrollment-faqs/",
      accessed: "2026-08-30",
    },
  },
  KY: {
    kind: "birthday",
    label: "Birthday rule — 60 days",
    summary:
      "Kentucky runs a birthday rule, not an anniversary rule. Applicants get an annual open enrollment period within 60 days of their birthday in which to switch insurers for the plan they already hold, with guaranteed issue and no pricing based on health status.",
    source: {
      publisher: "Kentucky Department of Insurance",
      title: "Medicare Supplement enrollment changes",
      url: "https://insurance.ky.gov/ppc/Documents/2024.01.24%20Medicare%20Supplement%20Enrollment%20Changes.pdf",
      accessed: "2026-08-30",
    },
  },
  MO: {
    kind: "anniversary",
    label: "Anniversary rule — 60 days",
    summary:
      "Tied to your policy's anniversary date rather than your birthday. You may move to the same plan with a different insurance company from 30 days before that anniversary to 30 days after it.",
    source: {
      publisher: "Missouri Department of Commerce and Insurance",
      title: "Missouri Medigap Shopping Guide",
      url: "https://insurance-new.mo.gov/media/29086",
      accessed: "2026-08-30",
    },
  },
  CT: {
    kind: "year-round",
    label: "Year-round guaranteed issue",
    summary:
      "Medigap plans are available on a guaranteed issue basis at all times, and rates may not vary by age, gender or health status — Connecticut policies are community-rated, so your premium does not rise because you got older.",
    source: {
      publisher: "Connecticut Insurance Department",
      title: "Medicare Supplement",
      url: "https://portal.ct.gov/cid/consumer-resource-library/health-insurance/medicare-supplement",
      accessed: "2026-08-30",
    },
  },
  NY: {
    kind: "year-round",
    label: "Year-round guaranteed issue",
    summary:
      "State law requires any insurer writing Medigap in New York to accept an application at any time of year. Insurers may not decline you or make premium distinctions because of health status, claims experience or medical condition.",
    source: {
      publisher: "New York State Department of Financial Services",
      title: "Protections for Medicare beneficiaries residing in New York",
      url: "https://www.dfs.ny.gov/consumers/health_insurance/information_for_medicare_beneficiaries",
      accessed: "2026-08-30",
    },
  },
  ME: {
    kind: "annual-designated-month",
    label: "One designated month a year, Plan A",
    summary:
      "Commonly described elsewhere as year-round guaranteed issue, which is not what the rule says. Each insurer must designate one month a year in which it will accept any applicant for Plan A. The insurer chooses the month, and it is not required to offer any other plan during it — so check the month and the plan before counting on this.",
    source: {
      publisher: "Maine Bureau of Insurance",
      title: "Buy or switch outside open enrollment",
      url: "https://www.maine.gov/pfr/insurance/consumers/medicare-supplement-insurance/buy-switch-outside-open-enrollment",
      accessed: "2026-08-30",
    },
  },
  MA: {
    kind: "state-standardized",
    label: "State-standardised plans",
    summary:
      "Massachusetts does not use the federal plan letters. It has its own standardised plan set, so plan-letter comparisons drawn from other states do not describe what is sold here.",
    source: MEDICARE_GUIDE,
  },
  MN: {
    kind: "state-standardized",
    label: "State-standardised plans",
    summary:
      "Minnesota does not use the federal plan letters. Policies are designated Basic or Extended Basic under state law, with riders and further variants on top, so a Plan G comparison from another state does not describe what is sold here.",
    source: {
      publisher: "Minnesota Office of the Revisor of Statutes",
      title: "Minnesota Statutes §62A.31 — Medicare supplement benefits; minimum standards",
      url: "https://www.revisor.mn.gov/statutes/cite/62A.31",
      accessed: "2026-08-30",
    },
  },
  WI: {
    kind: "state-standardized",
    label: "State-standardised plans",
    summary:
      "Wisconsin does not use the federal plan letters. It sells a basic policy with optional riders, so plan-letter comparisons from other states do not describe what is available here.",
    source: MEDICARE_GUIDE,
  },
  WA: {
    kind: "year-round",
    label: "Apply to switch at any time",
    summary:
      "There is no annual open enrollment period for Medigap in Washington: if you already hold a Medigap policy you may apply to buy or switch at any time, and a company offering a Plan B through N must accept you for it. If you do not currently hold a Medigap policy, whether an insurer may ask you to pass a health questionnaire varies — check before you apply.",
    source: {
      publisher: "Washington State Office of the Insurance Commissioner",
      title: "Medigap (Medicare Supplement) plan coverage and costs",
      url: "https://www.insurance.wa.gov/insurance-resources/medicare/health-and-drug-plans/medigap-medicare-supplement-plan-coverage-and-costs",
      accessed: "2026-08-30",
    },
  },
};

export function switchingRule(abbr: string): SwitchingRule {
  return RULES[abbr.toUpperCase()] ?? FEDERAL_ONLY;
}

/** True when the state's rule has been read in the state's own material. */
export function isVerified(abbr: string): boolean {
  return Boolean(RULES[abbr.toUpperCase()]?.source);
}

/** How much of the map is verified — rendered honestly on the switching page. */
export function verificationProgress(abbrs: readonly string[]) {
  const beyondFederal = abbrs.filter((a) => RULES[a.toUpperCase()]);
  return {
    total: abbrs.length,
    beyondFederal: beyondFederal.length,
    verified: beyondFederal.filter((a) => RULES[a.toUpperCase()]?.source).length,
  };
}
