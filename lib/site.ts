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
  phone: "702-706-6564",
  phoneHref: "+17027066564",
  email: "darinweidauer@ecos.care",
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
  `insurance agent in ${LICENSED_ABBRS.join(", ")}. In other states we work with contracted ` +
  `agents who are licensed there and can help you directly; we are paid nothing on business ` +
  `they write. We may receive compensation from insurance carriers for policies we sell.`;

/**
 * States where we do not offer even a partner introduction.
 *
 * Empty, deliberately. New York sat here until 2026-08-31, when Darin
 * confirmed he works with associated agents licensed there and does not
 * intend to take a New York licence himself. New York therefore gets the
 * same introduction as any other unlicensed state.
 *
 * The lead form is a separate matter and still closes for every unlicensed
 * state, New York included: the agent licensed there takes the details.
 */
export const NO_REFERRAL_ABBRS: readonly string[] = [];

/** Whether an unlicensed state gets the partner-agent introduction. */
export const hasPartnerReferral = (abbr: string): boolean =>
  !NO_REFERRAL_ABBRS.includes(abbr.toUpperCase());

/**
 * Required wherever rate history is shown. Presenting past increases as
 * predictive would be a misrepresentation, and this site exists to show past
 * increases — so the sentence travels with them rather than living on /terms.
 */
export const PREDICTION_DISCLAIMER =
  "Rates and approved increases change. Past rate increases do not predict future increases. " +
  "Verify current pricing with the carrier or the issuing state's insurance department before " +
  "making a decision.";

/**
 * What our commission actually costs the reader: nothing.
 *
 * Medigap benefits are standardised by plan letter, so price is the only thing
 * that differs between companies selling the same letter — and the commission
 * is paid by the insurer out of the filed rate, not added on top of it. A
 * buyer pays the same premium through us, through another agent, or direct.
 *
 * This matters commercially as well as ethically. Disclosing the commission
 * without this sentence reads as "using an agent costs money", which is both
 * false and the opposite of what a reader should take away.
 */
export const COMPENSATION_NOTE =
  "You pay the same premium whichever way you buy: the commission comes out of the carrier's " +
  "filed rate, it is never added to yours. Going direct to the insurer does not make the policy " +
  "cheaper, and using us does not make it dearer.";

/**
 * Web3Forms configuration.
 *
 * The access key is public by design — it is submitted from the browser and is
 * visible in the page source of every form that uses it. It is not a secret, it
 * is not a private API key, and it must never be treated as one.
 *
 * Because it is public, it is committed here as the default rather than left to
 * an environment variable. That is deliberate. A `NEXT_PUBLIC_*` variable is
 * read at build time, so a deploy that runs before the variable is set produces
 * a site with no working form and no error anywhere — which is exactly what
 * happened on 2026-08-31: the site went live with a lead form that could not be
 * submitted. On a lead-generation site that failure is silent and expensive, and
 * no secret was being protected by the indirection.
 *
 * Rotation still needs no commit: set NEXT_PUBLIC_WEB3FORMS_KEY in Vercel and it
 * wins over the default. An empty or whitespace-only value falls back, so a
 * blank variable cannot switch the forms off by accident.
 */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Web3Forms form: "My Medigap Rate". Public value — see the note above. */
const WEB3FORMS_KEY_DEFAULT = "378a7c36-4a66-40f9-baa7-bbb9fa8e79f0";

export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim() || WEB3FORMS_KEY_DEFAULT;

/**
 * Absolute URL Web3Forms redirects to after a successful submission. It has to
 * be absolute — a path alone is ignored and the reader lands on the service's
 * own generic success page instead of ours.
 */
export const FORM_REDIRECT_URL = `${SITE.url}/thank-you`;

/** Where the guide request form lands. Absolute, for the same reason. */
export const GUIDE_REDIRECT_URL = `${SITE.url}/guide-sent`;
