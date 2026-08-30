import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STATES, getState, RULE_LABEL, RULE_SHORT, RULE_NOTE } from "@/lib/states";
import { ROUTED_PLANS, getPlan } from "@/lib/plans";
import { getFilings } from "@/lib/rate-filings";
import { getPremiums, getPremiumBand } from "@/lib/premiums";
import { TN_NOTE } from "@/lib/tn-rate-actions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EvidenceNote } from "@/components/EvidenceNote";
import { Figure, Withheld } from "@/components/Figure";
import { isoToLong, money } from "@/lib/format";
import { ORG, SITE } from "@/lib/site";

interface Props {
  params: Promise<{ state: string; plan: string }>;
}

/** 51 states and territories x 4 routed plans = 204 statically generated pages. */
export function generateStaticParams() {
  return STATES.flatMap((s) => ROUTED_PLANS.map((p) => ({ state: s.slug, plan: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, plan } = await params;
  const s = getState(state);
  const p = getPlan(plan);
  if (!s || !p) return {};
  return {
    title: `${s.name} ${p.name} rate history`,
    description: `Medicare Supplement ${p.name} in ${s.name}: which carriers file here, what their filed rate actions show, and the public filing behind every published figure.`,
    alternates: { canonical: `/medigap-rate-history/${s.slug}/${p.slug}` },
  };
}

export default async function StatePlanPage({ params }: Props) {
  const { state, plan } = await params;
  const s = getState(state);
  const p = getPlan(plan);
  if (!s || !p || !ROUTED_PLANS.some((r) => r.slug === p.slug)) notFound();

  const stateStandardized = s.rules === "state-standardized";
  const filings = getFilings(s.abbr, [p.letter]);
  const premiums = getPremiums(s.abbr, [p.letter]);
  const band = getPremiumBand(s.abbr, [p.letter]);
  const verifiedHere = filings.publishedCount;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${s.name} ${p.name} rate history`,
    url: `${SITE.url}/medigap-rate-history/${s.slug}/${p.slug}`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: { "@type": "Thing", name: `Medicare Supplement ${p.name} in ${s.name}` },
  };

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/medigap-rate-history", label: "Rate history" },
            { href: `/medigap-rate-history/${s.slug}`, label: s.name },
            { label: p.name },
          ]}
        />

        <h1 style={{ marginTop: 0 }}>
          {s.name} {p.name} rate history
        </h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          {p.summary} This page tracks what {p.name} carriers have filed with the {s.name}{" "}
          insurance regulator and what those filings show about renewal increases.
        </p>

        <div className="layout" style={{ marginTop: "2.5rem" }}>
          <div className="layout__main">
            {stateStandardized && (
              <div className="evidence-note" style={{ marginBottom: "2rem" }}>
                <p className="evidence-note__title">{s.name} uses its own plan set</p>
                <p style={{ marginBottom: 0 }}>
                  {s.name} does not standardize Medicare Supplement coverage using the federal
                  A&ndash;N letters, so &ldquo;{p.name}&rdquo; does not name a product sold here.
                  Treat this page as background on the federal plan, not as a {s.name} shopping
                  guide.{" "}
                  <Link href={`/medigap-rate-history/${s.slug}`}>
                    See the {s.name} overview
                  </Link>
                  .
                </p>
              </div>
            )}

            {/* ---------------- premium range ---------------- */}
            <h2 style={{ marginTop: 0 }}>
              What {p.name} costs in {s.name}
            </h2>
            {band.low !== null && band.high !== null ? (
              <p className="lede">
                Verified {p.name} premiums in {s.name} run from{" "}
                <strong>{money(band.low, true)}</strong> to{" "}
                <strong>{money(band.high, true)}</strong> per month across {band.carriers}{" "}
                carriers. Each figure is cited to its filing in the table below.
              </p>
            ) : (
              <>
                <p style={{ marginBottom: ".9rem" }}>
                  <Withheld reason={band.carriers === 1 ? "not_confirmed" : "no_record"} />
                </p>
                <p style={{ maxWidth: "64ch" }}>
                  We do not publish a premium range until at least two carriers&rsquo; figures have
                  been matched to their filings. A range built from one filing is not a range, and
                  a single figure invites you to read it as the market.
                </p>
              </>
            )}

            <div className="table-scroll">
              <table className="data">
                <caption>
                  {p.name} carriers on file for {s.name}. Premiums are monthly and reflect the
                  filed scenario, not a quote for you.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Carrier</th>
                    <th scope="col">Rating method</th>
                    <th scope="col">Monthly premium</th>
                  </tr>
                </thead>
                <tbody>
                  {premiums.length > 0 ? (
                    premiums.map((row, i) => (
                      <tr key={`${row.carrier}-${i}`}>
                        <th scope="row" style={{ fontWeight: 600 }}>
                          {row.carrier}
                        </th>
                        <td>{row.ratingMethod ?? "Not stated in the filing"}</td>
                        <td className="num">
                          <Figure result={row.monthly} kind="money" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        No {p.name} carrier records have been published for {s.name} yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ---------------- filed rate actions ---------------- */}
            <h2>Filed rate actions</h2>
            <p style={{ maxWidth: "64ch" }}>
              A rate action is the increase a carrier asked the state to approve on an existing
              block of {p.name} policies. It is separate from the age increase built into an
              attained-age premium, and it is the number that tells you how a carrier has treated
              the people already holding the policy.
            </p>

            <div className="table-scroll">
              <table className="data">
                <caption>
                  {p.name} rate actions on file for {s.name}, newest first.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Carrier</th>
                    <th scope="col">Effective</th>
                    <th scope="col">Filed change</th>
                  </tr>
                </thead>
                <tbody>
                  {filings.rows.length > 0 ? (
                    filings.rows.map((row, i) => (
                      <tr key={`${row.carrier}-${i}`}>
                        <th scope="row" style={{ fontWeight: 600 }}>
                          {row.carrier}
                        </th>
                        <td>{isoToLong(row.effectiveDate) ?? "Not yet confirmed"}</td>
                        <td className="num">
                          <Figure result={row.ratePercent} kind="percent" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        No {p.name} rate actions have been published for {s.name} yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {s.abbr === "TN" && <p className="citation">{TN_NOTE}</p>}

            {verifiedHere === 0 && (
              <div style={{ marginTop: "2rem" }}>
                <EvidenceNote />
              </div>
            )}

            {/* ---------------- plan detail ---------------- */}
            <h2>What {p.name} covers</h2>
            <div className="prose">
              <p>{p.detail}</p>
              <p>
                <strong>With {p.name}, you still pay:</strong>
              </p>
              <ul>
                {p.youStillPay.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {!p.openToNewlyEligible && (
                <p>
                  {p.name} is closed to anyone who first became eligible for Medicare on or after
                  1 January 2020. If that is you, the closest open equivalent is{" "}
                  <Link href={`/medigap-rate-history/${s.slug}/plan-g`}>Plan G</Link>.
                </p>
              )}
              <p>
                Benefits are standardized by federal law, so {p.name} from one carrier pays the
                same claims as {p.name} from another. Price, rate-increase history and service are
                what differ. That is the whole argument for reading filings.
              </p>
            </div>

            <h2>
              Switching {p.name} carriers in {s.name}
            </h2>
            <p style={{ maxWidth: "64ch" }}>{RULE_NOTE[s.rules]}</p>
            <p className="citation">
              {s.name} is a {RULE_LABEL[s.rules].toLowerCase()}. State rules change; confirm the
              current window with the {s.name} insurance department or your SHIP counselor before
              you apply anywhere.
            </p>
          </div>

          {/* ---------------- aside ---------------- */}
          <aside className="layout__aside" aria-label="Page summary">
            <div className="aside-card">
              <h3>Verification status</h3>
              <p className="status-line">
                <span className={verifiedHere > 0 ? "status-dot status-dot--ok" : "status-dot"} />
                {verifiedHere > 0
                  ? `${verifiedHere} filing${verifiedHere === 1 ? "" : "s"} verified and cited`
                  : "No figures verified yet"}
              </p>
              <p style={{ marginTop: ".7rem" }}>
                <Link href="/methodology">How a figure gets published &rarr;</Link>
              </p>
            </div>

            <div className="aside-card">
              <h3>At a glance</h3>
              <dl className="facts">
                <div>
                  <dt>State</dt>
                  <dd>{s.abbr}</dd>
                </div>
                <div>
                  <dt>Plan</dt>
                  <dd>{p.name}</dd>
                </div>
                <div>
                  <dt>Switching rule</dt>
                  <dd>{RULE_SHORT[s.rules]}</dd>
                </div>
                <div>
                  <dt>Open to new enrollees</dt>
                  <dd>{p.openToNewlyEligible ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Carrier records held</dt>
                  <dd>{filings.totalCount}</dd>
                </div>
              </dl>
            </div>

            <div className="aside-card">
              <h3>Other plans in {s.abbr}</h3>
              <ul className="aside-links">
                {ROUTED_PLANS.filter((o) => o.slug !== p.slug).map((o) => (
                  <li key={o.slug}>
                    <Link href={`/medigap-rate-history/${s.slug}/${o.slug}`}>{o.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href={`/medigap-rate-history/${s.slug}`}>All {s.name} plans</Link>
                </li>
                <li>
                  <Link href={`/medigap-plans/${p.slug}`}>{p.name} benefits in detail</Link>
                </li>
              </ul>
            </div>

            <div className="aside-card">
              <h3>Questions?</h3>
              <p style={{ marginBottom: ".9rem" }}>
                {s.licensed
                  ? `A licensed agent can walk through ${p.name} options in ${s.name} with you.`
                  : `We are not licensed in ${s.name}, so we cannot write a policy here — but we can point you at the free state counseling program.`}
              </p>
              <Link href="/contact" className="btn btn--primary">
                {s.licensed ? "Talk to a person" : "Get pointed in the right direction"}
              </Link>
              <p className="citation" style={{ marginTop: ".8rem" }}>
                Or call <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
