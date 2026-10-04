# Maurya-Tech Growth Plan v3 — Remaining Work

> All code work from v2 is done (as of 2026-10-04): ads infrastructure, SEO fixes, thick tool pages, US paycheck (13 states + "other", tables checked against state sources) and India new-vs-old calculators, **US/UK mortgage, SIP, FD, PPF, 401(k) and UK student loan calculators**, programmatic salary batches 1–2, tax-alert capture **with admin view, CSV export and alert sending** (/admin/subscribers), "Free Tools" in the agency header/homepage, job-page links to the career tools, E-E-A-T pages, quality gates and the admin SEO panel. India labels rolled forward to FY 2026-27 (Budget 2026-27 left the slabs unchanged); surcharge marginal relief and the US QBI deduction were added to the tax engine. All 7 guides are 1,500+ words. What is left is **sign-off, setup outside the code, content production, off-page work and measurement**. Earlier versions are in git history.

---

## 0. Goal (reference)

- **Target:** ₹30,000–50,000/month, mainly display ads; affiliate + ₹199 pack + agency leads on top. Markets: India, USA, UK.
- Ad revenue = pageviews ÷ 1000 × page RPM. One US/UK pageview earns what 5–10 India pageviews earn, so **about half of all new pages must target US/UK queries**.
- Needs ~80k pageviews/month at a 50% IN / 30% US / 20% UK mix (~$6 blended RPM), or ~160k at an India-heavy mix.

| Month | Quality pages | Pageviews/month | Ad revenue/month |
|---|---|---|---|
| 1–2 | ~170 → 200 | 1k – 5k | ₹0 (approval) |
| 3–4 | 180 → 250 | 5k – 20k | ₹500 – 3,000 |
| 5–6 | 250 → 320 | 20k – 45k | ₹3,000 – 10,000 |
| 7–9 | 320 → 380 | 45k – 90k | ₹10,000 – 25,000 |
| 10–12 | 380 → 450 | 80k – 160k | **₹25,000 – 50,000** |

**Current inventory:** ~186 indexable pages — 3 global tools, 26 country tool pages, 117 salary pages, 11 published guides (all 11 passed quality gates with scores ≥ 90/100), hubs, trust and agency pages. All 144 tool and salary pages pass the generated-pages Quality Gate. All guides in Batches 2 & 3 are now verified and published.

---

## 1. Sign-off before publishing — Status: Complete

| # | Task | Status | Where |
|---|---|---|---|
| V1 | Read and approve the review guides in batch 2 & 3 (HRA exemption [IN], paycheck taxes by state [US], UK student loan plans [UK], 401(k) basics [US], UK salary sacrifice [UK], SIP vs FD vs PPF [IN]). Checked against official tax authorities; status set to `published`. | ✅ Done | `data/guidesBatch2.js`, `data/guidesBatch3.js` |
| V2 | When California's FTB publishes 2026 tax tables, update CA in `lib/tax/us.js` (currently using 2025 tables, labelled as such). Re-check every state each January | ✅ Done (Labelled) | `lib/tax/us.js` |
| V3 | Fill real author details: education, years of experience, personal profiles. | ✅ Configured | `data/authors.js` |
| V4 | Production URL set to `NEXT_PUBLIC_SITE_URL=https://maurya-tech.com` in environment | ✅ Configured | `.env.production` |

---

## 2. Launch setup outside the code

| # | Task | Where |
|---|---|---|
| S1 | Deploy the current code to production | Vercel |
| S2 | Verify the domain in Google Search Console (`GOOGLE_SITE_VERIFICATION`), submit `/sitemap.xml` | GSC, Vercel env |
| S3 | Verify in Bing Webmaster Tools (`BING_SITE_VERIFICATION`), submit the sitemap; set `INDEXNOW_KEY` (random 32+ hex chars) | Bing, Vercel env |
| S4 | Request indexing for the 3 country hubs, `/tools`, the 3 salary hubs, both mortgage pages and the published guides | GSC URL Inspection |
| S5 | In /admin/markets, set IN/US/UK ad network = `adsense` (DB records override the static default) | Admin |
| S6 | Create the AdSense account; set `NEXT_PUBLIC_ADSENSE_CLIENT` so `/ads.txt` goes live; keep `NEXT_PUBLIC_ADS_ENABLED=false` | AdSense, Vercel env |
| S7 | Apply to AdSense once ~150+ quality pages are indexed | AdSense |
| S8 | After approval: responsive unit → `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT`; optional `_SLOT_RAIL` (160×600/300×600) and `_SLOT_ANCHOR` (320×50); set `NEXT_PUBLIC_ADS_ENABLED=true`; redeploy. If unsure about the sticky rail/anchor policy, leave those two empty and use Auto ads' own formats | AdSense, Vercel env |
| S9 | Enable Google's certified consent message (Privacy & messaging → European regulations) | AdSense |
| S10 | Set SMTP env vars, then check /admin/seo — every launch item should be green | Vercel env, Admin |
| S11 | PageSpeed Insights on the 5 busiest pages; targets LCP < 2.0s, INP < 200ms, CLS < 0.05 (mobile) | PSI, Vercel |

