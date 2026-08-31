# Data gaps — what to go and find

Generated 2026-08-31 by `npm run data:gaps`.

Nothing here is on the website. Every row is either a value we hold and will not publish, or a scenario where we hold nothing. Resolving a row either puts a figure on a page or confirms that it should stay off.

**37 suppressed values · 25 incomplete scenarios**

## 1. Suppressed — held back as wrong or unproven

### Known or suspected vendor defect — 18

**How to resolve:** Raised in the vendor support ticket. Resolve there, or confirm independently against the state's filing record.

| State | Plan | NAIC | Carrier | Detail |
|---|---|---|---|---|
| IA | G | 69868 | United Of Omaha Life Insurance Company | 12% effective 2012-09-01. 107.6% at both ages, and the Plan N series for this carrier in this state is empty. Possibly an incomplete series rather than a wrong figure. Raised with the vendor. |
| VT | G | 53295 | Blue Cross And Blue Shield Of Vermont | 4.5% effective 2021-01-01. 189.8% on Plan N effective 2025-01-01 where Plan G for the same carrier and date shows 30.4%, and the Plan N series carries two rows against Plan G's six. Raised with the vendor. |
| OK | N | 94587 | Farm Bureau Health Plans Member S Health Insurance Company | 29.9% effective 2025-06-01. 100.0% may be genuine on a small block (3,747 lives): the carrier's own Plan N shows 29.9% on the same date and its other five states look ordinary. Withheld pending confirmation with the Oklahoma Insurance Department rather than dismissed. |
| VT | N | 53295 | Blue Cross And Blue Shield Of Vermont | 6.9% effective 2026-01-01. 189.8% on Plan N effective 2025-01-01 where Plan G for the same carrier and date shows 30.4%, and the Plan N series carries two rows against Plan G's six. Raised with the vendor. |

### Increase implausibly large — 10

**How to resolve:** Read the approved filing for this block. If the increase is real it is a significant consumer story and worth publishing with the citation; if it is a feed defect it stays suppressed.

| State | Plan | NAIC | Carrier | Detail |
|---|---|---|---|---|
| IA | G | 69868 | United Of Omaha Life Insurance Company | 107.6% effective 2026-08-28 is at or above the 100% defect threshold. |
| NC | G | 79987 | Medico Corp Life Insurance Company | 2079.9% effective 2026-08-01 is at or above the 100% defect threshold. |
| OK | G | 94587 | Farm Bureau Health Plans Member S Health Insurance Company | 100% effective 2025-06-01 is at or above the 100% defect threshold. |
| NC | N | 79987 | Medico Corp Life Insurance Company | 2058.3% effective 2026-08-01 is at or above the 100% defect threshold. |
| VT | N | 53295 | Blue Cross And Blue Shield Of Vermont | 189.8% effective 2025-01-01 is at or above the 100% defect threshold. |

### Carrier entity not established — 5

**How to resolve:** The NAIC code was matched on carrier-name similarity, not an exact rate match. Confirm the legal entity in the state filing before this record can be published — every claim on this site is entity-level.

| State | Plan | NAIC | Carrier | Detail |
|---|---|---|---|---|
| NV | G | 99724 | Lifeshield National Insurance Co. | NAIC matched by carrier-name similarity, not by an exact rate match. The entity behind the figure is not established, and every claim on this site is entity-level. |
| NV | G | 65269 | Healthspring Insurance Company (F/K/A Cic) | NAIC matched by carrier-name similarity, not by an exact rate match. The entity behind the figure is not established, and every claim on this site is entity-level. |
| NV | G | 22713 | Insurance Company Of North America | NAIC matched by carrier-name similarity, not by an exact rate match. The entity behind the figure is not established, and every claim on this site is entity-level. |
| NV | G | 66001 | American Benefit Life Insurance Company | NAIC matched by carrier-name similarity, not by an exact rate match. The entity behind the figure is not established, and every claim on this site is entity-level. |

### Premium implausibly high — 4

**How to resolve:** Confirm the current monthly premium with the carrier or the state's filed rate table. One inflated premium can also distort the reported increase, so re-check both together.

| State | Plan | NAIC | Carrier | Detail |
|---|---|---|---|---|
| NC | G | 79987 | Medico Corp Life Insurance Company | $3007.56/mo is at or above the $1500 defect threshold. |
| NC | N | 79987 | Medico Corp Life Insurance Company | $2612.46/mo is at or above the $1500 defect threshold. |

## 2. Missing — scenarios with rates but no analytics, or nothing at all

| State | Plan | Age | Licensed | What is missing | Recovery |
|---|---|---|---|---|---|
| NM | G | 65 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NM | N | 65 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NM | G | 70 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NM | N | 70 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NV | N | 65 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NV | G | 70 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NV | N | 70 | yes | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| MO | N | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| MO | N | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| MT | G | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| MT | N | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| MT | G | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| MT | N | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NE | G | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NE | N | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NE | G | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NE | N | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NH | G | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NH | N | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NH | G | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NH | N | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NJ | G | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NJ | N | 65 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NJ | G | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |
| NJ | N | 70 | no | per-carrier Increase History (dates + %), Market Data (national+state lives, premium, loss ratio, market share), Age Increases |  |

## 3. Known coverage limits — not defects, but gaps a reader would notice

| Gap | Effect on the site | What would close it |
|---|---|---|
| Premiums cover **female, non-tobacco only** | A male reader sees a premium that does not apply to him. Rate *history* is identical per block regardless of profile, so only the premium column is affected. | A male non-tobacco export at the same ages. |
| Premiums cover **ages 65 and 70 only** | The site's audience is switchers, who skew older than 70. A 78-year-old has no premium that speaks to them. | Exports at ages 75 and 80. |
| **One representative ZIP per state** | Premiums vary within a state by rating area. The figure is a like-for-like comparison between carriers, not a quote. | Nothing — this is a deliberate methodology choice and is disclosed on every page. |
| **Plan G and Plan N only** carry rate history | Plan F and High-Deductible G have premiums but no history anywhere, which is why neither has per-state pages. | Analytics exports for those plan letters, if the audience ever justifies it. |
| **Minnesota, Wisconsin, Massachusetts** | Waivered states with their own plan sets; federal plan letters do not map. MN is licensed and has nothing at all. | MN: export using Minnesota's own plan labels. WI/MA: not available from the panel in any format. |
