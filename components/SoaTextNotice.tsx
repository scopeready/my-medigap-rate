"use client";

import { useEffect, useRef } from "react";

/**
 * After a form is submitted: tell the visitor a text asking for a Scope of
 * Appointment is on its way (owner, 2026-10-19), so they look for it instead of
 * ignoring it. The scope form is sent by text from an outgoing-only number that
 * may show "Medicare Center" as the sender, which reads like spam unless the
 * visitor has been told to expect it.
 *
 * Shown twice on purpose: as a dialog that opens over the thank-you page, and
 * printed on the page itself, so a visitor who closes the dialog (or has
 * JavaScript off) still has it.
 */

const SENDER_NUMBER = "254-271-0085";
const SENDER_NAME = "Medicare Center";

function Body({ agent }: { agent: string }) {
  return (
    <>
      <p>
        Shortly you will get a text message asking you to fill out a short{" "}
        <strong>Scope of Appointment</strong> form. Please look for it and take a minute to
        complete it. It helps {agent} get ready for your conversation.
      </p>
      <ul className="soa-facts">
        <li>
          <strong>From:</strong> {SENDER_NUMBER}. Your phone may show it as coming from &ldquo;
          {SENDER_NAME}&rdquo;.
        </li>
        <li>
          <strong>It will read:</strong> &ldquo;[Your name], fill out this Scope of Appointment
          Form: https://www.planenroll.com/soa-confirmation-form/… to make sure you are ready for
          your next meeting with {agent}. Reply STOP to unsubscribe.&rdquo;
        </li>
        <li>
          <strong>Please don&rsquo;t call or text that number back.</strong> It sends messages
          only, so nobody will see a reply. To reach {agent}, use the phone number on this site.
        </li>
      </ul>
      <p>
        <strong>This is not a sale and not a contract.</strong> Medicare&rsquo;s rules ask us to
        have your Scope of Appointment on file before we talk about plans with you. It simply
        records which topics you would like to cover, and it does not commit you to anything.
      </p>
    </>
  );
}

export function SoaTextNotice({ agent }: { agent: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && typeof d.showModal === "function" && !d.open) d.showModal();
  }, []);

  return (
    <>
      <dialog ref={ref} className="soa-dialog" aria-labelledby="soa-dialog-title">
        <h2 id="soa-dialog-title" tabIndex={-1} autoFocus>
          Watch for a text from us
        </h2>
        <Body agent={agent} />
        <form method="dialog">
          <button className="btn btn--primary" type="submit">
            Got it, I&rsquo;ll watch for the text
          </button>
        </form>
      </dialog>

      <div className="soa-notice" role="note">
        <h2>Watch for a text from us</h2>
        <Body agent={agent} />
      </div>
    </>
  );
}
