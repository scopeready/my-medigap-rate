# Data Inventory

Every dataset, spreadsheet, PDF, processed file, and external source used in this project —
where it came from, and **whether it is included in this handoff package**.

> Written during the data phase. Paths have since settled: the kit lives at
> `data/csg/ecos-csg/` (git-ignored), with `recon/`, `parsed/`, `scripts/` and `docs/`
> beneath it. Items completed since are annotated inline; §5's website entry is superseded.

Legend: ✅ included · ⚠️ partially included · ❌ not included (reason given) · 🔒 external source

---

## 1. Processed data — INCLUDED

Location in package: `data/csg/ecos-csg/`

| File | Records | Size | Origin | Included |
|---|---|---|---|---|
| `recon/reconciliation_layer.json` | 4,913 | 10 MB | Produced by `reconcile.py` — the joined PDF↔Excel layer. **The primary dataset.** | ✅ |
| `recon/serff_queue.json` | 4,279 | 1.4 MB | Produced by `reconcile.py` — verification worklist ordered licensed-states-first, then by largest filed increase. `rank` is a unique ordinal, not a tier; see `DATA_DICTIONARY.md`. | ✅ |
| `recon/findings.json` | 4,279 | 1.4 MB | Per-block findings feeding the queue | ✅ |
| `recon/qa_flags.json` | 304 + 13 | 90 KB | Anomalies, systematic flags, unmatched blocks | ✅ |
| `recon/missing_data.json` | 25 scenarios | 17 KB | Produced by `missing_data_report.py` — what analytics we lack + recovery paths | ✅ |
| `recon/needs_attention.json` | per-state | 9.6 KB | Produced by `gaps_report.py` | ✅ |
| `recon/reexport_queue.json` | 26 open | 12 KB | Auto-maintained redo ledger | ✅ |
| `recon/excel_only_rows.json` | 14,101 | 12 MB | Workbook rows with no matching PDF block (other plan letters, non-quoted carriers) | ✅ |
| `recon/excel_snapshot_variance.json` | — | 4.3 KB | Log of any figure that changed between CSG snapshots | ✅ |
| `recon/summary.json` | — | 1.2 KB | Headline metrics | ✅ |
| `parsed/csg_pdf_blocks.json` | 4,913 | 8 MB | Raw parsed PDF blocks, pre-join. Needed to re-run reconciliation. | ✅ |
| `parsed/csg_excel_rates.json` | 18,981 | 16 MB | All workbook rate rows, all 12 plan letters | ✅ |

**Human-readable registers** (`data/csg/ecos-csg/recon/`, all ✅): `SUMMARY.md`,
`NEEDS_ATTENTION.md`, `REDO_LIST.md`, `MISSING_DATA.md`, and `VERIFICATION_WORKSHEET.md`
(generated later by `npm run data:worksheet` — it collapses the 1,395 licensed queue items
into the 305 carrier lookups they actually represent).

> 🔒 **All of the above is CSG-derived and licensed agent-use-only.** It is git-ignored.
> Never publish, never serve, never cite. See `COMPLIANCE.md`.

---

## 2. Ingest pipeline — INCLUDED

Location: `data/csg/ecos-csg/scripts/` — 8 Python files (`track_empty_exports.py` joined the
seven below). All 8 confirmed present on 2026-08-31.

The Node scripts are a separate thing and live in the repository proper, under `scripts/`:
`verify-publishable.mjs` (the pre-deploy guard), `check-figures.mjs`, `data-status.mjs`,
`verification-worksheet.mjs` and `verify-record.mjs`. Those are versioned and committed;
the Python pipeline is not, because it names the vendor.

| Script | Purpose | Included |
|---|---|---|
| `parse_csg_pdf.py` | Positional PDF parser (pdfplumber). Per-block panel anchoring, windowed age-row parsing, left mini-column isolation for discounts/fees. | ✅ |
| `parse_csg_excel.py` | Workbook parser (openpyxl). Reads all 12 "Plan X Rates" tabs; filename regex drives state/plan/age/profile. | ✅ |
| `merge_pdf.py` | Guarded PDF merge. **Enforces: never merge panel-less over full-panel.** Content-diff: identical=skip, changed=replace, new=merge. | ✅ |
| `merge_excel.py` | Latest-snapshot-wins Excel merge with variance logging. | ✅ |
| `reconcile.py` | Joins PDF↔Excel on (state, plan, age, rounded rate) + NAIC name-similarity fallback. Applies the anomaly filter. Emits the layer, queue, findings, QA flags. | ✅ |
| `gaps_report.py` | Regenerates the per-state needs-attention register. | ✅ |
| `missing_data_report.py` | Regenerates the missing-analytics inventory with recovery paths. | ✅ |

⚠️ **Known issue:** scripts contain absolute paths (`/home/claude/ecos-csg/...`) from the
authoring environment. Update the `R = Path(...)` constant at the top of each before running.
Tracked as `OPEN_ISSUES.md` #6.

---

## 3. Reference documents — INCLUDED

| File | Origin | Included |
|---|---|---|
| `docs/CSG_51Jurisdiction_Progress_Log.xlsx` | **Darin's own tracking spreadsheet.** 204 scenario rows across 51 jurisdictions + ZIP-source methodology tab + summary tab. Solved the panel-less root cause and supplies quote provenance (most-populous ZIP per state, Census-sourced with URLs and access dates). | ✅ |
| `docs/ECOS_Missing_Data_Inventory.docx` | Word deliverable produced during the session: missing-data inventory, recovery paths, priority order. | ✅ |

