# Deployment

GitHub, Vercel, domain, and deploy configuration for **My Medigap Rate**.

| Resource | Value |
|---|---|
| GitHub repo | `https://github.com/scopeready/my-medigap-rate` |
| Vercel project | `my-medigap-rate` |
| Production URL | `https://www.mymedigaprate.com` |
| Apex behavior | `mymedigaprate.com` → **308** → `https://www.mymedigaprate.com`, served by Vercel |

> ⚠ **Unrelated to `ecos-360`.** Do not link, share config, or copy from that project.

---

## 1. Repository

**Already set up — do not run the `git init` sequence this section used to describe.** The
repository exists at `scopeready/my-medigap-rate`, `main` carries the site, and `origin` is
configured. Re-initialising here would do damage, not setup.

What survives from that setup is the check that mattered, and it is worth re-running before
any push:

```bash
# CRITICAL: licensed data must never reach a remote
git ls-files | grep -c "data/csg"      # must print 0
git status --short | grep "data/csg"   # must print nothing
```

`.gitignore:7` excludes `data/csg/` as a directory rule, so files added beneath it later are
covered too, and `.gitignore:10-11` excludes `*.xlsx` / `*.xls` from anywhere in the tree as
a second line of defence. Both were verified on 2026-08-31: zero kit files are tracked.

If a kit file ever does appear in `git status`, stop and fix `.gitignore` before committing —
CSG-licensed data must not reach a remote, and a private repository is not an exception.

### Branch strategy
- `main` → production (auto-deploys to `www.mymedigaprate.com`)
- `dev` → preview deployments
- Feature branches → per-PR preview URLs

---

## 2. Vercel setup

### Import
1. Vercel dashboard → **Add New → Project** → import `scopeready/my-medigap-rate`
2. Framework preset: **Next.js**
3. Project name: **`my-medigap-rate`**
4. Root directory: `./`

### Build settings
| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `.next` (Next.js default) |
| Install command | `npm install` |
| Node version | 20.x (20.9 or newer — Next.js 16 requires it) |

**Recommended:** change the build command to
`npm run verify:publishable && npm run build`
so a build fails rather than shipping unverified data. That script now exists and is wired
into `package.json`; on Vercel the kit is absent, so it reports the path it checked and
exits 0. See `OPEN_ISSUES.md` #7 for what it does and does not cover.

### Deployment protection
Leave preview deployments password-protected until launch — pre-launch previews of a
Medicare site shouldn't be publicly indexable. Also confirm previews send
`X-Robots-Tag: noindex`.

---

## 3. Domain configuration

### In Vercel
1. Project → **Settings → Domains**
2. Add `www.mymedigaprate.com` → set as **Primary**
3. Add `mymedigaprate.com` → configure as **Redirect to `www.mymedigaprate.com`**. Vercel
   issues a **308 Permanent Redirect** for this, which is correct and is what the apex
   currently returns.

Vercel handles the apex→www redirect natively; do not implement it in `next.config.ts` as
well or you risk a redirect loop.

### At the registrar (DNS)

DNS is at **GoDaddy**. These are the records currently in force — confirmed 2026-08-31, and
what the live site resolves through:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `216.150.1.1` |
| `CNAME` | `www` | `0a5263960cd3d1f4.vercel-dns-016.com` |

> ⚠ **Do not replace these with the generic `76.76.21.21` / `cname.vercel-dns.com` pair**
> that earlier drafts of this document carried. Vercel now issues per-project CNAME targets,
> and the generic values would break resolution. If you ever need to re-derive them, read
> them out of **Vercel → Project → Settings → Domains** — never from documentation, this
> document included.

TLS certificates are issued automatically once DNS resolves. Allow up to 48h propagation,
usually far less.

### Redirect domains (if purchased)
Any additional domains — e.g. a short vanity URL for seminars and mailers — should be added
in Vercel as **redirects to `www.mymedigaprate.com`**, never as additional primary domains.

Point each at the most relevant deep path with UTM tags so offline attribution works:

```
<vanity-domain>  →  https://www.mymedigaprate.com/rate-review/?utm_source=vanity&utm_medium=domain&utm_campaign=seminar
```

