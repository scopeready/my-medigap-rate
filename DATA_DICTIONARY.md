# Data Dictionary

Field-by-field meaning for `data/csg/recon/reconciliation_layer.json` (4,913 records) and
`serff_queue.json` (4,279 items), plus guidance on **how each field should appear on the
website** — including which fields may never be shown.

> ⚠ Every record is currently `evidence_tier: "C"` / `publishable: false`.
> The "Display" column describes the intended treatment **once a record is filing-verified.**

> **Schema note (2026-08-30).** This dictionary was written during the data phase, before
> the site existed. The kit on disk and the site's evidence gate use different vocabularies
> for three governance fields. **The site's vocabulary is authoritative** — it is what
> `gate()` in `lib/evidence.ts` enforces — and the tables below have been corrected to it.
> A record written in the older vocabulary is silently degraded to Tier C and withheld, so
> use the shapes documented here, not the ones in the data-phase handoff.

---

## 1. `reconciliation_layer.json` — one record per carrier block × scenario

### Identity

| Field | Type | Meaning | Display |
|---|---|---|---|
| `key` | string | Composite unique ID: `STATE\|PLAN\|NAIC\|rating_class\|ageNN` (e.g. `AK\|G\|70319\|std\|age65`) | Internal only. Use as React key / URL slug component. |
| `state` | string | Two-letter state code | Page routing + "Nevada" heading (expand to full name for display) |
| `plan` | string | Medigap plan letter — `G` or `N` in this corpus | Page routing + "Plan G" heading |
| `naic` | string | **NAIC company code** — the legal entity identifier | **Show it.** This is what makes block-level claims verifiable and is the single most trust-building detail on the page. Render as "NAIC 70319". |
| `naic_join` | string | How NAIC was resolved: `rate+name` (exact rate match, high confidence) or `name_only` (fallback, lower confidence) | Internal. Treat `name_only` records with extra caution before publishing. |
| `carrier` | string | Carrier name as printed in the CSG PDF | Display, but see note below on brand vs. entity |
| `carrier_excel` | string | Carrier name as printed in the workbook (casing may differ) | Internal — used to audit the join |
| `parent_group` | string | Parent holding company (e.g. "Cno Financial Grp") | Useful context: "part of CNO Financial Group" |

> **Brand vs. entity is the crux of this site.** "AARP Medicare Supplement Insurance Plans"
> is a brand; NAIC 84549 and NAIC 79413 are different legal entities selling under it with
> radically different rate histories. Always pair the display name with the NAIC code, and
> never aggregate increase history across NAICs that share a brand name.

### Carrier profile

| Field | Type | Meaning | Display |
|---|---|---|---|
| `years_in_market` | integer | Years the carrier has sold Medigap | "34 years in the Medigap market" — a stability signal |
| `am_best.rating` | string | A.M. Best financial strength grade (A++ … D) | Show with a plain-language gloss ("A — Excellent") |
| `am_best.outlook` | string | Stable / Positive / Negative | Show alongside the rating |
| `sp_rating` | string | Standard & Poor's rating where present | Optional secondary |
| `rate_type` | string | **`Attained age`** (premium rises with age), **`Issue age`** (locked to age at purchase), or **`Community`** (same for all ages) | **Show prominently and explain.** This is one of the most consequential and least understood facts for a shopper — attained-age policies get more expensive every year by design. |
| `rating_class` | string\|null | Sub-class where a carrier files multiple (e.g. tobacco/preferred tiers) | Show only when non-null, as a qualifier |

### Premium

| Field | Type | Meaning | Display |
|---|---|---|---|
| `premium.monthly` | float | Monthly premium, USD, for this scenario | Show as "$153.78/mo" — **but only if publishable** |
| `premium.monthly_with_discounts` | float | After household/other discounts | Show as the "with discount" figure; explain eligibility |
| `premium.annual` | float | Annualized | Optional |
| `premium.hh_discount_pct` | float\|null | Household discount percentage | "7% household discount available" |
| `premium.discount_type` | string\|null | Discount description | Qualifier text |
| `premium.policy_fee` | float\|null | One-time or annual policy fee | **Show — buyers miss this.** Note whether one-time or recurring. |
| `premium.rate_effective_date` | date | When this rate took effect | Show — supports "how current is this?" |
| `premium.quote_effective_date` | date | Quote date used (2026-09-01 throughout) | Show as the "rates as of" date |

