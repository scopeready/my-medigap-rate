# MyMedigapRate.com

Medicare Supplement (Medigap) rate research: what carriers filed with state
insurance regulators, published only when the filing can be cited.

Live at **https://www.mymedigaprate.com** (Vercel, auto-deploying from `main`).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 20.9 or newer. No environment variables are required — the site builds and
deploys with none set.

## What it builds

280 statically prerendered routes:

| Route | Count |
| --- | --- |
| `/medigap-rate-history/{state}/{plan}` | 204 (51 states × 4 plans) |
| `/medigap-rate-history/{state}` | 51 |
| `/medigap-plans/{plan}` | 12 |
| Home, indexes, methodology, about, contact, privacy, terms, 404 | 10 |
| `sitemap.xml`, `robots.txt`, OG image | 3 |

Route sets are derived from `lib/states.ts` and `lib/plans.ts`. Add a state or a
routed plan and the pages, the sitemap and the internal links all follow.

## The editorial rule

A premium or rate change appears on the site only when it has been matched to a
public rate filing, that filing is linked on the page, and a reviewer has marked
the record publishable. Everything else renders as withheld, with the reason
shown.

This is enforced in code. `lib/evidence.ts` exports `gate()`, which fails closed;
`components/Figure.tsx` is the only path a number takes to the page. See
[`/methodology`](https://www.mymedigaprate.com/methodology) for the public
version and `CLAUDE.md` for the full rule set.

## Data

The research database is **not in this repository**. It is licensed vendor data
used to decide which filings to go read, and it is never published or cited.

Unzip the reconciliation kit to `data/csg/ecos-csg/` locally — that path is
git-ignored. `lib/csg-data.ts` reads it at build time and returns nothing when it
is absent, which is the production condition: on Vercel the kit is not present,
so every figure renders as unverified.

```bash
npm run data:status         # records, tier breakdown, queue depth, next items by rank
npm run data:status -- NV   # one state
npm run verify:publishable  # pre-deploy guard: nothing publishable without a citation
```

Run `verify:publishable` before any deploy, and ideally as part of the Vercel build
command. It applies the same tests as `gate()` and fails the build if a record is
flagged publishable while still on the research tier, unconfirmed, or uncited. With
the kit absent it prints the path it checked and exits 0.

## Documentation

| File | Purpose |
| --- | --- |
| `CLAUDE.md` | Rules and restrictions — read first |
| `PROJECT_HANDOFF.md` | What the data phase produced, decided, and left unfinished |
| `OPEN_ISSUES.md` | Everything unresolved or awaiting a decision |
| `DEPLOYMENT.md` | GitHub, Vercel, domain, and the pre-launch checklist |

## Stack

Next.js 16 (App Router), React 19, TypeScript. No CSS framework, no UI library,
no runtime data fetching, no build-time font downloads — one stylesheet in
`app/globals.css` and a system font stack.

## Configuration

Everything in `.env.example` is optional:

| Variable | Effect when unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical URLs default to `https://www.mymedigaprate.com` |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | `/rate-review` and `/contact` show phone and email only, no form |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | no analytics script is injected |

`NEXT_PUBLIC_*` values are visible in the browser. Never put a private key in
one, and never commit a real `.env`.

## Compliance

Operated by ECOS Medicare Solutions — Darin Weidauer, licensed insurance agent,
NPN 18580338. Not connected with or endorsed by the United States government or
the federal Medicare program. The TPMO disclaimer, the government disclaimer and
links to Medicare.gov, 1-800-MEDICARE and free SHIP counseling appear in the
footer of every page and must stay there.
