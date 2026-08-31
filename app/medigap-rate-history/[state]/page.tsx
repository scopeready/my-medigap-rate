import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STATES, getState, ruleLabel, ruleNote, ruleSource } from "@/lib/states";
import { ROUTED_PLANS } from "@/lib/plans";
import { getFilings } from "@/lib/rate-filings";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EvidenceNote } from "@/components/EvidenceNote";
import { SITE } from "@/lib/site";

interface Props {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  return {
    title: `${s.name} Medigap rate history`,
    description: `Medicare Supplement rate-filing history for ${s.name}: the plans we track, the carriers filing in the ${s.abbr} market, and the verification status of every premium and rate change.`,
    alternates: { canonical: `/medigap-rate-history/${s.slug}` },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();

  const standardized = s.rules !== "state-standardized";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${s.name} Medigap rate history`,
    url: `${SITE.url}/medigap-rate-history/${s.slug}`,
    about: { "@type": "Thing", name: `Medicare Supplement insurance in ${s.name}` },
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/medigap-rate-history", label: "Rate history" },
            { label: s.name },
          ]}
        />

        <h1 style={{ marginTop: 0 }}>{s.name} Medigap rate history</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          What Medicare Supplement carriers have filed in {s.name}, what those filings say about
          renewal increases, and which figures we have been able to confirm against the public
          record.
        </p>

        <div className="grid grid--2" style={{ marginTop: "2rem", alignItems: "start" }}>
          <div className="card">
            <h3>{ruleLabel(s)}</h3>
            <p>{ruleNote(s)}</p>
            {/*
              This classification is editorial, not a regulator's wording, and it
              has not been verified against the state's own rules the way a rate
              figure is verified against a filing. Saying so is consistent with
              how the rest of the site treats an unconfirmed claim.
            */}
            <p className="card__meta" style={{ marginBottom: 0 }}>
              Our summary of the rule, not the regulator&rsquo;s wording. State switching rules
              change and carry conditions this cannot hold &mdash; confirm with the {s.name}{" "}
              insurance department or your{" "}
              <a href="https://www.shiphelp.org/" rel="noopener noreferrer" target="_blank">
                free state counselling programme
              </a>{" "}
              before acting on it.{" "}
              <Link href="/switching-medigap-plans">More on switching</Link>.
            </p>
          </div>
          <div className="card">
            <h3>At a glance</h3>
            <dl className="facts">
              <div>
                <dt>State</dt>
                <dd>
                  {s.name} ({s.abbr})
                </dd>
              </div>
              <div>
                <dt>Plan set</dt>
                <dd>{standardized ? "Federal Plans A–N" : "State-standardized"}</dd>
              </div>
              <div>
                <dt>Switching rule</dt>
                <dd>{ruleLabel(s)}</dd>
              </div>
              <div>
                <dt>We are licensed here</dt>
                <dd>{s.licensed ? "Yes" : "Not currently"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {standardized ? (
          <>
            <h2>Plans we track in {s.name}</h2>
            <div className="grid grid--pair" style={{ marginTop: "1.4rem" }}>
              {ROUTED_PLANS.map((p) => {
                const f = getFilings(s.abbr, [p.letter]);
                return (
                  <Link
                    key={p.slug}
                    className="card card--link"
                    href={`/medigap-rate-history/${s.slug}/${p.slug}`}
                  >
                    <h3>
                      {p.name} in {s.abbr}
                    </h3>
                    <p>{p.summary}</p>
                    <p className="card__meta">
                      {f.publishedCount > 0
                        ? `${f.publishedCount} verified filing${f.publishedCount === 1 ? "" : "s"} published`
                        : "No verified filings published yet"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h2>{s.name} does not use the A&ndash;N plan letters</h2>
            <p style={{ maxWidth: "64ch" }}>
              {s.name} is one of three states that standardize Medicare Supplement coverage its own
              way. A &ldquo;Plan G&rdquo; comparison from another state does not carry across, so
              we do not publish per-letter rate-history pages here. When we build the{" "}
              {s.name}-specific plan labels into the database, those pages will appear at this
              address.
            </p>
            <p>
              <Link href="/contact">Ask us what the {s.name} plan set looks like &rarr;</Link>
            </p>
          </>
        )}

        <h2>Reading a rate increase in {s.name}</h2>
        <div className="prose">
          <p>
            Three things decide what happens to your premium over time, and only one of them is
            the carrier&rsquo;s logo.
          </p>
          <ul>
            <li>
              <strong>The block, not the brand.</strong> An increase applies to one closed or open
              block of policies in {s.name}. A carrier can hold rates on a growing block and push
              hard on an older one at the same time.
            </li>
            <li>
              <strong>The rating method.</strong> Attained-age policies build an age increase into
              every renewal on top of any filed rate action. Issue-age and community-rated
              policies do not. Comparing an attained-age premium to a community-rated one at 65
              tells you almost nothing about age 78.
            </li>
            <li>
              <strong>Whether you can leave.</strong> {ruleNote(s)}
            </li>
          </ul>
          <p>
            For a carrier&rsquo;s overall financial condition, the useful public source is the
            NAIC&rsquo;s consumer information, not a rate-history table. We report what was filed;
            we do not grade companies.
          </p>
        </div>

        <div style={{ marginTop: "2.5rem", maxWidth: "68ch" }}>
          <EvidenceNote />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
