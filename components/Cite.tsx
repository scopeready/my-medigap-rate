import { getSource, sourcesFor, type SourceId } from "@/lib/sources";

/**
 * Inline citation for a stated rule or deadline, and the source list that
 * closes an educational page.
 *
 * The rate pages never show a figure without a filing behind it. These pages
 * hold to the same standard for the rules they explain: if a sentence states
 * what the law or the programme requires, the government page saying so is one
 * click away, with the date we last read it.
 */

export function Cite({ id }: { id: SourceId }) {
  const s = getSource(id);
  return (
    <sup className="cite">
      <a
        href={s.url}
        rel="noopener noreferrer"
        target="_blank"
        title={`${s.publisher} — ${s.title}`}
      >
        [{s.publisher}]
      </a>
    </sup>
  );
}

export function SourceList({ ids }: { ids: readonly SourceId[] }) {
  const sources = sourcesFor(ids);
  return (
    <section className="sources" aria-labelledby="sources-heading">
      <h2 id="sources-heading">Where this comes from</h2>
      <p>
        Every rule and deadline on this page is stated from a federal source. Each entry below
        says what we relied on it for and when we last read it. If something here disagrees with
        Medicare, Medicare is right — tell us and we will fix it.
      </p>
      <ol className="source-list">
        {sources.map((s) => (
          <li key={s.id}>
            <a href={s.url} rel="noopener noreferrer" target="_blank">
              {s.title}
            </a>
            <span className="source-list__meta">
              {" "}
              — {s.publisher}. Read {s.accessed}.
            </span>
            <span className="source-list__claim">{s.claim}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
