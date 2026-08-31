# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What this is

`MyMedigapRate.com` — a Medicare Supplement (Medigap) rate-research site. It
publishes what carriers filed with state insurance regulators: premiums, filed
rate actions, and the plan mechanics that make those numbers mean something.

It is **its own site**, operated by ECOS Medicare Solutions (Darin Weidauer,
NPN 18580338). It shares no code, assets, content, data or deployment with any
other repository in this organization. Do not copy from, link build steps to,
or deploy anything from another project into this one.

- Stack: Next.js 16 (App Router) + React 19 + TypeScript. No CSS framework, no
  UI library, no fonts fetched at build time — one hand-written stylesheet in
  `app/globals.css`.
- Hosting: Vercel, auto-deploying from GitHub. Zero required environment
  variables; every route is statically prerendered.

## Who the visitor is

Not primarily people turning 65. The organic audience is the **rate-shocked
switcher** — already on Medicare, premium just jumped, searching "why did my
Plan G premium go up" or "most stable Medigap company in Texas." They already
know the word Medigap. Write for them. Head terms are owned by eight-figure
budgets and are not winnable; the long tail this data uniquely answers is.

## Known vendor-data defects — never render these as real

| Item | Detail |
|---|---|
| NC Medico Corp Life | "2079.9%" (Plan G) / "2058.3%" (Plan N) — garbled feed values |
| IA United of Omaha | "107.6%" at both ages — likely feed defect |
| Lumos | AM Best rating and outlook swapped in every state (normalised on ingest, flag kept) |
| OK Farm Bureau | "100.0%" — **may be genuine** (small 3,747-life block). Verify with OK DOI before dismissing. |

The reconciler's anomaly filter (monthly rate ≥ $1,500, or any increase ≥ 100%)
keeps these out of the verification queue; they stay in `qa_flags.json`.

## The rule that outranks everything else

**No figure is published without a citation to a public rate filing.**

Every premium and every rate change goes through `gate()` in `lib/evidence.ts`,
which fails closed. It publishes a value only when all of these hold:

1. `evidence_tier` is `A` or `B` — never `C`
2. `verification_status === "filing_confirmed"`
3. `publishable === true`
4. `source_citation` carries a filing number, an `http(s)` URL and a regulator

If any check fails, the page renders *why the figure is withheld*, never a
placeholder number, never a dash, never an estimate.

Corollaries, all non-negotiable:

- **Tier C is never publishable.** Tier C is the ingestion tier: records seeded
  from a licensed vendor export. That export is research scaffolding — it tells
  us which filing to go read. It is never a source, never cited, and the vendor
  is **never named on a public page**.
- **Never republish licensed data.** The reconciliation kit lives at
  `data/csg/` and is git-ignored. Never commit it, never move it under
  `public/`, never expose it through a route handler or an API.
- **State switching rules come from `lib/switching-rules.ts`, never from a
  category label.** Each state's rule is recorded as its own regulator states
  it, with a citation, because the label hides what decides whether somebody can
  actually move: Illinois caps its birthday rule at ages 65-75 and confines it
  to the existing insurer; Nevada's reaches only carriers with open blocks;
  Maine's is one insurer-chosen month for Plan A, not year-round guaranteed
  issue. A state with no `source` renders as unverified and says so.
- **Never rank carriers on rate stability.** Rate actions apply to a block of
  policies in one state, not to a company. "Carrier X raises rates a lot" is
  almost always wrong somewhere. Point at the NAIC for company-level questions.
- **Official Medicare amounts live in one file, and only there.** Part B
  premiums and deductibles and the Part A hospital deductible are published, on
  purpose — a Medigap page that will not state the Part B deductible cannot
  explain Plan G. They live in `lib/medicare-figures.ts`, keyed by year, each
  year carrying the CMS fact sheet it came from and the date it was read. Render
  them through `components/MedicareCosts.tsx`, never inline, and never write one
  into prose. `npm run check:figures` fails the build once the published year
  falls behind the calendar year; CMS announces the next year each November.
  Every *other* dollar figure still obeys the rule above: no number without a
  citation. Carrier premiums come only through `gate()`.
- **Never build a second site on a redirect domain.** Redirects point here.
  Doorway sites violate Google's spam policy.

If you add a component that displays a number, route it through
`components/Figure.tsx`. Do not format a raw value inline.

## Layout

