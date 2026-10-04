import { guidesBatch2 } from './guidesBatch2.js';
import { guidesBatch3 } from './guidesBatch3.js';

export const allGuides = [
  {
    slug: '2026-budget-new-tax-regime-guide',
    title: 'New Tax Regime FY 2026-27: Slabs, ₹12 Lakh Rebate & In-Hand Salary (Worked Examples)',
    excerpt: 'New tax regime slabs for FY 2026-27 (AY 2027-28), the ₹75,000 standard deduction, the ₹12 lakh Section 87A rebate, marginal relief, and exact in-hand salary for CTCs from ₹8 to ₹25 lakh.',
    country: 'IN',
    language: 'en-IN',
    category: 'Taxes & Salary',
    clusterType: 'pillar',
    relatedToolSlug: 'ctc-calculator',
    author: 'Kuldeep Maurya',
    authorSlug: 'kuldeep-maurya',
    reviewerSlug: 'editorial-team',
    authorRole: 'Founder & Lead Engineer, Maurya Technologies',
    readTime: '9 min read',
    date: '2026-02-15',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'Income Tax Department of India', url: 'https://www.incometax.gov.in/' },
      { name: 'Union Budget 2025-26 documents', url: 'https://www.indiabudget.gov.in/' },
      { name: 'EPFO', url: 'https://www.epfindia.gov.in/' },
    ],
    seo: {
      title: 'New Tax Regime FY 2026-27: Slabs, ₹12L Rebate, In-Hand Pay',
      description: 'New regime slabs for FY 2026-27, ₹75,000 standard deduction, ₹12 lakh 87A rebate and marginal relief — with in-hand salary worked out for ₹8–25 lakh CTC.',
      primaryKeyword: 'new tax regime slabs fy 2026-27',
      faqSchema: [
        {
          question: 'What are the new tax regime slabs for FY 2026-27?',
          answer: 'Nil up to ₹4 lakh, 5% from ₹4–8 lakh, 10% from ₹8–12 lakh, 15% from ₹12–16 lakh, 20% from ₹16–20 lakh, 25% from ₹20–24 lakh and 30% above ₹24 lakh, plus 4% cess.',
        },
        {
          question: 'Is income up to ₹12 lakh tax-free under the new regime?',
          answer: 'Yes. If taxable income is ₹12 lakh or less, the Section 87A rebate (up to ₹60,000) reduces tax to zero. With the ₹75,000 standard deduction, salaried employees pay no tax on gross salary up to ₹12.75 lakh.',
        },
        {
          question: 'What is marginal relief under the new regime?',
          answer: 'If taxable income is slightly above ₹12 lakh, tax cannot exceed the income above ₹12 lakh. At ₹12,03,400 taxable income, tax is limited to ₹3,400 plus cess.',
        },
        {
          question: 'Can I claim HRA under the new tax regime?',
          answer: 'No. HRA exemption, Section 80C, 80D and home-loan interest on a self-occupied house are available only under the old regime.',
        },
        {
          question: 'What is the in-hand salary for ₹15 lakh CTC under the new regime?',
          answer: 'About ₹1,13,356 per month, assuming basic pay of 50% of CTC, PF capped at ₹1,800 a month and ₹2,400 professional tax (income tax about ₹94,130 a year).',
        },
      ],
    },
    content: `
## The short answer

For **FY 2026-27 (assessment year 2027-28)** the new tax regime is the default for salaried employees. Three numbers matter most:

- **₹75,000 standard deduction** — subtracted from your gross salary automatically, no proof needed.
- **₹12 lakh rebate limit** — if your taxable income is ₹12,00,000 or less, the Section 87A rebate (up to ₹60,000) wipes out your income tax completely.
- **₹12.75 lakh effective tax-free salary** — ₹12 lakh taxable income plus the ₹75,000 standard deduction.

Above ₹12 lakh, tax is charged from the first rupee on the slabs below, but **marginal relief** makes sure you never pay more tax than the amount by which your income exceeds ₹12 lakh.

---

## New tax regime slabs for FY 2026-27

| Taxable income | Tax rate | Tax on the full slab |
|---|---|---|
| Up to ₹4,00,000 | Nil | ₹0 |
| ₹4,00,001 – ₹8,00,000 | 5% | ₹20,000 |
| ₹8,00,001 – ₹12,00,000 | 10% | ₹40,000 |
| ₹12,00,001 – ₹16,00,000 | 15% | ₹60,000 |
| ₹16,00,001 – ₹20,00,000 | 20% | ₹80,000 |
| ₹20,00,001 – ₹24,00,000 | 25% | ₹1,00,000 |
| Above ₹24,00,000 | 30% | 30% of the excess |

A **4% health and education cess** is added to the tax. A **surcharge** applies above ₹50 lakh (10%), ₹1 crore (15%) and ₹2 crore (25% — the maximum under the new regime).

These slabs were introduced by the Union Budget 2025-26, were left unchanged by the Union Budget 2026-27, and replaced the earlier structure (nil up to ₹3 lakh and a ₹7 lakh rebate limit). If you see the older numbers on other sites or in old offer-letter calculators, they are out of date.

---

## How your in-hand salary is actually calculated

Your offer letter shows **CTC (cost to company)**, but tax is calculated on **gross salary**, and your bank receives **in-hand salary**. The steps:

1. **Gross salary = CTC − employer PF − gratuity (if included in CTC).** Employer PF is 12% of basic pay, often capped at ₹1,800 a month (12% of the ₹15,000 statutory wage ceiling).
2. **Taxable income = gross salary − ₹75,000.** Under the new regime you cannot claim HRA exemption, Section 80C, 80D or the professional-tax deduction. The main extra deduction still available is your employer's contribution to NPS under Section 80CCD(2).
3. **Income tax** = slab tax − Section 87A rebate (or marginal relief) + 4% cess.
4. **In-hand = gross salary − employee PF − professional tax − income tax.**

Professional tax is levied by some states (Maharashtra, Karnataka, West Bengal, Tamil Nadu and others) and is capped at ₹2,500 a year. States such as Delhi and Uttar Pradesh do not levy it.

---

## Worked examples (basic = 50% of CTC, PF capped, ₹2,400 professional tax)

| CTC | Gross salary | Taxable income | Income tax (incl. cess) | Monthly in-hand |
|---|---|---|---|---|
| ₹8 lakh | ₹7,78,400 | ₹7,03,400 | ₹0 | ₹62,867 |
| ₹10 lakh | ₹9,78,400 | ₹9,03,400 | ₹0 | ₹79,533 |
| ₹13 lakh | ₹12,78,400 | ₹12,03,400 | ₹3,536 | ₹1,04,239 |
| ₹15 lakh | ₹14,78,400 | ₹14,03,400 | ₹94,130 | ₹1,13,356 |
| ₹20 lakh | ₹19,78,400 | ₹19,03,400 | ₹1,87,907 | ₹1,47,208 |
| ₹25 lakh | ₹24,78,400 | ₹24,03,400 | ₹3,13,061 | ₹1,78,445 |

### The ₹13 lakh example, step by step

- Gross salary: ₹13,00,000 − ₹21,600 employer PF = **₹12,78,400**
- Taxable income: ₹12,78,400 − ₹75,000 = **₹12,03,400**
- Slab tax: ₹20,000 (5% slab) + ₹40,000 (10% slab) + ₹510 (15% on ₹3,400) = ₹60,510
- Income above ₹12 lakh is only ₹3,400, so **marginal relief** cuts tax to ₹3,400
- Cess at 4%: ₹136 → **total tax ₹3,536**

Without marginal relief this employee would pay over ₹62,000 in tax for earning ₹3,400 more than the rebate limit. That is exactly the cliff that marginal relief removes.

---

## New regime vs old regime: who should switch?

The old regime still exists and keeps deductions such as HRA exemption, ₹1.5 lakh under Section 80C, a ₹50,000 standard deduction, health-insurance premiums under 80D and home-loan interest up to ₹2 lakh under Section 24(b). Its slabs, however, are much steeper (30% above ₹10 lakh).

As a rule of thumb:

- If your taxable income after the standard deduction is **up to ₹12 lakh**, the new regime is almost always better — you pay zero tax.
- Above that, the old regime only wins if your total deductions are large — typically a combination of high rent in a metro (big HRA exemption), full 80C, 80D and a home loan on a self-occupied house.

Salaried employees can switch between regimes every year when filing their return, so compare both before the deadline rather than relying on the declaration you gave your employer.

---

## Employee Provident Fund (EPF): the biggest deduction you do not see

Under the EPF Act, **12% of basic pay (plus dearness allowance)** is deducted from your salary and your employer contributes a matching 12% (part of which goes to the Employees' Pension Scheme). Many private employers cap the contribution at 12% of ₹15,000, i.e. **₹1,800 a month**, which raises monthly take-home pay.

If your employer contributes on your full basic instead, your in-hand pay falls but your retirement savings rise — the money is still yours, just locked in.

---

## Employer NPS: the one big deduction left in the new regime

Almost every deduction disappears under the new regime, but your **employer's contribution to NPS under Section 80CCD(2)** survives — up to **14% of basic pay plus DA**. If your employer lets you restructure part of your CTC into employer NPS, your taxable income falls by the same amount.

Take a ₹20 lakh CTC with ₹10 lakh basic. Moving ₹1,40,000 (14% of basic) into employer NPS cuts taxable income from ₹19,03,400 to ₹17,63,400 and income tax from **₹1,87,907 to ₹1,58,787 — a saving of ₹29,120 a year**. The catch: that money is locked in NPS until retirement, and part of the corpus must then be used to buy an annuity (check PFRDA's current exit rules). Total employer contributions to PF, NPS and superannuation above ₹7.5 lakh a year are taxable, which only matters for very high earners.

---

## How your employer deducts TDS every month

Your employer estimates your tax for the whole year from your salary and the regime you declared, then deducts it in equal monthly instalments. If your pay changes mid-year — a raise, a bonus, arrears — the remaining months' TDS is recalculated, which is why the deduction can jump in February or March.

If you **change jobs**, give your new employer your earlier salary and TDS for the year (Form 12B or a declaration). Otherwise both employers apply the rebate and lower slabs separately, too little tax is deducted, and you owe the balance when you file. If you declared the **old regime**, expect to submit rent receipts and investment proofs between January and March; without them the employer deducts tax as if you had no deductions.

---

## High incomes: surcharge and marginal relief

Above ₹50 lakh of taxable income a surcharge is added to the tax, but **marginal relief** stops the surcharge from costing more than the income that crossed the threshold.

| Taxable income | Surcharge | Total tax (incl. cess) |
|---|---|---|
| ₹50,00,000 | ₹0 | ₹11,23,200 |
| ₹50,50,000 | ₹35,000 (after relief; a flat 10% would be ₹1,09,500) | ₹11,75,200 |
| ₹55,00,000 | ₹1,23,000 | ₹14,07,120 |
| ₹1,01,00,000 | ₹3,28,000 (after relief) | ₹30,55,520 |

At ₹50.5 lakh, the extra ₹50,000 of income can raise tax plus surcharge by at most ₹50,000 before cess — so relief brings the surcharge down from ₹1,09,500 to ₹35,000.

---

## The new Income-tax Act, 2025

From **1 April 2026** the Income-tax Act, 2025 replaces the Income-tax Act, 1961. It replaces "previous year" and "assessment year" with a single **tax year** and renumbers most sections, so Section 87A, 80C and 10(13A) have new numbers in the law. The Union Budget 2026-27 kept the new-regime slabs, the ₹75,000 standard deduction and the ₹12 lakh rebate unchanged for FY 2026-27, so the numbers in this guide are the same under both Acts. Payslips, Form 16 and most employers still use the familiar section numbers during the changeover.

---

## Common mistakes when reading a salary offer

- **Dividing CTC by 12.** It ignores employer PF, gratuity and insurance that are part of CTC but never paid monthly.
- **Counting variable pay as guaranteed.** Performance bonuses are paid only if targets are met, and often annually.
- **Using the old ₹7 lakh rebate limit.** Many calculators still use it and overstate tax for salaries between roughly ₹8 lakh and ₹15 lakh.
- **Forgetting that joining and retention bonuses are taxable** in the year they are paid.

---

## Calculate your own number

Every figure in this guide comes from the same engine as our calculator. Enter your CTC, basic pay percentage and PF choice to get your exact monthly in-hand salary:

👉 **[CTC to In-Hand Salary Calculator](/in/tools/ctc-calculator)**

Or jump straight to a ready-made breakdown: [₹10 LPA](/in/salary/10-lpa-in-hand-salary) · [₹12 LPA](/in/salary/12-lpa-in-hand-salary) · [₹15 LPA](/in/salary/15-lpa-in-hand-salary) · [₹20 LPA](/in/salary/20-lpa-in-hand-salary) · [₹25 LPA](/in/salary/25-lpa-in-hand-salary)

*Rates reviewed on 4 October 2026 against Income Tax Department and Budget 2025-26 and 2026-27 documents. Tax rules change with each Union Budget — check the latest notification before filing.*

    `,
  },
  {
    slug: 'w2-vs-1099-contractor-tax-guide',
    title: 'W-2 vs 1099: Taxes, Take-Home Pay and Contract Rates (2026)',
    excerpt: 'How W-2 employment and 1099 contracting differ on tax, withholding and benefits — with 2026 take-home pay compared at $60k, $100k and $150k and a step-by-step self-employment tax example.',
    country: 'US',
    language: 'en-US',
    category: 'Taxes & Payroll',
    clusterType: 'pillar',
    relatedToolSlug: 'hourly-to-annual-salary',
    author: 'Maurya Technologies Editorial Team',
    authorSlug: 'editorial-team',
    reviewerSlug: 'kuldeep-maurya',
    lastReviewed: '2026-10-04',
    authorRole: 'Research & Review',
    readTime: '8 min read',
    date: '2026-01-20',
    sources: [
      { name: 'IRS — Self-employment tax', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
      { name: 'IRS — Independent contractor or employee?', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee' },
      { name: 'IRS — Estimated taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' },
      { name: 'SSA — Contribution and benefit base', url: 'https://www.ssa.gov/oact/cola/cbb.html' },
    ],
    seo: {
      title: 'W-2 vs 1099: Taxes and Take-Home Pay Compared (2026)',
      description: 'W-2 vs 1099 explained: withholding, 15.3% self-employment tax, benefits and quarterly taxes — with 2026 take-home pay compared at $60k, $100k and $150k.',
      primaryKeyword: 'w2 vs 1099 tax comparison',
      faqSchema: [
        { question: 'What is the self-employment tax rate in 2026?', answer: '15.3% — 12.4% Social Security (up to the $184,500 wage base) and 2.9% Medicare — applied to 92.35% of net self-employment earnings. Half of it is deductible.' },
        { question: 'Do 1099 contractors take home less than W-2 employees?', answer: 'At the same gross pay, yes. At $100,000, a single W-2 employee keeps about $79,180 after federal tax and FICA versus about $77,635 for a contractor (after the 20% QBI deduction), before business expenses and state tax.' },
        { question: 'How much higher should a 1099 rate be than a W-2 wage?', answer: 'Many contractors start at 1.25× to 1.5× the equivalent W-2 hourly rate to cover the employer half of FICA, benefits, paid leave and unbilled time.' },
        { question: 'Do 1099 contractors have to pay quarterly taxes?', answer: 'Generally yes. Without withholding, contractors usually pay estimated tax four times a year with Form 1040-ES to avoid underpayment penalties.' },
        { question: 'Can I choose to be a 1099 contractor?', answer: 'Classification depends on the actual working relationship — control over how, when and where work is done — not only on the contract label.' },
      ],
    },
    content: `
## The short answer

A **W-2 employee** has income tax withheld from every paycheck and pays only half of Social Security and Medicare (7.65%); the employer pays the other half and usually adds benefits. A **1099 independent contractor** is paid gross, pays **both halves** as self-employment tax (15.3% on 92.35% of net earnings), makes quarterly estimated tax payments, and funds their own benefits — but can deduct business expenses.

At the same headline pay, a contractor takes home less. That is why contract rates are usually quoted well above the equivalent salary.

---

## Side-by-side comparison

| | W-2 employee | 1099 contractor |
|---|---|---|
| Social Security + Medicare | 7.65% (employer pays another 7.65%) | 15.3% self-employment tax on 92.35% of net earnings |
| Tax withholding | Employer withholds every paycheck | None — you pay quarterly estimated taxes |
| Benefits (health, 401(k) match, PTO) | Often provided or subsidised | Self-funded |
| Business expenses | Generally not deductible | Deductible on Schedule C |
| Year-end form | Form W-2 | Form 1099-NEC |
| Overtime and minimum-wage protection | Covered by FLSA if non-exempt | Not covered |

---

## How much you actually take home (2026, single filer, before state tax)

These figures use the 2026 federal brackets, the $16,100 standard deduction, and the Social Security wage base of $184,500. For contractors, half of self-employment tax is deducted before income tax, and the 20% qualified business income (QBI) deduction is applied, as the IRS allows.

| Gross income | W-2 take-home | 1099 take-home | Difference |
|---|---|---|---|
| $60,000 | $50,390 | $47,963 | $2,427 |
| $100,000 | $79,180 | $77,635 | $1,545 |
| $150,000 | $113,791 | $112,392 | $1,399 |

The contractor column is **before** business deductions. Real expenses — a laptop, software, a home office, health-insurance premiums (often deductible for the self-employed) — reduce taxable income and narrow the gap.

---

## The self-employment tax, step by step

For a contractor earning $100,000 net:

1. **Self-employment base:** $100,000 × 92.35% = $92,350
2. **Self-employment tax:** $92,350 × 15.3% = **$14,130** (12.4% Social Security + 2.9% Medicare)
3. **Deduct half:** $7,065 comes off income before federal income tax
4. **Income before the QBI deduction:** $100,000 − $7,065 − $16,100 standard deduction = $76,835
5. **QBI deduction:** 20% of the lower of qualified business income ($100,000 − $7,065 = $92,935) and taxable income before QBI ($76,835) = **$15,367**
6. **Taxable income:** $76,835 − $15,367 = $61,468
7. **Federal income tax:** about **$8,235**

The same $100,000 as a W-2 salary produces $7,650 of FICA and $13,170 of federal income tax. The contractor pays much less income tax (thanks to the SE-tax and QBI deductions) but much more payroll tax.

Social Security tax stops once earnings pass the annual wage base ($184,500 in 2026); Medicare does not, and an extra 0.9% Additional Medicare Tax applies above $200,000.

---

## The QBI deduction: why contractors keep more than you might expect

Since 2018, most self-employed people can deduct up to **20% of their qualified business income** under Section 199A, and the One Big Beautiful Bill Act made the deduction permanent. For a sole proprietor, qualified business income is roughly net profit minus the deductible half of self-employment tax, self-employed health insurance and retirement contributions. The deduction is capped at 20% of taxable income before the deduction, which is why it is $15,367 rather than $18,587 in the $100,000 example.

For 2026, single filers with taxable income up to **$201,750** ($403,500 married filing jointly) get the full deduction whatever their line of work. Above that, the deduction phases out for "specified service" businesses — consulting, health, law, accounting, financial services, performing arts and similar — and becomes limited by wages paid and property held for other businesses; for a one-person consultancy it disappears completely by $276,750 of taxable income. The QBI deduction reduces income tax only; it does not reduce self-employment tax.

---

## Retirement savings for contractors

Losing an employer 401(k) match hurts, but contractors have generous alternatives:

| Plan | How much you can put in (2026) | Good for |
|---|---|---|
| Solo 401(k) | $24,500 as "employee" plus up to 20% of net self-employment earnings as "employer", up to $72,000 in total (plus catch-up from age 50) | Highest contributions at moderate incomes; Roth option |
| SEP IRA | Up to 20% of net self-employment earnings, up to $72,000 | Simple to open and run |
| Traditional or Roth IRA | $7,500 (plus $1,100 catch-up from age 50) | Anyone with earned income |

For the $100,000 contractor above, net self-employment earnings for the calculation are $92,935, so a Solo 401(k) could take $24,500 plus 20% × $92,935 = $18,587 — about **$43,087** in total, all deductible if made as traditional contributions. A SEP IRA would allow only the $18,587. Use the [401(k) calculator](/us/tools/401k-calculator) to see how either amount could grow.

---

## Health insurance and other benefits

A W-2 job often includes subsidised health insurance worth several thousand dollars a year, plus paid holidays, sick leave and sometimes disability and life cover. Contractors pay for all of these themselves. Health insurance premiums for you, your spouse and dependants are usually deductible as an adjustment to income (the self-employed health insurance deduction), provided you are not eligible for an employer plan through another job or a spouse's job. Marketplace plans under the Affordable Care Act may come with premium tax credits depending on household income. When you compare offers, price these benefits explicitly rather than looking only at the headline pay.

---

## Quarterly estimated taxes

Because nothing is withheld, contractors generally must pay estimated tax four times a year (mid-April, mid-June, mid-September and mid-January) using Form 1040-ES. Underpaying can trigger a penalty. A common approach is to move 25–30% of every invoice into a separate tax account the day it is paid.

You avoid the underpayment penalty if your estimated payments cover at least **90% of this year's tax** or **100% of last year's tax** (110% if last year's adjusted gross income was over $150,000). In your first year of contracting, basing payments on last year's total tax as an employee is often the simplest safe harbor — any balance is then due by the April filing deadline, without a penalty.

---

## What contract rate matches a salary?

To compare offers fairly, a contractor rate must cover:

- The employer half of FICA you now pay yourself (≈7.65%)
- Health insurance, retirement contributions and paid time off you no longer receive
- Unbilled time between contracts and on admin and sales

Many contractors aim for **1.25× to 1.5× the equivalent W-2 hourly rate** as a starting point; specialised or short contracts often command more. Use our [freelance rate calculator](/us/tools/freelance-rate-calculator) to set a rate from your own costs.

---

## Hourly to annual: quick conversions

A full-time year is 2,080 hours (40 hours × 52 weeks). See a full breakdown, including take-home pay, for common rates:

[$20 an hour](/us/salary/20-an-hour-is-how-much-a-year) · [$25 an hour](/us/salary/25-an-hour-is-how-much-a-year) · [$30 an hour](/us/salary/30-an-hour-is-how-much-a-year) · [$40 an hour](/us/salary/40-an-hour-is-how-much-a-year) · [$50 an hour](/us/salary/50-an-hour-is-how-much-a-year) · [all rates](/us/salary)

---

## State taxes for contractors

State income tax treats contractors and employees much the same: the same brackets and deductions apply to your net self-employment income as to wages. Two differences matter. First, nothing is withheld, so state estimated payments are usually due on a similar quarterly schedule to the federal ones. Second, some cities and states tax business income separately — for example New York City's unincorporated business tax and Philadelphia's business income and receipts tax — so check local rules before you sign. Our [paycheck calculator](/us/tools/us-paycheck-calculator) shows how much each state takes from a W-2 salary for comparison.

---

## Checklist before accepting a 1099 contract

- Convert the rate to an annual figure at realistic billable hours — rarely 2,080; 1,600–1,800 is common after holidays, sickness and gaps between contracts.
- Subtract the extra 7.65% self-employment tax and the cost of health insurance, retirement savings and paid time off.
- Check whether you qualify for the full QBI deduction at your expected income.
- Set aside 25–30% of every payment for federal and state taxes and pay estimates quarterly.
- Keep receipts and a separate business bank account so expenses are easy to claim.
- Confirm the working relationship really is independent; if it looks like employment, ask why it is not W-2.

---

## Is it your choice?

Not entirely. Whether you are an employee or a contractor depends on the working relationship — behavioural control, financial control and how the relationship is structured — not just on what the contract says. Misclassification can leave workers without protections and employers with back taxes. If a client controls your hours, tools and methods like an employer would, ask whether W-2 employment is the correct status.

---

## Run your own numbers

👉 **[Hourly to Annual Salary & Tax Calculator](/us/tools/hourly-to-annual-salary)** — switch between W-2 and 1099 and add your state tax rate.

*Figures reviewed on 4 October 2026 against IRS 2026 inflation adjustments (Rev. Proc. 2025-32) and the SSA wage base. This is general information, not tax advice.*

    `,
  },
  {
    slug: 'uk-paye-tax-bands-explained-2026',
    title: 'UK Income Tax Bands 2026/27: Take-Home Pay, NI and Pensions',
    excerpt: 'UK Income Tax bands and National Insurance for 2026/27, the £100k Personal Allowance taper, take-home pay at six common salaries and how pensions change your payslip.',
    country: 'UK',
    language: 'en-GB',
    category: 'Salary & Taxes',
    clusterType: 'pillar',
    relatedToolSlug: 'ctc-calculator',
    author: 'Maurya Technologies Editorial Team',
    authorSlug: 'editorial-team',
    reviewerSlug: 'kuldeep-maurya',
    lastReviewed: '2026-10-04',
    authorRole: 'Research & Review',
    readTime: '8 min read',
    date: '2026-03-01',
    sources: [
      { name: 'GOV.UK — Income Tax rates and Personal Allowances', url: 'https://www.gov.uk/income-tax-rates' },
      { name: 'GOV.UK — National Insurance rates and categories', url: 'https://www.gov.uk/national-insurance-rates-letters' },
      { name: 'GOV.UK — Workplace pensions', url: 'https://www.gov.uk/workplace-pensions' },
      { name: 'GOV.UK — Scottish Income Tax', url: 'https://www.gov.uk/scottish-income-tax' },
    ],
    seo: {
      title: 'UK Tax Bands 2026/27: Take-Home Pay, NI & Pensions',
      description: 'UK Income Tax bands and National Insurance for 2026/27, the £100k allowance taper, and take-home pay at £25k–£110k with a worked £60,000 example.',
      primaryKeyword: 'uk tax bands 2026/27',
      faqSchema: [
        { question: 'What is the UK Personal Allowance for 2026/27?', answer: '£12,570. It is reduced by £1 for every £2 of income above £100,000 and is zero at £125,140.' },
        { question: 'What are the UK Income Tax bands for 2026/27?', answer: '20% on £12,571–£50,270, 40% on £50,271–£125,140 and 45% above £125,140 in England, Wales and Northern Ireland. Scotland has different bands.' },
        { question: 'How much National Insurance do employees pay?', answer: '8% on earnings between £12,570 and £50,270 a year and 2% above £50,270.' },
        { question: 'What is the take-home pay on £60,000?', answer: 'About £45,357 a year (£3,780 a month) after £11,432 Income Tax and £3,211 National Insurance, with a 1257L code and no pension or student loan.' },
        { question: 'Do pension contributions reduce tax?', answer: 'Yes. Contributions get tax relief at your marginal rate, and salary-sacrifice schemes also save National Insurance.' },
      ],
    },
    content: `
## The short answer

For the **2026/27 tax year** (6 April 2026 – 5 April 2027) in England, Wales and Northern Ireland:

- The first **£12,570** of income is tax-free (Personal Allowance).
- Income above that is taxed at **20%** (basic rate) up to £50,270, **40%** (higher rate) up to £125,140, and **45%** (additional rate) above.
- Employees also pay **National Insurance** of **8%** on earnings between £12,570 and £50,270 and **2%** above.

These thresholds are frozen, so as pay rises, more of it is taxed at higher rates — often called "fiscal drag".

---

## Income Tax bands for 2026/27

| Band | Income | Rate |
|---|---|---|
| Personal Allowance | Up to £12,570 | 0% |
| Basic rate | £12,571 – £50,270 | 20% |
| Higher rate | £50,271 – £125,140 | 40% |
| Additional rate | Over £125,140 | 45% |

**The £100,000 taper:** above £100,000 of adjusted net income, the Personal Allowance falls by £1 for every £2 earned, disappearing entirely at £125,140. Between those two figures each extra £1 is effectively taxed at 60% (plus 2% National Insurance).

**Scotland** sets its own Income Tax bands and rates on earned income (starter, basic, intermediate, higher, advanced and top rates). National Insurance is the same across the UK.

---

## National Insurance for employees

| Annual earnings | Employee Class 1 rate |
|---|---|
| Up to £12,570 | 0% |
| £12,570 – £50,270 | 8% |
| Above £50,270 | 2% |

National Insurance is calculated on each pay period rather than annually, so a one-off bonus can push a single month into the 2% band even if your annual pay is below £50,270. Employer National Insurance is paid on top of your salary and is not deducted from your pay.

---

## Take-home pay at common salaries (2026/27)

Standard 1257L tax code, no pension, student loan or benefits in kind:

| Salary | Income Tax | National Insurance | Take-home per year | Per month |
|---|---|---|---|---|
| £25,000 | £2,486 | £994 | £21,520 | £1,793 |
| £35,000 | £4,486 | £1,794 | £28,720 | £2,393 |
| £50,000 | £7,486 | £2,994 | £39,520 | £3,293 |
| £60,000 | £11,432 | £3,211 | £45,357 | £3,780 |
| £80,000 | £19,432 | £3,611 | £56,957 | £4,746 |
| £110,000 | £33,432 | £4,211 | £72,357 | £6,030 |

### Worked example: £60,000

- Personal Allowance: £12,570 → taxable income £47,430
- Basic rate: £37,700 × 20% = £7,540
- Higher rate: £9,730 × 40% = £3,892
- **Income Tax: £11,432**
- National Insurance: £37,700 × 8% + £9,730 × 2% = **£3,211**
- **Take-home: £45,357 a year (£3,780 a month)**

See detailed breakdowns for [£30,000](/uk/salary/30000-after-tax), [£40,000](/uk/salary/40000-after-tax), [£50,000](/uk/salary/50000-after-tax), [£60,000](/uk/salary/60000-after-tax) or [every salary from £15k to £100k](/uk/salary).

---

## The 60% trap between £100,000 and £125,140

Because the Personal Allowance is withdrawn above £100,000, earnings in this range are taxed at 40% plus the tax on the lost allowance — an effective **60% Income Tax rate**, or 62% with National Insurance.

| Salary | Personal Allowance | Income Tax | National Insurance | Take-home |
|---|---|---|---|---|
| £100,000 | £12,570 | £27,432 | £4,011 | £68,557 |
| £110,000 | £7,570 | £33,432 | £4,211 | £72,357 |
| £125,140 | £0 | £42,516 | £4,513 | £78,111 |

A £10,000 pay rise from £100,000 to £110,000 adds only **£3,800** to take-home pay. Turn it round and the same £10,000 paid into a pension through salary sacrifice costs a £110,000 earner just £3,800 of take-home pay — one of the most generous tax reliefs in the system. Parents in this range may also lose tax-free childcare and some free childcare hours, which makes the trap even steeper.

---

## How PAYE spreads tax across the year

PAYE normally works on a **cumulative** basis. Each month your employer gives you 1/12 of your Personal Allowance and each tax band, compares the tax due on your pay so far this tax year with the tax already deducted, and takes the difference. That is why:

- if you start your first job partway through the year, your early payslips can show little or no tax — you have unused allowance from the months you were not working;
- if your pay falls, a later payslip can include a **tax refund**;
- a large bonus in one month is taxed at your marginal rate but not "over-taxed" for the year, because later months even it out.

If your code ends in **W1** or **M1** (or "X" on your payslip), you are on a non-cumulative **emergency code**: each pay period is taxed on its own, and any overpayment is refunded at the end of the year or once HMRC sends your employer the right code.

---

## Tax codes in plain English

| Code | What it means |
|---|---|
| 1257L | The standard Personal Allowance of £12,570 |
| BR | All income taxed at the basic rate — usually a second job |
| D0 / D1 | All income taxed at the higher or additional rate — usually a second job for higher earners |
| 0T | No Personal Allowance — often when HMRC lacks your details or your allowance is used up |
| K codes | Untaxed income or benefits exceed your allowance, so tax is added rather than deducted |
| S or C prefix | Scottish or Welsh taxpayer rates |

Check your code in the HMRC app or your personal tax account. A wrong code is the most common reason for paying the wrong amount of tax, especially after changing jobs or getting a company car.

---

## Child Benefit and the £60,000 threshold

If you or your partner receive Child Benefit and either of you has adjusted net income above **£60,000**, the High Income Child Benefit Charge claws it back at 1% for every £200 of income above £60,000, so it is fully repaid at £80,000. It is based on the higher earner's income, not household income. Pension contributions reduce adjusted net income, so they can reduce or remove the charge as well as cutting Income Tax.

---

## What your employer pays on top

Your employer also pays **employer National Insurance of 15%** on your earnings above £5,000 a year, plus at least 3% of qualifying earnings into your workplace pension. Neither comes out of your pay, but they are part of what you cost to employ — useful context when negotiating, and the reason salary sacrifice is popular with employers too: it lowers their National Insurance bill.

---

## Workplace pensions

Under automatic enrolment, the minimum total contribution is **8% of qualifying earnings** — at least 3% from your employer, with the rest from you (including tax relief). Pension contributions reduce your take-home pay by less than their face value, because they attract tax relief:

- **Relief at source / net pay:** contributions get relief at your marginal Income Tax rate.
- **Salary sacrifice:** you also save National Insurance, because your contractual salary is lower.

For higher earners near £100,000, pension contributions can restore the Personal Allowance and avoid the 60% band.

---

## Other deductions that change your payslip

- **Student loan repayments** (Plans 1, 2, 4, 5 and Postgraduate) — a percentage of earnings above the plan's threshold.
- **Tax code changes** — company car or medical benefits, underpaid tax from a previous year, or emergency tax when you start a new job.
- **Marriage Allowance** — lets a lower-earning spouse transfer part of their allowance.

---

## Scotland and Wales

Scottish taxpayers pay Scottish Income Tax on earned income, with more bands than the rest of the UK — starter, basic, intermediate, higher, advanced and top rates — set each year by the Scottish Parliament. The Personal Allowance and National Insurance are the same everywhere in the UK, so a Scottish taxpayer's take-home pay differs only in the Income Tax line. Welsh taxpayers currently pay the same overall rates as England, although part of the tax goes to the Welsh Government. Your tax code starts with **S** in Scotland and **C** in Wales; if it does not match where you live, tell HMRC.

---

## Checklist: is your payslip right?

- Your tax code is 1257L unless you have benefits, a second job or untaxed income.
- Income Tax and National Insurance roughly match the tables above for your salary.
- Pension contributions appear, and salary sacrifice reduces the gross pay used for tax and NI.
- Student loan deductions use the right plan type.
- Your year-to-date figures carry over correctly after a job change (check your P45).
- At the end of the tax year your P60 totals agree with your last payslip.

---

## Check your own take-home pay

👉 **[UK Salary Calculator](/uk/tools/ctc-calculator)** · **[Student loan repayment calculator](/uk/tools/student-loan-calculator)** · **[Mortgage calculator](/uk/tools/mortgage-calculator)** · **[UK hourly wage calculator](/uk/tools/hourly-to-annual-salary)**

*Rates reviewed on 4 October 2026 against GOV.UK Income Tax and National Insurance guidance. This is general information, not tax or financial advice.*

    `,
  },
  ...guidesBatch2,
  ...guidesBatch3,
];

/**
 * Only published guides are routed, listed, linked and put in the sitemap. A guide with
 * `status: 'review'` waits for a person to verify every number against the official
 * source (plan §3.3); /admin/seo lists it, then flip it to 'published'.
 */
export const defaultGuides = allGuides.filter((g) => (g.status || 'published') === 'published');

export function getGuidesForCountry(countryCode = 'IN') {
  const normalized = (countryCode || 'IN').toUpperCase();
  return defaultGuides.filter((g) => g.country === normalized);
}

export function getGuideBySlug(slug, countryCode = 'IN') {
  const normalized = (countryCode || 'IN').toUpperCase();
  return defaultGuides.find((g) => g.slug === slug && g.country === normalized) || null;
}
