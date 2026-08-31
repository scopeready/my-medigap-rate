import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { GuideCta } from "@/components/GuideCta";
import { SITE } from "@/lib/site";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = ["ssa-1882", "cfr-403b", "naic-model-reg", "medigap-guide"];

const TITLE = "Medigap loss ratios explained";
const DESCRIPTION =
  "A loss ratio is claims paid divided by premium collected. Federal law sets a floor of 65% for individual Medigap policies. Why a block above 100% is usually a rate increase waiting to happen — and why that is not a scandal.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/medigap-loss-ratios-explained" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/medigap-loss-ratios-explained`,
    type: "article",
  },
};

export default function Page() {
  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Loss ratios explained" }]} />
        <h1 style={{ marginTop: 0 }}>Medigap loss ratios explained</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          One number tells you more about whether your premium is going to rise than any review or
          star rating: how much of the premium that block collects is already going back out as
          claims.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>The definition, in one line</h2>
          <p>
            A loss ratio is <strong>claims paid divided by premiums collected</strong>, over some
            period, for some group of policies. A block collecting $100 and paying $88 in claims
            has an 88% loss ratio.
          </p>
          <p>
            &ldquo;Loss&rdquo; here is insurance jargon for a claim, not for losing money. A high
            loss ratio means a large share of premium is going back to policyholders as benefits.
            From your side of the table, high is not automatically bad — it means the policy is
            paying out.
          </p>

          <h2>The floor the law sets</h2>
          <p>
            Federal law does not leave this to the market. A Medicare supplement policy must be
            expected to return, as benefits, at least:
          </p>
          <ul>
            <li>
              <strong>65% of premiums</strong> for individual policies, and
            </li>
            <li>
              <strong>75% of premiums</strong> for group policies.
            </li>
          </ul>
          <p>
            That is §1882(r)(1) of the Social Security Act.
            <Cite id="ssa-1882" /> The implementing regulations sit at 42 CFR Part 403, Subpart B.
            <Cite id="cfr-403b" /> Most Medigap policies bought individually are on the 65% side.
          </p>
          <p>
            So a block running at 70% is not violating anything. It is above the floor. The floor
            exists to stop a policy being sold that returns very little of what it takes in — it is
            a consumer protection, not a target.
          </p>

          <h2>The number worth watching is 100%</h2>
          <p>
            Here is where it gets useful to you. The legal floor is 65%, but the economically
            interesting line is 100%.
          </p>
          <p>
            At 100%, a block is paying out in claims exactly what it collects in premium — before
            paying a single employee, commission, or overhead cost. Above 100%, it is paying out
            more than it takes in.
          </p>
          <p>
            A block cannot stay there. It has essentially three ways out, and only one of them is
            available at scale: raise premiums. It cannot cancel policyholders — Medigap coverage
            is guaranteed renewable — and it cannot cut the benefits, which are standardised by
            plan letter.
          </p>
          <p>
            That is why we publish loss ratios beside rate history rather than on their own. In our
            research corpus, the pattern recurs: blocks carrying state loss ratios at or above 100%
            turn up repeatedly alongside the largest filed increases. A loss ratio above 100% is
            not a prediction, and we will not dress it up as one. It is a pressure reading.
          </p>

          <h2>Read the state figure, not the national one</h2>
          <p>
            Rates are filed state by state, and a company&rsquo;s experience varies enormously
            between them. The same carrier can be comfortable nationally and badly underwater in
            one state — different age mix, different medical costs, different history of who bought
            when.
          </p>
          <p>
            When a national number and a state number diverge sharply, the state number is the one
            that bears on your premium, because your state&rsquo;s regulator is the one reviewing
            the filing that affects you. Where we can publish both, we show both, and we label
            which is which.
          </p>

          <h2>What a loss ratio does not tell you</h2>
          <p>Four honest limits, because a number used carelessly is worse than no number:</p>
          <ul>
            <li>
              <strong>It is backward-looking.</strong> It describes an experience period that has
              already closed, often a year or more ago. It is a photograph, not a forecast.
            </li>
            <li>
              <strong>It is noisy in small blocks.</strong> A block of a few thousand lives can
              swing wildly on a handful of expensive claims. Treat a dramatic figure attached to a
              small block with caution.
            </li>
            <li>
              <strong>It says nothing about service.</strong> A block with a great loss ratio can
              still have poor claims handling. Different question, different source — your state
              insurance department publishes complaint data.
            </li>
            <li>
              <strong>It is not a company grade.</strong> Loss ratios belong to blocks in states,
              like rate increases do. Averaging them into a carrier-level score would be wrong in
              some state for nearly every company.{" "}
              <Link href="/what-is-a-closed-block">Why blocks, not brands</Link>.
            </li>
          </ul>

          <h2>How to use it when you are actually shopping</h2>
          <p>
            Loss ratio is a second-pass filter, not a first-pass one. A sensible order:
          </p>
          <ol>
            <li>Work out which plan letter you want, on benefits.</li>
            <li>Find the blocks offering it to someone like you in your state.</li>
            <li>
              Look at each block&rsquo;s filed increase history — the shape over several years, not
              one figure.
            </li>
            <li>
              Then use the loss ratio to sanity-check what you saw. A calm history with a loss
              ratio near or above 100% suggests the calm may not last. A history with one large
              increase and a loss ratio that has since come back down may mean the correction has
              already happened.
            </li>
          </ol>
          <p>
            That last case is worth dwelling on, because it cuts against instinct: a block that has
            just taken a painful increase and returned to health can be a better place to be than
            one that has not taken its medicine yet.
          </p>

          <h2>Where our figures come from</h2>
          <p>
            Loss ratios on this site are published only when we can attribute them to a public
            regulatory source and cite it on the page. Until a figure clears that check, the page
            says so rather than showing an unsourced number.{" "}
            <Link href="/methodology">Our verification standard</Link>.
          </p>
        </div>

        <LeadCta heading="Want the loss ratio on your own block?">
          <p>
            Give us the carrier, plan letter and state from your policy schedule. We will tell you
            what that block&rsquo;s experience looks like where you live and what it has filed for
            — and if the answer is that it looks healthy, we will say that.
          </p>
        </LeadCta>

        <GuideCta />
        <div className="prose">
          <SourceList ids={SOURCES} />
        </div>
      </div>
    </section>
  );
}
