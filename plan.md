# Maurya-Tech Growth Plan v2 — Remaining Work

> The codebase part of this plan was implemented on 2026-09-28/29 (ads infrastructure incl. side rails and mobile anchor, SEO fixes, thick tool pages, US paycheck and India new-vs-old regime calculators, programmatic salary batches 1–2, tax-alert email capture, E-E-A-T pages and structured author data, quality gates, admin SEO panel). What is left below is **setup outside the code, content production, off-page work and measurement** — plus a few optional code items. Earlier versions of this plan are in git history.

---

## 0. Goal and the math behind it (reference)

- **Target:** ₹30,000–50,000/month (~$360–600) mainly from display ads; affiliate + ₹199 pack + agency leads on top.
- **Markets:** India, USA, UK.

Ad revenue = pageviews ÷ 1000 × page RPM.

| Country | Page RPM (AdSense) | Page RPM (Ezoic / Journey later) |
|---|---|---|
| India | $0.8 – 2.5 | $1.5 – 4 |
| USA | $8 – 20 | $15 – 30 |
| UK | $6 – 15 | $10 – 22 |

| Traffic mix | Blended RPM | Pageviews/month for ₹40k |
|---|---|---|
| 80% IN / 12% US / 8% UK | ~$3 | ~160,000 |
| 50% IN / 30% US / 20% UK (target) | ~$6 | ~80,000 |

One US pageview earns what 5–10 India pageviews earn, so **about half of all new pages must target US/UK queries**.

| Month | Quality pages | Pageviews/month | Ad revenue/month |
|---|---|---|---|
| 1–2 | ~165 → 200 | 1k – 5k | ₹0 (approval) |
| 3–4 | 180 → 250 | 5k – 20k | ₹500 – 3,000 |
| 5–6 | 250 → 320 | 20k – 45k | ₹3,000 – 10,000 |
| 7–9 | 320 → 380 | 45k – 90k | ₹10,000 – 25,000 |
| 10–12 | 380 → 450 | 80k – 160k | **₹25,000 – 50,000** |

"Every page ranks" = every page targets one query, is indexed, passes the Quality Gate, and anything with zero impressions after 90 days is improved, merged or noindexed.

**Current inventory:** ~165 indexable pages (3 global tools, 19 country tool pages, 117 salary pages, 3 guides of ~1,000–1,100 words, hubs, trust pages, agency pages). All 137 tool and salary pages pass the generated-pages Quality Gate (see /admin/seo).

---

## 1. Launch setup outside the code (do these first)

These need accounts or dashboard access; the code already reads them from env / admin.

| # | Task | Where |
|---|---|---|
| S1 | Deploy the current code to production | Vercel |
| S2 | Verify the domain in **Google Search Console** (DNS or HTML tag → `GOOGLE_SITE_VERIFICATION`), submit `/sitemap.xml` | GSC, Vercel env |
| S3 | Verify in **Bing Webmaster Tools** (`BING_SITE_VERIFICATION`), submit sitemap; set `INDEXNOW_KEY` (random 32+ hex chars) | Bing, Vercel env |
| S4 | Request indexing in GSC for the 3 country hubs, `/tools`, the 3 salary hubs and the 3 guides | GSC URL Inspection |
| S5 | In **/admin/markets**, make sure IN/US/UK have ad network = `adsense` (DB records override the static default) | Admin |
| S6 | Create the **AdSense** account; set `NEXT_PUBLIC_ADSENSE_CLIENT` (ca-pub-…) so `/ads.txt` goes live; keep `NEXT_PUBLIC_ADS_ENABLED=false` | AdSense, Vercel env |
| S7 | Apply to AdSense once ~150+ quality pages are indexed (the site is already close: programmatic pages + tools) | AdSense |
| S8 | After approval: create one responsive display unit → `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT`; optionally a 160×600/300×600 unit → `NEXT_PUBLIC_ADSENSE_SLOT_RAIL` and a 320×50 unit → `NEXT_PUBLIC_ADSENSE_SLOT_ANCHOR`; set `NEXT_PUBLIC_ADS_ENABLED=true`; redeploy. Check the sticky rail/anchor against the current AdSense placement policy — if in doubt, leave those two slots empty and use Auto ads' own anchor/side-rail formats instead | AdSense, Vercel env |
| S9 | Enable Google's certified consent message (**Privacy & messaging → European regulations**, covers UK/EEA) | AdSense |
| S10 | Check **/admin/seo** — every launch-configuration item should be green | Admin |
| S10b | Make sure SMTP env vars are set in production so the tax-alert sign-up sends double opt-in emails (without SMTP, sign-ups are stored as confirmed without an email) | Vercel env |
| S11 | Run PageSpeed Insights / Vercel Speed Insights on the 5 busiest pages; targets: LCP < 2.0s, INP < 200ms, CLS < 0.05 (mobile) | PSI, Vercel |

