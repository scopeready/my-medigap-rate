import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { GuideCta } from "@/components/GuideCta";
import { SITE } from "@/lib/site";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medigap-costs",
  "medigap-how-works",
  "naic-model-reg",
  "medigap-guide",
  "medigap-when",
];

const TITLE = "How Medigap rates work: attained age, issue age and community rated";
const DESCRIPTION =
  "The three ways a Medicare Supplement policy can be priced, how to tell which one you have, and why two increases can stack on the same policy in the same year.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/how-medigap-rates-work" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/how-medigap-rates-work`,
    type: "article",
  },
};

export default function Page() {
  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { label: "How Medigap rates work" }]}
        />
        <h1 style={{ marginTop: 0 }}>How Medigap rates work</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Two different things raise a Medigap premium, and they are not the same thing. Telling
          them apart is the difference between a policy that ages gracefully and one that becomes
          unaffordable at 78.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>The three pricing methods</h2>
          <p>
            Medicare&rsquo;s own guidance says a Medigap policy can be priced in one of three ways.
            <Cite id="medigap-costs" /> Every policy sold in the United States uses one of them,
            and the choice is made by the insurer when it files the policy form with your state.
          </p>

          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Premium is based on</th>
                  <th scope="col">Does it rise as you age?</th>
                  <th scope="col">Also called</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Attained-age-rated</th>
                  <td>Your age right now</td>
                  <td>
                    <strong>Yes, every year</strong>
                  </td>
                  <td>&mdash;</td>
                </tr>
                <tr>
                  <th scope="row">Issue-age-rated</th>
                  <td>Your age when you bought it</td>
                  <td>No</td>
                  <td>Entry-age-rated</td>
                </tr>
                <tr>
                  <th scope="row">Community-rated</th>
                  <td>Nobody&rsquo;s age &mdash; everyone pays the same</td>
                  <td>No</td>
                  <td>No-age-rated</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="citation">
            Definitions from Medicare.gov. All three still receive filed rate increases; only the
            first has an automatic annual age step on top.
            <Cite id="medigap-costs" />
          </p>

          <h2>The part that surprises people: the two increases stack</h2>
          <p>
            If your policy is attained-age-rated, you can receive two increases in the same year
            and they multiply rather than replace each other:
          </p>
          <ol>
            <li>
              <strong>The age step.</strong> You moved from one age band to the next. This is built
              into the rate table the insurer already filed. No new filing is needed and no letter
              announces it as a &ldquo;rate increase&rdquo;, because technically it is not one.
            </li>
            <li>
              <strong>The filed rate increase.</strong> The insurer asked your state for more
              premium across the whole block, and got it. This one arrives in a letter.
            </li>
          </ol>
          <p>
            Suppose the age step is about 3% and the filed increase is about 7%. Your bill does not
            rise 10%. It rises about 10.2%, because the second applies on top of the first — and
            it does that again the next year, and the year after. That compounding is the single
            most consequential thing to understand about attained-age pricing, and it is why
            Medicare warns these policies &ldquo;may be the least expensive at first, but they can
            eventually become the most expensive.&rdquo;
            <Cite id="medigap-costs" />
          </p>
          <p>
            None of this means attained-age is a bad choice. It is usually the cheapest way to be
            covered at 65, and if you are choosing between paying more now or more later, that is a
            real trade-off with a real argument on both sides. It only becomes a problem when
            nobody told you it was coming.
          </p>

          <h2>How to find out which one you have</h2>
          <p>Three places to look, in order of how quickly they will answer:</p>
          <ol>
            <li>
              <strong>Your policy schedule or outline of coverage.</strong> The rating method is
              disclosed there. The outline of coverage is the short document you were given at
              application, and it is the one worth digging out.
            </li>
            <li>
              <strong>Your insurer.</strong> Ask them directly: &ldquo;Is my policy attained-age,
              issue-age or community-rated?&rdquo; They must be able to answer.
            </li>
            <li>
              <strong>Your state insurance department.</strong> They hold the filed rate tables. In
              several states they also publish an annual premium comparison that shows the pricing
              method for every carrier in the market.
            </li>
          </ol>
          <p>
            A quick test that usually works: pull two renewal notices from consecutive years in
            which your insurer did <em>not</em> announce a rate increase. If the premium still went
            up, you are almost certainly attained-age-rated.
          </p>

          <h2>What the insurer has to do before it can raise your rate</h2>
          <p>
            A Medigap policy issued since 1992 is guaranteed renewable: as long as you pay, the
            company cannot cancel it, and it cannot single you out because of your health or your
            claims.
            <Cite id="medigap-how-works" />
          </p>
          <p>
            That protection is about your coverage, not your price. The model regulation the states
            adopt says plainly that guaranteed renewability does not prohibit rate increases
            otherwise authorised by law.
            <Cite id="naic-model-reg" /> To take one, the insurer files a request with your
            state&rsquo;s insurance department, supports it with claims experience, and the state
            reviews it. The increase applies to an entire filed class at once.
          </p>
          <p>
            Two consequences follow, and both matter when you are shopping:
          </p>
          <ul>
            <li>
              <strong>A filed request is not an approved increase.</strong> States can and do
              approve less than what was asked for. When we publish a figure here, it is the one we
              could confirm in the filing record, and we say which it is.
            </li>
            <li>
              <strong>The filing is public.</strong> That is the whole basis of this site. You do
              not have to take a carrier&rsquo;s word, or ours — you can read what they filed.{" "}
              <Link href="/methodology">How we verify a figure before publishing it</Link>.
            </li>
          </ul>

          <h2>Why the company name is not the useful unit</h2>
          <p>
            A rate increase is filed by a legal entity for a specific policy form in a specific
            state. One familiar brand often sits on top of several legal entities, each with its
            own NAIC number and its own filing history — and those histories can diverge sharply
            while the brand on the envelope stays identical.
          </p>
          <p>
            This is why we will never publish a &ldquo;most stable carrier&rdquo; ranking. Averaged
            across blocks, such a ranking would be wrong in some state for almost every company on
            it. What we publish instead is per-block: the entity, its NAIC code, and what it filed.{" "}
            <Link href="/what-is-a-closed-block">
              Why the same brand can run two very different books
            </Link>
            .
          </p>

          <h2>What this means when you are choosing</h2>
          <p>
            Comparing two quotes on this month&rsquo;s premium alone tells you very little. Worth
            asking about any policy you are considering:
          </p>
          <ul>
            <li>Which of the three pricing methods is it?</li>
            <li>
              If attained-age, what does the premium look like at 75 and at 80? The insurer has
              that table — it is filed.
            </li>
            <li>What has this specific block filed for in the last five years?</li>
            <li>Is the policy still open to new customers, or has it been closed?</li>
          </ul>
          <p>
            The last two are what this site was built to answer.{" "}
            <Link href="/medigap-rate-history">Start with your state</Link>.
          </p>
        </div>

        <LeadCta heading="Not sure how your policy is rated?">
          <p>
            Tell us the carrier, the plan letter and your state, and we will tell you which pricing
            method your policy uses and what the block it sits in has filed for. If the answer is
            &ldquo;you are fine, stay put&rdquo;, that is the answer you will get.
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
