import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { SITE } from "@/lib/site";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medigap-how-works",
  "naic-model-reg",
  "macra-bulletin",
  "medigap-compare",
  "medigap-ready",
  "ssa-1882",
];

const TITLE = "What is a closed block, and is your Medigap policy in one?";
const DESCRIPTION =
  "When an insurer stops selling a policy form, everyone left in it ages together and the premium compounds. How closed blocks work, why the same brand can run a calm one and a brutal one, and how to check yours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/what-is-a-closed-block" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/what-is-a-closed-block`,
    type: "article",
  },
};

export default function Page() {
  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "What is a closed block" }]} />
        <h1 style={{ marginTop: 0 }}>What is a closed block?</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          It is the reason two people with the same insurance company, the same plan letter and the
          same address can be paying premiums that differ by a hundred dollars a month — and why
          one of them is watching that gap widen every year.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>First, a plain warning about the term</h2>
          <p>
            &ldquo;Closed block&rdquo; and &ldquo;death spiral&rdquo; are industry and actuarial
            usage. They are not legal categories, they are not defined by Medicare, and no
            regulator maintains a list of them. If a website tells you a specific carrier is
            &ldquo;officially in a death spiral&rdquo;, it is inventing an authority that does not
            exist.
          </p>
          <p>
            What <em>is</em> documented is every piece of the mechanism: that policies are
            guaranteed renewable, that rate increases apply to filed classes rather than to
            individuals, and that insurers must file those increases with the state. Put those
            together and the pattern follows. We will show you the parts, cite each one, and let
            you draw the conclusion.
          </p>

          <h2>The mechanism, in order</h2>
          <ol>
            <li>
              <strong>An insurer stops selling a policy form.</strong> Maybe it launched a
              replacement, maybe it left the market, maybe the pricing stopped working. Nothing
              about this is improper, and it does not have to be announced to you.
            </li>
            <li>
              <strong>No new customers enter that group.</strong> Existing holders keep their
              coverage — the policy is guaranteed renewable and the insurer cannot cancel it while
              you pay.
              <Cite id="medigap-how-works" /> But nobody younger joins.
            </li>
            <li>
              <strong>Everyone in it ages together.</strong> A group with no new entrants gets
              older every year, in lockstep. Claims per person rise accordingly.
            </li>
            <li>
              <strong>Premiums follow claims.</strong> Federal law requires a Medigap policy to be
              expected to return at least 65% of premium as benefits for individual policies, and
              75% for group policies.
              <Cite id="ssa-1882" /> When claims climb against a fixed premium, the arithmetic has
              one release valve: file for more premium.
            </li>
            <li>
              <strong>The healthiest people leave.</strong> Here is the turn. Anyone healthy enough
              to pass medical underwriting can shop elsewhere — and the people who can pass are, by
              definition, the ones with the lowest claims.
              <Cite id="medigap-ready" />
            </li>
            <li>
              <strong>Which makes the average worse.</strong> Removing the cheapest people from a
              pool raises the average cost of everyone remaining. That drives the next increase,
              which prompts the next healthy exit. This self-reinforcing loop is what the
              &ldquo;spiral&rdquo; in the nickname refers to.
            </li>
          </ol>
          <p>
            Guaranteed renewability is doing exactly what it was designed to do throughout: nobody
            is cancelled, nobody is singled out for their health. The model regulation states adopt
            simply does not extend that protection to price — it says plainly that guaranteed
            renewability does not prohibit rate increases otherwise authorised by law.
            <Cite id="naic-model-reg" />
          </p>

          <h2>Why the same brand runs two different books</h2>
          <p>
            This is the part that makes carrier-level advice useless.
          </p>
          <p>
            Rates are filed by a legal entity, for a specific policy form, in a specific state. A
            national brand may sit on top of several legal entities, each with its own NAIC number.
            One of those entities may hold an older, closed book. Another may hold the current one,
            still selling, still taking in 65-year-olds.
          </p>
          <p>
            Our own research corpus shows this clearly. In Ohio, two entities selling under the
            same well-known brand, on the same plan letter, with increases effective the same day
            each June, ran like this over three consecutive years: one at roughly 10%, then 20%,
            then 36%; the other at roughly 11%, then 14%, then 15%. A customer of the first would
            reasonably conclude the brand raises rates aggressively. A customer of the second would
            reasonably conclude the opposite. Both would be generalising from their own block, and
            both would be wrong about the other.
          </p>
          <p>
            So &ldquo;which company is best?&rdquo; has no answer. &ldquo;Which block am I in, and
            what has it filed?&rdquo; has a precise one.
          </p>

          <h2>A closed block is not the same as a discontinued plan letter</h2>
          <p>
            These get conflated constantly, and they are different things.
          </p>
          <p>
            Plan C and Plan F are not available to people who turned 65 on or after 1 January 2020,
            because federal law stopped new policies from covering the Part B deductible for people
            newly eligible from that date.
            <Cite id="medigap-compare" /> That is a statutory change to what can be sold, not an
            insurer's business decision.
          </p>
          <p>
            Crucially, it did <em>not</em> close the existing books. People who were eligible for
            Medicare before 1 January 2020 keep their Plan C or Plan F, and may still buy one.
            <Cite id="macra-bulletin" /> Those blocks remain open to a shrinking but real pool of
            new entrants.
          </p>
          <p>
            The practical upshot: being on Plan F does not by itself mean you are in a closed
            block. It means your pool of possible new entrants is limited to people who reached
            Medicare eligibility before 2020, and that pool only shrinks. Worth watching, not worth
            panicking about.
          </p>

          <h2>How to check whether your block is closed</h2>
          <p>You can do this yourself in about fifteen minutes.</p>
          <ol>
            <li>
              <strong>Get the exact entity name from your policy schedule.</strong> Not the brand on
              the envelope — the legal entity, and the NAIC number if it is printed. This is the
              only identifier that maps to a filing.
            </li>
            <li>
              <strong>Ask the insurer the direct question:</strong> &ldquo;Is this policy form still
              being sold to new applicants in my state?&rdquo; They know. Ask for it in writing.
            </li>
            <li>
              <strong>Look at the shape of the history, not one number.</strong> Increases that
              hold steady in the mid single digits describe a functioning block. Increases that
              step up year over year — 10, then 20, then 36 — describe one under pressure.
            </li>
            <li>
              <strong>Check the loss ratio.</strong> A block paying out more in claims than it
              collects has a problem it must eventually solve through price.{" "}
              <Link href="/medigap-loss-ratios-explained">
                What a loss ratio is and how to read one
              </Link>
              .
            </li>
            <li>
              <strong>Compare against the same carrier&rsquo;s current offering.</strong> If the
              entity is quoting a much lower premium to a new 65-year-old for the same plan letter,
              you are likely in the older book.
            </li>
          </ol>

          <h2>If you are in one</h2>
          <p>
            Being in a closed block is not an emergency and it is not a reason to do something
            hasty. It is a reason to find out what your options are <em>before</em> you need them,
            because the options narrow as your health changes.
          </p>
          <p>
            The honest constraint: leaving requires somewhere to go, and outside your one-time
            open enrollment window that usually means passing medical underwriting.
            <Cite id="medigap-ready" /> Some states give you standing rights the federal floor does
            not.{" "}
            <Link href="/switching-medigap-plans">What applies where you live</Link>.
          </p>
          <p>
            And if you do move, move on the destination&rsquo;s filed history, not its opening
            price. A cheaper policy in a worse block is a slower version of the same problem.
          </p>
        </div>

        <LeadCta heading="Want to know whether your block is one of the bad ones?">
          <p>
            Send us the carrier and plan letter from your policy schedule and the state you live
            in. We will identify the filed block, pull what it has actually done, and tell you
            plainly whether it looks closed. No health questions.
          </p>
        </LeadCta>

        <div className="prose">
          <SourceList ids={SOURCES} />
        </div>
      </div>
    </section>
  );
}
