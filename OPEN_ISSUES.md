# Open Issues

Everything missing, uncertain, unverified, or requiring Darin's decision.

**Priority key:** 🔴 blocks launch · 🟡 blocks a feature · 🟢 improvement

> This register came out of the data-ingest phase, before the site was built.
> Items resolved since then are struck through and annotated **RESOLVED**
> rather than deleted, so the history stays readable. Last reconciled against
> the repository on 2026-08-31.

---

## 🔴 1. Nothing is publishable yet — the SERFF pass hasn't started

**Status:** 0 of 4,913 records verified. All are `evidence_tier: "C"`, `publishable: false`.
Confirmed against the kit on 2026-08-30 — `npm run verify:publishable` reports `C=4913`,
zero publishable. The verification worklist is 4,279 items, of which **1,395 are in
licensed states**; `npm run data:status` prints the next ones by rank.

The entire dataset is vendor data used for discovery. Under the licensing rules
(`COMPLIANCE.md` §4) none of it may be published until independently confirmed in SERFF,
a state DOI record, or an NAIC exhibit.

**This is the gating item for the whole site.** Everything else can proceed in parallel, but
no data page can launch until verification begins.

**Decision needed from Darin:** who does the verification work, and at what pace? Options:
(a) Darin works the queue personally, rank 1 first; (b) it's delegated; (c) Claude Code
drives it semi-automatically where SERFF permits programmatic search. A realistic first
milestone is ~20 verified blocks covering the strongest findings in 3–4 licensed states —
enough to launch a credible first set of pages.

---

## ~~🔴 2. No website exists~~ — RESOLVED

The site was built after this register was written. The repository now holds a Next.js 16
App Router application that prerenders **200 static routes**, 195 of them in the sitemap:
the home page, the state index, 51 state pages, 102 state x plan pages, 12 plan explainers,
five explainer pages, `/turning-65` and its 15 licensed-state pages, `/rate-review`,
`/thank-you`, and the methodology, about, contact, privacy and terms pages. Evidence gating
(`lib/evidence.ts`), the figure component (`components/Figure.tsx`) and the site footer's
compliance block are all in place.

The remaining decisions below are still open:
- Visual identity — a placeholder logo ships (`components/Logo.tsx`, a three-bar filing
  ledger in `#0f4c81`, matching `public/favicon.svg`) along with a full token set in
  `app/globals.css`. No commissioned mark, no photography. (Audience is 65+; legibility
  outranks style. See `COMPLIANCE.md` §7 — the WCAG audit has still not been run.)
- CMS or file-based content for the educational pages? They are file-based today.
- Lead form destination — Web3Forms is wired and tested on both forms. Email only, or a CRM
  as well? Which CRM?
- Analytics platform.

---

## 🟡 3. Legacy regulator data — modules present, data not yet loaded

`lib/rate-filings.ts`, `lib/premiums.ts` and `lib/tn-rate-actions.ts` **are now in the
repository**, so the "blocked on `ecos-medigap-site.zip`" note in `reconcile.py` and in
`ECOS_Missing_Data_Inventory.docx` is stale. All three read through `recordsFor()` and gate
every figure, and `lib/tn-rate-actions.ts` is the reference per-state adapter.

What has *not* been recovered is the regulator data those modules were meant to surface:
the **TN TDCI approved rate-action list** and the **NV DOI annual premium survey**
(2020-2024 trend). Those are Tier A material that needs no SERFF work, so they remain the
fastest route to a first publishable page.

**Decision needed:** re-gather TN TDCI and NV DOI from the source portals, or is an archive
of the earlier site still available?

---

## 🟡 4. Licensed-state data gaps

| State | Gap | Path |
|---|---|---|
| **NV** | Analytics panels present on only 1 of 4 scenarios (G-65 from the 8/24 book). Rates complete. | Fresh-quote recipe — `data/csg/ecos-csg/recon/REDO_LIST.md` |
| **NM** | No analytics on any scenario. Rates complete. | Same recipe |
| **MN** | **No data at all.** CSG normalizes plan letters away — Minnesota is a waivered state. | Export CSG's Minnesota-specific plan labels (MN Basic / Extended Basic / MN_50% etc.); store as base+rider composite |

26 open re-export items total, all traceable to the quote-refresh bug (`PROJECT_HANDOFF.md` §3).
One focused CSG sitting with the correct procedure clears NV and NM.

**Decision needed:** when will Darin run the re-export sitting?

---

## 🟡 5. Seven unresolved NAIC codes

"Humana Achieve (Humana Benefit Plan of Illinois)" rows in NJ and SC could not be resolved
to a single NAIC — the entities show identical rates in CSG's own workbooks, making them
genuinely indistinguishable in the source.

**Resolution:** the SERFF filing names the legal entity. These resolve as a byproduct of
verification. **No action needed now** — do not guess.

