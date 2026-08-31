import Link from "next/link";
import type { Metadata } from "next";
import { PLANS } from "@/lib/plans";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MedicareCosts } from "@/components/MedicareCosts";

export const metadata: Metadata = {
  title: "Medigap plans A through N",
  description:
    "What each standardized Medicare Supplement plan covers, what it leaves you paying, and which plans are closed to people who became eligible for Medicare in 2020 or later.",
  alternates: { canonical: "/medigap-plans" },
};

export default function PlansIndex() {
  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Plans" }]} />
        <h1 style={{ marginTop: 0 }}>Medigap plans, A through N</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Medicare Supplement benefits are set by federal law, not by the carrier. Plan G from a
          household-name insurer pays exactly what Plan G from a company you have never heard of
          pays. What differs is the premium, the rate-increase history, and how the company
          behaves when you file a claim.
        </p>

        <div className="grid grid--pair" style={{ marginTop: "2rem" }}>
          {PLANS.map((p) => (
            <Link key={p.slug} className="card card--link" href={`/medigap-plans/${p.slug}`}>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <p className="card__meta">
                {p.openToNewlyEligible
                  ? "Open to newly eligible enrollees"
                  : "Closed to enrollees first eligible on or after 1 Jan 2020"}
              </p>
            </Link>
          ))}
        </div>

        <h2>What Medicare itself costs this year</h2>
        <p style={{ maxWidth: "64ch" }}>
          Every plan letter below is defined by which of these it picks up for you.
        </p>
        <MedicareCosts />


        <h2>Three states are different</h2>
        <p style={{ maxWidth: "64ch" }}>
          Massachusetts, Minnesota and Wisconsin standardize Medicare Supplement coverage their own
          way and do not use the A&ndash;N letters. If you live in one of them, the plan letters on
          this page do not describe what is for sale where you are.
        </p>
      </div>
    </section>
  );
}
