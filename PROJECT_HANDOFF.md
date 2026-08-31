# Project Handoff — My Medigap Rate

**Handoff date:** 2026-08-30
**From:** Claude (Cowork session, ~92 ingest batches)
**To:** Claude Code, repo `scopeready/my-medigap-rate`

> Record of the data-ingest phase, kept as written. Two items in §6 have since
> been completed and are annotated inline; everything else stands.

---

## 1. What this session accomplished

### The data corpus (complete)

Built a national Medigap rate + market-data corpus from CSG Actuarial exports, ingested
in ~92 batches over the session, each batch parsed, validated, joined, and reconciled.

| Metric | Value |
|---|---|
| Carrier blocks (analytics layer) | **4,913** across 48 states |
| NAIC-resolved | 4,905 (99.8%) |
| Workbook rate rows | **18,981** across 49 plan-letter states × ages 65 & 70 |
| SERFF verification queue | **4,279** prioritized items |
| QA flags | 304 (+13 unmatched PDF blocks) |
| Licensed states fully complete | **12 of 15** |

**Complete licensed states** (all four scenarios — Plan G and N at ages 65 and 70, with
full Increase History / Market Data / Age Increases panels, plus workbooks):
AZ, CA, CO, FL, GA, NC, OH, SC, TN, TX, UT, WA.

### The ingest pipeline (complete, reusable)

Seven Python scripts that parse CSG PDFs positionally (pdfplumber, per-block panel
anchoring), parse CSG Excel workbooks (openpyxl), merge with content-diff and
snapshot-variance logging, reconcile PDF↔Excel on (state, plan, age, rate) + NAIC
name-similarity fallback, and regenerate the gap registers. Included in `data/csg/scripts/`.

### Verification of data integrity

The entire Excel layer was re-pulled from CSG and re-verified during the session —
roughly 120 workbook files across all states and both ages — with **zero variance** against
the stored snapshots. A partial PDF re-verification (batches 79–90) was likewise
content-identical. The corpus is confirmed stable as of 2026-08-26.

---

## 2. Key decisions made

### Business / positioning

- **Site purpose is lead generation for ECOS Medicare Solutions**, not a standalone data
  product. The data earns trust; the agency converts it.
- **Target audience is the "rate-shocked switcher"** — already on Medicare, premium jumped,
  searching for whether their carrier is the problem. This was a significant reframe: the
  original assumption was people turning 65, but head terms for that audience are owned by
  eight-figure competitors, and the long tail our data answers belongs to switchers. Switchers
  are also *better* leads: already educated, specifically motivated, clean plan-to-plan sale.
- **Domain: `mymedigaprate.com`** (this supersedes an extended earlier deliberation that had
  landed on MedigapRateGuide.com / MedigapRateExplorer.com — see §4).
- **Redirect strategy:** fresh domains pass ~zero SEO value. Their real jobs are offline
  recall (seminars, mailers), attribution (UTM-tagged redirects), and brand defense.
  Never build a second site on a redirect domain — doorway pages violate Google spam policy.

### Data governance

- **CSG data is licensed, agent-use-only, never published.** Established at project start and
  enforced throughout: every record carries `evidence_tier: "C"`, `publishable: false`.
- **Evidence tier system** (A1/A2/B/C) governs what may appear on the site.
- **Rate stability is block-level, not carrier-level** — the core intellectual claim of the
  site, proven repeatedly in the data (Ohio AARP 84549 vs 79413 is the cleanest example).
- **Missing ≠ zero; requested ≠ approved.**
- **MN/WI stored as base+rider composites**, never plan letters.
- **Never NY.**

### Technical decisions

- **One workbook per state per age suffices.** Proven across batches 59–62 and confirmed
  over 49 states: CSG's per-plan workbook exports at the same age/profile are byte-identical
  12-tab snapshots. This halved the remaining export work.
- **Panel guard enforced in code** (`merge_pdf.py`): a panel-less export may never overwrite
  a full-panel one. Added after a near-miss in batch 81 (see §5).
