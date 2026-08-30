/**
 * The standing explanation shown wherever figures are withheld. Written to be
 * read by a 66-year-old comparing plans, not by an analyst.
 */
export function EvidenceNote({
  title = "Why there are no premiums on this page yet",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="evidence-note" role="note">
      <p className="evidence-note__title">
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.6v4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="8" cy="11.4" r=".95" fill="currentColor" />
        </svg>
        {title}
      </p>
      {children ?? (
        <p>
          We publish a premium or a rate increase only after we have found the carrier&rsquo;s
          filing in the state&rsquo;s public records and linked to it on the page. Until that
          check is done for this plan and state, we show you the structure of what we track and
          leave the numbers off. A number without a source is worse than no number.
        </p>
      )}
    </div>
  );
}
