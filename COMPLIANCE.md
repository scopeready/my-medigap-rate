# Compliance

Disclaimers, marketing restrictions, sourcing requirements, and the compliance decisions
made during this project.

> This document records decisions and the reasoning behind them. It is **not legal advice.**
>
> **Implementation status (2026-08-30).** §2.1 now renders in a bar at the top of every
> page as well as in the footer. §2.2 renders in the footer site-wide, with the state list
> derived from `STATES` in `lib/states.ts` so it cannot drift from the flag that governs the
> agent call-to-action. §2.3's no-prediction sentence renders beneath every rate-history
> table. §2.4 renders in the footer. §3.6 is enforced by that same `licensed` flag. §4 is
> enforced by `gate()` and by `npm run verify:publishable`. What is **not** yet done is
> listed at the end of this file.
> Before launch, have the site reviewed by a compliance officer or attorney familiar with
> Medicare Supplement marketing in the states where ECOS is licensed. State insurance
> departments — not CMS — are the primary regulator for Medigap advertising.

---

## 1. Regulatory posture

**Medigap is state-regulated.** Medicare Supplement advertising is governed primarily by
state Departments of Insurance under NAIC model advertising rules, and federally by
[42 CFR Part 403 Subpart B](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-A/part-403/subpart-B).

**CMS's Medicare Communications and Marketing Guidelines (MCMG) largely do not apply to
Medigap-only marketing.** They govern Medicare Advantage and Part D. This distinction
drives several decisions below.

**⚠ The moment Medicare Advantage or Part D content is added to this site, that changes.**
CMS marketing rules and Third-Party Marketing Organization (TPMO) requirements would attach
site-wide — including the TPMO disclaimer, call recording obligations, and material
submission requirements. **Design the footer and disclaimer system so it can be switched on
without rework.** Do not add MA/PD content casually.

---

## 2. Required disclaimers

### 2.1 Government non-affiliation — REQUIRED, every page

Place near the header, adjacent to every lead form, and in the footer:

> **My Medigap Rate is operated by ECOS Medicare Solutions, an independent insurance agency.
> It is not connected with or endorsed by the U.S. government or the federal Medicare program.**

This is the single most important disclaimer on the site. The domain and design intentionally
read as a neutral research resource, which makes the non-affiliation statement more
necessary, not less.

### 2.2 Agent/licensing disclosure — REQUIRED

> Insurance products are offered through ECOS Medicare Solutions. Darin Weidauer is a
> licensed insurance agent in AZ, CA, CO, FL, GA, MN, NC, NM, NV, OH, SC, TN, TX, UT, and WA.
> We may receive compensation from insurance carriers for policies sold.

Compensation disclosure is both good practice and required in several states.

### 2.3 Data currency and sourcing — REQUIRED on every data page

> Rate information shown reflects filings on record as of [DATE] and is sourced from
> [SERFF filing / state Department of Insurance / NAIC Medicare Supplement Experience
> Exhibit]. Rates and approved increases change; verify current pricing before making a
> decision. Past rate increases do not predict future increases.

That last sentence matters. Presenting historical increases as predictive would be a
misrepresentation.

### 2.4 Not-all-plans disclosure — CONDITIONAL

> We do not offer every plan available in your area. Any information we provide is limited
> to those plans we do offer in your area. Please contact Medicare.gov, 1-800-MEDICARE, or
> your local State Health Insurance Program (SHIP) to get information on all of your options.

**This is a CMS TPMO requirement for Medicare Advantage and Part D — it is not federally
required for Medigap-only content.** Decision made during this project: include it anyway
as a good-practice transparency measure, and treat it as **mandatory** the moment MA/PD
content appears. Build it as a toggleable component.

---

## 3. Marketing restrictions — hard rules

