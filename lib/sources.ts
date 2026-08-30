/**
 * Government sources for the educational pages.
 *
 * The rate pages hold themselves to a rule: no figure without a citation to a
 * public filing. Editorial pages get the same treatment. Every rule, deadline
 * and percentage stated as fact on this site traces to a federal source
 * recorded here, and renders with a visible link to it.
 *
 * Rules for this file:
 *
 *  - Federal primary sources only — medicare.gov, cms.gov, ssa.gov, ecfr.gov,
 *    and ACL for the counselling programme it funds. No secondary commentary,
 *    no competitor sites, no trade press.
 *  - `accessed` is the date the wording behind the claim was last read. When a
 *    page's claim is re-checked, update it here rather than in the page.
 *  - `claim` states what the source is being cited *for*, so a later reader can
 *    re-verify without re-reading the whole document.
 *  - Nothing here carries a dollar figure. Part B premiums, deductibles and
 *    plan limits change annually; the pages describe them in words and send the
 *    reader to Medicare for the current number. That is deliberate — a stale
 *    figure on a Medicare site is worse than no figure.
 */

export interface Source {
  id: string;
  publisher: string;
  title: string;
  url: string;
  /** ISO date the cited wording was last verified. */
  accessed: string;
  /** What this source is cited for. */
  claim: string;
}

