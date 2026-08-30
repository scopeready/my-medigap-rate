import type { Metadata } from "next";
import { ORG, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${SITE.name} handles the information you give us and what the site collects automatically.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow prose">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy" }]} />
        <h1 style={{ marginTop: 0 }}>Privacy</h1>

        <h2>What we collect</h2>
        <p>
          If you call, email or send the contact form, we keep what you tell us: your name, contact
          details and the substance of your question. We use it to answer you and, if you ask us
          to, to help you compare or apply for coverage.
        </p>
        <p>
          Browsing the research pages requires nothing from you. There is no account, no email
          gate, and no step where you have to identify yourself to read a rate-history page.
        </p>

        <h2>What the site collects automatically</h2>
        <p>
          The site may use a standard web analytics service to count page views and understand
          which pages people find useful. That service records technical information such as an
          approximate location, browser and referring page. It is not used to identify you and we
          do not combine it with anything you send us.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell your information.</li>
          <li>
            We do not pass your details to lead buyers, other agencies, or a network of agents.
          </li>
          <li>
            We do not use your health information for anything other than the coverage question you
            asked us about.
          </li>
        </ul>

        <h2>Calls and texts</h2>
        <p>
          If you give us permission to contact you, you can withdraw it at any time by telling us
          in writing or by replying STOP to a text. Withdrawing it does not affect any coverage you
          already hold.
        </p>

        <h2>Your choices</h2>
        <p>
          Ask us what we hold about you, ask us to correct it, or ask us to delete it: email{" "}
          <a href={`mailto:${ORG.email}`}>{ORG.email}</a> or call{" "}
          <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a>. Some records have to be retained to
          meet insurance recordkeeping requirements, and we will tell you if that applies.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes materially we will say so on this page rather than update it
          quietly.
        </p>
      </div>
    </section>
  );
}