### The stability data — the reason this site exists

| Field | Type | Meaning | Display |
|---|---|---|---|
| `increase_history[]` | array | Past rate increases: `{effective_date, increase_pct}`. Typically the ~5 most recent. | **The centerpiece.** Render as a timeline or small bar chart. Label clearly as *historical, approved* increases once SERFF-verified. |
| `increase_history_avg_pct` | float | Mean of the recorded increases | "Averaged 3.0% per increase" — but always show the underlying series; an average hides a 10→20→36% acceleration. |
| `age_curve[]` | array | Premium at each attained age: `{age, monthly_rate, increase_pct}` | Line chart: "what this costs you at 70, 75, 80." Powerful for attained-age plans. |
| `age_increase_avg_pct` | float | Mean annual age-based step | "About 3.9% per year from aging alone" — **explain this is separate from rate increases and they compound.** |

> **Critical framing rule.** Age increases and rate increases are different things and they
> stack. A shopper choosing an attained-age plan with a 3.9% age curve and a carrier averaging
> 6% rate increases is facing roughly 10% compounding annually. Explaining that clearly is the
> single most valuable thing this site can do for a consumer — and it is exactly the insight
> that produces a switcher lead.

### Market data

| Field | Type | Meaning | Display |
|---|---|---|---|
| `market_data.national.lives` | integer | Policyholders nationally in this block | Context for block size |
| `market_data.national.premium_usd` | integer | Annual premium volume nationally | Optional |
| `market_data.national.loss_ratio_pct` | float | Claims paid ÷ premium collected, national | **Show and explain.** Above ~100% means the block is paying out more than it takes in — a strong predictor of a future increase. |
| `market_data.national.market_share_pct` | float | Share of national Medigap market | Optional |
| `market_data.state.*` | same shape | Same metrics for this state | **Prefer state over national for consumer-facing claims** — a carrier can be healthy nationally and distressed in one state. |

> **Loss ratio is your leading indicator.** GA Medico at 100.1%, CO Aflac at 131.3%, NV GPM
> at 113.7%, TN AARP at 100.41% — each preceded or accompanied a large increase. A page that
> says "this block is paying out more in claims than it collects, which historically precedes
> a rate increase" is genuinely useful consumer information. Source it to the NAIC exhibit
> (Tier A2), not to CSG.

### Governance — check these before rendering

| Field | Type | Meaning | Display |
|---|---|---|---|
| `evidence_tier` | `A`\|`B`\|`C` | Provenance grade. `A` = confirmed against the filing document itself; `B` = confirmed against the filing's public summary or the state's rate table; `C` = vendor ingestion tier. **Currently `C` for all records.** Anything the loader does not recognise becomes `C`. | Never displayed directly; governs whether anything else may be. |
| `verification_status` | string | `unverified` → `in_review` → `filing_confirmed`, or `superseded` / `withdrawn`. Only `filing_confirmed` passes the gate. (The kit currently carries `pending_serff`, which normalises to `unverified`.) | Internal. May drive a "verification in progress" UI state. |
| `publishable` | boolean | **The gate.** `false` for all 4,913 records today. | **Filter on this before rendering any figure to a public route.** |
| `source.file` / `source.page` | string / int | Origin CSG file and page | Internal audit trail only — never shown (would disclose CSG as a source). |
| `source_citation` | object | **To be added during verification.** Must carry `filingNumber`, an `http(s)` `url`, and `regulator`; `accessed` and `exhibit` are optional. All three required fields must be present and non-empty or the whole record is withheld. | **Required on every published figure.** Rendered as a visible citation line linking to the filing. |

---

## 2. `serff_queue.json` — the verification worklist

