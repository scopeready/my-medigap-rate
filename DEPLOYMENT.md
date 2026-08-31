# Deployment

GitHub, Vercel, domain, and deploy configuration for **My Medigap Rate**.

| Resource | Value |
|---|---|
| GitHub repo | `https://github.com/scopeready/my-medigap-rate` |
| Vercel project | `my-medigap-rate` |
| Production URL | `https://www.mymedigaprate.com` |
| Apex behavior | `mymedigaprate.com` → 301 → `https://www.mymedigaprate.com` |

> ⚠ **Unrelated to `ecos-360`.** Do not link, share config, or copy from that project.

---

## 1. Initial repository setup

```bash
# from the unzipped handoff folder
git init
git branch -M main
git remote add origin https://github.com/scopeready/my-medigap-rate.git

# CRITICAL: confirm licensed data is excluded before the first commit
cat .gitignore | grep data/csg
git status --short | grep -c "data/csg" || echo "✅ data/csg correctly ignored"

git add .
git commit -m "Initial handoff: data corpus, pipeline, and project documentation"
git push -u origin main
```

**Verify before pushing** that `data/csg/` shows nothing in `git status`. That directory
contains CSG-licensed data which must never reach a remote — even a private one is
inadvisable. If it appears, stop and fix `.gitignore` first.

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
| Node version | 20.x |

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
3. Add `mymedigaprate.com` → configure as **Redirect to `www.mymedigaprate.com`** (308/301)

Vercel handles the apex→www redirect natively; do not implement it in `next.config.mjs` as
well or you risk a redirect loop.

### At the registrar (DNS)

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Confirm current target values in Vercel's Domains panel at setup time — Vercel's
documented IP/CNAME targets change occasionally.

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

**No secrets are included in this handoff.** All values must be supplied by Darin.

Variables prefixed `NEXT_PUBLIC_` are exposed to the browser — never put a secret there.

---

## 5. Pre-launch checklist

**Data integrity**
- [ ] `npm run verify:publishable` passes — no record is flagged publishable without a citation
- [ ] `data/csg/` absent from the repo (`git ls-files | grep data/csg` returns nothing)
- [ ] No vendor filename or vendor name in any rendered page or bundle
      (`grep -rl "csg-agent-use-only\|CSG" .next/` returns nothing)

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
- [ ] Apex → www redirect verified in a browser
- [ ] JSON-LD validates (Rich Results Test)
- [ ] Lighthouse: accessibility ≥ 95 (65+ audience — see `COMPLIANCE.md` §7)
- [ ] Lead form tested end-to-end; submission reaches Darin
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
