import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { SITE } from "@/lib/site";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medigap-costs",
  "medigap-how-works",
  "naic-model-reg",
  "ssa-1882",
  "medigap-when",
  "medigap-ready",
  "medigap-guide",
];

const TITLE = "Why did my Medigap premium go up?";
const DESCRIPTION =
  "Your Medigap premium rose for one of three reasons, and they stack: you got a year older, your carrier raised rates on your whole block, or your block is closed to new customers. How to tell which one is happening to you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/why-did-my-medigap-premium-increase" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/why-did-my-medigap-premium-increase`,
    type: "article",
  },
};

const FAQ = [
  {
    q: "Can my insurance company raise my Medigap premium?",
    a: "Yes. A Medigap policy issued since 1992 is guaranteed renewable, which means the insurer cannot cancel it while you pay the premium — but guaranteed renewability does not stop rate increases that are otherwise authorised by law. The company files an increase with your state's insurance department, and if the state permits it, it applies to everyone in that filed group.",
  },
  {
    q: "Did my premium go up because I filed a claim?",
    a: "No. Medigap rate increases apply to a whole filed class of policyholders, not to an individual because of their claims. If your premium rose and your neighbour's did not, you are almost certainly in a different block — a different company, a different rating class, or a policy sold in a different year.",
  },
  {
    q: "Is a big increase a sign my company is in trouble?",
    a: "Not necessarily, but it can be a sign the block is. A block paying out more in claims than it collects in premium has a mathematical problem that usually resolves through rate increases. That is why we publish loss ratios next to rate history rather than on their own.",
  },
  {
    q: "Will switching companies fix it?",
    a: "Sometimes. Outside your one-time six-month open enrollment window, and without a guaranteed issue right, an insurer can ask health questions and decline you. So the honest answer depends on your health and your state's rules, not on the rates alone.",
  },
];

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Why my premium went up" }]} />
        <h1 style={{ marginTop: 0 }}>Why did my Medigap premium go up?</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          There are only three reasons, and they stack on top of each other. Two of them are
          happening to everyone. The third one is the one worth doing something about — and it is
          the one nobody tells you about, because it is invisible from your bill.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>Reason one: you got a year older</h2>
          <p>
            Most Medigap policies sold in the United States are{" "}
            <strong>attained-age-rated</strong>. That means the premium is based on your current
            age and goes up as you get older, by design, every single year — whether or not your
            insurer ever files a rate increase.
            <Cite id="medigap-costs" />
          </p>
          <p>
            There are two other pricing methods, and which one you have changes everything about
            what to expect:
          </p>
          <ul>
            <li>
              <strong>Attained-age-rated</strong> — priced on your age now. Cheapest at 65, and
              Medicare&rsquo;s own guidance warns these &ldquo;may be the least expensive at first,
              but they can eventually become the most expensive.&rdquo;
              <Cite id="medigap-costs" />
            </li>
            <li>
              <strong>Issue-age-rated</strong> — priced on your age when you bought it, and that
              part never changes as you age.
              <Cite id="medigap-costs" />
            </li>
            <li>
              <strong>Community-rated</strong> — everyone with that policy pays the same
              regardless of age.
              <Cite id="medigap-costs" />
            </li>
          </ul>
          <p>
            Issue-age and community-rated policies still get rate increases. They just do not have
            the automatic annual step built in on top. If you do not know which kind you have, it
            is on your policy schedule, and your state insurance department can tell you.{" "}
            <Link href="/how-medigap-rates-work">
              We explain how to work out which one you have here
            </Link>
            .
          </p>

          <h2>Reason two: your carrier raised rates on your whole block</h2>
          <p>
            This is the increase people notice, because it arrives in a letter. Your insurer filed
            a rate change with your state&rsquo;s insurance department, the state permitted it, and
            it applied to everyone in that filed group at once.
          </p>
          <p>
            Two things are worth knowing here, and both are commonly misunderstood.
          </p>
          <p>
            <strong>It is not about you.</strong> A Medigap rate increase applies to a class of
            policyholders, not to a person. You cannot be singled out for a rate increase because
            you had a hip replaced. Your policy is guaranteed renewable, so the company cannot drop
            you for using it either.
            <Cite id="medigap-how-works" /> What guaranteed renewability does <em>not</em> do is
            freeze your price — the model regulation states adopt is explicit that it does not
            prohibit rate increases otherwise authorised by law.
            <Cite id="naic-model-reg" />
          </p>
          <p>
            <strong>It is not really about the company either.</strong> This is the part that costs
            people money. A single brand can run one calm block of policies and one brutal one, in
            the same state, on the same plan letter, at the same time. We can show you this
            happening: in Ohio, two blocks sold under the same national brand — different legal
            entities, identified by different NAIC codes — took very different paths through the
            same three years. One ran roughly 10%, then 20%, then 36%. The other ran roughly 11%,
            then 14%, then 15%. Same brand. Same state. Same plan letter. Same effective dates.
          </p>
          <p>
            So &ldquo;is Carrier X a good company?&rdquo; is the wrong question, and any site that
            answers it is guessing. The right question is{" "}
            <strong>which filed block is my policy actually in</strong>, because that is the thing
            that has a rate history.
          </p>

          <h2>Reason three: your block is closed</h2>
          <p>
            This is the one that turns a manageable premium into an unaffordable one, and it is
            invisible unless you know to look.
          </p>
          <p>
            When an insurer stops selling a particular policy form to new customers, the group of
            people holding it stops taking in anyone new. Everybody left in it gets older together
            and, on average, sicker together. Claims per person climb. Premiums have to climb with
            them. The healthiest people pass underwriting and leave for something cheaper, which
            raises the average cost of everyone who remains, which drives the next increase.
          </p>
          <p>
            Insurance people call this a closed block, and the compounding version of it a death
            spiral. Neither term is a legal or regulatory category, so treat anyone quoting an
            official definition with suspicion — but the mechanism is real, and it is visible in
            filed rate history as increases that accelerate rather than hold steady.{" "}
            <Link href="/what-is-a-closed-block">
              We walk through how to spot one in the filings
            </Link>
            .
          </p>

          <h2>How to tell which one is happening to you</h2>
          <p>
            Take your renewal letter and answer these in order. You can do all of it yourself.
          </p>
          <ol>
            <li>
              <strong>What is the actual percentage?</strong> Divide the increase by your old
              premium. A rise from $180 to $196 is about 9%; from $180 to $245 is about 36%. The
              dollar figure feels the same in your account either way, but those are completely
              different stories.
            </li>
            <li>
              <strong>How is your policy rated?</strong> If it is attained-age, some of that
              increase is just the annual age step and would have happened regardless.
              <Cite id="medigap-costs" />
            </li>
            <li>
              <strong>What is on your policy schedule?</strong> You want the carrier&rsquo;s full
              legal entity name and, if it is shown, the NAIC number. Not the brand on the
              envelope — brands are shared across several legal entities, and the entity is what
              files rates.
            </li>
            <li>
              <strong>Is this the first big one, or the third?</strong> One large increase after
              years of small ones is a correction. Three escalating increases in three years is a
              pattern, and patterns continue.
            </li>
            <li>
              <strong>Can the company still sell your exact policy to a 66-year-old today?</strong>{" "}
              If not, you may be in a closed block, and the arithmetic above is working against
              you.
            </li>
          </ol>

          <h2>What you can actually do about it</h2>
          <p>
            Here is the part most sites skip, because it is not the part that sells: switching is
            not free and it is not always available.
          </p>
          <p>
            Your Medigap Open Enrollment Period is six months long, starts the first month you are
            both 65 and enrolled in Part B, and never comes back.
            <Cite id="medigap-when" /> During it, no insurer can turn you down or charge you more
            for your health. After it, unless you have a guaranteed issue right, a company may use
            medical underwriting and may simply decline you.
            <Cite id="medigap-ready" />
          </p>
          <p>
            So if you are past that window and in imperfect health, the honest answer may be that
            your best move is to stay where you are and plan around it. Some states give you more
            room than the federal floor does — a few allow a yearly window to move to an equal or
            lesser plan without underwriting.{" "}
            <Link href="/switching-medigap-plans">
              The rules that apply to you, and how to check whether you qualify
            </Link>
            .
          </p>
          <p>
            If you can pass underwriting, the thing to compare is not this year&rsquo;s premium. It
            is the filed rate history of the block you would be moving <em>into</em>. A policy that
            is $12 cheaper today and sits in a block running 20% a year is a worse deal within two
            years.{" "}
            <Link href="/medigap-rate-history">Rate history by state and plan</Link>.
          </p>

          <h2>Common questions</h2>
          <dl className="faq">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>

          <h2>One thing we will not tell you</h2>
          <p>
            We will not tell you your premium is going to rise by a particular amount next year.
            Nobody knows that, ourselves included. Past rate increases do not predict future
            increases — they describe what a block has done, which is useful, and that is all it
            is. Anyone showing you a projection of your future Medigap premium is selling
            something.
          </p>
        </div>

        <LeadCta />

        <div className="prose">
          <SourceList ids={SOURCES} />
        </div>
      </div>
    </section>
  );
}
