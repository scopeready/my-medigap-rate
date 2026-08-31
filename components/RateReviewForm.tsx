"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * The rate-review request form.
 *
 * A client component for one reason: the state field has to change what the
 * form says. We are licensed in fifteen states, and taking a lead from
 * somewhere we cannot write a policy wastes the visitor's time and implies we
 * can sell there. So choosing an unlicensed state swaps the submit path for an
 * honest explanation and a pointer to that state's free counselling service,
 * before they fill anything else in rather than after they hear back.
 *
 * What this form deliberately does not do:
 *
 *  - No health questions. Not a symptom, not a medication, not a condition.
 *    Underwriting belongs in a conversation with an agent; collecting any of
 *    it here would pull the site into HIPAA and state privacy scope for no
 *    benefit to anybody.
 *  - No date of birth. Age band is enough to know which rules apply, and it is
 *    markedly less identifying than a full DOB.
 *  - No pre-ticked consent, and consent is not a condition of anything.
 */

export interface StateOption {
  abbr: string;
  name: string;
  licensed: boolean;
  /**
   * Whether an unlicensed state gets the contracted-agent introduction.
   * Computed on the server from NO_REFERRAL_ABBRS so this component stays
   * free of lib/site and out of the client bundle.
   */
  referral: boolean;
}

const AGE_BANDS = ["Under 65", "65-69", "70-74", "75-79", "80-84", "85 or older"];

const PLANS = [
  "Plan A",
  "Plan B",
  "Plan C",
  "Plan D",
  "Plan F",
  "High-Deductible Plan F",
  "Plan G",
  "High-Deductible Plan G",
  "Plan K",
  "Plan L",
  "Plan M",
  "Plan N",
  "I am not sure",
  "I do not have a Medigap policy yet",
];