| Field | Type | Meaning |
|---|---|---|
| `state` | string | Filing jurisdiction |
| `carrier` | string | Carrier name to search |
| `naic` | string | **Search SERFF by this**, not by name — names vary between the filing and the marketing brand |
| `plan` | string | Plan letter |
| `rating_class` | string\|null | Sub-class qualifier |
| `verify[]` | array of strings | Human-readable statements of exactly what to confirm, e.g. *"double-digit increases on this block: 73.5% eff 2024-04-01, 15.0% eff 2026-04-01"* |
| `where` | string | Where to look, e.g. *"AZ DOI / SERFF filing search, NAIC 73288"* |
| `rank` | integer | Position in the worklist. **A unique ordinal over the whole queue (1…4,279), not a priority tier** — the reconciler sorts licensed states first, then by largest filed increase, and numbers the result. Work the *lowest ranks*; filtering for `rank == 1` matches a single row. 1,395 of the 4,279 items are in licensed states. |
| `licensed_state` | boolean | Whether the agency is licensed in this filing's state. The practical filter for "what should I work on". |

**Verification workflow.** For each item: search the filing system by NAIC + state, locate
the rate filing matching the effective date, confirm the approved percentage, then update the
corresponding `reconciliation_layer.json` record. All four governance fields move together —
setting `publishable` alone does nothing, because the gate checks every one:

```jsonc
{
  "evidence_tier": "A",                     // "A" or "B". NOT "A1"/"A2" — those degrade to C.
  "verification_status": "filing_confirmed", // NOT "verified" — that degrades to unverified.
  "publishable": true,
  "source_citation": {
    "filingNumber": "AETN-134567890",        // NOT "filing_id"
    "url": "https://…",                      // must be http(s)
    "regulator": "Tennessee Department of Commerce and Insurance",
    "accessed": "2026-09-15",                // optional
    "exhibit": "Exhibit 3, p. 12"            // optional
  }
}
```

Run `npm run verify:publishable` afterwards. It applies exactly the checks `gate()` applies
and names any record that claims to be publishable without meeting them, so a
mis-shaped update fails loudly instead of quietly rendering as withheld.

> **Open question — tier granularity.** The data-phase scheme distinguished `A1` (primary
> regulator document) from `A2` (official regulator dataset, e.g. an NAIC experience
> exhibit). The site's scheme has a single `A`. That distinction is worth keeping for loss
> ratios in particular, which come from NAIC exhibits rather than from filings. Adding it
> means widening `EvidenceTier` in `lib/evidence.ts` and the guard together. Not yet done.

---

## 3. Supporting files

| File | Shape | Use |
|---|---|---|
| `qa_flags.json` | `{qa: [...304], pdf_unmatched: [...13]}` | Anomalies and systematic issues. Review before trusting an outlier. |
| `missing_data.json` | 25 entries: state, plan, age, licensed, status, have/missing, recovery paths | Drives "data not yet available for this state" UI states |
| `needs_attention.json` | per-state item lists | Internal ops register |
| `reexport_queue.json` | 26 open entries with issue + action | Internal ops register |
| `excel_only_rows.json` | 14,101 rows | Workbook rows with no PDF block — other plan letters (A, B, C, D, F, HDF, HDG, K, L, M) and non-quoted carriers. **This is where Plan F / HDG / etc. rates live** if the site expands beyond G and N. Note the consequence: the analytics layer covers **G and N only**, so Plan F and HDG have premiums in all 48 states but *no rate-increase history anywhere*. `ROUTED_PLANS` in `lib/plans.ts` currently routes all four, which means half of the 204 state × plan pages cannot show a rate history from this corpus. See `OPEN_ISSUES.md`. |
| `csg_excel_rates.json` | 18,981 rows | All workbook rows, all 12 plan tabs, both ages |

---

## 4. Fields that must NEVER appear on the site

- Anything sourced only to CSG while `publishable` is `false`
- `source.file` / `source.page` — disclosing CSG filenames identifies the vendor
- Any aggregate that merges NAIC codes sharing a brand name
- Any increase presented without its effective date
- Any *requested* (unapproved) filing presented as an increase
