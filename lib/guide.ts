/**
 * The gated guide (the book), and the rules its request form follows.
 *
 * WHY THE IDENTITY LIVES HERE
 * --------------------------
 * The title, the summary and the contents are facts about a document that
 * exists. They are not marketing copy to be invented, and a lead magnet that
 * misdescribes what it delivers is a consumer-protection problem as well as a
 * refund request. So the page renders from this object, and when the object is
 * `null` the page and every call to action for it are simply absent — no
 * placeholder, no "coming soon", nothing that promises a document we cannot
 * send.
 *
 * TO ACTIVATE
 * -----------
 * 1. Put the file at `public/guides/<file>` (or wherever it is hosted).
 * 2. Fill in every field below from the document itself.
 * 3. Set `GUIDE` to that object.
 * 4. Add `/medigap-guide` to `app/sitemap.ts` and `public/llms.txt` — llms.txt
 *    is hand-written, so it does not follow automatically.
 */

export interface Guide {
  /** Exact title as printed on the document. */
  title: string;
  /** One sentence on who it is for and what it answers. */
  summary: string;
  /** What the reader actually gets — taken from the contents, not invented. */
  contains: readonly string[];
  /** Page count, so the reader knows what they are committing to. */
  pages: number;
  /** File name as delivered, for the fulfilment email. */
  fileName: string;
}

/**
 * `null` until the document is supplied. Nothing renders a guide CTA while this
 * is null, which is deliberate: the alternative is a form that collects a
 * reader's phone number in exchange for a file that does not exist.
 */
export const GUIDE: Guide | null = null;

/**
 * How the guide is delivered, stated to the reader before they submit.
 *
 * It is emailed rather than downloaded. That is a deliberate trade: a download
 * link converts better, but an emailed copy confirms the address is real, gives
 * the reader a permanent copy they can find again, and means the request and
 * the delivery are the same record. Say so plainly on the form — a reader who
 * expects an instant download and gets an email instead feels tricked, and that
 * is a bad first impression to give somebody you want to advise on insurance.
 */
export const GUIDE_DELIVERY =
  "We email it. Nothing downloads from this page — check your inbox, and your spam folder if it is not there within a few minutes.";
