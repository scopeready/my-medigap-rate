import type { GateResult } from "@/lib/evidence";
import { WITHHELD_COPY } from "@/lib/evidence";
import { money, percent } from "@/lib/format";

/**
 * The only way a number reaches the page.
 *
 * If the gate withheld the value, the component renders why — never a
 * placeholder that could be mistaken for a figure, never a dash that a reader
 * could read as "zero".
 */

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <rect x="2" y="5" width="8" height="6" rx="1.5" fill="currentColor" />
      <path d="M4 5V3.6a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

export function Withheld({ reason }: { reason: keyof typeof WITHHELD_COPY }) {
  return (
    <span className="figure-withheld">
      <LockIcon />
      {WITHHELD_COPY[reason]}
    </span>
  );
}

type Kind = "money" | "percent";

export function Figure({
  result,
  kind,
  showCitation = true,
}: {
  result: GateResult<number>;
  kind: Kind;
  showCitation?: boolean;
}) {
  if (!result.published) return <Withheld reason={result.reason} />;

  const text = kind === "money" ? `${money(result.value, true)}/mo` : percent(result.value);

  return (
    <>
      <span className="figure-value">{text}</span>
      {showCitation && (
        <>
          {" "}
          <span className="citation">
            (
            <a href={result.citation.url} rel="nofollow noopener noreferrer" target="_blank">
              {result.citation.filingNumber}
            </a>
            , {result.citation.regulator})
          </span>
        </>
      )}
    </>
  );
}
