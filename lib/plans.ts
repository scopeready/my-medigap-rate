export type PlanSlug =
  | "plan-a" | "plan-b" | "plan-c" | "plan-d" | "plan-f" | "high-deductible-plan-f"
  | "plan-g" | "high-deductible-plan-g" | "plan-k" | "plan-l" | "plan-m" | "plan-n";

export interface PlanInfo {
  slug: PlanSlug;
  /** Plan letter as CMS labels it. */
  letter: string;
  /** Display name, e.g. "Plan G". */
  name: string;
  /** One line describing who the plan is for. */
  summary: string;
  /**
   * Whether the plan is open to people who first became eligible for Medicare
   * on or after 1 January 2020. Plans C, F and High-Deductible F are closed to
   * that group because they pay the Part B deductible.
   */
  openToNewlyEligible: boolean;
  /** Longer editorial description. No dollar figures — those live in filings. */
  detail: string;
  /** What the enrollee still pays. */
  youStillPay: readonly string[];
}

export const PLANS: readonly PlanInfo[] = [
  {
    slug: "plan-a", letter: "A", name: "Plan A", openToNewlyEligible: true,
    summary: "The federal floor. Every Medigap issuer must offer it.",
    detail:
      "Plan A is the minimum standardized benefit package. Every carrier that sells Medigap in a state has to offer it, which makes it a useful yardstick for comparing one carrier's pricing posture against another's — but it leaves the Part A deductible and the Part B deductible with you.",
    youStillPay: ["The Part A hospital deductible", "The Part B annual deductible", "Skilled nursing facility coinsurance", "Excess charges where a state allows them"],
  },
  {
    slug: "plan-b", letter: "B", name: "Plan B", openToNewlyEligible: true,
    summary: "Plan A plus the Part A hospital deductible.",
    detail:
      "Plan B adds coverage of the Part A hospital deductible to the Plan A package. It is thinly sold in most markets, so its filed rates are often stale relative to the plans a carrier actively competes on.",
    youStillPay: ["The Part B annual deductible", "Skilled nursing facility coinsurance", "Excess charges where a state allows them"],
  },
  {
    slug: "plan-c", letter: "C", name: "Plan C", openToNewlyEligible: false,
    summary: "Closed to people newly eligible in 2020 or later.",
    detail:
      "Plan C covers the Part B deductible, which is why federal law closed it to anyone who first became eligible for Medicare on or after 1 January 2020. If you were eligible before that date and already hold a Plan C, you can keep it — but the block is closed to new entrants, and closed blocks tend to age, which shows up in the filed rate history.",
    youStillPay: ["Part B excess charges"],
  },
  {
    slug: "plan-d", letter: "D", name: "Plan D", openToNewlyEligible: true,
    summary: "Plan G's benefits without excess-charge coverage.",
    detail:
      "Plan D covers the Part A deductible, skilled nursing coinsurance and foreign travel emergency care, but not Part B excess charges. It sits between Plan B and Plan G and is lightly sold.",
    youStillPay: ["The Part B annual deductible", "Part B excess charges"],
  },
  {
    slug: "plan-f", letter: "F", name: "Plan F", openToNewlyEligible: false,
    summary: "The old first-dollar plan. Closed to newly eligible since 2020.",
    detail:
      "Plan F was the most comprehensive standardized plan and, for years, the most widely sold. Because it covers the Part B deductible, it is closed to anyone first eligible for Medicare on or after 1 January 2020. Existing policyholders keep it. Watching Plan F rate filings matters precisely because the block is closed: new, healthier entrants are no longer joining it, and that dynamic is visible in the filings.",
    youStillPay: ["Nothing on the standardized Medicare-covered services this plan lists"],
  },
  {
    slug: "high-deductible-plan-f", letter: "F", name: "High-Deductible Plan F", openToNewlyEligible: false,
    summary: "Plan F behind an annual deductible. Closed to newly eligible.",
    detail:
      "High-Deductible Plan F pays the same benefits as Plan F, but only after you have met a separate annual deductible set by CMS each year. Like standard Plan F it is closed to those first eligible on or after 1 January 2020.",
    youStillPay: ["The plan's annual deductible before benefits begin"],
  },
  {
    slug: "plan-g", letter: "G", name: "Plan G", openToNewlyEligible: true,
    summary: "The most comprehensive plan still open to new enrollees.",
    detail:
      "Plan G covers everything Plan F covers except the Part B deductible, which you pay once a year. It is the plan most people compare first, and the one with the deepest, most competitive set of filings in nearly every state — which is what makes its rate history the clearest read on how a carrier behaves over time.",
    youStillPay: ["The Part B annual deductible"],
  },
  {
    slug: "high-deductible-plan-g", letter: "G", name: "High-Deductible Plan G", openToNewlyEligible: true,
    summary: "Plan G behind an annual deductible, for a much lower premium.",
    detail:
      "High-Deductible Plan G pays Plan G's benefits after you meet a separate annual deductible that CMS sets each year. The monthly premium is a fraction of standard Plan G. The trade is real: in a bad health year you pay the deductible before the plan does anything, and the rate-increase history on these blocks is worth reading carefully before you rely on the low entry premium.",
    youStillPay: ["The plan's annual deductible before benefits begin", "The Part B annual deductible, which counts toward that deductible"],
  },
  {
    slug: "plan-k", letter: "K", name: "Plan K", openToNewlyEligible: true,
    summary: "Cost-sharing plan with an annual out-of-pocket limit.",
    detail:
      "Plan K pays a partial share of most cost-sharing items and then covers everything once you hit an annual out-of-pocket maximum set by CMS. It behaves less like a supplement and more like a stop-loss.",
    youStillPay: ["A share of most coinsurance and deductibles until the annual limit is met", "The Part B annual deductible"],
  },
  {
    slug: "plan-l", letter: "L", name: "Plan L", openToNewlyEligible: true,
    summary: "Plan K at a higher coverage share and a lower annual limit.",
    detail:
      "Plan L works the same way as Plan K but pays a larger share of cost-sharing and has a lower annual out-of-pocket maximum, so it costs more per month.",
    youStillPay: ["A share of most coinsurance and deductibles until the annual limit is met", "The Part B annual deductible"],
  },
  {
    slug: "plan-m", letter: "M", name: "Plan M", openToNewlyEligible: true,
    summary: "Splits the Part A deductible with you.",
    detail:
      "Plan M covers half the Part A hospital deductible and leaves the Part B deductible with you. It is rarely offered and rarely competitive; where it is filed at all, the block is usually small.",
    youStillPay: ["Half the Part A hospital deductible", "The Part B annual deductible", "Part B excess charges"],
  },
  {
    slug: "plan-n", letter: "N", name: "Plan N", openToNewlyEligible: true,
    summary: "Lower premium than Plan G, with small copays at the point of care.",
    detail:
      "Plan N covers the same ground as Plan G except that you pay the Part B deductible, a small copay for some office and emergency-room visits, and any Part B excess charges your provider bills. In states that prohibit excess charges, that last exposure disappears — which is why Plan N's value depends heavily on where you live.",
    youStillPay: ["The Part B annual deductible", "A copay for some office and emergency-room visits", "Part B excess charges, where a state permits them"],
  },
];

const BY_SLUG = new Map(PLANS.map((p) => [p.slug, p]));

export function getPlan(slug: string): PlanInfo | undefined {
  return BY_SLUG.get(slug.toLowerCase() as PlanSlug);
}

/**
 * Plans that get a programmatic rate-history page in every state.
 *
 * Plan G and Plan N only, deliberately. A rate-history page exists to show a
 * block's filed rate actions over time, and the research corpus carries that
 * history for G and N alone — the other plan letters have premiums but no
 * increase history in any state, so their pages could never show the one thing
 * the page type is for. Every other letter gets a national explainer under
 * `/medigap-plans/[plan]` instead.
 *
 * Adding a letter here is only correct once verified rate actions exist for it.
 */
const ROUTED_ORDER: readonly PlanSlug[] = ["plan-g", "plan-n"];

export const ROUTED_PLANS: readonly PlanInfo[] = ROUTED_ORDER.map((slug) => {
  const p = BY_SLUG.get(slug);
  if (!p) throw new Error(`ROUTED_ORDER references unknown plan "${slug}"`);
  return p;
});
