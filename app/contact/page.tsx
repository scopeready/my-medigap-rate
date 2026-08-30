import type { Metadata } from "next";
import { COMPENSATION_NOTE, ORG, SITE, TPMO_DISCLAIMER } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${ORG.legalName} about Medicare Supplement coverage, or report a figure on this site that does not match its filing.`,
  alternates: { canonical: "/contact" },
};

/**
 * Optional form endpoint. When it is not configured the page renders phone and
 * email only — which is a complete contact page, not a degraded one. No API key
 * or secret is ever needed here; this value is public by design.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

export default function ContactPage() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
        <h1 style={{ marginTop: 0 }}>Talk to a person</h1>
        <p className="lede">
          A licensed agent answers the phone. There is no call centre, no queue and no transfer to
          a &ldquo;benefits specialist&rdquo; you have not met.
        </p>

        <div className="card" style={{ marginBlock: "2rem" }}>
          <dl className="facts">
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
              </dd>
            </div>
            <div>
              <dt>Agency</dt>
              <dd>{ORG.legalName}</dd>
            </div>
            <div>
              <dt>Agent</dt>
              <dd>
                {ORG.agent} &middot; NPN {ORG.npn}
              </dd>
            </div>
          </dl>
        </div>

        <h2>Found a figure that does not match its filing?</h2>
        <p>
          That is the most useful message you can send us. Include the page address and the filing
          number shown on it, and we will pull the figure while we recheck it.
        </p>

        {endpoint ? (
          <>
            <h2>Send a message</h2>
            <form action={endpoint} method="POST">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone (optional)</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="message">How can we help?</label>
                <textarea id="message" name="message" rows={5} required />
              </div>

              {/* Honeypot — hidden from people, filled in by bots. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="consent">
                <input id="tcpa_consent" name="tcpa_consent" type="checkbox" required value="yes" />
                <label htmlFor="tcpa_consent">
                  By checking this box and submitting this form, I give {ORG.legalName} and{" "}
                  {ORG.agent} permission to contact me by phone, email or text at the number and
                  address I provided, including by automated means, about Medicare Supplement,
                  Medicare Advantage or Part D plan options. My consent is not a condition of
                  purchase and I may revoke it at any time.
                </label>
              </div>

              <button type="submit" className="btn btn--primary" style={{ marginTop: "1.4rem" }}>
                Send message
              </button>
            </form>
          </>
        ) : (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3>Prefer to write?</h3>
            <p style={{ marginBottom: 0 }}>
              Email <a href={`mailto:${ORG.email}`}>{ORG.email}</a> and include the page address
              you are asking about. We read every message.
            </p>
          </div>
        )}

        <h2>What this costs you, and where else to get help</h2>
        <p>
          <strong>Talking to us is free, and so is buying through us.</strong> {COMPENSATION_NOTE}
        </p>
        <p>
          If you would rather talk to someone who is not paid by a carrier at all, every state runs
          a State Health Insurance Assistance Program offering free, unbiased Medicare counseling,
          funded federally. Medicare itself answers questions at{" "}
          <a href="tel:+18006334227">1-800-MEDICARE</a>, 24 hours a day. We would rather you used
          them for a second opinion than went uninformed.
        </p>

        <p className="citation" style={{ marginTop: "2.5rem" }}>
          {TPMO_DISCLAIMER} {SITE.name} is not connected with or endorsed by the United States
          government or the federal Medicare program.
        </p>
      </div>
    </section>
  );
}
