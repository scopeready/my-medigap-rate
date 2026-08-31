import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideRequestForm } from "@/components/GuideRequestForm";
import { GUIDE, GUIDE_DELIVERY } from "@/lib/guide";
import {
  GOVERNMENT_DISCLAIMER,
  GUIDE_REDIRECT_URL,
  ORG,
  SITE,
  WEB3FORMS_ENDPOINT,
  WEB3FORMS_KEY,
} from "@/lib/site";

const TITLE = GUIDE ? `${GUIDE.title} — free ${GUIDE.edition}` : "Guide";

export const metadata: Metadata = {
  title: TITLE,
  description: GUIDE
    ? `${GUIDE.summary} Request a free copy by email.`
    : "Guide",
  alternates: { canonical: "/retirement-guide" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: GUIDE?.summary ?? "",
    url: `${SITE.url}/retirement-guide`,
    type: "website",
  },
};

export default function RetirementGuidePage() {
  // No document, no page. The alternative is a form that takes a reader's
  // phone number in exchange for a file that does not exist.
  if (!GUIDE) notFound();

  return (
    <section className="section">
      <div className="wrap wrap-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: GUIDE.title }]} />

        <h1 style={{ marginTop: 0 }}>
          {GUIDE.title}
          <span className="guide-sub">{GUIDE.edition}</span>
        </h1>
        <p className="lede">{GUIDE.subtitle}</p>

        <div className="prose">
          <p>
            {GUIDE.summary} It is {GUIDE.pages} pages, it is free, and there is nothing to buy at
            the end of it.
          </p>

          <h2>Why we are giving it away</h2>
          <p>
            The rest of this site does one thing well: it shows what Medigap carriers have filed
            with state regulators, so you can see what happened to the block your policy sits in.
            That answers a narrow question. The book answers the wider one — the decisions that
            arrive between 62 and 75, most of which have deadlines, and several of which are
            expensive to get wrong in ways nobody tells you about until later.
          </p>

          <h2>What is in it</h2>
          <ul>
            {GUIDE.parts.map((part) => (
              <li key={part.title}>
                <strong>{part.title}.</strong> {part.detail}
              </li>
            ))}
          </ul>
          <p>
            Forty-seven chapters, plus a glossary, a 2026 quick-reference card and a what-changed
            summary. Each chapter stands alone, so you can go straight to the one that is worrying
            you.
          </p>

          <h2>Who wrote it</h2>
          <p>
            <strong>{GUIDE.author}</strong> — {GUIDE.authorCredentials}. He is the licensed agent
            behind this site, and he is independent, which means he is appointed with a number of
            carriers rather than employed by one. That is worth knowing before you read anything he
            has written about insurance, so it is on{" "}
            <Link href="/about">the about page</Link> as well.
          </p>

          <h2>What happens when you ask for it</h2>
          <p>{GUIDE_DELIVERY}</p>
          <p>
            The second checkbox on the form is optional and unticked by default. Leave it that way
            and you get the book and nothing else — no call, no follow-up sequence. Tick it only if
            you actually want to talk to somebody.
          </p>
        </div>

        <h2 id="request" style={{ marginTop: "2.4rem" }}>
          Where should we send it?
        </h2>

        <GuideRequestForm
          endpoint={WEB3FORMS_ENDPOINT}
          accessKey={WEB3FORMS_KEY}
          redirectTo={GUIDE_REDIRECT_URL}
          agency={ORG.legalName}
          agent={ORG.agent}
          guideTitle={GUIDE.title}
          phone={ORG.phone}
          phoneHref={ORG.phoneHref}
        />

        <p className="citation rr-disclaimer">{GOVERNMENT_DISCLAIMER}</p>
        <p className="citation">
          The book is educational. It is not a quote, an offer of coverage, or a recommendation to
          buy, drop or change any policy. See our <Link href="/privacy">privacy policy</Link> for
          what we do with the details you give us.
        </p>
      </div>
    </section>
  );
}