- **Anomaly filter**: monthly rate ≥ $1,500 or |increase| ≥ 100% is flagged as a probable
  vendor defect and excluded from the SERFF queue rather than silently trusted.

---

## 3. Root causes diagnosed

**The "panel-less export" mystery (solved).** For most of the session, exports from MT, NE,
NH, NJ, NM, NV, and MO (Plan N) consistently came back without the Increase History /
Market Data / Age Increases panels — across five separate sittings. Working hypotheses
progressed from "the Add-to-PDF toggle resets" → "Market Analytics isn't enabled for these
states on the account." **Darin's 51-Jurisdiction Progress Log settled it:** in those states
the quote had been *refreshed after the initial pull* (effective-date change, or Market
Analytics closed and reopened). After any such refresh, those panels stop rendering for the
remainder of the quote session and every export inherits the broken state. It was neither
the toggle nor the account.

**The fix recipe** (in `data/csg/recon/REDO_LIST.md`): start a completely fresh quote; set
ZIP, county, age, plan, gender, tobacco, *and effective date* before opening Market
Analytics; open it once and confirm all three panels render; export immediately with no
refresh in between. One clean sitting clears all 26 open redo items and completes NV and NM.

**Wisconsin and Massachusetts have no plan-letter data in CSG at all** — confirmed
definitively (workbooks structurally empty at both ages; PDFs return "No Results Found").
Both are waivered states. **Minnesota is exportable** via CSG's Minnesota-specific plan
labels (plan letters normalize away to MN_50% etc.).

---

## 4. Corrections Darin made / course changes

1. **"Track the panel-less PDFs too."** Darin asked for an explicit register of what was
   missing, not just what to re-export. This produced `MISSING_DATA.md` — a per-scenario
   inventory of exactly which analytics are absent and the three recovery paths for each
   (CSG re-export, SERFF filings, NAIC exhibits + state DOI portals). It became one of the
   more useful artifacts.
2. **"Keep a list of those that we need to redo."** Requested twice; produced the
   auto-maintained `REDO_LIST.md` / `reexport_queue.json` ledger that self-resolves when a
   good re-export arrives.
3. **The 51-Jurisdiction Progress Log.** Darin supplied his own tracking spreadsheet
   ("not sure if you need this") — it solved the panel mystery and supplied the ZIP/county
   provenance methodology.
4. **Reframed the site purpose to lead generation.** Mid-project, Darin clarified the site
   is a lead-gen engine for ECOS, not a data reference. This invalidated the initial domain
   shortlist (which was aimed at agents/researchers) and drove the audience rethink.
5. **Final domain choice: `mymedigaprate.com`.** Chosen by Darin after a three-round
   comparison between Claude and ChatGPT recommendations. Both AI shortlists
   (MedigapRateGuide / MedigapRateExplorer / MedigapPlanExplorer) are superseded.
   Treat `mymedigaprate.com` as settled and do not re-litigate.

---

## 5. Mistakes made during the session (and their fixes)

Recorded for transparency; all were caught and corrected.

- **Fabricated a NAIC code in a summary.** Early in the session an NAIC number was stated
  from memory rather than read from source. Caught during verification; corrected. Response:
  every headline figure thereafter was grep-verified against raw PDF text before being
  reported. **Retain this habit — verify before asserting.**
- **Overwrote NV's authoritative data in batch 81.** A panel-less NV re-pull replaced the
  good full-panel 8/24 group during an inline merge. Caught within the same batch, restored
  from the original source PDF (24 blocks / 23 histories re-verified), and the panel guard
  was then hard-coded into `merge_pdf.py` so it cannot recur.
- **Register mislabeled queue items.** Panel-less PDF entries displayed as "workbook exported
  empty" in `NEEDS_ATTENTION.md` because the matcher ignored file type. Fixed; NV's workbook
  was never the problem, its PDF was.