export function RateReviewForm({
  endpoint,
  accessKey,
  redirectTo,
  states,
  agency,
  agent,
  phone,
  phoneHref,
}: {
  endpoint: string;
  /** Web3Forms access key. Public by design; absent means submissions are off. */
  accessKey?: string;
  redirectTo: string;
  states: readonly StateOption[];
  agency: string;
  agent: string;
  phone: string;
  phoneHref: string;
}) {
  const [stateAbbr, setStateAbbr] = useState("");

  const chosen = states.find((s) => s.abbr === stateAbbr);
  const unlicensed = chosen !== undefined && !chosen.licensed;
  const live = Boolean(accessKey);

  return (
    <form
      action={endpoint}
      method="POST"
      className="rr-form"
      // With no access key there is nowhere for this to go. Without the guard
      // the form would submit to the endpoint anyway and fail, or — worse, if
      // the action were ever empty — reload the page and throw away everything
      // the visitor typed.
      onSubmit={live ? undefined : (e) => e.preventDefault()}
    >
      {/* Where the submission lands, and where the visitor lands after it. */}
      <input type="hidden" name="access_key" value={accessKey ?? ""} />
      <input type="hidden" name="subject" value="Rate-stability review request — MyMedigapRate" />
      <input type="hidden" name="from_name" value="MyMedigapRate" />
      <input type="hidden" name="lead_source" value="Rate review page" />
      <input type="hidden" name="redirect" value={redirectTo} />

      <fieldset>
        <legend>Where you live</legend>
        <div className="field">
          <label htmlFor="rr-state">Your state</label>
          <select
            id="rr-state"
            name="state"
            required
            value={stateAbbr}
            onChange={(e) => setStateAbbr(e.target.value)}
          >
            <option value="">Choose a state…</option>
            {states.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {unlicensed && (
          <div className="rr-blocked" role="status">
            {chosen.referral ? (
              <>
                <p>
                  <strong>
                    {agent} is not licensed in {chosen.name}, so he cannot write a policy there
                  </strong>{" "}
                  — but {agency} works with contracted agents who are licensed in {chosen.name} and
                  can help you directly. Call <a href={`tel:${phoneHref}`}>{phone}</a> and we will
                  introduce you to one.
                </p>
                <p>
                  This form stays closed for {chosen.name} on purpose. The agent licensed there
                  should be the one who takes your details, so we do not collect them here.
                </p>
              </>
            ) : (
              <p>
                <strong>We do not take enquiries from {chosen.name}.</strong> We would rather tell
                you now than take your details and tell you later.
              </p>
            )}
            <p>
              The research on this site still applies to you, and all of it is free:{" "}
              <Link href="/medigap-rate-history">rate history by state and plan</Link> and{" "}
              <Link href="/why-did-my-medigap-premium-increase">why premiums go up</Link>.
            </p>
            <p style={{ marginBottom: 0 }}>
              For advice specific to {chosen.name}, your State Health Insurance Assistance Program
              gives free one-to-one counselling and is funded federally rather than by any
              insurer. Find it through the{" "}
              <a href="https://www.shiphelp.org/" rel="noopener noreferrer" target="_blank">
                SHIP locator
              </a>{" "}
              or by calling 1-877-839-2675.
            </p>
          </div>
        )}
      </fieldset>

      {!unlicensed && (
        <>
          <fieldset>
            <legend>Your current policy</legend>
            <p className="rr-hint">
              All optional. Skip anything you do not have to hand — we can find it on the call.
            </p>
            <div className="field">
              <label htmlFor="rr-carrier">Who is your Medigap policy with?</label>
              <input
                id="rr-carrier"
                name="current_carrier"
                type="text"
                autoComplete="off"
                placeholder="The company name on your bill"
              />
            </div>
            <div className="field">
              <label htmlFor="rr-plan">Which plan letter?</label>
              <select id="rr-plan" name="current_plan" defaultValue="">
                <option value="">Choose one…</option>
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="rr-premium">What are you paying a month?</label>
              <input
                id="rr-premium"
                name="current_premium"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="e.g. 184"
              />
            </div>
            <div className="field">
              <label htmlFor="rr-age">Your age</label>
              <select id="rr-age" name="age_band" defaultValue="">
                <option value="">Choose one…</option>
                {AGE_BANDS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset>
            <legend>How to reach you</legend>
            <div className="field">
              <label htmlFor="rr-name">Your name</label>
              <input id="rr-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="rr-email">Email</label>
              <input id="rr-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="rr-phone">Phone</label>
              <input id="rr-phone" name="phone" type="tel" autoComplete="tel" required />
            </div>
            <div className="field">
              <label htmlFor="rr-zip">ZIP code</label>
              <input
                id="rr-zip"
                name="zip"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                autoComplete="postal-code"
                required
              />
              <span className="rr-hint">
                Medigap rates are filed by ZIP in some states, so this changes the answer.
              </span>
            </div>
            <div className="field">
              <label htmlFor="rr-notes">Anything else we should know? (optional)</label>
              <textarea id="rr-notes" name="notes" rows={4} />
              <span className="rr-hint">
                Please do not include health conditions, medications or diagnoses. We do not need
                them to answer your question, and we do not want them in an email.
              </span>
            </div>
          </fieldset>

          {/*
            Honeypot. Web3Forms rejects any submission where botcheck carries a
            value. Positioned off-screen rather than display:none — some bots
            skip fields that are display:none, which defeats the point.
          */}
          <input className="hp" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="consent">
            <input id="rr-consent" name="tcpa_consent" type="checkbox" required value="yes" />
            <label htmlFor="rr-consent">
              By checking this box and submitting this form, I give {agency} and {agent} permission
              to contact me by phone, email or text at the number and address I provided, including
              by automated means, about Medicare Supplement, Medicare Advantage or Part D plan
              options. My consent is not a condition of purchase and I may revoke it at any time.
            </label>
          </div>

          {live ? (
            <button type="submit" className="btn btn--primary rr-submit">
              Request my rate review
            </button>
          ) : (
            <p className="rr-hint rr-submit">
              This form is not accepting submissions yet. Call {agent} on the number above, or
              email us — both reach the same person.
            </p>
          )}
        </>
      )}
    </form>
  );
}
