import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ORG, SITE, GOVERNMENT_DISCLAIMER } from "@/lib/site";

const TITLE = "Check your email";

export const metadata: Metadata = {
  title: TITLE,
  description: "Your guide is on its way by email.",
  alternates: { canonical: "/guide-sent" },
  // A confirmation page has no search value and can carry query strings into
  // an index. Keep it out.
  robots: { index: false, follow: true },
};

export default function GuideSentPage() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: TITLE }]} />
        <h1 style={{ marginTop: 0 }}>It is on its way.</h1>
        <p className="lede">
          We have your request and the guide is being emailed to the address you gave us. It should
          arrive within a few minutes.
        </p>

        <div className="prose">
          <h2>If it has not arrived</h2>
          <ul>
            <li>
              <strong>Check your spam or promotions folder.</strong> A first email from an address
              you have never written to often lands there. Marking it &ldquo;not spam&rdquo; means
              anything else we send reaches you.
            </li>
            <li>
              <strong>Check the address for a typo.</strong> One wrong character and it goes
              nowhere. Request it again with the corrected address — there is no limit.
            </li>
            <li>
              <strong>Still nothing?</strong> Call {ORG.agent} on{" "}
              <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a> or email{" "}
              <a href={`mailto:${ORG.email}`}>{ORG.email}</a> and we will send it directly.
            </li>
          </ul>

          <h2>What happens now</h2>
          <p>
            If you left the second box unticked, nothing. You will get the guide and we will not
            call you. That is the whole arrangement, and we mean it — a guide that costs you a sales
            call is not free.
          </p>
          <p>
            If you did tick it, {ORG.agent} or a contracted agent licensed in your state will be in
            touch. You can withdraw that at any time by replying to any email from us or calling the
            number above.
          </p>

          <h2>While you wait</h2>
          <p>
            The research on this site is free and needs no form:{" "}
            <Link href="/why-did-my-medigap-premium-increase">
              why premiums go up
            </Link>
            ,{" "}
            <Link href="/what-is-a-closed-block">what a closed block is</Link>, and{" "}
            <Link href="/medigap-rate-history">rate history by state and plan</Link>.
          </p>
        </div>

        <p className="citation rr-disclaimer">{GOVERNMENT_DISCLAIMER}</p>
        <p className="citation">
          {SITE.name} does not sell or share the details you gave us. See our{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
}
