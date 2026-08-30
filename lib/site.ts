/** Site-wide constants. Single source of truth for identity and contact data. */
import { STATES } from "./states";

export const SITE = {
  name: "MyMedigapRate",
  domain: "mymedigaprate.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mymedigaprate.com").replace(/\/$/, ""),
  tagline: "Medicare Supplement rate research, filing by filing.",
  description:
    "Independent research on Medicare Supplement (Medigap) premiums, rate-increase history and plan benefits — sourced from public insurance-department filings and published only after the filing is confirmed.",
} as const;

/** Third-party marketing organization behind the site (CMS/TPMO identification). */
export const ORG = {
  legalName: "ECOS Medicare Solutions",
  agent: "Darin Weidauer",
  npn: "18580338",
  phone: "480-845-0246",
  phoneHref: "+14808450246",
  email: "darinweidauer@gmail.com",
} as const;

export const TPMO_DISCLAIMER =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

export const GOVERNMENT_DISCLAIMER =
  "MyMedigapRate is a Medicare Supplement research resource operated by an independent, licensed insurance agency. We are not connected with or endorsed by the United States government or the federal Medicare program.";

export const DATA_DISCLAIMER =
  "Premiums shown on this site are published only after the underlying rate filing has been located in the issuing state's public filing system and cited on the page. Figures that have not yet cleared that check are labelled unverified and are never presented as a quote.";

/**
 * Licensing and compensation disclosure. Required site-wide, not only on the
 * about page: a reader who lands on a state page from search never sees /about.
 *
 * The state list is derived from `STATES` rather than written out, so it cannot
 * drift from the flag that governs the agent call-to-action. Editing one place
 * changes both.
 */
export const LICENSED_ABBRS: readonly string[] = STATES.filter((s) => s.licensed).map(
  (s) => s.abbr,
);

export const LICENSING_DISCLOSURE =
  `Insurance products are offered through ${ORG.legalName}. ${ORG.agent} is a licensed ` +
  `insurance agent in ${LICENSED_ABBRS.join(", ")}. We may receive compensation from ` +
  `insurance carriers for policies sold.`;

/**
 * Required wherever rate history is shown. Presenting past increases as
 * predictive would be a misrepresentation, and this site exists to show past
 * increases — so the sentence travels with them rather than living on /terms.
 */
export const PREDICTION_DISCLAIMER =
  "Rates and approved increases change. Past rate increases do not predict future increases. " +
  "Verify current pricing with the carrier or the issuing state's insurance department before " +
  "making a decision.";