```
app/
  layout.tsx                                   header, footer, JSON-LD, optional GA
  page.tsx                                     home
  medigap-rate-history/
    page.tsx                                   state index
    [state]/page.tsx                           state overview (51 pages)
    [state]/[plan]/page.tsx                    state x plan template (102 pages)
  medigap-plans/page.tsx, [plan]/page.tsx      plan explainers (12 pages)
  turning-65/page.tsx, [state]/page.tsx        enrollment timing (15 licensed states)
  why-did-my-medigap-premium-increase/         the highest-intent page on the site
  how-medigap-rates-work/, what-is-a-closed-block/
  medigap-loss-ratios-explained/, switching-medigap-plans/
  rate-review/page.tsx                         the lead form
  thank-you/page.tsx                           post-submission, noindex
  methodology/, about/, contact/, privacy/, terms/
  sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
components/                                    Figure, EvidenceNote, Cite, MedicareCosts,
                                               RateReviewForm, header, footer, …
lib/
  evidence.ts        the gate. Start here.
  csg-data.ts        build-time loader for the git-ignored kit
  rate-filings.ts    filed rate actions, already gated
  premiums.ts        premiums and published bands, already gated
  tn-rate-actions.ts Tennessee adapter (reference for per-state adapters)
  states.ts          51 states, licensing, and the switching-rule shape
  switching-rules.ts per-state switching rights, each cited to its regulator
  sources.ts         federal sources cited by the editorial pages
  medicare-figures.ts official Medicare amounts by year, with CMS citations
  plans.ts           plans A-N; ROUTED_PLANS drives the state x plan routes
  site.ts            identity, contact, disclaimers
  format.ts          the only place a value is turned into display text
scripts/data-status.mjs                        local verification-progress report
scripts/verification-worksheet.mjs             the worklist, grouped by carrier
scripts/verify-record.mjs                      records a verification safely
scripts/verify-publishable.mjs                 pre-deploy guard; mirrors gate()
scripts/check-figures.mjs                      fails the build on stale Medicare amounts
data/csg/                                      git-ignored. Licensed. Never commit.
```

Route count comes from `STATES.length * ROUTED_PLANS.length`. Adding a state or a
routed plan regenerates the sitemap, the internal links and the route set automatically.

**One file is the exception: `public/llms.txt`.** It names the routed plans and the licensed
states in prose, by hand, because it is written for AI crawlers rather than generated. It
has already gone stale once — it advertised per-state pages for Plan F and High-Deductible G
after both were dropped from `ROUTED_ORDER`, pointing crawlers at 404s. **Whenever
`ROUTED_ORDER` or a state's `licensed` flag changes, update `public/llms.txt` in the same
commit.**

## Working with the data

The reconciliation kit is not in this repo and is not on Vercel. Unzip it to
`data/csg/ecos-csg/` locally; `lib/csg-data.ts` reads
`recon/reconciliation_layer.json` and `recon/serff_queue.json` at build time and
returns nothing when they are absent. **The build must never fail because the
data is missing** — that is the production condition.

```bash
npm run data:status         # counts, tier breakdown, next queue items by rank
npm run data:status -- NV   # scoped to one state
npm run data:worksheet      # the verification worklist, grouped by carrier
npm run data:worksheet -- NV --top 25
npm run data:verify -- --state AZ --naic 73288 --tier A \
  --filing "TRACKING-NUMBER" --url "https://…" \
  --regulator "Arizona Department of Insurance and Financial Institutions"
```

**Never hand-edit the layer to record a verification.** `scripts/verify-record.mjs`
writes all four governance fields together and validates the citation against the
same rules `gate()` applies, so a mis-shaped verification fails at the command
line rather than silently rendering as withheld on a page that looks finished.
Add `--dry-run` to see which blocks a lookup would clear before writing, and
`--revoke` to withdraw one.

The queue lists an item per scenario — plan letter crossed with age — but a
filing search is per carrier per state, and one Medigap filing generally covers a
carrier's whole portfolio there. So the 1,395 licensed items are really **305
carrier lookups**. `npm run data:worksheet` does that collapsing and orders the
result by the size of the filed increase.

Do not hand-edit the JSON. The verification workflow is: work the queue from the
lowest rank, find the filing, then update that record's `evidence_tier`,
`verification_status`, `publishable` and `source_citation` together. Those four
move as a unit; changing `publishable` alone does nothing because the gate checks
all four.

