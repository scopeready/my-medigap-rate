/**
 * The gated guide, and the rules its request form follows.
 *
 * Every field below is read from the document itself — title page, table of
 * contents, author page — not written as marketing copy. A lead magnet that
 * misdescribes what it delivers is a consumer-protection problem as well as a
 * refund request, and this one is offered by a licensed agent on a Medicare
 * site, where the standard is higher rather than lower.
 *
 * When `GUIDE` is null nothing renders: no page, no call to action, no form.
 */

export interface Guide {
  /** Exact title as printed on the title page. */
  title: string;
  /** The book's own subtitle, verbatim. */
  subtitle: string;
  /** One sentence on who it is for. Ours, not the book's. */
  summary: string;
  author: string;
  /** Author credentials as the book states them. */
  authorCredentials: string;
  pages: number;
  /** Edition as printed. */
  edition: string;
  /** Path under public/. Unguessable on purpose, and disallowed in robots.txt. */
  filePath: string;
  /** Parts of the book, from the table of contents. */
  parts: readonly { title: string; detail: string }[];
}

export const GUIDE: Guide | null = {
  title: "Retire With Confidence",
  subtitle: "Medicare, Social Security, and the Money Decisions That Decide Your Retirement",
  summary:
    "A 295-page reference on the decisions that come at you between 62 and 75 — Medicare, Social Security, income, taxes and long-term care — written by the licensed agent who runs this site.",
  author: "Darin Weidauer",
  authorCredentials:
    "Gerontologist, 22-year U.S. Air Force veteran, independent insurance agent and Registered Social Security Analyst",
  pages: 295,
  edition: "2026 Edition",
  filePath: "/guides/retire-with-confidence-2026-b7fa43423a2c.pdf",
  parts: [
    {
      title: "Medicare: your foundation",
      detail:
        "The four parts, the seven-month enrollment window, what Medicare covers and the gaps it leaves, Original Medicare against Medicare Advantage, Medigap, and Part D.",
    },
    {
      title: "IRMAA and the income traps",
      detail:
        "The surcharge nobody warns you about, the late-enrollment penalties that never end, and how selling a house or converting an IRA can raise your Medicare premium two years later.",
    },
    {
      title: "Social Security",
      detail:
        "How the benefit is calculated, claiming at 62 against 67 against 70, spousal and survivor benefits, the earnings test, and how much of it is taxed.",
    },
    {
      title: "Retirement income planning",
      detail:
        "Building the income stack, the tax difference between a 401(k), an IRA and a Roth, life insurance in retirement, and where you live changing what you keep.",
    },
    {
      title: "Protecting what you have built",
      detail:
        "Long-term care and the hybrid policies that return your money, where you will live, caring for aging parents, and final expense planning.",
    },
    {
      title: "Future-proofing, and the reference material",
      detail:
        "The annual Medicare review, the decision timeline from 59½ to 75+, a glossary of 60+ terms, a 2026 quick-reference card, and what changed for 2026.",
    },
  ],
};

/**
 * How the guide is delivered, stated before the reader submits.
 *
 * It is emailed rather than downloaded. That is a deliberate trade: a download
 * link converts better, but an emailed copy confirms the address is real, gives
 * the reader a permanent copy they can find again, and makes the request and
 * the delivery one record. Say so plainly — a reader who expects an instant
 * download and gets an email instead feels tricked, and that is a poor first
 * impression to give somebody you want to advise on insurance.
 */
export const GUIDE_DELIVERY =
  "We email it. Nothing downloads from this page — check your inbox, and your spam folder if it has not arrived within a few minutes.";
