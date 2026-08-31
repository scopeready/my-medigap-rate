import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cite, SourceList } from "@/components/Cite";
import { RateReviewForm } from "@/components/RateReviewForm";
import { COMPENSATION_NOTE, GOVERNMENT_DISCLAIMER, LICENSED_ABBRS, ORG, SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import type { SourceId } from "@/lib/sources";

const SOURCES: readonly SourceId[] = [
  "medigap-when",
  "medigap-ready",
  "medigap-costs",
  "medigap-how-works",
  "ship-about",
];

const TITLE = "Free Medigap rate-stability review";
const DESCRIPTION =
  "Send us your carrier, plan letter and state. We identify the filed block your policy actually sits in, show you what it has done historically, and tell you whether a better-behaved block is open to you. No health questions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/rate-review" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/rate-review`,
    type: "website",
  },
};

/**
 * Public by design — this is a form-relay endpoint, never a secret. When it is
 * unset the page still renders in full and tells the reader to call instead,
 * which is a working contact path rather than a broken one.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

const STATE_OPTIONS = STATES.map((s) => ({
  abbr: s.abbr,
  name: s.name,
  licensed: s.licensed,
}));

export default function RateReviewPage() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Rate review" }]} />
        <h1 style={{ marginTop: 0 }}>Free Medigap rate-stability review</h1>
        <p className="lede">
          Your premium went up. The useful question is not whether your company is
          &ldquo;good&rdquo; — it is which filed block your policy actually sits in, and what that
          block has done to everyone else in it.
        </p>

        <div className="prose">
          <h2>What you get</h2>
          <ol>
            <li>
              <strong>Which block you are in.</strong> Not the brand on your bill — the legal
              entity and its NAIC number, which is the thing that files rates. One brand often runs
              several, and they behave very differently.
            </li>
            <li>
              <strong>What that block has filed.</strong> Its rate actions over recent years, from
              the public filing record, so you can see whether this year was a correction or the
              third step of a pattern.
            </li>
            <li>
              <strong>Whether it is still open.</strong> A policy form closed to new customers ages
              without replacement, and the arithmetic of that works against you.{" "}
              <Link href="/what-is-a-closed-block">How closed blocks work</Link>.
            </li>
            <li>
              <strong>Whether you could actually move.</strong> This is the part most reviews skip.
              Outside your one-time six-month window, and without a guaranteed issue right, an
              insurer may ask health questions and decline you.
              <Cite id="medigap-ready" /> If the honest answer is that you should stay where you
              are, that is the answer you will get.
            </li>
          </ol>

          <h2>What happens after you send it</h2>
          <p>
            {ORG.agent} reads it and calls you, usually the same business day and always within two
            business days. It is a conversation, not a quote engine. Nothing is sold on the call,
            and if there is nothing worth changing we will say so and you will not hear from us
            again unless you ask.
          </p>
          <p>
            <strong>This costs you nothing, and neither does buying through us.</strong>{" "}
            {COMPENSATION_NOTE}
          </p>

          <div className="callout callout--warn">
            <p style={{ marginBottom: 0 }}>
              <strong>We will never ask about your health on this website.</strong> No conditions,
              no medications, no diagnoses. Those questions belong in a conversation with a
              licensed agent, if and when you decide to apply somewhere. Please leave them out of
              the notes box too.
            </p>
          </div>
        </div>

        <h2 id="form">Request your review</h2>
        <p className="rr-intro">
          Six fields are required and the rest help. We are licensed in{" "}
          {LICENSED_ABBRS.join(", ")} — choose your state first and the form will tell you straight
          away if we cannot help where you live.
        </p>

        <RateReviewForm
          endpoint={endpoint}
          states={STATE_OPTIONS}
          agency={ORG.legalName}
          agent={ORG.agent}
        />

        {/* Required adjacent to every lead form, not only in the footer. */}
        <p className="citation rr-disclaimer">{GOVERNMENT_DISCLAIMER}</p>
        <p className="citation">
          Prefer to talk first? Call <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a> or email{" "}
          <a href={`mailto:${ORG.email}`}>{ORG.email}</a>. {ORG.agent} answers both. You are also
          welcome to use the research here and never contact us —{" "}
          <Link href="/medigap-rate-history">it is all free and none of it is gated</Link>.
        </p>

        <div className="prose">
          <SourceList ids={SOURCES} />
        </div>
      </div>
    </section>
  );
}