---

## 2. Remaining gaps

### 🟠 Content volume (the main lever now)
~165 pages today vs ~350–450 needed for the revenue target. See §3.

### 🟠 E-E-A-T: people
- `data/authors.js` now has structured fields (background, expertise, credentials, verified profiles, review scope) and every finance page carries `reviewedBy` schema — but `credentials` is empty and the background is minimal. Fill in real education, years of experience and a personal LinkedIn. **Never add credentials a person does not hold.**
- Optional but valuable for finance (YMYL) pages: have a Chartered Accountant (India) and a CPA/EA (US) or ACCA/CTA (UK) review tax pages once, and add them as reviewers.

### 🟠 Hindi content (G13)
No `hi-IN` pages yet. Hindi salary/tax queries have far weaker competition.

### 🟡 Return-visitor loop (G18)
Tax-alert email capture is live (double opt-in, stored in the `Subscriber` collection). Still missing: an admin view/export of subscribers, and actually sending the alert emails when rules change (Budget, IRS, UK Budget). Saved calculations are not built.

### 🟡 Optional code items
- Admin UI for ad slot IDs (currently env-based, which works fine).
- Country-specific blog (`/[country]/blog`) — not needed while country content lives in `/[country]/guides`.
- Split the sitemap into an index (`generateSitemaps`) once it passes ~5,000 URLs.

---

## 3. Content production

### 3.1 New tools (all client-side; add to `components/tools/registry.js`, `data/tools.js`, `data/toolContent.js`)
Priority = US/UK first (highest RPM), then high-volume India.

| Priority | Tool | Country |
|---|---|---|
| 1 | Mortgage calculator | US, UK |
| 1 | Paycheck calculator: add more states (e.g. NJ, PA, MA, GA, NC) and update CA/NY to their latest published tables | US |
| 2 | SIP calculator, FD calculator, PPF calculator | IN |
| 2 | 401(k) calculator | US |
| 2 | Student loan repayment (Plans 1/2/4/5) | UK |
| 2 | GST calculator / sales tax calculator / VAT calculator | IN / US / UK |
| 3 | HRA exemption, 80C planner | IN |
| 3 | Compound interest, profit margin, invoice generator | Global |
| 3 | Cover letter generator, notice-period / joining-date calculator | Global |
| 3 | GPA calculator (US 4.0), attendance calculator | US / IN |
| 3 | BMI, word counter, time-zone converter | Global |

Every new tool must follow the standard in §4 and pass the Quality Gate.

### 3.2 Programmatic batches (engine: `lib/programmatic/salary.js`)
Batches 1–2 are live (IN 4–25 LPA, US $10–$60/hr, US $30k–$200k/yr, UK £15k–£100k). Next batches — **only after ≥50% of the previous batch is indexed in GSC**:

| Batch | Pattern | Values |
|---|---|---|
| 3 | UK: extend to £105k–£150k | step £5k |
| 3 | `/in/emi/home-loan-[amount]-[years]-years` | ₹10L–₹1Cr × 10/15/20/25/30 yrs (needs new builder) |
| 3 | `/in/sip/[amount]-per-month-for-[years]-years` | ₹1k–₹50k × 5/10/15/20/25 (needs SIP tool first) |
| 4 | IN: extend to 26–50 LPA and half-steps (e.g. 7.5 LPA) where search demand exists | |

