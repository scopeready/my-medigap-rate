import {
  CURRENT_FIGURES,
  PREVIOUS_FIGURES,
  dollars,
  type MedicareYearFigures,
} from "@/lib/medicare-figures";

/**
 * The official Medicare amounts, with the year on the face of them.
 *
 * A Medigap page that will not state the Part B deductible is incomplete:
 * Plan G is defined as "everything except that deductible", so the plan cannot
 * be explained without the number. These are the only hard-coded dollar figures
 * on the site, they carry the CMS fact sheet they came from, and a build fails
 * once they fall behind the calendar year (`npm run check:figures`).
 *
 * Showing last year's figure beside this year's is deliberate. The reader's
 * lived experience is that Medicare costs keep rising, and confirming it with
 * the real numbers is more useful than a bare current figure.
 */

function change(now: number, before: number | undefined) {
  if (before === undefined || before === now) return null;
  const diff = now - before;
  const pct = (diff / before) * 100;
  return `${diff > 0 ? "up" : "down"} ${dollars(Math.abs(diff))} (${Math.abs(pct).toFixed(1)}%)`;
}

export function MedicareCosts({
  figures = CURRENT_FIGURES,
  previous = PREVIOUS_FIGURES,
}: {
  figures?: MedicareYearFigures;
  previous?: MedicareYearFigures;
}) {
  const rows = [
    {
      label: "Part B standard monthly premium",
      now: figures.partBPremiumMonthly,
      before: previous?.partBPremiumMonthly,
      note: "What most people pay for Part B. Higher earners pay more, based on income reported to the IRS.",
    },
    {
      label: "Part B annual deductible",
      now: figures.partBDeductible,
      before: previous?.partBDeductible,
      note: "The figure that separates Plan G from Plan F: Plan G covers everything Plan F does except this.",
    },
    {
      label: "Part A hospital deductible",
      now: figures.partAHospitalDeductible,
      before: previous?.partAHospitalDeductible,
      note: "Per benefit period, not per year — you can owe it more than once in a calendar year. Every Medigap plan except Plan A covers at least part of it.",
    },
  ];

  return (
    <div className="medicare-costs">
      <div className="table-scroll">
        <table className="data">
          <caption className="medicare-costs__caption">
            Official Medicare amounts for {figures.year}
            {previous ? `, against ${previous.year}` : ""}
          </caption>
          <thead>
            <tr>
              <th scope="col">What it is</th>
              <th scope="col">{figures.year}</th>
              {previous && <th scope="col">{previous.year}</th>}
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">
                  {r.label}
                  <span className="medicare-costs__note">{r.note}</span>
                </th>
                <td className="medicare-costs__now">{dollars(r.now)}</td>
                {previous && <td>{r.before === undefined ? "—" : dollars(r.before)}</td>}
                <td>{change(r.now, r.before) ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="citation">
        {figures.year} amounts announced by CMS on {figures.announced}, read {figures.accessed}:{" "}
        <a href={figures.sourceUrl} rel="noopener noreferrer" target="_blank">
          {figures.sourceTitle}
        </a>
        . These change every year and are set by Medicare, not by any insurance company — no
        Medigap policy alters them. Confirm the current amount at{" "}
        <a href="https://www.medicare.gov/basics/costs/medicare-costs" rel="noopener noreferrer" target="_blank">
          Medicare.gov
        </a>{" "}
        before relying on it.
      </p>
    </div>
  );
}
