import Link from "next/link";
import type { Metadata } from "next";
import { ORG, SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who runs MyMedigapRate, why a licensed insurance agent publishes rate-filing research, and how we handle the conflict of interest that creates.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const licensed = STATES.filter((s) => s.licensed);

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
        <h1 style={{ marginTop: 0 }}>About {SITE.name}</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          {SITE.name} is a research project run by {ORG.legalName}, an independent insurance agency.
          It exists because the single most useful fact about a Medicare Supplement policy — what
          the carrier has done to the premium of people who already own it — is public, and almost
          nobody publishes it.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>The conflict, stated plainly</h2>
          <p>
            {ORG.agent} is a licensed insurance agent. If you buy a Medigap policy through this
            agency, the carrier pays a commission. That is a real conflict of interest and you
            should know about it before you read anything else here.
          </p>
          <p>Three things follow from it:</p>
          <ul>
            <li>
              <strong>The research does not depend on you buying anything.</strong> Every
              rate-history page is free and carries no gate, no email capture, and no
              &ldquo;unlock your results&rdquo; step.
            </li>
            <li>
              <strong>We publish carriers we cannot sell.</strong> A filing is a filing. If a
              carrier we have no contract with has held rates steady, that shows up the same as any
              other.
            </li>
            <li>
              <strong>We tell you when the free option is better.</strong> Every state runs a State
              Health Insurance Assistance Program that gives unbiased Medicare counseling at no
              cost, and Medicare itself answers questions at 1-800-MEDICARE. If you want advice
              with no commission attached anywhere in it, start there. Both are linked in the
              footer of every page.
            </li>
          </ul>

          <h2>What we are licensed to do</h2>
          <p>
            {ORG.agent} holds a resident insurance license and non-resident licenses in{" "}
            {licensed.length} states, National Producer Number {ORG.npn}. Where we are not
            licensed, the research pages still work — we just cannot write the policy, and we will
            say so rather than take a referral fee for handing you off quietly.
          </p>
          <p className="citation">
            Licensed: {licensed.map((s) => s.abbr).join(", ")}. Licensing changes; confirm current
            status through your state&rsquo;s insurance department producer lookup or the NAIC
            producer database.
          </p>

          <h2>What we are not</h2>
          <ul>
            <li>Not affiliated with, endorsed by, or connected to the federal Medicare program.</li>
            <li>Not a government agency, and not a Medicare plan.</li>
            <li>Not a comparison marketplace that sells your contact details to other agents.</li>
            <li>
              Not able to offer every plan in your area. What we can offer is limited to the
              carriers we are appointed with.
            </li>
          </ul>

          <h2>How to check us</h2>
          <p>
            Read the <Link href="/methodology">methodology</Link> first — it is the part of this
            site that determines whether the rest is worth anything. Then pick a state page, click
            a filing citation, and confirm the number against the regulator&rsquo;s own record. If
            one does not match, <Link href="/contact">tell us</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