const SOURCE_LIST = [
  {
    id: "medigap-when",
    publisher: "Medicare.gov",
    title: "When can I buy a Medigap policy?",
    url: "https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy/when",
    accessed: "2026-08-30",
    claim:
      "The Medigap Open Enrollment Period is six months, begins the first month you are 65 or older and enrolled in Part B, and does not repeat.",
  },
  {
    id: "medigap-ready",
    publisher: "Medicare.gov",
    title: "Get ready to buy a Medigap policy",
    url: "https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy",
    accessed: "2026-08-30",
    claim:
      "Outside open enrollment and without a guaranteed issue right, an insurer may use medical underwriting and may decline an application.",
  },
  {
    id: "medigap-change",
    publisher: "Medicare.gov",
    title: "Can I change my Medigap policy?",
    url: "https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy/change-policies",
    accessed: "2026-08-30",
    claim:
      "A new Medigap policy carries a 30-day free look; a pre-existing condition waiting period of up to six months may apply when switching.",
  },
  {
    id: "medigap-switch-drop",
    publisher: "Medicare.gov",
    title: "Can I switch or drop my Medigap policy?",
    url: "https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy/change-policies/switch-drop",
    accessed: "2026-08-30",
    claim:
      "Do not cancel the first policy until the second is in force; both premiums are due for the overlapping month.",
  },
  {
    id: "medigap-how-works",
    publisher: "Medicare.gov",
    title: "Learn how Medigap works",
    url: "https://www.medicare.gov/health-drug-plans/medigap/basics/how-medigap-works",
    accessed: "2026-08-30",
    claim:
      "Medigap policies issued since 1992 are guaranteed renewable: the insurer cannot cancel the policy while premiums are paid.",
  },
  {
    id: "medigap-costs",
    publisher: "Medicare.gov",
    title: "Medigap costs — how insurance companies price policies",
    url: "https://www.medicare.gov/health-drug-plans/medigap/basics/costs",
    accessed: "2026-08-30",
    claim:
      "Medigap policies are priced one of three ways: community-rated, issue-age-rated, or attained-age-rated. Attained-age premiums rise with the policyholder's age.",
  },
  {
    id: "medigap-compare",
    publisher: "Medicare.gov",
    title: "Compare Medigap plan benefits",
    url: "https://www.medicare.gov/health-drug-plans/medigap/basics/compare-plan-benefits",
    accessed: "2026-08-30",
    claim:
      "Plans C and F are unavailable to people who turned 65 on or after 1 January 2020; those eligible before that date may still buy or keep them.",
  },
  {
    id: "medigap-guide",
    publisher: "Centers for Medicare & Medicaid Services",
    title: "Choosing a Medigap Policy — the official government guide (PDF)",
    url: "https://www.medicare.gov/publications/02110-choosing-a-medigap-policy.pdf",
    accessed: "2026-08-30",
    claim:
      "The official plain-language guide to Medigap benefits, pricing methods, enrollment timing and guaranteed issue rights.",
  },
  {
    id: "ssa-1882",
    publisher: "Social Security Administration",
    title: "Social Security Act §1882 — Certification of Medicare Supplemental Policies",
    url: "https://www.ssa.gov/OP_Home/ssact/title18/1882.htm",
    accessed: "2026-08-30",
    claim:
      "Section 1882(r)(1): a Medigap policy must be expected to return at least 75% of premiums as benefits for group policies and at least 65% for individual policies.",
  },
  {
    id: "cfr-403b",
    publisher: "Electronic Code of Federal Regulations",
    title: "42 CFR Part 403, Subpart B — Medicare Supplemental Policies",
    url: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-A/part-403/subpart-B",
    accessed: "2026-08-30",
    claim: "The federal regulations implementing §1882, including loss-ratio and refund standards.",
  },
  {
    id: "naic-model-reg",
    publisher: "Centers for Medicare & Medicaid Services",
    title: "NAIC Model Regulation to Implement the Medicare Supplement Insurance Minimum Standards (PDF)",
    url: "https://www.cms.gov/medicare/health-plans/medigap/downloads/modelmedigapregulation2008.pdf",
    accessed: "2026-08-30",
    claim:
      "The model regulation states adopt: guaranteed renewability does not prohibit rate increases otherwise authorised by law.",
  },
  {
    id: "macra-bulletin",
    publisher: "National Association of Insurance Commissioners",
    title: "Agent Alert — Medicare Supplement enforcement, implementing MACRA amendments (PDF)",
    url: "https://content.naic.org/sites/default/files/committee_related_documents/cmte_b_senior_issues_related_macra_producer_bulletin_0.pdf",
    accessed: "2026-08-30",
    claim:
      "MACRA did not close the pre-2020 blocks of business; people eligible before 1 January 2020 keep and may still buy Plan C, Plan F and High-Deductible F.",
  },
  {
    id: "medicare-signup",
    publisher: "Medicare.gov",
    title: "When can I sign up for Medicare?",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare",
    accessed: "2026-08-30",
    claim:
      "The Initial Enrollment Period runs seven months: the three months before the month you turn 65, that month, and the three months after.",
  },
  {
    id: "medicare-penalties",
    publisher: "Medicare.gov",
    title: "Avoid late enrollment penalties",
    url: "https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties",
    accessed: "2026-08-30",
    claim:
      "The Part B premium may rise 10% for each full 12-month period you could have had Part B and did not enroll, and the penalty generally lasts as long as you have Part B.",
  },
  {
    id: "ssa-when-signup",
    publisher: "Social Security Administration",
    title: "When to sign up for Medicare",
    url: "https://www.ssa.gov/medicare/plan/when-to-sign-up",
    accessed: "2026-08-30",
    claim: "Social Security's own guidance on Medicare enrollment timing and how to enroll.",
  },
  {
    id: "medicare-working-past-65",
    publisher: "Medicare.gov",
    title: "Working past 65",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65",
    accessed: "2026-08-30",
    claim:
      "How employer coverage interacts with Medicare enrollment timing and the special enrollment period that follows it.",
  },
  {
    id: "ship-about",
    publisher: "SHIP National Technical Assistance Center",
    title: "About SHIPs — free Medicare counselling",
    url: "https://www.shiphelp.org/what-we-do/about-ships/",
    accessed: "2026-08-30",
    claim:
      "State Health Insurance Assistance Programs give free, unbiased, one-to-one Medicare counselling and take no commission.",
  },
  {
    id: "acl-ship",
    publisher: "Administration for Community Living, U.S. Department of Health and Human Services",
    title: "State Health Insurance Assistance Program (SHIP)",
    url: "https://acl.gov/programs/connecting-people-services/state-health-insurance-assistance-program-ship",
    accessed: "2026-08-30",
    claim: "SHIP is federally funded through the Administration for Community Living.",
  },
] as const satisfies readonly Source[];

export type SourceId = (typeof SOURCE_LIST)[number]["id"];

export const SOURCES: readonly Source[] = SOURCE_LIST;

const BY_ID = new Map(SOURCE_LIST.map((s) => [s.id, s as Source]));

export function getSource(id: SourceId): Source {
  const s = BY_ID.get(id);
  // Sources are compile-time constants, so a miss is a build-time bug, not a
  // runtime condition to render around.
  if (!s) throw new Error(`Unknown source id "${id}"`);
  return s;
}

/** The sources cited by one page, in the order given, de-duplicated. */
export function sourcesFor(ids: readonly SourceId[]): Source[] {
  return [...new Set(ids)].map((id) => getSource(id));
}
