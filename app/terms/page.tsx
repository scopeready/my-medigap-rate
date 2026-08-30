import Link from "next/link";
import type { Metadata } from "next";
import { ORG, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms that apply to using ${SITE.name}, including what the published research is and is not.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow prose">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Terms" }]} />
        <h1 style={{ marginTop: 0 }}>Terms of use</h1>

        <h2>What this site is</h2>
        <p>
          {SITE.name} publishes research about Medicare Supplement rate filings. It is operated by{" "}
          {ORG.legalName}, an independent licensed insurance agency. It is educational material and
          general information, not personalised advice.
        </p>

        <h2>What a figure on this site is not</h2>
        <ul>
          <li>
            It is not a quote. Filed rates describe a scenario — a particular age, ZIP code,
            tobacco status and discount assumption — that is almost certainly not yours.
          </li>
          <li>
            It is not an offer of coverage, and it does not bind any carrier. Only the carrier can
            tell you what it will charge you.
          </li>
          <li>
            It is not a prediction. A rate action a carrier filed last year says nothing certain
            about what it will file next year.
          </li>
        </ul>
        <p>
          Read the <Link href="/methodology">methodology</Link> for how figures are verified and
          why some are withheld.
        </p>

        <h2>Accuracy</h2>
        <p>
          We verify each published figure against a public filing and cite it. Filings are
          themselves amended, superseded and occasionally withdrawn, and regulators correct their
          own records. Confirm anything you intend to act on with the carrier or the issuing
          state&rsquo;s insurance department. If you find an error,{" "}
          <Link href="/contact">tell us</Link> and we will pull the figure while we recheck it.
        </p>

        <h2>Links to other sites</h2>
        <p>
          We link to regulators, Medicare.gov and other public sources. We do not control those
          sites and are not responsible for their content.
        </p>

        <h2>Liability</h2>
        <p>
          This site is provided as is. To the extent the law allows, {ORG.legalName} is not liable
          for losses arising from reliance on general information published here. Nothing in these
          terms limits any liability that cannot lawfully be limited, and nothing here displaces
          the duties an agent owes a client in an actual advisory relationship.
        </p>

        <h2>Contact</h2>
        <p>
          {ORG.legalName} &middot; {ORG.agent}, NPN {ORG.npn} &middot;{" "}
          <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a> &middot;{" "}
          <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
        </p>
      </div>
    </section>
  );
}
