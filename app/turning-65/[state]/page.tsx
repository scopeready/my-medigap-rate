import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { SITE, ORG } from "@/lib/site";
import { STATES, getState } from "@/lib/states";
import { ROUTED_PLANS } from "@/lib/plans";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medicare-signup",
  "medicare-penalties",
  "medigap-when",
  "medigap-ready",
  "medigap-costs",
  "medigap-guide",
  "ship-about",
];

/**
 * State pages exist only for the states the agency is licensed in.
 *
 * A page here carries an agent call-to-action, and publishing one for a state
 * we cannot write in would imply we can sell there. Non-licensed states are
 * served by the national guide and by their own rate-history pages, which carry
 * no agent CTA.
 */
export function generateStaticParams() {
  return STATES.filter((s) => s.licensed).map((s) => ({ state: s.slug }));
}

export const dynamicParams = false;

/** Editorial description of each switching-rule category, in consumer language. */
const RULE_COPY: Record<string, string> = {
  standard:
    "follows the federal baseline. Outside your one-time six-month window, and without a guaranteed issue right, an insurer may ask health questions and may decline you.",
  birthday:
    "is generally described as a birthday-rule state: an annual window tied to your birthday in which you may move to a policy of equal or lesser benefits without medical underwriting.",
  anniversary:
    "is generally described as an anniversary-rule state: an annual window tied to your policy anniversary rather than your birthday.",
  continuous:
    "is generally described as offering year-round guaranteed issue, meaning insurers must sell to eligible applicants without medical underwriting.",
  waiver:
    "is generally described as allowing year-round switching between plans of equal or lesser benefit.",
  "state-standardized":
    "does not use the federal plan letters at all. It has its own standardised plan structure, so plan-letter comparisons from other states do not apply here.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  const title = `Turning 65 in ${s.name}`;
  const description = `Medicare and Medigap enrollment timing for ${s.name}: your 7-month Initial Enrollment Period, your one-time 6-month Medigap window, and the switching rules that apply after it closes.`;
  return {
    title,
    description,
    alternates: { canonical: `/turning-65/${s.slug}` },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url: `${SITE.url}/turning-65/${s.slug}`,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = getState(state);
  if (!s || !s.licensed) notFound();

  const ruleCopy = RULE_COPY[s.rules] ?? RULE_COPY.standard;
  const isStandardized = s.rules === "state-standardized";

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/turning-65", label: "Turning 65" },
            { label: s.name },
          ]}
        />
        <h1 style={{ marginTop: 0 }}>Turning 65 in {s.name}</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          The federal deadlines are the same everywhere. What changes state by state is how much
          room you have to change your mind afterwards — and in {s.name}, that is worth knowing
          before you choose, not after.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>The two federal windows</h2>
          <p>
            These apply in {s.name} exactly as they do everywhere else.
          </p>
          <ul>
            <li>
              <strong>Initial Enrollment Period — 7 months.</strong> The three months before your
              65th birthday month, that month, and the three after.
              <Cite id="medicare-signup" /> Miss it without a special enrollment period and the
              Part B premium may rise 10% for each full 12 months you could have enrolled and did
              not, generally for as long as you have Part B.
              <Cite id="medicare-penalties" />
            </li>
            <li>
              <strong>Medigap Open Enrollment — 6 months, once.</strong> Starts the first month you
              are 65 or older and enrolled in Part B.
              <Cite id="medigap-when" /> Inside it no insurer can decline you or price you on your
              health. Outside it, without a guaranteed issue right, they may do both.
              <Cite id="medigap-ready" />
            </li>
          </ul>
          <p>
            <Link href="/turning-65">
              The full walk-through of both windows, and the order to do things in
            </Link>
            .
          </p>

          <h2>What {s.name} adds after that</h2>
          <p>
            Beyond the federal floor, {s.name} {ruleCopy}
          </p>
          <p className="citation">
            <strong>Confirm this before relying on it.</strong> That description is our own
            editorial classification, not a regulator&rsquo;s wording. State switching rules are
            changed by legislation, carry conditions and deadlines a single sentence cannot hold,
            and are the kind of thing worth hearing from the state itself. Check with the{" "}
            {s.name} insurance department, or with your free state counselling programme, before
            acting on it.
            <Cite id="ship-about" />
          </p>
          {isStandardized && (
            <p>
              Because {s.name} standardises its own plans rather than using the federal letters,
              most national Medigap comparison content — including plan-letter tables — does not
              describe what is actually sold here. Treat any site that shows you a Plan G
              comparison for {s.name} with real caution.
            </p>
          )}

          <h2>What to compare while your window is open</h2>
          <p>
            Benefits are fixed by plan letter, so the differences that remain are price and
            behaviour. Behaviour is the one that compounds.
          </p>
          <p>
            Most policies are attained-age-rated, which means the premium climbs with your age every
            year in addition to any filed rate increase — Medicare&rsquo;s guidance notes these
            &ldquo;may be the least expensive at first, but they can eventually become the most
            expensive.&rdquo;
            <Cite id="medigap-costs" />{" "}
            <Link href="/how-medigap-rates-work">How the three pricing methods differ</Link>.
          </p>
          {!isStandardized && (
            <>
              <p>
                What we track for {s.name}, by plan:
              </p>
              <ul className="inline-list">
                {ROUTED_PLANS.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/medigap-rate-history/${s.slug}/${p.slug}`}>
                      {p.name} rate history in {s.abbr}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p>
            <Link href={`/medigap-rate-history/${s.slug}`}>
              Everything we hold for {s.name}
            </Link>
            , including which figures have cleared verification and which have not.
          </p>

          <h2>If you are already past 65</h2>
          <p>
            This page is about the window. If yours has closed and your premium has jumped, the
            question is a different one — whether the increase is your age, your block, or a block
            that has stopped taking new customers.{" "}
            <Link href="/why-did-my-medigap-premium-increase">
              Working out which one is happening to you
            </Link>
            .
          </p>

          <h2>Free help in {s.name}</h2>
          <p>
            {s.name} has a State Health Insurance Assistance Program offering free, unbiased,
            one-to-one Medicare counselling. It takes no commission on your decision.
            <Cite id="ship-about" /> Find it through the{" "}
            <a href="https://www.shiphelp.org/" rel="noopener noreferrer" target="_blank">
              SHIP locator
            </a>{" "}
            or by calling 1-877-839-2675. We recommend using it even if you also talk to us.
          </p>
        </div>

        <LeadCta heading={`Turning 65 in ${s.name}?`}>
          <p>
            {ORG.agent} is licensed in {s.abbr} and can walk through your options here — what the
            blocks in the {s.name} market have filed, which are still open, and how the rules here
            affect whether you could move later. Tell us your birthday month and we will work back
            from it.
          </p>
        </LeadCta>

        <div className="prose">
          <SourceList ids={SOURCES} />
        </div>
      </div>
    </section>
  );
}
