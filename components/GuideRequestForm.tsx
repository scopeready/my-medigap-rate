"use client";

import { useState } from "react";

/**
 * The gated request form for the guide.
 *
 * WHAT IT COLLECTS, AND WHY EACH FIELD IS THERE
 * ---------------------------------------------
 * Required: name, ZIP, phone, email. Optional: street address and city, and
 * only because a printed copy needs somewhere to go — a field with no stated
 * purpose reads as data harvesting and costs completions on a form whose whole
 * job is to be completed.
 *
 * NO HEALTH QUESTIONS. Not here, not anywhere on this site. A condition,
 * medication or diagnosis field would pull the site into HIPAA and state
 * privacy scope for the sake of a free download.
 *
 * TWO CONSENTS, DELIBERATELY SEPARATE
 * -----------------------------------
 * Sending the document the reader just asked for is fulfilment. Calling them
 * afterwards about insurance is marketing, and the two are not the same
 * permission. Bundling them would mean nobody could read the guide without
 * agreeing to a sales call, which is worse practice and a weaker consent
 * record: a permission that was the price of entry is a permission a regulator
 * will discount. So delivery consent is required, plan-contact consent is
 * optional, and the optional one is what turns a reader into a lead.
 *
 * The plan-contact wording names "a contracted agent licensed in your state"
 * as well as the agency, because that is what actually happens outside the
 * fifteen licensed states — and because a reader in Pennsylvania should not be
 * told that the licensed agent here will be calling them.
 */

export function GuideRequestForm({
  endpoint,
  accessKey,
  redirectTo,
  agency,
  agent,
  guideTitle,
  phone,
  phoneHref,
}: {
  endpoint: string;
  /** Web3Forms access key. Public by design. */
  accessKey?: string;
  redirectTo: string;
  agency: string;
  agent: string;
  guideTitle: string;
  phone: string;
  phoneHref: string;
}) {
  const [wantsPrinted, setWantsPrinted] = useState(false);
  const live = Boolean(accessKey);

  return (
    <form
      action={endpoint}
      method="POST"
      className="rr-form"
      // With no access key there is nowhere for this to go. Without the guard a
      // press of Enter would clear the reader's typing and look like a send.
      onSubmit={live ? undefined : (e) => e.preventDefault()}
    >
      <input type="hidden" name="access_key" value={accessKey ?? ""} />
      <input type="hidden" name="subject" value={`Guide request — ${guideTitle}`} />
      <input type="hidden" name="from_name" value="MyMedigapRate" />
      <input type="hidden" name="lead_source" value="Guide request" />
      <input type="hidden" name="guide" value={guideTitle} />
      <input type="hidden" name="redirect" value={redirectTo} />

      <fieldset>
        <legend>Where to send it</legend>

        <div className="field">
          <label htmlFor="g-name">Your name</label>
          <input id="g-name" name="name" type="text" autoComplete="name" required />
        </div>

        <div className="field">
          <label htmlFor="g-email">Email</label>
          <input id="g-email" name="email" type="email" autoComplete="email" required />
          <p className="rr-hint">This is where the guide goes, so check it before you send.</p>
        </div>

        <div className="field">
          <label htmlFor="g-phone">Phone</label>
          <input id="g-phone" name="phone" type="tel" autoComplete="tel" required />
        </div>

        <div className="field">
          <label htmlFor="g-zip">ZIP code</label>
          <input
            id="g-zip"
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}(-[0-9]{4})?"
            maxLength={10}
            required
          />
          <p className="rr-hint">
            Medigap premiums and switching rights are set state by state, so the ZIP tells us which
            rules apply to you.
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend>A printed copy (optional)</legend>
        <div className="consent">
          <input
            id="g-printed"
            type="checkbox"
            checked={wantsPrinted}
            onChange={(e) => setWantsPrinted(e.target.checked)}
          />
          <label htmlFor="g-printed">Post me a printed copy as well</label>
        </div>

        {wantsPrinted && (
          <>
            <div className="field">
              <label htmlFor="g-street">Street address</label>
              <input id="g-street" name="street" type="text" autoComplete="street-address" />
            </div>
            <div className="field">
              <label htmlFor="g-city">City and state</label>
              <input id="g-city" name="city" type="text" autoComplete="address-level2" />
            </div>
            <p className="rr-hint">
              Only needed for the printed copy. Leave the box unticked and we will not ask for it.
            </p>
          </>
        )}
      </fieldset>

      <fieldset>
        <legend>Permissions</legend>

        <div className="consent">
          <input id="g-consent-send" type="checkbox" required name="consent_send" value="yes" />
          <label htmlFor="g-consent-send">
            <strong>Required.</strong> Send me {guideTitle} by email, and email me about this
            request if anything about it needs sorting out.
          </label>
        </div>

        <div className="consent">
          <input id="g-consent-contact" type="checkbox" name="consent_contact" value="yes" />
          <label htmlFor="g-consent-contact">
            <em>Optional, and not a condition of receiving the guide.</em> {agent} or a contracted
            agent licensed in my state may call, text or email me about Medicare Supplement,
            Medicare Advantage or Part D options. I may withdraw this at any time.
          </label>
        </div>

        <p className="rr-hint">
          Leave the second box unticked and you will get the guide and nothing else. We do not sell
          or share your details, and we never ask about your health on this site.
        </p>
      </fieldset>

      {/* Honeypot. Web3Forms rejects a submission where botcheck is set. */}
      <input className="hp" type="checkbox" tabIndex={-1} autoComplete="off" aria-hidden name="botcheck" />

      {live ? (
        <button type="submit" className="btn btn--primary rr-submit">
          Email me the guide
        </button>
      ) : (
        <p className="rr-hint rr-submit">
          This form is not accepting requests yet. Call {agency} on{" "}
          <a href={`tel:${phoneHref}`}>{phone}</a> and we will send the guide over.
        </p>
      )}
    </form>
  );
}