---

## 🟡 6. Pipeline scripts contain absolute paths

Every script in `data/csg/ecos-csg/scripts/` hardcodes `/home/claude/ecos-csg/...` from the
authoring environment. They will fail elsewhere until the `R = Path(...)` constant at the top
of each is updated to the local kit path.

`reconcile.py` is the exception: it takes its input and output paths as arguments to `main()`,
so it runs unmodified. It has been re-run against the shipped `parsed/` inputs and reproduces
`reconciliation_layer.json`, `serff_queue.json`, `findings.json`, `qa_flags.json` and
`excel_only_rows.json` byte for byte.

**Fix:** parameterize via an env var (e.g. `CSG_DATA_ROOT`) with a sane default. ~15 minutes.
Only needed when new CSG exports arrive.

---

## ~~🟡 7. `verify:publishable` script does not exist~~ — RESOLVED

`scripts/verify-publishable.mjs` now exists and is wired into `package.json`. Its checks
mirror `gate()` in `lib/evidence.ts` exactly — tier, verification status, the `publishable`
flag, and a citation carrying a filing number, an `http(s)` URL and a regulator — so it
cannot report success on a record the site would refuse to render. It exits non-zero and
names the offending block keys on any violation, and exits 0 with the path it checked when
the kit is absent, which is the CI and Vercel condition.

**Still open (the original #7 ambition):** it validates the data layer, not the built
routes. Statically scanning `.next/` output for figures that reached a page would be
strictly stronger. Worth doing before the first data page ships.

---

## 🟡 8. CSG support ticket — written, not sent

**Drafted in full at `data/csg/ecos-csg/docs/CSG_SUPPORT_TICKET.md`** (git-ignored — it
quotes carrier names, NAIC codes and premiums from the vendor exports). Every figure in it
was checked back against the corpus before it was written.

Seven items, not the six listed here previously. A cross-check while drafting turned up an
eighth anomaly that had not been recorded: **Vermont BCBS (NAIC 53295) shows 189.8% on Plan
N effective 2025-01-01, where Plan G for the same carrier and the same date shows 30.4%** —
and the Plan N series carries two history rows where Plan G carries six.

Ordered by what it costs rather than by how easy each looks:

1. **The refresh defect.** 26 exports, 634 carrier blocks with rates but no analytics,
   **166 of them in licensed states** — New Mexico entirely, Nevada on three of four
   scenarios. The ticket includes the reproduction steps and how it was ruled out as a
   toggle or account problem.
2. **NM Plan-N age-65 workbook exports empty**, reproduced in two independent sittings.
3. **NC Medico Corp Life** — premium roughly 21× too high. The ticket carries a diagnostic
   worth handing them: the reported increase and the reported premium are consistent with
   each other, implying prior premiums of $121–$143, so this looks like one inflated
   current-premium value producing both symptoms rather than two separate errors.
4. **VT BCBS 189.8%** — the new item above.
5. **IA United of Omaha 107.6%**, with the same carrier's Plan N series in that state
   completely empty — possibly an incomplete series rather than a wrong figure.
6. **Lumos AM Best rating and outlook transposed** — 100 occurrences across 25 states,
   consistent everywhere, so likely one mapping error.
7. **OK Farm Bureau 100.0%** — deliberately framed as *please confirm*, not as a defect.
   Its own Plan N shows 29.9% on the same date and its other five states look ordinary
   (SD 45.4%, TX 19.1%, KS 12.0%, MI 4.5%, IN 20.0%). If it is real it is a significant
   consumer story and we would publish it.

**Decision needed:** send it. Items 1 and 2 are defects in a paid tool, and item 1 is the
only thing standing between us and usable analytics for New Mexico and Nevada.

---

## 🟢 9. Domain portfolio not finalized

`mymedigaprate.com` is settled as production. Whether to buy redirect domains for offline
attribution (seminars, mailers, business cards) is open.

Prior analysis: fresh domains pass ~zero SEO value; their genuine uses are spoken/printed
recall, UTM-tagged attribution, and brand defense. If bought, configure per
`DEPLOYMENT.md` §3, and never build a separate site on one.

**Decision needed:** buy any? Which?

---

## 🟢 10. Data profile depth

Current corpus: **Female / Non-tobacco, ages 65 and 70.** Male and tobacco rates exist in CSG
but were deliberately not collected — increase *history* is identical per block, so they add
premium figures only.

**Decision needed:** does the site need gender/tobacco-specific pricing? If it shows a
representative premium alongside verified rate history, the current profile suffices and
this is deliberate scope discipline rather than a gap.

---

## 🟢 11. Refresh cadence not established

Corpus snapshot: quote effective **2026-09-01**, verified stable **2026-08-26**. The pipeline
re-verifies automatically and content-diffs re-sends, so refreshes are cheap.

**Recommendation:** quarterly. **Decision needed:** confirm, and decide who runs it.

---

## 🟢 12. WI, MA, and other non-plan-letter states

Wisconsin and Massachusetts have **no plan-letter data in CSG in any format** — confirmed
(workbooks structurally empty at both ages; PDFs return "No Results Found"). Both are
waivered states with their own plan structures. Neither is a licensed state.

**Decision needed:** informational pages for these states, or exclude entirely? Excluding is
defensible; a short "Wisconsin works differently" explainer would capture some search traffic
without requiring data.

---

## 🔴 13. The documented verification shape does not pass the gate

Added 2026-08-30, reconciling `DATA_DICTIONARY.md` and the data-phase `CLAUDE.md`
against `lib/evidence.ts`.

Three governance fields use different vocabularies in the handoff documentation and in
the code that enforces them. A record updated exactly as the old documentation instructs
is **silently degraded and withheld** — no error, no warning, nothing on the page:

| Written as documented | Loader normalises to | Result |
|---|---|---|
| `evidence_tier: "A1"` | `"C"` | unrecognised tier fails closed |
| `verification_status: "verified"` | `"unverified"` | not in the allowed set |
| `source_citation: { filing_id, type, state, retrieved }` | `null` | no `regulator`; `filingNumber` missing |

Tested end to end against the kit: the record comes back Tier C, unverified, citation
null, and `gate()` returns `WITHHELD (tier_c)`.

This matters because the verification pass is the product. Working the queue and
recording results in the documented shape would produce **zero visible change** and give
no indication anything was wrong.

**Resolved for the writing side:** `DATA_DICTIONARY.md` §2 now documents the shape the
gate actually enforces, with a worked example, and `npm run verify:publishable` fails
loudly on a mis-shaped record rather than letting it render as withheld.

**Still open — tier granularity.** The old scheme distinguished `A1` (primary regulator
document) from `A2` (official regulator dataset such as an NAIC experience exhibit). The
site has a single `A`. Loss ratios come from NAIC exhibits, not from filings, so the
distinction is worth having. Restoring it means widening `EvidenceTier` in
`lib/evidence.ts`, the normaliser in `lib/csg-data.ts`, and
`scripts/verify-publishable.mjs` together.

**Decision needed:** keep the single `A`, or restore `A1`/`A2`?

---

## ~~🟡 14. `ROUTED_PLANS` routes two plans the data cannot fill~~ — RESOLVED

`lib/plans.ts` routed Plan G, Plan N, High-Deductible G and Plan F — 4 x 51 = 204
state x plan pages. Two independent sources said it should be two plans, not four:

- **The data.** The analytics layer covers **G and N only**. Plan F and HDG have premiums
  in all 48 states (3,260 and 1,760 workbook rows) and **no rate-increase history
  anywhere**. No amount of filing verification changes that; the profile was never
  collected. So 102 of the 204 pages cannot show a rate history, which is the entire
  purpose of the page type.
- **The content plan.** `CONTENT_MAP.md` §1 specifies "~96 routes (48 states x Plan G,
  Plan N)". Plan F and HDG were never in it.

