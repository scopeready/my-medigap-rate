import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MedicareCosts } from "@/components/MedicareCosts";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { SITE, COMPENSATION_NOTE } from "@/lib/site";
import { STATES } from "@/lib/states";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medicare-signup",
  "ssa-when-signup",
  "medicare-penalties",
  "medicare-working-past-65",
  "medigap-when",
  "medigap-ready",
  "medigap-compare",
  "medigap-costs",
  "ship-about",
];

const TITLE = "Turning 65: the two deadlines that matter";
const DESCRIPTION =
  "Your 7-month Initial Enrollment Period for Medicare and your one-time 6-month Medigap Open Enrollment Period are different windows with different consequences. What each one does, what missing it costs, and the decision that follows you for life.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/turning-65" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/turning-65`,
    type: "article",
  },
};

export default function Page() {
  const licensed = STATES.filter((s) => s.licensed);

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Turning 65" }]} />
        <h1 style={{ marginTop: 0 }}>Turning 65</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          There are two enrollment windows, they are not the same length, they do not start on the
          same day, and missing them has entirely different consequences. Almost everything that
          goes wrong at 65 comes from confusing the two.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>Window one: signing up for Medicare</h2>
          <p>
            Your <strong>Initial Enrollment Period</strong> is seven months long: the three months
            before the month you turn 65, your birthday month, and the three months after.
            <Cite id="medicare-signup" />
            <Cite id="ssa-when-signup" />
          </p>
          <p>
            Enrolling in the three months <em>before</em> your birthday month is generally the way
            to have coverage ready on time. Waiting until the back half of the window delays when
            coverage starts.
          </p>
          <p>
            If you miss it and do not qualify for a special enrollment period, the Part B premium
            may rise <strong>10% for each full 12-month period</strong> you could have had Part B
            and did not — and that penalty generally lasts for as long as you have Part B.
            <Cite id="medicare-penalties" /> It is not a one-off fee. It is a permanent addition to
            a monthly bill you will pay for the rest of your life.
          </p>
          <p>
            <strong>Still working at 65?</strong> The rules change, and this is the most common
            place people get bad advice from well-meaning friends. Whether you can delay Part B
            without penalty depends on the size of the employer and the kind of coverage you have.
            Check Medicare&rsquo;s own guidance before you decide.
            <Cite id="medicare-working-past-65" />
          </p>

          <h2>Window two: buying a Medigap policy</h2>
          <p>
            This is the one nobody warns you about, and the one with the longest shadow.
          </p>
          <p>
            Your <strong>Medigap Open Enrollment Period</strong> is six months. It begins the first
            month you are both 65 or older and enrolled in Part B — so it usually starts <em>after</em>{" "}
            your Medicare enrollment, not alongside it. It is a one-time window that does not repeat
            annually.
            <Cite id="medigap-when" />
          </p>
          <p>
            During those six months, no insurer can turn you down or charge you more because of
            your health. Once it closes, unless you hold a guaranteed issue right, an insurer may
            ask health questions and may decline you.
            <Cite id="medigap-ready" />
          </p>
          <p>
            That is the whole game. A 65-year-old chooses from the entire market. A 72-year-old with
            a heart condition may have no choice at all. Whatever you buy in that window is,
            realistically, what you may be keeping — so buy it on how it will behave at 80, not on
            what it costs at 65.
          </p>

          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Initial Enrollment Period</th>
                  <th scope="col">Medigap Open Enrollment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">What it is for</th>
                  <td>Signing up for Medicare Parts A and B</td>
                  <td>Buying a Medicare Supplement policy</td>
                </tr>
                <tr>
                  <th scope="row">How long</th>
                  <td>7 months</td>
                  <td>6 months</td>
                </tr>
                <tr>
                  <th scope="row">When it starts</th>
                  <td>3 months before your 65th birthday month</td>
                  <td>First month you are 65+ and enrolled in Part B</td>
                </tr>
                <tr>
                  <th scope="row">Cost of missing it</th>
                  <td>Possible lifetime 10%-per-year Part B premium penalty</td>
                  <td>Insurers may use medical underwriting and may decline you</td>
                </tr>
                <tr>
                  <th scope="row">Does it come back?</th>
                  <td>No — special enrollment periods only</td>
                  <td>No — guaranteed issue rights only</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="citation">
            Sources for each cell are listed at the foot of this page.
            <Cite id="medicare-signup" />
            <Cite id="medicare-penalties" />
            <Cite id="medigap-when" />
            <Cite id="medigap-ready" />
          </p>

          <h2>What Medicare costs before any Medigap policy</h2>
          <p>
            A Medigap policy sits on top of these; it does not replace them. You keep paying the
            Part B premium whatever supplement you hold.
          </p>
          <MedicareCosts />

          <h2>The decision that follows you</h2>
          <p>
            Benefits are standardised by plan letter — a Plan G is a Plan G whoever sells it. So the
            choice that actually matters is not which letter, once you have settled that. It is
            which <em>block</em> you buy into, and how it is priced.
          </p>
          <p>
            Most policies sold are attained-age-rated, meaning the premium rises with your age every
            year on top of any filed increase. Medicare&rsquo;s own guidance warns these &ldquo;may
            be the least expensive at first, but they can eventually become the most expensive.&rdquo;
            <Cite id="medigap-costs" /> Issue-age and community-rated policies price differently.
            <Link href="/how-medigap-rates-work"> The three methods, and how to tell them apart</Link>.
          </p>
          <p>
            Two questions to ask about anything you are offered, which almost nobody asks at 65:
          </p>
          <ol>
            <li>
              <strong>What has this block filed for in the last five years?</strong> It is public
              record.
            </li>
            <li>
              <strong>What does the premium look like at 75 and 80?</strong> For an attained-age
              policy the insurer has that table, because it was filed.
            </li>
          </ol>

          <h2>One thing that has changed</h2>
          <p>
            If you turned 65 on or after 1 January 2020, Plan C and Plan F are not available to you.
            Policies sold to people newly eligible from that date are not permitted to cover the
            Part B deductible.
            <Cite id="medigap-compare" /> People who were eligible before that date keep those plans
            and may still buy them.
          </p>
          <p>
            For most people newly turning 65, the practical comparison is Plan G against Plan N.{" "}
            <Link href="/medigap-plans">What each plan letter covers</Link>.
          </p>

          <h2>A sensible order of operations</h2>
          <ol>
            <li>
              <strong>About four months out.</strong> Work out whether you are enrolling at 65 or
              delaying because of employer coverage. Get this from Medicare or Social Security, not
              from a friend.
              <Cite id="medicare-working-past-65" />
            </li>
            <li>
              <strong>Three months before your birthday month.</strong> Initial Enrollment Period
              opens. Enrol in Part B unless you have established you should delay.
            </li>
            <li>
              <strong>Decide the shape of your coverage.</strong> Original Medicare with a Medigap
              policy, or Medicare Advantage. Different structures with different trade-offs — and
              the choice interacts with window two, because leaving Advantage later may mean facing
              underwriting.
            </li>
            <li>
              <strong>When Part B starts.</strong> Your six-month Medigap window opens. Compare
              blocks and filed rate history, not just this month&rsquo;s premium.
            </li>
            <li>
              <strong>Before the six months close.</strong> Buy. Whatever you hold when the window
              shuts is what you may be keeping.
            </li>
          </ol>

          <h2>Get a second opinion, free</h2>
          <p>
            Every state has a State Health Insurance Assistance Program giving free, unbiased
            one-to-one counselling, funded federally rather than by carriers.
            <Cite id="ship-about" /> Find yours through the{" "}
            <a href="https://www.shiphelp.org/" rel="noopener noreferrer" target="_blank">
              SHIP locator
            </a>{" "}
            or 1-877-839-2675.
          </p>
          <p>
            We are a licensed agency and carriers pay us when someone buys through us. That is a
            real conflict of interest and we would rather you knew it. What it is <em>not</em> is a
            cost to you: {COMPENSATION_NOTE.charAt(0).toLowerCase() + COMPENSATION_NOTE.slice(1)}{" "}
            So the reason to use the free counselling service is a second opinion, not a cheaper
            policy. <Link href="/about">How we handle the conflict</Link>.
          </p>

          <h2>State enrollment rules</h2>
          <p>
            Switching rights after your open enrollment window differ by state, and that difference
            shapes how much a decision now can be undone later. We have state pages for the{" "}
            {licensed.length} states we are licensed in:
          </p>
          <ul className="inline-list">
            {licensed.map((s) => (
              <li key={s.slug}>
                <Link href={`/turning-65/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <LeadCta heading="Turning 65 in the next six months?">
          <p>
            Tell us your state and your birthday month and we will walk you through both windows,
            what applies where you live, and what the blocks in your market have actually filed.
            No health questions through this site.
          </p>
        </LeadCta>

        <div className="prose">
          <SourceList ids={SOURCES} />
        </div>
      </div>
    </section>
  );
}
