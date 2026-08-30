import Link from "next/link";
import type { Metadata } from "next";
import { STATES, RULE_LABEL } from "@/lib/states";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Medigap rate history by state",
  description:
    "Medicare Supplement rate-filing history for all 50 states and the District of Columbia — the carriers filing in each market, the plans they file on, and the verification status of every figure.",
  alternates: { canonical: "/medigap-rate-history" },
};

export default function RateHistoryIndex() {
  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Rate history" }]} />
        <h1 style={{ marginTop: 0 }}>Medigap rate history by state</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Medicare Supplement rates are filed state by state. A carrier that has been steady in
          one state can have raised rates hard in the one next door, on the same plan letter, in
          the same year. Start with where you live.
        </p>

        <ul className="tile-grid" style={{ marginTop: "2rem" }}>
          {STATES.map((s) => (
            <li key={s.slug}>
              <Link className="tile" href={`/medigap-rate-history/${s.slug}`}>
                <span>{s.name}</span>
                <span className="tile__abbr">{s.abbr}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2>States with their own switching rules</h2>
        <p style={{ maxWidth: "64ch" }}>
          Most states let a Medigap insurer ask health questions once your open enrollment window
          closes. These do not, or not entirely — which changes what a rate increase means for
          you, because you may be able to answer it by moving.
        </p>
        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">Rule</th>
                <th scope="col">Licensed here</th>
              </tr>
            </thead>
            <tbody>
              {STATES.filter((s) => s.rules !== "standard").map((s) => (
                <tr key={s.slug}>
                  <th scope="row" style={{ fontWeight: 600 }}>
                    <Link href={`/medigap-rate-history/${s.slug}`}>{s.name}</Link>
                  </th>
                  <td>{RULE_LABEL[s.rules]}</td>
                  <td>{s.licensed ? "Yes" : "Not currently"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
