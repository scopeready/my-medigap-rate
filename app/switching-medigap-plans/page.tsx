import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { LeadCta } from "@/components/LeadCta";
import { GuideCta } from "@/components/GuideCta";
import { SITE, COMPENSATION_NOTE } from "@/lib/site";
import { STATES, ruleLabel, ruleSource } from "@/lib/states";
import { verificationProgress } from "@/lib/switching-rules";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medigap-when",
  "medigap-ready",
  "medigap-change",
  "medigap-switch-drop",
  "medigap-how-works",
  "medigap-guide",
  "ship-about",
  "acl-ship",
];

const TITLE = "Switching Medigap plans: when you can, when you cannot";
const DESCRIPTION =
  "Your six-month open enrollment window, guaranteed issue rights, medical underwriting, the 30-day free look and the pre-existing condition waiting period — the rules that decide whether you can move, and what to check before you do.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/switching-medigap-plans" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/switching-medigap-plans`,
    type: "article",
  },
};

export default function Page() {
  const beyond = STATES.filter((st) => st.rules !== "federal-only");
  const progress = verificationProgress(STATES.map((st) => st.abbr));

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Switching Medigap plans" }]} />
        <h1 style={{ marginTop: 0 }}>Switching Medigap plans</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Most articles about switching assume you are allowed to. Whether you are is the whole
          question, and for a lot of people past 65 the answer is no — or not without answering
          health questions first. Here is how to find out which you are, before you cancel
          anything.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>The one window nobody gets back</h2>
          <p>
            Your <strong>Medigap Open Enrollment Period</strong> runs six months. It starts the
            first month you are both 65 or older and enrolled in Part B, and it does not repeat —
            it is a one-time enrollment, unlike the annual Medicare Open Enrollment you hear
            advertised each autumn.
            <Cite id="medigap-when" />
          </p>
          <p>
            Inside it, an insurer cannot refuse you or charge you more because of your health.
            Outside it, unless you hold a guaranteed issue right, an insurer may use medical
            underwriting and may decline your application outright.
            <Cite id="medigap-ready" />
          </p>
          <p>
            That asymmetry is the single most important fact on this page. It is also why a plan
            that looks cheap at 65 deserves scrutiny about what it will cost at 80 — because by 80,
            leaving it may not be your decision to make.{" "}
            <Link href="/how-medigap-rates-work">How the pricing methods differ</Link>.
          </p>

          <h2>Guaranteed issue rights: when the door reopens</h2>
          <p>
            Federal law reopens the door in specific circumstances. When you have a guaranteed
            issue right, an insurer must sell you a policy, must cover your pre-existing
            conditions, and cannot charge you more because of your health.
            <Cite id="medigap-ready" />
          </p>
          <p>
            Most of these arise when other coverage you hold changes or ends. One is worth knowing
            by name because people stumble into it without realising:
          </p>
          <p>
            <strong>The Medicare Advantage trial right.</strong> If you dropped a Medigap policy to
            try a Medicare Advantage plan for the first time, have been in it less than a year, and
            want to come back, you have a guaranteed issue right to buy your former policy back if
            the company still sells it — and if not, to buy Plan A, B, D, G, K or L in your state.
            <Cite id="medigap-ready" />
          </p>
          <p>
            The full list of qualifying situations, with the paperwork each requires, is in
            Medicare&rsquo;s official guide.
            <Cite id="medigap-guide" /> If you think one applies to you, get the letter proving your
            other coverage ended — insurers will ask for it, and the clock on these rights is
            short.
          </p>

          <h2>What your state may add on top</h2>
          <p>
            The federal rules are a floor, not a ceiling. {progress.beyondFederal} states go
            beyond it, and we have read {progress.verified} of those {progress.beyondFederal} in
            the state&rsquo;s own material and cited it below. A one-word label like
            &ldquo;birthday rule&rdquo; hides the parts that decide whether you can actually
            move, so the summaries here carry the limits.
          </p>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">State</th>
                  <th scope="col">Rule</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {beyond.map((st) => {
                  const src = ruleSource(st);
                  return (
                    <tr key={st.abbr}>
                      <th scope="row">{st.name}</th>
                      <td>{ruleLabel(st)}</td>
                      <td>
                        {src ? (
                          <a href={src.url} rel="noopener noreferrer" target="_blank">
                            {src.publisher}
                          </a>
                        ) : (
                          <span className="card__meta">not yet verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="citation">
            Every state above links to the material we read it in. The remaining{" "}
            {progress.total - progress.beyondFederal} states are, as far as we have found, on the
            federal floor &mdash; which is not the same as having proved it. State rules change by
            legislation; confirm the current wording with your insurance department or your free
            counselling programme before acting.
          </p>
          <p>
            Three examples of why the label is not enough, all from the table above.{" "}
            <strong>Illinois</strong> caps its birthday rule at ages 65 to 75 and confines it to
            your existing insurer, so it will not move you to a different company.{" "}
            <strong>Nevada</strong>&rsquo;s reaches carriers with open blocks of business, which
            may exclude the closed block you are trying to leave. <strong>Maine</strong> is
            widely described as year-round guaranteed issue and is not: each insurer picks one
            month a year, and only Plan A has to be offered in it.
          </p>

          <h2>The two traps in the mechanics</h2>
          <p>
            Suppose you can switch and you have decided to. Two procedural details cost people real
            money every year.
          </p>
          <p>
            <strong>Do not cancel the old policy first.</strong> Get the new policy in force before
            you cancel the old one. You will pay both premiums for the overlapping month, and that
            is the correct outcome — it is the price of not ending up uninsured if the new
            application fails.
            <Cite id="medigap-switch-drop" /> A new policy also carries a{" "}
            <strong>30-day free look</strong>, so you have a window to change your mind.
            <Cite id="medigap-change" />
          </p>
          <p>
            <strong>The pre-existing condition waiting period.</strong> If you have held your
            current Medigap policy less than six months and switch, the new insurer may make you
            wait up to six months before it covers a pre-existing condition.
            <Cite id="medigap-change" /> After six months it must cover it. Worth planning around if
            you are treating something now.
          </p>

          <h2>Before you move, compare the right thing</h2>
          <p>
            The mistake we see most often: comparing this month&rsquo;s premium and nothing else.
          </p>
          <p>
            Benefits by plan letter are standardised, so a Plan G is a Plan G whoever sells it. What
            is <em>not</em> standardised is what the block you are joining has done with its rates,
            and what it is likely to keep doing. A policy $15 cheaper today, sitting in a block that
            has filed double-digit increases three years running, is more expensive within two
            years and worse every year after that.
          </p>
          <p>Four questions to ask about any policy you are considering:</p>
          <ol>
            <li>Which legal entity issues it, and what is its NAIC number?</li>
            <li>Attained-age, issue-age or community-rated?</li>
            <li>What has that entity filed for, in this state, over the last five years?</li>
            <li>Is the policy form still open to new applicants?</li>
          </ol>
          <p>
            <Link href="/medigap-rate-history">Rate history by state and plan</Link> is where we
            answer the third and fourth.
          </p>

          <h2>If you cannot switch</h2>
          <p>
            It is worth saying plainly, because most sites in this business will not: sometimes the
            answer is that you should stay where you are.
          </p>
          <p>
            If you are outside your open enrollment window, hold no guaranteed issue right, live in
            a state with no standing switching rule, and would not pass underwriting, then your
            Medigap policy is the coverage you have. It is guaranteed renewable — the insurer
            cannot cancel it while you pay.
            <Cite id="medigap-how-works" /> The useful work then is budgeting for the trend and
            re-checking each year, not chasing a move that will end in a declination.
          </p>
          <p>
            Anyone who tells you otherwise without asking a single question about your health or
            your state is not giving you advice.
          </p>

          <h2>Free help, and what our help costs you</h2>
          <p>
            Every state has a <strong>State Health Insurance Assistance Program</strong> (SHIP)
            giving free, unbiased, one-to-one Medicare counselling, federally funded through the
            Administration for Community Living.
            <Cite id="ship-about" />
            <Cite id="acl-ship" /> They sell nothing and are funded federally rather than by
            carriers.
          </p>
          <p>
            We are a licensed agency, and carriers pay us when someone buys through us. Worth being
            precise about what that means for you: {COMPENSATION_NOTE.charAt(0).toLowerCase() +
            COMPENSATION_NOTE.slice(1)} The difference between us and the counselling service is
            that they cannot sell you a policy and we can &mdash; not that one of us is cheaper.
          </p>
          <p>
            Find yours through the{" "}
            <a href="https://www.shiphelp.org/" rel="noopener noreferrer" target="_blank">
              SHIP locator
            </a>{" "}
            or by calling 1-877-839-2675. If you want a second opinion on anything we tell you, that
            is where we would send you too.
          </p>
        </div>

        <LeadCta heading="Not sure whether you can switch?">
          <p>
            Tell us your state, your carrier and your plan letter. We will tell you which rules
            apply where you live, whether a window is open to you, and what the block you are in
            has actually filed. If the answer is &ldquo;stay put&rdquo;, you will get that answer.
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