Plan F is also closed to anyone first eligible on or after 2020-01-01, so its audience is
shrinking by definition — and the site's audience is switchers, who are mostly on G.

**Resolved: `plan-f` and `high-deductible-plan-g` were removed from `ROUTED_ORDER`.**
`ROUTED_ORDER` is now `["plan-g", "plan-n"]`. Both plans keep their national explainer pages
under `/medigap-plans/[plan]`, so no content was lost, and the sitemap regenerated itself.
The route count went from 280 to 200 and the state x plan pages from 204 to 102. The plan,
the data and the site now agree.

One follow-up was needed and has been made: `public/llms.txt` still advertised per-state
routes for Plan F and High-Deductible G after the change, which pointed AI crawlers at URLs
that returned 404. It now names Plan G and Plan N only. **When `ROUTED_ORDER` changes, check
`public/llms.txt` — it is the one place the route set is written out by hand rather than
derived.**

---

## Summary of decisions needed from Darin

| # | Decision |
|---|---|
| 1 | Who performs SERFF verification, and at what pace? |
| 2 | CRM and lead-form destination; analytics platform |
| 3 | Re-gather TN TDCI and NV DOI data, or recover an archive of the earlier site? |
| 4 | When to run the NV/NM/MN CSG re-export sitting |
| 8 | Send the CSG support ticket? It is written and fact-checked; items 1 and 2 block NM and NV. |
| 9 | Buy redirect domains? |
| 10 | Are male/tobacco rate profiles needed? |
| 11 | Confirm quarterly refresh cadence and owner |
| 12 | WI/MA — informational pages or exclude? |
| 13 | Evidence tiers — keep a single `A`, or restore the `A1`/`A2` distinction? |
