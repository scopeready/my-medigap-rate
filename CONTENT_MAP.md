# Content Map

Every planned page: URL, purpose, lead-generation action, and current status.

**Status key:** `PLANNED` (designed, not built) · `BLOCKED` (needs verified data) ·
`BUILT` (exists)

> **Reconciled against the repository, 2026-08-31.** This map was written before the site
> was built, when nothing existed. 200 routes now ship, 195 of them in the sitemap.
> Statuses below have been corrected; where the built site diverges from the plan, that is
> called out rather than quietly rewritten — the divergences are decisions, not oversights.

**Data gate:** any page marked *data-dependent* must render only records with
`publishable === true`. That count is zero until the SERFF pass begins, so those pages
should ship with an honest "verification in progress" state rather than Tier C figures.

---

## 1. Core programmatic pages — the SEO/GEO engine

These are the reason the site can rank. Roughly 200+ routes generated from the data.

### `/medigap-rate-history/[state]/[plan]/`
**Planned: ~96 routes** (48 states × Plan G, Plan N)
**Built: 102 routes** (51 jurisdictions × Plan G, Plan N)
Example: `/medigap-rate-history/nevada/plan-g/`

> **Divergence resolved.** `ROUTED_PLANS` briefly routed four plans — Plan F and
> High-Deductible G as well. Neither could ever be filled: the analytics layer covers
> **Plan G and N only**, so F and HDG have premiums but no rate-increase history anywhere,
> and half the pages could not show the thing the page type exists to show. Both were
> dropped from `ROUTED_ORDER`; each keeps its national explainer at `/medigap-plans/[plan]`,
> so no content was lost. The plan, the data and the routes now agree.

- **Purpose:** the flagship page type. For one state and one plan, list every carrier block
  with its verified rate-increase history, NAIC code, loss ratio, rate type, and current premium.
- **Primary query targets:** "medigap rate increase history nevada", "plan g rate increases",
  "which medigap company raises rates the most in [state]"
- **Must include:** per-block increase timeline, NAIC codes displayed, effective dates,
  loss ratio with explanation, rate-type explainer, visible last-updated date, SERFF citations
- **Lead action:** *"Is your carrier on this list? Get a free rate-stability review of your
  current policy."* → lead form pre-filled with state + plan
- **Status:** `BUILT` · data-dependent · figures withheld until verification begins

### `/medigap-carriers/[state]/`
**~48 routes** — Example: `/medigap-carriers/texas/`

- **Purpose:** every carrier writing Medigap in the state, with entity-level detail
  (NAIC, parent group, years in market, A.M. Best, rate type, block size)
- **Primary query targets:** "medigap companies in texas", "best medicare supplement company texas"
- **Lead action:** *"Not sure which of these is right for you? Talk to a licensed agent."*
- **Status:** `PLANNED` · data-dependent

### `/medigap-carriers/[state]/[carrier]/`
**~600+ routes** (only build for carriers with meaningful data)

- **Purpose:** single carrier in one state — full history, all blocks, stability assessment
- **Primary query targets:** "aetna medigap rate increase 2026", "[carrier] medicare supplement reviews"
- **⚠ Rule:** if a carrier has multiple NAIC blocks in the state, show them **separately**.
  Never average across them.
- **Lead action:** *"Considering leaving [carrier]? See what you'd pay elsewhere."*
- **Status:** `PLANNED` · data-dependent · build after the state pages prove out

### `/compare/plan-g-vs-plan-n/[state]/`
**~48 routes**

- **Purpose:** side-by-side benefit and cost comparison using real state premiums; explains
  the Plan N tradeoff (copays + excess charges vs. lower premium)
- **Primary query targets:** "plan g vs plan n", "is plan n worth it"
- **Lead action:** *"Which fits your situation? Free 15-minute comparison call."*
- **Status:** `PLANNED` · data-dependent

### `/medigap-plans/[state]/`
**~48 routes** — state hub linking the above

- **Purpose:** state landing page; overview, current price range, links to the deeper pages
- **Primary query targets:** "medicare supplement plans [state]", "medigap [state]"
- **Lead action:** state-specific consultation CTA
- **⚠ For non-licensed states:** informational only, no agent CTA (see `COMPLIANCE.md`)
- **Status:** `PLANNED` · data-dependent

---

## 2. Educational pages — trust building and top-of-funnel

These can be built **now**; they don't depend on verified rate data.

| URL | Purpose | Lead action | Status |
|---|---|---|---|
| `/why-did-my-medigap-premium-increase/` | **The single highest-intent page on the site.** Explains the three compounding causes: age-based increases, block-level rate increases, and closed-block death spirals. Directly answers the switcher's question. | "Find out if your block is one of the bad ones — free review" | `BUILT` |
| `/how-medigap-rates-work/` | Attained age vs. issue age vs. community rated, explained plainly with real cost curves | Soft CTA | `BUILT` |
| `/what-is-a-closed-block/` | Why a carrier's old block spirals while its new block stays cheap — the block-level thesis in consumer language | "Check whether your policy is in a closed block" | `BUILT` |
| `/medigap-loss-ratios-explained/` | What a loss ratio is and why >100% predicts an increase | Soft CTA | `BUILT` |
| `/switching-medigap-plans/` | Underwriting, guaranteed issue, birthday rules, state-specific windows | **High intent** — "See if you qualify to switch" | `BUILT` |
| `/medigap-plans/plan-g/` · `/medigap-plans/plan-n/` | National plan explainers. Built under `/medigap-plans/[plan]`, not at the top-level paths this map first proposed — the bare `/medigap-plan-g` URLs do not exist, so do not link them. | Soft CTA | `BUILT` |
| `/turning-65/` | Enrollment timing, IEP/OEP, first-time buyer guidance | "Get help choosing your first plan" | `BUILT` |
| `/turning-65/[state]/` | State-specific enrollment rules (~15 licensed states only) | State consultation CTA | `BUILT` |