> Note, corrected 2026-08-31: this previously warned that the progress log carried business
> contact details in its sheet header. A full scan of both Office documents — every XML part,
> not just the shared strings — found **no email addresses, no phone numbers and no name
> mentions**. The same scan across every JSON and Markdown file in the kit found no PII of
> any kind. No client PII exists anywhere in this project, and no personal data of Darin's
> is in the kit either.

---

## 4. Source files — NOT INCLUDED (size)

These live on Darin's machine at
`~/Downloads/CSG_Medigap_Market_Analytics_2026-09-01/`.

| Asset | Volume | Included | Reason |
|---|---|---|---|
| CSG Market Analytics PDFs — `PDF/Age-65_Plan-G/`, `PDF/Age-65_Plan-N/`, `PDF/Age-70_Plan-G/`, `PDF/Age-70_Plan-N/` | ~180 files, ~200 MB | ❌ | Size. Fully parsed into `parsed/csg_pdf_blocks.json` — nothing lost analytically. Retain as the audit trail. |
| CSG rate workbooks — `Excel/` | ~100 files, ~140 MB | ❌ | Size. Fully parsed into `parsed/csg_excel_rates.json`. |
| `Reconciliation/ecos-csg-reconciliation.zip` | ~5 MB | ❌ | Superseded — its contents are unpacked into `data/csg/` in this package. |

**If the raw sources are ever needed** (e.g. to re-verify a disputed figure), they are on
Darin's machine at the path above, organized by scenario folder with canonical filenames of
the form `CSG_{ST}_{StateName}_Plan-{G|N}_Age-{65|70}_Female_NonTobacco_2026-09-01.pdf`.

---

## 5. Missing / inaccessible — EXPLICITLY LISTED

| Item | Status | Impact |
|---|---|---|
| **`ecos-medigap-site.zip`** — the legacy Next.js site | ⚠️ **Superseded.** `lib/rate-filings.ts`, `lib/premiums.ts` and `lib/tn-rate-actions.ts` now exist in the repository and are gated. What was never recovered is the **regulator data** they were built to surface. | The **TN TDCI rate-action list** and **NV DOI annual premium survey** (2020-2024 trend) still need re-gathering from the source portals. Both are Tier A material needing no new filing work, so they remain the fastest route to a first publishable page. `OPEN_ISSUES.md` #3. |
| **Website source code, images, logos, structured data** | ✅ **Now exists.** Built after this inventory was written: 200 prerendered routes, evidence gating, JSON-LD (`InsuranceAgency`, `WebSite`, `WebPage`, `Article`, `FAQPage`), a placeholder logo and favicon, and a generated OG image. | No longer a gap. `Dataset` JSON-LD and a `/sources` page remain — see `CONTENT_MAP.md`. |
| **MN data** | ❌ Not exported. CSG normalizes plan letters away for Minnesota. | Last licensed state with zero coverage. Export path known (MN-specific plan labels). |
| **WI / MA data** | ❌ Does not exist in CSG in any format. Confirmed: workbooks structurally empty both ages, PDFs return "No Results Found." | Waivered states. Not licensed states, so low priority. |
| **Analytics panels for NV (3 of 4 scenarios), NM (all 4), MT, NE, NH, NJ, MO(N)** | ⚠️ Rates present, analytics absent — 25 state-scenarios / 634 blocks are rates-only. | Detailed per-scenario in `data/csg/recon/missing_data.json` and `MISSING_DATA.md`, each with three recovery paths. |
| **Male / tobacco / other-age rate profiles** | ❌ Deliberately not collected. | Increase *history* is identical per block regardless of profile, so these would add premium figures only. Collect only if the site adds those views. |

---

## 6. External sources referenced (not files)

| Source | Use | Access |
|---|---|---|
| **SERFF Filing Access** (per state) | 🔒 The authoritative source for rate-filing confirmation. Every one of the 4,279 queue items points here. | Public, per-state portals |
| **NAIC Medicare Supplement Experience Exhibit** | 🔒 Annual lives / premium / loss ratio by carrier by state. The independent replacement for missing CSG Market Data panels. | Public |
| State DOI portals | 🔒 MT CSI, NE DOI, NH NHID, NJ DOBI, NM OSI, NV DOI, MO DIFP — listed per-state in `missing_data.json` | Public |
| NV DOI annual Medigap premium survey | 🔒 Site previously held 2020–2024 trend; 2025/2026 not pulled | Public |
| TN TDCI rate-action list | 🔒 Referenced in the legacy site; needs refresh | Public |
| U.S. Census ZIP/county relationship files | 🔒 Provenance for quote ZIP selection; URLs recorded in the progress log | Public |

---

## 7. Verification of completeness

The Excel layer was fully re-pulled from CSG and re-verified during the session —
approximately 120 workbook files spanning all 49 plan-letter states at both ages —
with **zero variance** against stored snapshots. Batches 79–90 additionally re-verified a
large share of the PDF layer as content-identical. Nothing previously provided has been
silently dropped: every dataset supplied during the session is either included above or
explicitly listed as missing in §5.
