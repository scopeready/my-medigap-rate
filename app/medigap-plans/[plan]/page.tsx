import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLANS, ROUTED_PLANS, getPlan } from "@/lib/plans";
import { STATES } from "@/lib/states";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MedicareCosts } from "@/components/MedicareCosts";
import { SITE } from "@/lib/site";

interface Props {
  params: Promise<{ plan: string }>;
}

export function generateStaticParams() {
  return PLANS.map((p) => ({ plan: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { plan } = await params;
  const p = getPlan(plan);
  if (!p) return {};
  return {
    title: `Medigap ${p.name}`,
    description: `${p.summary} What ${p.name} covers, what you still pay, and where to read its rate-filing history state by state.`,
    alternates: { canonical: `/medigap-plans/${p.slug}` },
  };
}

const POPULAR = ["arizona", "nevada", "texas", "florida", "georgia", "tennessee"];

export default async function PlanPage({ params }: Props) {
  const { plan } = await params;
  const p = getPlan(plan);
  if (!p) notFound();

  const routed = ROUTED_PLANS.some((r) => r.slug === p.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Medicare Supplement ${p.name}`,
    description: p.summary,
    url: `${SITE.url}/medigap-plans/${p.slug}`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/medigap-plans", label: "Plans" },
            { label: p.name },
          ]}
        />

        <h1 style={{ marginTop: 0 }}>Medigap {p.name}</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          {p.summary}
        </p>

        <div className="prose" style={{ marginTop: "2rem" }}>
          <p>{p.detail}</p>

          <h2>What you still pay</h2>
          <ul>
            {p.youStillPay.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>The Medicare amounts behind those items</h2>
          <p>
            Medigap plans are described in terms of Medicare&rsquo;s own deductibles and
            coinsurance, so the plan only means something once you know what those are. These are
            set by Medicare and change every year; no policy you buy changes them.
          </p>
          <MedicareCosts />

          <h2>Who can buy it</h2>
          <p>
            {p.openToNewlyEligible ? (
              <>
                {p.name} is open to anyone eligible for Medicare Supplement coverage, including
                people who became eligible for Medicare recently. Whether a carrier will accept you
                outside your open enrollment window depends on your state&rsquo;s rules and on
                medical underwriting.
              </>
            ) : (
              <>
                {p.name} pays the Part B deductible, which is why federal law closed it to anyone
                who first became eligible for Medicare on or after 1 January 2020. If you were
                eligible before that date you can still buy it where a carrier still offers it. For
                everyone else, the closest open equivalent is{" "}
                <Link href="/medigap-plans/plan-g">Plan G</Link>.
              </>
            )}
          </p>

          <h2>Why the same plan costs different amounts</h2>
          <p>
            Because the benefits are fixed, price is the variable. Three things move it: the
            carrier&rsquo;s underwriting and claims experience on its {p.name} block in your state,
            the rating method it uses, and how long the block has been open. A carrier that entered
            a market cheaply and then filed steep increases on the same block is doing something
            visible in the public record — which is what we go looking for.
          </p>
        </div>

        {routed ? (
          <>
            <h2>{p.name} rate history by state</h2>
            <ul className="tile-grid" style={{ marginTop: "1.2rem" }}>
              {STATES.filter((s) => POPULAR.includes(s.slug)).map((s) => (
                <li key={s.slug}>
                  <Link className="tile" href={`/medigap-rate-history/${s.slug}/${p.slug}`}>
                    <span>{s.name}</span>
                    <span className="tile__abbr">{s.abbr}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1.2rem" }}>
              <Link href="/medigap-rate-history">All states &rarr;</Link>
            </p>
          </>
        ) : (
          <>
            <h2>Rate history for {p.name}</h2>
            <p style={{ maxWidth: "64ch" }}>
              {p.name} is too thinly sold in most markets to support a per-state rate-history page
              — in many states only one or two carriers file on it, and a trend line drawn through
              one filing is not a trend. We track the four blocks with enough competing filings to
              read honestly:{" "}
              {ROUTED_PLANS.map((r, i) => (
                <span key={r.slug}>
                  {i > 0 && (i === ROUTED_PLANS.length - 1 ? " and " : ", ")}
                  <Link href={`/medigap-plans/${r.slug}`}>{r.name}</Link>
                </span>
              ))}
              .
            </p>
          </>
        )}

        <h2>Other plans</h2>
        <ul>
          {PLANS.filter((o) => o.slug !== p.slug).map((o) => (
            <li key={o.slug}>
              <Link href={`/medigap-plans/${o.slug}`}>{o.name}</Link> — {o.summary}
            </li>
          ))}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
