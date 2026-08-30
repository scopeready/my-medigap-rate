import Link from "next/link";
import { ORG, LICENSED_ABBRS } from "@/lib/site";

/**
 * The consultation call-to-action used at the foot of the editorial pages.
 *
 * Three things it deliberately does:
 *
 *  - Says what happens next. The reader is told who calls, roughly when, and
 *    that nothing is sold on the call. Vagueness about the follow-up is how
 *    lead capture earns its reputation.
 *  - Names the licensed states in the CTA itself, not in small print
 *    elsewhere, so a reader in a state we cannot write in learns that before
 *    they spend time rather than after.
 *  - Asks no health questions anywhere. Underwriting belongs in the agent
 *    conversation, and collecting conditions on a web page would change this
 *    site's privacy obligations entirely.
 */
export function LeadCta({
  heading = "Find out whether it is your block or just your age",
  children,
}: {
  heading?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside className="lead-cta" aria-labelledby="lead-cta-heading">
      <h2 id="lead-cta-heading">{heading}</h2>
      {children ?? (
        <p>
          Send us your carrier, your plan letter and your state. We will look up which filed
          block your policy actually sits in, what that block has done historically, and whether
          a better-behaved block is open to you where you live.
        </p>
      )}
      <p className="lead-cta__actions">
        <Link href="/contact" className="btn">
          Ask about your policy
        </Link>
        <a href={`tel:${ORG.phoneHref}`} className="btn btn--ghost">
          {ORG.phone}
        </a>
      </p>
      <p className="lead-cta__terms">
        {ORG.agent} answers, usually the same business day. It is a conversation, not a quote
        engine, and nothing is sold on the call. We never ask about your health conditions
        through this website. We can write policies in {LICENSED_ABBRS.join(", ")} — everywhere
        else, we will point you at your state&rsquo;s free counselling programme instead, which
        takes no commission.
      </p>
    </aside>
  );
}
