import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideCta } from "@/components/GuideCta";
import { ORG, SITE, GOVERNMENT_DISCLAIMER } from "@/lib/site";

const TITLE = "Request received";

export const metadata: Metadata = {
  title: TITLE,
  description: "We have your rate-review request. Here is what happens next.",
  alternates: { canonical: "/thank-you" },
  // A confirmation page has no search value and can leak query strings into an
  // index. Keep it out.
  robots: { index: false, follow: true },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: "We have your rate-review request.",
    url: `${SITE.url}/thank-you`,
    type: "website",
  },
};

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Request received" }]} />
        <h1 style={{ marginTop: 0 }}>We have it. Thank you.</h1>
        <p className="lede">
          Nothing else is needed from you. {ORG.agent} will read it and call the number you gave
          us, usually the same business day and always within two business days.
        </p>

        <div className="prose">
          <h2>What the call is, and is not</h2>
          <ul>
            <li>
              It is a conversation about which filed block your policy sits in and what that block
              has done. Expect questions about your policy, not a pitch.
            </li>
            <li>
              Nothing is sold on the call, and there is no obligation at any point.
            </li>
            <li>
              If the honest answer is that you are in a good block and should stay put, that is
              what you will hear, and you will not hear from us again unless you ask.
            </li>
            <li>
              You will not be asked about your health by email. If you decide later to apply
              somewhere, underwriting questions come from the insurer at that point.
            </li>
          </ul>

          <h2>Changed your mind?</h2>
          <p>
            Reply to the confirmation email, or call{" "}
            <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a> and say so. We will delete your
            details. Consent to be contacted can be withdrawn at any time and was never a
            condition of anything.
          </p>

          <h2>While you wait</h2>
          <p>
            The research is free, ungated, and yours whether or not you ever speak to us:
          </p>
          <ul>
            <li>
              <Link href="/why-did-my-medigap-premium-increase">Why Medigap premiums go up</Link> —
              the three causes, and how to tell which is yours
            </li>
            <li>
              <Link href="/what-is-a-closed-block">What a closed block is</Link> — and how to check
              whether yours is one
            </li>
            <li>
              <Link href="/switching-medigap-plans">Switching plans</Link> — the rules that decide
              whether you can move at all
            </li>
            <li>
              <Link href="/medigap-rate-history">Rate history by state and plan</Link>
            </li>
          </ul>
        </div>

        <GuideCta context="While you wait for the call: the book covers everything around the policy decision — Social Security timing, IRMAA, taxes in retirement and long-term care. Free, and asking for it does not add you to anything." />

        <p className="citation rr-disclaimer">{GOVERNMENT_DISCLAIMER}</p>
      </div>
    </section>
  );
}
