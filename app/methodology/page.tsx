import Link from "next/link";
import type { Metadata } from "next";
import { getCoverage } from "@/lib/rate-filings";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EvidenceNote } from "@/components/EvidenceNote";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How MyMedigapRate decides whether a premium or rate increase is publishable: the evidence tiers, the verification standard, and the reasons a figure is withheld.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  const coverage = getCoverage();

  return (
    <section className="section">
      <div className="wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Methodology" }]} />
        <h1 style={{ marginTop: 0 }}>How a number gets published here</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Most Medigap &ldquo;rate history&rdquo; content online is a carrier&rsquo;s marketing
          material with a chart on it. This site works the other way round: a figure has to survive
          a check before it can appear, and if it does not survive the check we print the gap
          instead.
        </p>

        <div className="prose" style={{ marginTop: "2.5rem" }}>
          <h2>The standard</h2>
          <p>A premium or rate change is published only when all four of these are true:</p>
          <ol>
            <li>
              It has been matched to a specific rate filing submitted by the carrier to the
              insurance regulator of the state it applies to.
            </li>
            <li>That filing is publicly accessible, and we link to it on the page.</li>
            <li>
              The filing identifier, the regulator&rsquo;s name and the date we read it are stored
              with the figure, not with a spreadsheet somewhere.
            </li>
            <li>
              A reviewer has marked the record publishable. The default is not publishable, and
              nothing flips that automatically.
            </li>
          </ol>
          <p>
            The check is enforced in code, not by discipline. Every figure on this site passes
            through a single gate function that fails closed: if it cannot confirm all four
            conditions, the page renders the reason it withheld the number instead of the number.
          </p>

          <h2>Evidence tiers</h2>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">Tier</th>
                  <th scope="col">What it means</th>
                  <th scope="col">Publishable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">A</th>
                  <td>
                    Read off the filing document itself, with an exhibit or page reference stored
                    alongside the figure.
                  </td>
                  <td>Yes, with citation</td>
                </tr>
                <tr>
                  <th scope="row">B</th>
                  <td>
                    Read off the filing&rsquo;s public summary record or the state&rsquo;s
                    published rate table, where the underlying document is not posted.
                  </td>
                  <td>Yes, with citation</td>
                </tr>
                <tr>
                  <th scope="row">C</th>
                  <td>
                    Ingested from a licensed industry data source during research. Useful for
                    knowing where to look. Not evidence of anything on its own.
                  </td>
                  <td>
                    <strong>Never</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Tier C is the entry point for everything. A record leaves Tier C only when a person has
            gone to the state&rsquo;s filing system, found the document, and recorded where it is.
            We do not republish licensed data, and we do not treat a vendor&rsquo;s number as a
            source.
          </p>

          <h2>Where the site stands</h2>
          {coverage.datasetPresent ? (
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">Measure</th>
                    <th scope="col">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Records in the research database</th>
                    <td className="num">{coverage.totalRecords.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th scope="row">Records verified and published</th>
                    <td className="num">{coverage.publishedRecords.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th scope="row">States with at least one published figure</th>
                    <td className="num">{coverage.statesWithPublished}</td>
                  </tr>
                  <tr>
                    <th scope="row">Items in the verification queue</th>
                    <td className="num">{coverage.queueLength.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>
              No verified figures have been published yet. The research database is held privately
              and is not part of this site&rsquo;s deployment; verification is done by hand,
              state by state, and pages fill in as it completes.
            </p>
          )}

          <h2>What we will not do</h2>
          <ul>
            <li>
              <strong>Rank carriers by rate stability.</strong> Increases apply to blocks, not
              companies. A single &ldquo;this carrier raises rates a lot&rdquo; verdict is almost
              always wrong somewhere. For a company&rsquo;s financial standing, use the NAIC&rsquo;s
              consumer resources.
            </li>
            <li>
              <strong>Present a filed figure as your quote.</strong> Filed rates describe a scenario
              — an age, a ZIP code, a tobacco status, a household-discount assumption. Your premium
              depends on yours.
            </li>
            <li>
              <strong>Republish licensed data.</strong> Vendor exports point us at filings. They
              never appear on the page and are never cited as a source.
            </li>
            <li>
              <strong>Fill gaps with estimates.</strong> An interpolated number on a page like this
              is indistinguishable from a real one, which makes it worse than a blank.
            </li>
          </ul>

          <h2>Corrections</h2>
          <p>
            If a figure here does not match the filing it cites, tell us and we will pull it the
            same day. <Link href="/contact">Contact us</Link>.
          </p>
        </div>

        <div style={{ marginTop: "2.5rem", maxWidth: "68ch" }}>
          <EvidenceNote title="Short version">
            <p style={{ marginBottom: 0 }}>
              We would rather show you an empty column than a number we cannot stand behind. The
              empty columns are not an oversight — they are the verification backlog, visible.
            </p>
          </EvidenceNote>
        </div>
      </div>
    </section>
  );
}