**Never build a separate site on a redirect domain** — doorway pages violate Google's spam
policy (see `COMPLIANCE.md` §3.7).

---

## 4. Environment variables

Copy `.env.example` → `.env.local` for local development, and add the same keys in
**Vercel → Settings → Environment Variables** for Preview and Production.

**The site builds and serves all 200 routes with no variables set.** All three are optional
and all three are `NEXT_PUBLIC_`, meaning visible in the browser — never put a secret there.
There are no secrets in this repository and there should never be any.

| Variable | Set for launch? | Behaviour when unset |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | **Yes** — no key, no leads | `/contact` shows phone and email instead of a form; `/rate-review` renders the full form but replaces its submit button with a note to call or email |
| `NEXT_PUBLIC_SITE_URL` | No | Canonicals default to `https://www.mymedigaprate.com`, which is correct |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Your call | No analytics script is injected. Setting it triggers the cookie-consent requirement in `COMPLIANCE.md` §6 |

`NEXT_PUBLIC_*` values are read at **build time**, so setting one in Vercel does not affect
an existing deployment — redeploy after changing any of them.

Two Web3Forms settings live outside this repository and are easy to miss: the form's
**allowed domain** must be `mymedigaprate.com`, or submissions are rejected on arrival; and
this site uses **its own access key**, separate from any other ECOS property, so leads and
quota stay attributable per site.

`CSG_DATA_DIR` is a local-only override for the data scripts. **Never set it on Vercel** —
the kit must not exist in a deployment.

---

## 5. Pre-launch checklist

**Data integrity**
- [x] `npm run verify:publishable` passes — no record is flagged publishable without a
      citation. Verified 2026-08-31: 4,913 records, 0 publishable, all Tier C.
- [x] `data/csg/` absent from the repo (`git ls-files | grep data/csg` returns nothing).
      Verified 2026-08-31.
- [x] No vendor filename or vendor name in any rendered page or bundle
      (`grep -rl "csg-agent-use-only\|CSG" .next/server/app` returns nothing).
      Verified 2026-08-31.

**Compliance** (see `COMPLIANCE.md`)
- [ ] Government non-affiliation disclaimer in header, near forms, and footer
- [ ] Agent licensing + compensation disclosure present
- [ ] Data currency and sourcing statement on every data page
- [ ] Agent CTAs suppressed for non-licensed states; **no NY pages or lead capture**
- [ ] Privacy policy and terms live
- [ ] No health-information fields on any form

**Technical**
- [ ] `sitemap.xml` includes all programmatic routes
- [ ] `robots.txt` allows crawl and references the sitemap
- [ ] Apex → www redirect verified in a browser (expect **308**, not 301)
- [ ] JSON-LD validates (Rich Results Test)
- [ ] Lighthouse: accessibility ≥ 95 (65+ audience — see `COMPLIANCE.md` §7)
- [x] Both forms verified in a browser against a production build: correct access key,
      absolute `/thank-you` redirect, consent required before submit, honeypot omitted from
      the payload, and an unlicensed state removing the submit path entirely.
- [ ] **Still untested: that a submission actually lands.** The build was verified in an
      environment with no route to `api.web3forms.com`, so delivery was never exercised.
      Send one real test through the live site after the first deploy and confirm it
      arrives.
- [ ] Analytics recording, with form contents excluded

**Post-launch**
- [ ] Google Search Console verified; sitemap submitted
- [ ] Bing Webmaster Tools verified
- [ ] Both apex and www registered as GSC properties

---

## 6. Ongoing operations

**Quarterly data refresh.** Pull fresh CSG exports, run the pipeline (see the kit's
`scripts/`, and note the hardcoded paths in `OPEN_ISSUES.md` #6), review
`excel_snapshot_variance.json` for movement, and re-verify anything that changed materially
before republishing. The pipeline is idempotent and content-diffs re-sends, so unchanged
data is a no-op.

**Adding verified data.** As each SERFF confirmation completes, update the record's
`evidence_tier`, `verification_status`, `publishable`, and `source_citation`, then rebuild.
Newly-publishable records begin rendering automatically if templates filter on `publishable`.

**Update `dateModified`** in JSON-LD and the visible "last updated" line whenever a page's
underlying figures change. Both AI engines and human trust depend on visible currency.