Rules: unique computed tables per page, value-specific facts and FAQs, batches of 20–40, only values with real search demand (Google autocomplete / Keyword Planner).

### 3.3 Guides (~60 in 12 months, 1,500–3,000 words each, each linked to a tool)
The 3 existing guides are ~1,000–1,100 words and pass the gate; grow them to 1,500+ over time.
- IN: old vs new regime with 10 worked salaries; HRA exemption; CTC breakdown by company (TCS/Infosys/Wipro/Accenture); "is ₹X LPA good in Bangalore/Pune/Hyderabad".
- US: paycheck taxes by state; hourly vs salary; 401(k) basics; overtime rules.
- UK: student loan plans; IR35 for contractors; salary sacrifice explained; Scottish tax bands.
- Career (feeds from `/careers` traffic): ATS resume guide, resume vs CV by country, fresher resume for Indian IT companies.

Draft with the AI Content Studio (`/admin/automation`), then a human verifies every number against the official source before publishing — the Quality Gate blocks publication until it passes.

### 3.4 Hindi
`/in/hi/...` for the top 10 India tools + 10 guides (CTC, income tax, EMI, SIP, percentage, age, CGPA). Written in natural Hindi (AI-drafted, human-reviewed), with `hreflang="hi-IN"`.

### 3.5 Cadence
| Period | New tools | Programmatic | Guides | Hindi |
|---|---|---|---|---|
| Month 1–2 | +6 | +40 | +8 | — |
| Month 3–4 | +6 | +60 | +10 | 5 |
| Month 5–6 | +6 | +60 | +10 | 10 |
| Month 7–12 | +5 | +100 | +30 | 10 |

---

## 4. Page Quality Standard (for all new pages)

**Tool page** (template: `components/tools/ToolPage.jsx`): breadcrumbs → H1 matching the query → calculator → quick-answer box → how it works / formula → worked examples + reference table → 6–8 visible FAQs → sources, author, reviewer, last-reviewed date → related tools/guides. 600–1,200 words around the calculator.

**Guide:** H1, summary, 1,500–3,000 words, ≥1 table, ≥3 internal links (tool + hub + related), ≥5 FAQs, sources, author + reviewer + review date. Title 20–60 chars, description 70–160 chars, unique primary keyword.

**Titles:** answer in the title where possible ("$25 an Hour Is How Much a Year? ($52,000 Before Tax)"). Monthly: rewrite titles of pages at positions 3–15 with CTR below 3%.

**Tax-year updates:** when rules change, update `lib/tax/index.js` (rates + `lastReviewed`) — every calculator, table, salary page and the methodology page update together. India: after Budget (1 Feb) and 1 April. US: after IRS inflation adjustments (Oct–Nov). UK: after the Budget and before 6 April.

---

## 5. Ad network progression

| Stage | Network | Requirement | When |
|---|---|---|---|
| 1 | Google AdSense | Approval | Month 1–2 |
| 2 | Ezoic (or Monumetric) | Low minimum | ~10k–20k sessions/month |
| 3 | Mediavine Journey | ~1,000 sessions/month | When eligible — typically 1.5–2.5× AdSense RPM |
| 4 | Raptive / Mediavine full | ~25k–50k+ monthly pageviews | Month 9–12 |

Adding a network = its script domain in the CSP (`next.config.mjs`) + its lines in `ADS_TXT_EXTRA`. Moving from stage 1 to 3–4 alone can roughly double revenue on the same traffic.

**Affiliate** (one contextual link per page, below the result): Groww/Upstox/Zerodha (IN salary/EMI), Coursera/upGrad (career/CGPA), Grammarly/Canva (resume, US/UK), Wise (freelancers). Add offers in `/admin/monetization`; disclose affiliate links.

---

