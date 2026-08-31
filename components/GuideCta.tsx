import Link from "next/link";
import { GUIDE } from "@/lib/guide";

/**
 * The book offer, for the foot of the editorial pages.
 *
 * It sits alongside `LeadCta` rather than replacing it, and the two ask for
 * different things on purpose. The rate review is for somebody whose premium
 * has already jumped and who wants an answer about their own policy. The book
 * is for somebody who is reading to understand, is not ready to talk to
 * anybody, and would otherwise leave with nothing. Offering only the call
 * loses that second reader entirely.
 *
 * It renders nothing when no document is configured, so a page can carry the
 * component safely whether or not there is a book to send.
 */
export function GuideCta({ context }: { context?: string }) {
  if (!GUIDE) return null;

  return (
    <aside className="guide-cta" aria-labelledby="guide-cta-heading">
      <p className="guide-cta__kicker">Free, {GUIDE.pages} pages, no cost and nothing to buy</p>
      <h2 id="guide-cta-heading">
        {GUIDE.title} <span className="guide-cta__ed">{GUIDE.edition}</span>
      </h2>
      <p>
        {context ??
          "This page answers one question. The book covers the rest of them — Medicare, Social Security, IRMAA, income, taxes and long-term care, in the order they actually arrive."}
      </p>
      <p className="lead-cta__actions">
        <Link href="/retirement-guide" className="btn btn--primary">
          Email me the book
        </Link>
      </p>
      <p className="lead-cta__terms">
        Written by {GUIDE.author}, the licensed agent behind this site. We email it rather than
        hand you a download, so give us an address you read. Asking for the book does not sign you
        up for a call &mdash; that is a separate, optional box on the form, and it is unticked.
      </p>
    </aside>
  );
}