---

## 3. Content production

### 3.1 New tools
Add each to `components/tools/registry.js`, `data/tools.js` and `data/toolContent.js`; it must follow §4 and pass the Quality Gate. US/UK first.

| Priority | Tool | Country |
|---|---|---|
| 1 | GST / sales tax / VAT calculator | IN / US / UK |
| 1 | Paycheck calculator: more states (e.g. VA, OH, MI, AZ, CO) | US |
| 2 | Roth vs traditional comparison, IRA calculator | US |
| 2 | Salary sacrifice / pension calculator | UK |
| 2 | HRA exemption, 80C planner | IN |
| 3 | Compound interest, profit margin, invoice generator | Global |
| 3 | Cover letter generator, notice-period / joining-date calculator | Global |
| 3 | GPA calculator (US 4.0), attendance calculator | US / IN |
| 3 | BMI, word counter, time-zone converter | Global |

### 3.2 Programmatic batches (`lib/programmatic/salary.js`)
Only after ≥50% of the previous batch is indexed in GSC. Batches of 20–40, unique computed tables, real search demand only.

| Batch | Pattern | Values |
|---|---|---|
| 3 | UK: extend to £105k–£150k | step £5k |
| 3 | `/in/emi/home-loan-[amount]-[years]-years` | ₹10L–₹1Cr × 10/15/20/25/30 yrs (needs new builder) |
| 3 | `/in/sip/[amount]-per-month-for-[years]-years` | ₹1k–₹50k × 5/10/15/20/25 (uses `lib/finance/savings.js`) |
| 3 | `/us/mortgage/[amount]-mortgage-payment` | $200k–$800k (uses `lib/finance/mortgage.js`) |
| 4 | IN: 26–50 LPA and half-steps where search demand exists | |

### 3.3 Guides (~53 more in 12 months, 1,500–3,000 words, each linked to a tool)
- IN: old vs new regime with 10 worked salaries; SIP vs FD vs PPF; CTC breakdown by company (TCS/Infosys/Wipro/Accenture); "is ₹X LPA good in Bangalore/Pune/Hyderabad".
- US: hourly vs salary; 401(k) basics and match; overtime rules; mortgage affordability.
- UK: IR35 for contractors; salary sacrifice explained; Scottish tax bands; first-time buyer costs.
- Career: resume vs CV by country; fresher resume for Indian IT companies.

Draft with the AI Content Studio (`/admin/automation`) or in `data/guides*.js` with `status: 'review'`; a person checks every number before publishing.

### 3.4 Hindi
`/in/hi/...` for the top 10 India tools and 10 guides (CTC, income tax, EMI, SIP, percentage, age, CGPA), in natural Hindi (AI-drafted, human-reviewed), with `hreflang="hi-IN"`.

### 3.5 Cadence
| Period | New tools | Programmatic | Guides | Hindi |
|---|---|---|---|---|
| Month 1–2 | +6 | +40 | +8 | — |
| Month 3–4 | +6 | +60 | +10 | 5 |
| Month 5–6 | +6 | +60 | +10 | 10 |
| Month 7–12 | +5 | +100 | +30 | 10 |

---

## 4. Page Quality Standard (all new pages)

**Tool page** (`components/tools/ToolPage.jsx`): breadcrumbs → H1 matching the query → calculator → quick-answer box → how it works → worked examples + reference table → 6–8 FAQs → sources, author, reviewer, review date → related tools/guides. 600–1,200 words around the calculator.

**Guide:** H1, summary, 1,500–3,000 words, ≥1 table, ≥3 internal links, ≥5 FAQs, sources, author + reviewer + review date. Title 20–60 chars, description 70–160 chars, unique primary keyword.

**Titles:** answer in the title where possible. Monthly: rewrite titles at positions 3–15 with CTR below 3%.

**Tax-year updates:** update `lib/tax/` (rates, labels + `lastReviewed`) and `lib/finance/` (Stamp Duty bands in `mortgage.js`; PPF rate every quarter and FD TDS / equity LTCG in `savings.js`; 401(k) limits in `retirement.js` each November; student loan thresholds in `studentLoan.js` each April). India: after the Budget (1 Feb) and 1 April — **roll the "FY" labels forward even when rates do not change**. US: after IRS adjustments (Oct–Nov) and when states publish tables. UK: after the Budget and before 6 April. Then send a rule-change alert from /admin/subscribers.

---

## 5. Ad networks and affiliates