- **Overstated the SEO value of keyword domains.** Corrected after ChatGPT accurately cited
  Google's guidance that domain keywords have minimal ranking effect. The domain matters for
  click-through, human trust, and AI-citation naming — not ranking.

---

## 6. What remains unfinished

| # | Item | Status |
|---|---|---|
| 1 | **SERFF verification pass** — 4,279 queued items, 0 verified | Not started. This is the whole product. |
| 2 | ~~**Website** — no application code exists~~ | **Done.** 280 prerendered routes; see `OPEN_ISSUES.md` #2 |
| 3 | **NV / NM analytics recovery** — 26 re-exports | Recipe known, not executed |
| 4 | **MN data** — last licensed state with nothing | Export path identified, not executed |
| 5 | **Legacy site join** — `lib/rate-filings.ts`, `lib/premiums.ts`, `lib/tn-rate-actions.ts` | Modules now in the repo and gated; the TN TDCI / NV DOI **data** still needs re-gathering. See `OPEN_ISSUES.md` #3 |
| 6 | **CSG support ticket** — 6 items (1 UI bug, 4 data defects, 1 state-format question) | Drafted in `OPEN_ISSUES.md`, not sent |
| 7 | **7 unresolved NAIC codes** — Humana Achieve entities in NJ/SC | Indistinguishable in CSG; SERFF filings will resolve |

See `OPEN_ISSUES.md` for detail and decisions required.

---

## 7. Strongest verified findings (SERFF starting lineup)

Every figure below was grep-verified against raw source text during the session. All are
still **Tier C** and must be SERFF-confirmed before publication — but they are the highest-value
places to start, because each is both a strong consumer story and a single filing to confirm.

| State | Finding | Why it matters |
|---|---|---|
| TN | AARP portfolio-wide ~40% (G 39.9/39.4%, N 40.3/39.4%) eff 6/1/2026, at **100.41% state loss ratio** | Largest current AARP action found; the loss ratio explains it |
| AZ/ND/IA/SC | Humana Insurance Co 2024 wave: 73.5% / 72.0% / 56.0% / 51.0–53.8% | One carrier, four states, same window — multi-state story |
| OH | AARP 84549: 10.2→20.4→35.8% vs AARP 79413: 11.1→14.0→14.6% | The block-level thesis in one state |
| NC | AARP 30.9/30.3% vs 12.7/12.6% — same brand, same effective date | Split-brand proof |
| SC | Humana G 51.0% + N 53.8%, both eff 1/1/2024 | One filing, whole portfolio |
| UT/AZ | WMI Mutual 42.7% / 36.3%, both eff 1/1/2026 | Multi-state schedule family |
| IN | Healthspring G 42.7% + N 40.0%, both eff 4/1/2026 | Portfolio-wide April action |
| SD | Heartland 35.0% + 35.0% in consecutive Augusts | Sharpest two-year compounding found |
| AR | BCBS Arkansas Plan N 55.9% eff 1/1/2026 — pure in-state block (107,770 lives) | Whole book took it at once |
| GA | Medico 24.3% at 100.1% loss ratio | Loss ratio predicts the increase |
| CO | Omaha 30% + 25% stacked; Aflac 131.3% loss ratio | Stacking + distress signal |
| NV | GPM 50% at 113.7% loss ratio | Home-state headline |

---

## 8. Session provenance

- Quote profile: **Female / Non-tobacco, ages 65 and 70**, effective **2026-09-01**
- ZIP methodology: most-populous ZIP per state, U.S. Census-sourced with URLs and access
  dates (documented in `data/csg/ecos-csg/docs/CSG_51Jurisdiction_Progress_Log.xlsx`).
  This provenance is public-source and therefore citable on `/methodology`, unlike the
  vendor rate data itself.
- Corpus snapshot date: **2026-08-24 / 2026-09-01 effective**, re-verified 2026-08-26
- Recommended refresh cadence: quarterly (the pipeline re-verifies automatically)