### 3.1 Never imply government affiliation
No `.gov` styling, no Medicare logo, no eagle/flag iconography, no "official," no
"Medicare Plan Finder," no naming that suggests a government service.
[Medicare's plan marketing rules](https://www.medicare.gov/health-drug-plans/health-plans/your-coverage-options/plan-marketing-rules)
and [Google's site-name guidance](https://developers.google.com/search/docs/appearance/site-names)
both bear on this. The site name must accurately describe its owner and not mislead.

### 3.2 Never state or imply anything about a plan you cannot substantiate
Every factual claim about a rate, increase, or carrier must trace to a cited regulator source.

### 3.3 Block-level claims only — no carrier-level defamation risk
**Never write "Carrier X raises rates a lot."** Write "the block issued under NAIC 84549
took increases of 10.2%, 20.4%, and 35.8% effective [dates], per [SERFF filing]." This is
simultaneously the accurate framing, the legally defensible framing, and the genuinely
useful one. Carrier-level generalizations are both wrong (the data disproves them) and an
unnecessary liability.

### 3.4 No unsolicited contact implications
Do not imply the visitor will be contacted unless they submit a form. No auto-dialer
language. Lead forms must state clearly what happens next.

### 3.5 No health information collection
The site must not collect health conditions, medications, or diagnoses. That would trigger
HIPAA and state privacy obligations disproportionate to a lead-gen site. Underwriting
questions belong in the agent conversation, not the web form.

### 3.6 No non-licensed-state solicitation
Informational content is fine nationally. **Agent CTAs, quote forms, and "talk to us"
actions must be suppressed for states where ECOS is not licensed** (all except AZ, CA, CO,
FL, GA, MN, NC, NM, NV, OH, SC, TN, TX, UT, WA). **Never NY** — no NY landing pages,
no NY lead capture.

### 3.7 No doorway pages
Redirect domains must 301 to the main site. Never build parallel or near-duplicate sites on
alternate domains — this violates
[Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
and risks the main site.

---

## 4. Data licensing — the most consequential restriction

**CSG Actuarial data is licensed to Darin as an agent tool. It is agent-use-only.**

| Rule | Detail |
|---|---|
| **Never publish** | No CSG-derived figure may appear on the public site while `publishable: false` |
| **Never cite** | CSG must not be named as a source anywhere public |
| **Never serve** | No API route, no file under `public/`, no client-side bundle containing the raw layer |
| **Never expose filenames** | `source.file` / `source.page` fields identify the vendor — internal only |
| **Git-ignored** | `data/csg/` is excluded from version control. Keep it that way. |

**The lawful path to publication** is: use CSG internally to identify *what to verify* →
confirm the figure independently in SERFF / DOI / NAIC → publish the **independently
verified** figure with **that** citation. The published number happens to match what CSG
showed, but it is sourced, cited, and legally grounded in the public regulatory record.

This is why the evidence-tier system exists, and why all 4,913 records currently sit at
`publishable: false`.

---

## 5. Sourcing requirements

Every published figure requires a `source_citation`:

```jsonc
{
  "type": "SERFF",                          // SERFF | DOI | NAIC
  "filing_id": "AETN-134567890",
  "state": "TN",
  "url": "https://...",
  "retrieved": "2026-09-15",
  "approved_effective_date": "2026-06-01",
  "approved_increase_pct": 39.9
}
```

Rendered visibly on-page as a citation line with a working link.

**Accepted sources by tier:** `A` primary regulator source — a filing or DOI order, or an
official regulator dataset such as an NAIC Medicare Supplement Experience Exhibit ·
`B` reputable secondary with attribution · `C` vendor data — **never published.**

> The tier vocabulary above and the `source_citation` shape shown in the code block are the
> data-phase versions. **The site enforces a different shape** — see `DATA_DICTIONARY.md` §2
> for the one `gate()` actually accepts. Whether to restore the `A1`/`A2` split is
> `OPEN_ISSUES.md` #13.

**Language precision:**
- *Requested* ≠ *approved*. Label filings that were requested but not approved as such.
- *Missing* ≠ *zero*. "No increase on record" ≠ "0% increase."
- Always pair a percentage with its effective date.

---

## 6. Privacy

- Privacy policy required — the site collects PII via lead forms
- State privacy laws apply (CA CCPA/CPRA is the binding constraint given California licensing)
- Cookie consent needed if analytics or advertising pixels are used
- Do not log form contents to client-side analytics
- Retention and deletion policy should be stated
- **No client PII belongs in this repository, ever**

---

## 7. Accessibility

The audience is 65+. Beyond ADA exposure, this is a conversion issue.

- WCAG 2.1 AA as the target
- Minimum 16px body text; 18px preferred
- Strong contrast ratios — do not use light grey on white
- Full keyboard navigation; visible focus states
- Real labels on every form field
- Charts must have text alternatives — a rate-history timeline needs a data table equivalent

---

## 8. Compliance decisions recorded

| Decision | Rationale |
|---|---|
| "Medigap" in the domain rather than "Medicare" | Reduces government-confusion risk and qualifies the audience toward switchers who know the term |
| Include the TPMO not-all-plans disclosure despite Medigap exemption | Transparency; and it becomes mandatory if MA/PD is ever added |
| Block-level framing enforced site-wide | Accuracy, defensibility, and it is the site's actual differentiator |
| No health data collected | Avoids HIPAA/state privacy scope |
| CSG used for discovery only, never publication | License terms |
| Non-licensed states get content but no CTA | Avoids unlicensed solicitation |
| Never NY | Not licensed; explicit standing instruction |

---

## 9. Not yet implemented

Tracked here so the pre-launch checklist in `DEPLOYMENT.md` has something to check against.

| § | Requirement | Status |
|---|---|---|
| 2.1 | Non-affiliation adjacent to every lead form | **Done** — `/rate-review` renders `GOVERNMENT_DISCLAIMER` directly beneath the form, and `/thank-you` carries it too. |
| 2.3 | Visible "filings on record as of [DATE]" on each data page | **Pending** — the date should derive from the citations' access dates once records are verified, so that it cannot be sourced from the vendor snapshot. Zero records are verified today. |
| 2.4 | SHIP named in the not-all-plans disclosure | **Partial** — SHIP is linked in the footer, but the disclosure text names only Medicare.gov and 1-800-MEDICARE. |
| 3.4 | Lead forms state what happens next | **Done** — who calls, how soon, that nothing is sold on the call, and that consent can be withdrawn. Repeated on `/thank-you`. |
| 6 | Cookie consent | **Pending** — not needed while no analytics ID is set; required the moment one is. |
| 7 | Chart text alternatives | **Pending** — no charts exist yet. A rate-history timeline needs a data-table equivalent. |
| 7 | WCAG 2.1 AA audit | **Not run.** Body text is 17px against a 16px floor; contrast and focus states have not been measured. |

A note on 3.5 and 3.6, both enforced in `components/RateReviewForm.tsx`: the form collects no
health field of any kind and asks the reader to keep conditions out of the free-text box, and
choosing a state we are not licensed in removes the contact fields and the consent checkbox
entirely, so a lead cannot be submitted from a state we cannot serve. That behaviour is
browser-side, so re-test it after any change to that component.

One open question rather than a gap: the header's "Talk to a person" call-to-action is
global, so it appears on non-licensed state pages. It points at `/contact`, which is general
contact rather than a state solicitation, and the per-state agent CTAs *are* correctly
suppressed. Worth a decision before launch.
