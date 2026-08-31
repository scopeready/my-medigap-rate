import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { SITE, ORG, COMPENSATION_NOTE } from "@/lib/site";
import { STATES, getState, ruleLabel, ruleNote, ruleSource } from "@/lib/states";
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

  const isStandardized = s.rules === "state-standardized";
  const src = ruleSource(s);

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

          <h2>What {s.name} adds after that: {ruleLabel(s).toLowerCase()}</h2>
          <p>{ruleNote(s)}</p>
          {src ? (
            <p className="citation">
              Read in {src.publisher}&rsquo;s own material on {src.accessed}:{" "}
              <a href={src.url} rel="noopener noreferrer" target="_blank">
                {src.title}
              </a>
              . State rules change by legislation, so confirm the current wording before you act
              on it &mdash; and note that a window being open is not the same as an insurer being
              obliged to sell you any plan you want.
            </p>
          ) : (
            <p className="citation">
              We have not identified a {s.name} rule beyond the federal floor. That is not the
              same as proving none exists, so confirm with the {s.name} insurance department or
              your free state counselling programme before assuming you cannot move.
              <Cite id="ship-about" />
            </p>
          )}
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
            one-to-one Medicare counselling, funded federally rather than by carriers.
            <Cite id="ship-about" /> Find it through the{" "}
            <a href="https://www.shiphelp.org/" rel="noopener noreferrer" target="_blank">
              SHIP locator
            </a>{" "}
            or by calling 1-877-839-2675. We recommend using it even if you also talk to us &mdash;
            and note that neither route costs you anything. {COMPENSATION_NOTE}
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