---

## 3. Conversion pages

| URL | Purpose | Status |
|---|---|---|
| `/rate-review/` | **Primary lead form.** Captures state, carrier, plan letter, current premium, age band, name, email, phone, ZIP. No health fields and no date of birth. Unlicensed states are told so before they fill anything in. | `BUILT` |
| `/compare-rates/` | Secondary form — quote request for shoppers rather than switchers | `PLANNED` |
| `/contact/` | Standard contact + phone | `BUILT` |
| `/schedule/` | Calendar booking for consultations | `PLANNED` |
| `/thank-you/` | Post-submission confirmation; sets expectations for follow-up. `noindex`. | `BUILT` |

**Lead form fields (minimum):** name, email, phone, ZIP, current carrier (optional),
current plan (optional), date of birth or age. **Never collect health information** through
the site — that changes the compliance posture entirely.

---

## 4. Trust & compliance pages

| URL | Purpose | Status |
|---|---|---|
| `/about/` | Who ECOS is, Darin's licensing footprint, why this data exists | `BUILT` |
| `/methodology/` | **Important for both trust and AI citation.** How the data is gathered, what SERFF is, what "verified" means, the evidence tiers, update cadence. Sites that document methodology get cited more by AI engines. | `BUILT` |
| `/sources/` | Full source list — SERFF, NAIC exhibits, state DOI portals, with links | `PLANNED` |
| `/privacy/` | Privacy policy (required — the site collects leads) | `BUILT` |
| `/terms/` | Terms of use | `BUILT` |
| `/disclosures/` | Full compliance disclosures — see `COMPLIANCE.md` | `PLANNED` — the disclosures themselves render site-wide in the header bar and footer, so this page is a convenience, not a gap |

---

## 5. Infrastructure routes

| Route | Purpose | Status |
|---|---|---|
| `/sitemap.xml` | Dynamic — must include all programmatic routes | `BUILT` (`app/sitemap.ts`) |
| `/robots.txt` | Allow all; point to sitemap | `BUILT` (`app/robots.ts`) |
| `/rss.xml` or `/updates/` | Rate-change updates feed — supports the "RateWatch" newsletter concept | `PLANNED` |

---

## 6. Content status summary

| Category | Planned | Built | Notes |
|---|---|---|---|
| Programmatic data pages | ~200+ | 166 | State index, 51 state pages, 102 state × plan, plan index, 12 plan explainers. Structure done; figures withheld pending verification. |
| Educational pages | 9 | 8 | Built: the five explainers, `/turning-65`, its 15 state pages, and the plan explainers under `/medigap-plans/[plan]`. |
| Conversion pages | 5 | 3 | `/contact`, `/rate-review` and `/thank-you` exist. `/compare-rates` and `/schedule` do not. |
| Trust & compliance | 6 | 4 | `/sources` and `/disclosures` remain. |
| Infrastructure | 3 | 2 | `/rss.xml` or `/updates` remains. |
| Carrier pages, comparison pages | ~700 | 0 | Deliberately deferred; build after the state template proves out. |

**Revised build order.** The original order put conversion and compliance first; those are
substantially done. What remains, in order:

1. ~~**Educational pages (9).**~~ **Done** — the five explainers, `/turning-65` and its 15
   state pages ship, each claim cited to a federal source in `lib/sources.ts` or a state
   regulator in `lib/switching-rules.ts`.
2. ~~**`/rate-review`** — the primary lead form.~~ **Done**, with §2.1's non-affiliation notice
   and §3.4's what-happens-next copy shipped alongside it.
3. **Verification pass** on the queue, lowest ranks first — the only work that turns figures on.
   Nothing else moves the site forward as much: 153 of the 200 routes are waiting on it.
4. **`/sources`, and `Dataset` JSON-LD on the rate-history pages** — both cheap, both aimed at
   AI citation. `Dataset` is worth holding until a figure is publishable, so that its
   `citation` points at a real filing rather than at nothing.
5. **Carrier and comparison pages**, once the state template has proved out with real cited data.

---

## 7. Structured data (JSON-LD) — none created yet

Recommended per page type. This matters more for AI citation than for classic SEO.

- **All pages:** `Organization` (ECOS Medicare Solutions, with `isNotGovernmentAgency`-style
  disambiguation in the description), `WebSite`
- **Educational pages:** `Article` with `author`, `datePublished`, `dateModified`
- **Rate-history pages:** `Dataset` with `creator`, `temporalCoverage`, `spatialCoverage`,
  and `citation` pointing at the SERFF/NAIC sources — this is the schema most likely to earn
  an AI citation
- **FAQ blocks:** `FAQPage`
- **Comparison pages:** `ItemList`

**Status:** partially `BUILT`. Shipping today: `InsuranceAgency` and `WebSite` site-wide
from `app/layout.tsx`; `WebPage` on the state and state × plan pages; `Article` and
`FAQPage` with `Question`/`Answer` on `/why-did-my-medigap-premium-increase`; `Person` for
the agent. **Still `PLANNED`: `Dataset`** on the rate-history pages — the schema most likely
to earn an AI citation, and worth adding as soon as a figure clears the gate.