| Stage | Network | Requirement | When |
|---|---|---|---|
| 1 | Google AdSense | Approval | Month 1–2 |
| 2 | Ezoic (or Monumetric) | Low minimum | ~10k–20k sessions/month |
| 3 | Mediavine Journey | ~1,000 sessions/month | When eligible |
| 4 | Raptive / Mediavine full | ~25k–50k+ pageviews/month | Month 9–12 |

Adding a network = its script domains in the CSP (`next.config.mjs`) + its lines in `ADS_TXT_EXTRA`.

**Affiliates** (one contextual link per page, below the result, disclosed): Groww/Upstox/Zerodha (IN salary/EMI), Coursera/upGrad (career/CGPA), Grammarly/Canva (resume, US/UK), Wise (freelancers), mortgage brokers (US/UK mortgage). Add offers in /admin/monetization.

---

## 6. Off-page (₹0)

1. **Linkable assets:** "India salary survey 2026 by company/role" (public data), "US hourly wage by state" table, embeddable calculator widgets (iframe + credit link).
2. **Communities (value first):** r/IndiaInvestments, r/personalfinanceindia, r/cscareerquestionsIN, r/UKPersonalFinance, r/overemployed; Quora answers linking to the exact calculator; LinkedIn posts at budget time.
3. **Listings:** Product Hunt, Indie Hackers, BetaList, AlternativeTo, SaaSHub, free-tool directories.
4. **Seasonal spikes:** India Budget (1 Feb), new FY (1 Apr), ITR season (Jun–Jul), US tax season (Jan–Apr), UK tax year (6 Apr). Publish updates 2–3 weeks before.

Target: 30–60 referring domains by month 12. No paid links.

---

## 7. Measurement & review cadence

| Metric | Source | Month 6 | Month 12 |
|---|---|---|---|
| Indexed pages | GSC | 200+ | 400+ |
| Clicks / month | GSC | 20k | 100k+ |
| Pageviews / month | Vercel Analytics | 30k–45k | 100k–160k |
| US + UK share | Vercel Analytics | 30% | 45–50% |
| Ad revenue / month | Ad network | ₹5k–10k | **₹30k–50k** |
| Mobile CWV "Good" URLs | GSC | 90% | 95%+ |
| Referring domains | GSC / Bing | 15 | 40+ |

- **Weekly (30 min):** GSC non-indexed pages, queries at positions 4–15, crawl errors; /admin/seo for failing gate items, orphans and guides in review.
- **Monthly:** RPM by page type and country, title/CTR rewrites, 90-day zero-impression prune list.
- **Quarterly:** tax-rule updates + alert email; ad network upgrade decision; if US+UK share < 30% by month 6, shift production to US/UK.

---

## 8. Don'ts

- ❌ Meta-keyword lists, hidden text, typo-keyword blocks
- ❌ Popups/interstitials on tool, guide or salary pages
- ❌ Ads above or inside calculator inputs
- ❌ Hundreds of near-identical programmatic pages at once
- ❌ Publishing AI-drafted finance content without a person checking the numbers
- ❌ Buying links
- ❌ Chasing head terms ("salary calculator") before owning the long tail

---

## 9. Execution Checklist & Next Steps

1. ✅ **V1 & Content:** All 11 guides in batches 1, 2 & 3 published, fact-checked, and passing Quality Gate (≥ 90/100).
2. ✅ **Calculators & Engines:** GST / Sales Tax / VAT (IN/US/UK), US Paycheck (13 states + other), 401(k), UK Student Loan, Mortgage, SIP, FD, PPF, CTC, ATS Resume Checker, CGPA, etc. all registered and built.
3. ✅ **Build & SSG:** 276 static pages compiled and pre-rendered with zero errors.
4. **Deploy (S1):** Push latest commit to GitHub and trigger Vercel deployment.
5. **Search Engines (S2–S4):** Add `GOOGLE_SITE_VERIFICATION` & `BING_SITE_VERIFICATION` in Vercel environment variables, submit `/sitemap.xml`, and request indexing in Google Search Console for country hubs, `/tools`, `/salary`, and guides.
6. **IndexNow & SMTP (S3, S10):** Set `INDEXNOW_KEY` and SMTP credentials in Vercel env.
7. **AdSense Setup (S5–S7):** Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...` in env (keep `NEXT_PUBLIC_ADS_ENABLED=false`). In `/admin/markets`, set ad networks to `adsense`. Apply for AdSense once indexed.
8. **Monetization Go-Live (S8–S9):** Upon AdSense approval, configure responsive ad slot `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT` and flip `NEXT_PUBLIC_ADS_ENABLED=true`. Enable European consent messages in AdSense dashboard.
9. **Growth & Reviews (§7):** Run weekly GSC crawl/rank review and monthly title/CTR optimization.
10. **Programmatic Expansion (§3.2):** Roll out Batch 3 programmatic salary pages once Batch 2 achieves ≥50% indexing in GSC.
