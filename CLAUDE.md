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
- **Never rank carriers on rate stability.** Rate actions apply to a block of
  policies in one state, not to a company. "Carrier X raises rates a lot" is
  almost always wrong somewhere. Point at the NAIC for company-level questions.
- **Never invent or "update" a dollar figure.** Part B premiums, deductibles and
  plan out-of-pocket limits change annually and are not hard-coded anywhere in
  this repo on purpose. Editorial copy describes them in words. Only introduce a
  specific figure when the user supplies a verified, dated source, and cite it.
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
    [state]/[plan]/page.tsx                    state x plan template (204 pages)
  medigap-plans/page.tsx, [plan]/page.tsx      plan explainers (12 pages)
  methodology/, about/, contact/, privacy/, terms/
  sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
components/                                    Figure, EvidenceNote, header, footer, …
lib/
  evidence.ts        the gate. Start here.
  csg-data.ts        build-time loader for the git-ignored kit
  rate-filings.ts    filed rate actions, already gated
  premiums.ts        premiums and published bands, already gated
  tn-rate-actions.ts Tennessee adapter (reference for per-state adapters)
  states.ts          51 states, switching rules, licensing
  plans.ts           plans A-N; ROUTED_PLANS drives the state x plan routes
  site.ts            identity, contact, disclaimers
  format.ts          the only place a value is turned into display text
scripts/data-status.mjs                        local verification-progress report
data/csg/                                      git-ignored. Licensed. Never commit.
```

Route count comes from `STATES.length * ROUTED_PLANS.length`. Adding a state or a
routed plan regenerates the sitemap automatically — no file needs hand-editing.

## Working with the data

The reconciliation kit is not in this repo and is not on Vercel. Unzip it to
`data/csg/ecos-csg/` locally; `lib/csg-data.ts` reads
`recon/reconciliation_layer.json` and `recon/serff_queue.json` at build time and
returns nothing when they are absent. **The build must never fail because the
data is missing** — that is the production condition.

```bash
npm run data:status        # counts, tier breakdown, next queue items by rank
npm run data:status -- NV  # scoped to one state
```

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
  in the footer as the official, no-commission alternatives. Keep them.
- Any contact form must carry the permission-to-contact checkbox and its
  wording. It is required, not decorative.
- The commission conflict is disclosed plainly on `/about`. Keep it plain.

## Commands

```bash
npm run dev                # local dev server
npm run build              # production build — must be warning-free
npm run typecheck          # tsc --noEmit
npm run verify:publishable # pre-deploy evidence guard
npm start                  # serve the production build
```

Before pushing: `npm run typecheck && npm run build && npm run verify:publishable`,
and confirm the build ends with no Turbopack warnings.

## Secrets

There are none, and there should be none. The site requires zero environment
variables. Everything in `.env.example` is optional and public-by-design
(`NEXT_PUBLIC_*` values are visible in the browser). Never put a private API key
in this repo or in a `NEXT_PUBLIC_` variable.