## 6. Off-page: getting discovered with ₹0

1. **Linkable assets:** "India salary survey 2026 by company/role" (from public data), "US hourly wage by state" table, embeddable calculator widgets (iframe + credit link).
2. **Communities (value first, no spam):** r/IndiaInvestments, r/personalfinanceindia, r/cscareerquestionsIN, r/UKPersonalFinance, r/overemployed; Quora answers linking to the exact calculator; LinkedIn posts at budget time.
3. **Listings:** Product Hunt, Indie Hackers, BetaList, AlternativeTo, SaaSHub, free-tool directories.
4. **Seasonal spikes:** India Budget (1 Feb), new FY (1 Apr), ITR season (Jun–Jul), US tax season (Jan–Apr), UK tax year (6 Apr). Publish updates 2–3 weeks before.
5. **Agency equity:** add a "Free Tools" item to the agency header/homepage linking to `/tools` and the country hubs.
6. **Careers traffic:** add in-body links from job pages to the ATS checker and salary calculator (banner already exists).

Target: 30–60 referring domains by month 12. No paid links.

---

## 7. Measurement & review cadence

| Metric | Source | Month 6 | Month 12 |
|---|---|---|---|
| Indexed pages | GSC | 200+ | 400+ |
| Impressions / month | GSC | 500k | 2.5M+ |
| Clicks / month | GSC | 20k | 100k+ |
| Pageviews / month | Vercel Analytics | 30k–45k | 100k–160k |
| US + UK share | Vercel Analytics | 30% | 45–50% |
| Blended page RPM | Ad network | $2.5 | $4–6 |
| Ad revenue / month | Ad network | ₹5k–10k | **₹30k–50k** |
| Mobile CWV "Good" URLs | GSC | 90% | 95%+ |
| Referring domains | GSC / Bing | 15 | 40+ |

- **Weekly (30 min):** GSC non-indexed pages, queries at positions 4–15, crawl errors; `/admin/seo` for failing Quality Gate items and orphans.
- **Monthly:** RPM by page type and country, title/CTR rewrites, 90-day zero-impression prune list.
- **Quarterly:** tax-rule updates; ad network upgrade decision; if US+UK share < 30% by month 6, shift more production to US/UK.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Programmatic pages judged thin | Small batches, unique computed tables, indexing-rate gate, 90-day prune |
| Wrong tax numbers (YMYL) | Single engine (`lib/tax`), human review against official sources, review dates shown |
| AdSense rejection | Apply with 150+ indexed quality pages; no popups on tools; no ads near inputs |
| Core update volatility | 3 countries, several clusters, affiliate + product + agency leads |
| AI Overviews take simple clicks | Interactive tools and value tables are harder to replace; answer boxes still earn citations |
| Traffic stays India-heavy | 50% of new pages for US/UK; review mix monthly |

---

## 9. Don'ts

- ❌ Meta-keyword lists, hidden text, typo-keyword blocks
- ❌ Popups/interstitials on tool, guide or salary pages
- ❌ Ads above or inside calculator inputs
- ❌ Hundreds of near-identical programmatic pages at once
- ❌ Publishing AI-drafted finance content without a human checking the numbers
- ❌ Buying links
- ❌ Chasing head terms ("salary calculator") before owning the long tail

---

## 10. Next 10 tasks (in order)

1. Deploy, then S2–S5 (Search Console, Bing, IndexNow key, markets set to AdSense)
2. S6: AdSense account + publisher ID in env (ads stay off)
3. Fill real author bios in `data/authors.js`
4. Write 4 guides: HRA exemption (IN), paycheck taxes by state (US), student loans (UK), ATS resume guide
5. Build the mortgage calculator (US, UK)
6. Add 5 more states to the paycheck calculator and refresh CA/NY tables
7. Admin view + CSV export for tax-alert subscribers
8. Add "Free Tools" to the agency header and homepage
9. When ~150 pages are indexed: apply to AdSense (S7)
10. After approval: S8–S9, then start the weekly/monthly review loop (§7)
