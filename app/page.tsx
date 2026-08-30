import Link from "next/link";
import type { Metadata } from "next";
import { STATES } from "@/lib/states";
import { ROUTED_PLANS } from "@/lib/plans";
import { getCoverage } from "@/lib/rate-filings";
import { EvidenceNote } from "@/components/EvidenceNote";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

const featured = ["arizona", "nevada", "texas", "florida", "georgia", "tennessee", "california", "ohio"];

export default function HomePage() {
  const coverage = getCoverage();

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Medicare Supplement rate research</p>
          <h1>What your Medigap policy actually costs — and what it did last year.</h1>
          <p className="hero__lede">
            The premium a carrier advertises at 65 is not the premium you pay at 75. We read the
            rate filings insurers submit to state regulators and publish what they show, plan by
            plan and state by state, with a link to the filing every time.
          </p>
          <div className="btn-row">
            <Link href="/medigap-rate-history" className="btn btn--primary">
              Find your state
            </Link>
            <Link href="/methodology" className="btn btn--ghost">
              How we verify a figure
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3">
            <div className="card">
              <h3>The filing, not the brochure</h3>
              <p>
                Every rate change a Medigap carrier makes has to be filed with the state that
                licensed it, and most of those filings are public. That paper trail is the only
                honest record of how a carrier has treated the people already on its books.
              </p>
            </div>
            <div className="card">
              <h3>Increases are a block, not a company</h3>
              <p>
                Carriers do not raise &ldquo;their rates&rdquo; — they raise rates on a specific
                block of policies in a specific state. Two people with the same logo on their card
                can see very different increases. We report at the block level.
              </p>
            </div>
            <div className="card">
              <h3>Nothing published without a citation</h3>
              <p>
                If we cannot point you at the filing a number came from, we do not print the
                number. You will see gaps on this site. The gaps are the honest part.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>Rate history by state</h2>
          <p className="lede" style={{ maxWidth: "62ch" }}>
            Pick a state to see the plans we track there, the carriers filing in that market, and
            what stage of verification each figure has reached.
          </p>
          <ul className="tile-grid" style={{ marginTop: "1.6rem" }}>
            {STATES.filter((s) => featured.includes(s.slug)).map((s) => (
              <li key={s.slug}>
                <Link className="tile" href={`/medigap-rate-history/${s.slug}`}>
                  <span>{s.name}</span>
                  <span className="tile__abbr">{s.abbr}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "1.4rem" }}>
            <Link href="/medigap-rate-history">All {STATES.length} states and territories &rarr;</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 style={{ marginTop: 0 }}>The four plans worth comparing</h2>
          <div className="grid grid--pair" style={{ marginTop: "1.5rem" }}>
            {ROUTED_PLANS.map((p) => (
              <Link key={p.slug} className="card card--link" href={`/medigap-plans/${p.slug}`}>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <p className="card__meta">
                  {p.openToNewlyEligible
                    ? "Open to people newly eligible for Medicare."
                    : "Closed to people first eligible on or after 1 January 2020."}
                </p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem" }}>
            <Link href="/medigap-plans">Every standardized plan, A through N &rarr;</Link>
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap wrap-narrow">
          <EvidenceNote title="Where this site stands today">
            <p>
              We are working through a verification backlog: every carrier, plan and state has to
              be matched to a public filing before its numbers go live.{" "}
              {coverage.datasetPresent ? (
                <>
                  Of {coverage.totalRecords.toLocaleString()} records in the research database,{" "}
                  <strong>{coverage.publishedRecords.toLocaleString()}</strong> have cleared
                  verification and are published.
                </>
              ) : (
                <>
                  No verified figures have been published yet, so every premium and rate change on
                  this site currently reads as pending.
                </>
              )}{" "}
              The page structure, the plan explanations and the state rules below are accurate now
              and do not depend on that backlog.
            </p>
            <p>
              <Link href="/methodology">Read the full methodology and verification standard</Link>.
            </p>
          </EvidenceNote>
        </div>
      </section>
    </>
  );
}