`rank` is a unique ordinal over the whole queue, not a priority tier — the
reconciler sorts licensed states first, then by largest filed increase, and
numbers the result. So "work rank 1 first" means the lowest ranks, not the rows
whose rank equals 1. Of 4,279 items, 1,395 are in licensed states.

`lib/csg-data.ts` normalizes defensively and defaults everything it does not
recognize to Tier C / not publishable. Keep it that way. Also keep its filesystem
path statically rooted — a variable directory makes the bundler trace the whole
project into the server output.

## Compliance

This is a Medicare marketing site subject to CMS/TPMO rules.

- The TPMO disclaimer and the "not connected with or endorsed by the United
  States government or the federal Medicare program" wording appear in the
  footer of every page via `components/SiteFooter.tsx`. Do not weaken or remove
  them, and do not move them behind a click.
- 1-800-MEDICARE, Medicare.gov and the free SHIP counseling program are linked
  in the footer as the official, independent alternatives. Keep them.
- Any contact form must carry the permission-to-contact checkbox and its
  wording. It is required, not decorative. Both forms — `/rate-review` and
  `/contact` — post to Web3Forms and carry the government non-affiliation
  notice adjacent to the form, not only in the footer.
- **`/rate-review` must never accept a lead from a state we are not licensed
  in.** Choosing one removes the contact fields and the consent checkbox
  outright, so there is no submit path. That is browser-side behaviour in
  `components/RateReviewForm.tsx`; re-test it after changing that component.
  Unlicensed states are offered a **contracted-agent introduction by phone**
  instead — the agency works with agents licensed elsewhere — but the form
  stays closed, because the agent licensed in that state should be the one
  who takes the reader's details. Offering the introduction is not the same
  as capturing the lead here, and the distinction is the compliance line.
- **New York is excluded even from the introduction.** `NO_REFERRAL_ABBRS` in
  `lib/site.ts` holds it, and a New York reader is pointed at SHIP and nothing
  else. Never NY: no NY landing pages, no NY lead capture, no NY hand-off.
- **No form on this site asks a health question.** No condition, medication or
  diagnosis field, and the free-text box tells the reader to leave them out.
  Collecting any of it would pull the site into HIPAA and state privacy scope.
- The commission conflict is disclosed plainly on `/about` and in the footer.
  Keep it plain — and always keep it next to `COMPENSATION_NOTE` in
  `lib/site.ts`. Disclosing the commission on its own reads as "using an agent
  costs money", which is false: Medigap commission is paid out of the carrier's
  filed rate, so the buyer pays the same premium direct, through us, or through
  anyone else. Say both, or the disclosure misinforms.
- SHIP is described as federally funded rather than carrier-funded. Do not
  describe it as "the no-commission option" — that implies we are the option
  that costs money.

## Commands

```bash
npm run dev                # local dev server
npm run build              # production build — must be warning-free
npm run typecheck          # tsc --noEmit
npm run check:figures      # fails if the Medicare amounts are a year behind
npm run verify:publishable # figures check + pre-deploy evidence guard
npm start                  # serve the production build
```

Before pushing: `npm run typecheck && npm run build && npm run verify:publishable`,
and confirm the build ends with no Turbopack warnings.

## Secrets

There are none, and there should be none. The site requires zero environment
variables. Everything in `.env.example` is optional and public-by-design
(`NEXT_PUBLIC_*` values are visible in the browser). Never put a private API key
in this repo or in a `NEXT_PUBLIC_` variable.

The Web3Forms access key is public by design — it is submitted from the browser
and appears in the page source of every form that uses it — so it is not a
secret and does not need protecting. **It is committed as the default in
`lib/site.ts`, and both forms work with no environment variable set.**

That is deliberate, and it was learned the hard way. A `NEXT_PUBLIC_*` variable
is read at build time, so the first production deploy — which ran before the
variable was set in Vercel — shipped a lead form with no submit button, no
error, and nothing in any log. On a lead-generation site that failure is silent
and costs money, and the indirection was protecting nothing.

`NEXT_PUBLIC_WEB3FORMS_KEY` still overrides the default, so rotating the key
needs no commit. A blank or whitespace-only value falls back rather than
switching the forms off.

The no-key fallbacks remain in both components as a safety net for anyone who
removes the default: `/contact` renders no form and shows the phone number and
email instead, and `/rate-review` renders the whole form — state gating included
— with its submit button replaced by a note to call or email. Neither page ever
accepts input it would silently discard.
