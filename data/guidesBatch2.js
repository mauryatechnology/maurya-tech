/**
 * Guides batch 2 (plan task 4). Finance guides ship with `status: 'review'` and stay
 * off the live site until a person has checked every number against the official
 * source, then changed the status to 'published' (see defaultGuides in ./guides.js).
 */
export const guidesBatch2 = [
  {
    slug: 'hra-exemption-calculation-guide',
    status: 'published',
    title: 'HRA Exemption: How to Calculate It, Rules and Worked Examples (FY 2026-27)',
    excerpt: 'How HRA exemption under Section 10(13A) is calculated, which cities count as metro, the documents you need, Section 80GG if you get no HRA, and whether HRA makes the old regime worth it.',
    country: 'IN',
    language: 'en-IN',
    category: 'Taxes & Salary',
    clusterType: 'spoke',
    relatedToolSlug: 'income-tax-calculator',
    author: 'Kuldeep Maurya',
    authorSlug: 'kuldeep-maurya',
    reviewerSlug: 'editorial-team',
    authorRole: 'Founder & Lead Engineer, Maurya Technologies',
    readTime: '9 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'Income Tax Act, Section 10(13A) and Rule 2A', url: 'https://incometaxindia.gov.in/' },
      { name: 'Income Tax Department — Salaried individuals: allowances', url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1' },
      { name: 'Income Tax Department — Section 80GG and Form 10BA', url: 'https://www.incometax.gov.in/' },
    ],
    seo: {
      title: 'HRA Exemption Calculation: Rules & Examples (FY 2026-27)',
      description: 'How to calculate HRA exemption under Section 10(13A): the three-way formula, metro vs non-metro, rent receipts, landlord PAN, 80GG and worked examples.',
      primaryKeyword: 'hra exemption calculation',
      faqSchema: [
        { question: 'How is HRA exemption calculated?', answer: 'It is the lowest of three amounts: the HRA you actually received, rent paid minus 10% of basic salary, and 50% of basic salary in Delhi, Mumbai, Kolkata or Chennai (40% in any other city). Basic includes dearness allowance if it counts for retirement benefits.' },
        { question: 'Can I claim HRA under the new tax regime?', answer: 'No. HRA exemption is available only under the old tax regime. Under the new regime the whole HRA you receive is taxable.' },
        { question: 'Which cities are metro for HRA?', answer: 'Only Delhi, Mumbai, Kolkata and Chennai. Bengaluru, Hyderabad, Pune and other large cities use the 40% limit.' },
        { question: 'Do I need my landlord’s PAN?', answer: 'Yes, if the rent you pay is more than ₹1 lakh in the financial year. Below that, rent receipts or a rent agreement are usually enough for your employer.' },
        { question: 'Can I pay rent to my parents and claim HRA?', answer: 'Yes, if you genuinely pay rent to a parent who owns the house and the parent shows it as rental income in their return. Rent paid to a spouse is generally not accepted.' },
        { question: 'What if my employer does not pay HRA?', answer: 'You may be able to claim Section 80GG under the old regime: the lowest of ₹5,000 a month, 25% of adjusted total income, or rent paid minus 10% of adjusted total income. You file Form 10BA, and you cannot own a house in the city where you live.' },
      ],
    },
    content: `
## The short answer

House Rent Allowance (HRA) is partly tax-free if you live in a rented home and pay rent. Under **Section 10(13A)** and **Rule 2A**, the exempt amount is the **lowest** of three figures:

1. The **HRA you actually received** from your employer.
2. **Rent paid minus 10% of basic salary.**
3. **50% of basic salary** if you live in Delhi, Mumbai, Kolkata or Chennai, or **40% of basic** anywhere else.

Whatever HRA is left over is taxable as salary. The exemption is available **only under the old tax regime** — under the new regime the whole HRA is taxable. To see whether claiming HRA actually makes the old regime cheaper for you, run your numbers through the [new vs old regime income tax calculator](/in/tools/income-tax-calculator).

## The three-way formula, step by step

All three amounts are worked out for the same period — normally the full financial year, or month by month if your rent or salary changed during the year.

**Basic salary** here means basic pay plus dearness allowance (DA) if the DA counts for retirement benefits, plus any commission paid as a fixed percentage of turnover. Other allowances are not included.

**Rent minus 10% of basic** is the limb most people forget. If your rent is low compared with your salary, this figure can be small or even zero, and it then becomes your exemption no matter how much HRA your employer pays.

**The 50% / 40% cap** depends only on the city you actually live in, not where your employer is registered.

| Limb | What it measures | Typical effect |
|---|---|---|
| HRA received | What your salary structure gives you | Binds when HRA is a small part of CTC |
| Rent − 10% of basic | How much rent you pay relative to pay | Binds when rent is low |
| 50% / 40% of basic | A ceiling linked to basic pay | Binds when rent is very high |

## Worked examples

Each example uses annual figures for FY 2026-27 under the old regime.

| Example | City | Basic / year | HRA received | Rent / year | Rent − 10% basic | 50% / 40% of basic | **Exempt HRA** | Taxable HRA |
|---|---|---|---|---|---|---|---|---|
| A | Mumbai (metro) | ₹4,80,000 | ₹2,40,000 | ₹3,60,000 | ₹3,12,000 | ₹2,40,000 | **₹2,40,000** | ₹0 |
| B | Bengaluru (non-metro) | ₹6,00,000 | ₹2,40,000 | ₹2,64,000 | ₹2,04,000 | ₹2,40,000 | **₹2,04,000** | ₹36,000 |
| C | Pune (non-metro) | ₹3,60,000 | ₹1,80,000 | ₹1,44,000 | ₹1,08,000 | ₹1,44,000 | **₹1,08,000** | ₹72,000 |
| D | Delhi (metro) | ₹12,00,000 | ₹6,00,000 | ₹4,80,000 | ₹3,60,000 | ₹6,00,000 | **₹3,60,000** | ₹2,40,000 |

In **example A** the HRA received and the 50% cap tie, so the full HRA is exempt. In **example B** rent minus 10% of basic is the lowest limb, so ₹36,000 of HRA is taxable even though the employee lives in a big city — Bengaluru is not a metro for HRA. In **example C** the rent is low relative to HRA. In **example D** a high earner pays moderate rent, so the rent limb caps the exemption at ₹3.6 lakh.

How much tax this saves depends on your slab. At the old regime's 30% slab plus 4% cess, ₹3,60,000 of exempt HRA saves about ₹1,12,320 a year; at the 20% slab it saves about ₹74,880.

## Month-by-month: when rent or salary changes during the year

The formula works for any period, so when something changes mid-year you calculate each stretch separately and add the results. Say you lived in Pune from April to September and moved to Mumbai from October to March, with basic pay of ₹50,000 a month and HRA of ₹20,000 a month throughout:

| Period | City | Months | Basic | HRA received | Rent paid | Rent − 10% basic | 40% / 50% of basic | Exempt |
|---|---|---|---|---|---|---|---|---|
| Apr–Sep | Pune (40%) | 6 | ₹3,00,000 | ₹1,20,000 | ₹96,000 | ₹66,000 | ₹1,20,000 | ₹66,000 |
| Oct–Mar | Mumbai (50%) | 6 | ₹3,00,000 | ₹1,20,000 | ₹2,10,000 | ₹1,80,000 | ₹1,50,000 | ₹1,20,000 |
| **Year** | | 12 | | ₹2,40,000 | | | | **₹1,86,000** |

Working it out on annual totals instead would give a different, and wrong, answer, because the city limit and the rent changed partway through. Your employer normally does this split for you if you update your declaration when you move.

## How salary structure changes your HRA

Because two of the three limbs depend on basic pay, the way your CTC is split matters. A higher basic raises the 50% / 40% cap but also raises the "10% of basic" that is subtracted from rent. A lower basic does the opposite. For someone paying moderate rent, a lower basic can increase the exemption; for someone paying very high rent in a metro, a higher basic can. Basic pay also drives your PF contribution and gratuity, so it is rarely worth restructuring salary for HRA alone. The [CTC to in-hand calculator](/in/tools/ctc-calculator) lets you change the basic percentage and see the effect on PF and take-home pay.

## Where HRA appears in Form 16 and your return

Your employer reports the exempt HRA in **Part B of Form 16** under allowances exempt under Section 10. In the ITR, the same figure goes in the salary schedule as an exempt allowance, so only the taxable balance of HRA is added to your income. If you claim HRA directly in the return because you missed the employer deadline, the gross salary in your return will be higher than the taxable salary in Form 16 — that is expected, but keep rent receipts and the landlord's PAN ready in case the Income Tax Department asks.

Notices most often follow large HRA claims with no PAN for the landlord, rent paid in cash to a relative who does not declare it, or claims for a city where the taxpayer also owns and lives in a house. Clean documentation avoids almost all of them.

## Which cities count as metro?

For HRA only four cities use the 50% limit: **Delhi, Mumbai, Kolkata and Chennai**. Every other city — including Bengaluru, Hyderabad, Pune, Ahmedabad, Gurugram and Noida — uses 40%. This matters most for people in Bengaluru and Hyderabad with high rent, where the 40% cap often limits the exemption.

## Documents and proofs

- **Rent receipts** or a rent agreement, submitted to your employer through **Form 12BB** so TDS is calculated correctly.
- **Landlord's PAN** if the annual rent is more than ₹1 lakh. If the landlord has no PAN, a signed declaration from the landlord is needed.
- Bank transfer records are the strongest evidence; large cash payments invite questions.
- If you missed the employer deadline, you can still claim the exemption in your income tax return — keep the same documents in case of a notice.

## Common situations

**Paying rent to parents.** Allowed if a parent owns the property, you genuinely pay rent (preferably by bank transfer), and the parent declares it as rental income. Paying rent to a spouse is generally not accepted.

**Owning a house and renting another.** You can claim HRA for a rented home even if you own a house elsewhere — for example, you own a flat in your home town but work in another city. If you own a house in the same city and still rent, expect closer scrutiny and keep a clear reason (distance, size, family needs).

**Changing city or rent mid-year.** Calculate each period separately with the city and rent that applied, then add them up.

**Living in your own home.** No rent, so no HRA exemption; all HRA is taxable. Home-loan interest under Section 24(b) may help instead (old regime).

## No HRA from your employer? Section 80GG

Self-employed people and employees whose salary has no HRA component can claim **Section 80GG** under the old regime. The deduction is the lowest of:

- **₹5,000 a month** (₹60,000 a year),
- **25% of adjusted total income**, and
- **rent paid minus 10% of adjusted total income**.

You must file **Form 10BA**, and you, your spouse or minor child cannot own a house in the city where you live and work.

## Is HRA enough to choose the old regime?

Often not on its own. The new regime for FY 2026-27 makes taxable income up to ₹12 lakh tax-free and has lower slabs, so the old regime usually wins only when HRA is combined with the full ₹1.5 lakh under 80C, health insurance under 80D, NPS under 80CCD(1B) and home-loan interest. The [income tax calculator](/in/tools/income-tax-calculator) shows the exact break-even amount of deductions for your salary, and our [new tax regime guide](/in/guides/2026-budget-new-tax-regime-guide) explains the slabs and the ₹12 lakh rebate.

To see what your CTC turns into each month after PF, professional tax and income tax, use the [CTC to in-hand calculator](/in/tools/ctc-calculator) or browse [in-hand salary for every CTC from 4 to 25 LPA](/in/salary).

## Checklist before you declare HRA

- Confirm which regime you will use this year.
- Check the city type: only Delhi, Mumbai, Kolkata and Chennai are metro.
- Work out all three limbs; the lowest one is your exemption.
- Collect rent receipts and, if annual rent is above ₹1 lakh, the landlord's PAN.
- Pay rent by bank transfer where possible.
- Submit Form 12BB on time, or claim in your return if you miss it.
`,
  },

  {
    slug: 'paycheck-taxes-by-state-2026',
    status: 'published',
    title: 'Paycheck Taxes by State (2026): How Much Each State Takes From Your Pay',
    excerpt: 'How state income tax changes your take-home pay in 2026 — no-tax states, flat-tax states and progressive states compared at $50k, $75k and $100k, plus local taxes and payroll programs.',
    country: 'US',
    language: 'en-US',
    category: 'Taxes & Payroll',
    clusterType: 'spoke',
    relatedToolSlug: 'us-paycheck-calculator',
    author: 'Maurya Technologies Editorial Team',
    authorSlug: 'editorial-team',
    reviewerSlug: 'kuldeep-maurya',
    authorRole: 'Research & Review',
    readTime: '9 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'IRS — Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
      { name: 'California Franchise Tax Board — Tax rates', url: 'https://www.ftb.ca.gov/' },
      { name: 'New York State Department of Taxation and Finance', url: 'https://www.tax.ny.gov/' },
      { name: 'Pennsylvania Department of Revenue — Personal income tax', url: 'https://www.revenue.pa.gov/' },
      { name: 'New Jersey Division of Taxation', url: 'https://www.nj.gov/treasury/taxation/' },
    ],
    seo: {
      title: 'Paycheck Taxes by State 2026: Take-Home Pay Compared',
      description: 'How much state income tax comes out of your paycheck in 2026 — no-tax, flat-tax and progressive states compared at $50k, $75k and $100k a year.',
      primaryKeyword: 'paycheck taxes by state',
      faqSchema: [
        { question: 'Which states have no income tax on wages?', answer: 'Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming do not tax wages.' },
        { question: 'How much state tax is taken out of a $75,000 paycheck?', answer: 'For a single filer in 2026 it ranges from $0 in Texas or Florida to roughly $2,300–$3,600 a year in the states compared here, depending on the state’s rate, deduction and exemption.' },
        { question: 'What is a flat state income tax?', answer: 'One rate applies to all taxable income. Pennsylvania (3.07%), Illinois (4.95%), North Carolina and Georgia use flat rates, though deductions and exemptions still differ.' },
        { question: 'Do I pay state tax where I live or where I work?', answer: 'Usually the state where you work taxes the wages and your home state gives a credit for that tax. Some neighbouring states have reciprocity agreements, so you only pay your home state.' },
        { question: 'Are city and local taxes included in the paycheck calculator?', answer: 'No. Local income taxes such as New York City, Philadelphia and many Ohio and Pennsylvania localities, and state disability or paid-leave premiums, are not included.' },
      ],
    },
    content: `
## The short answer

Every paycheck loses federal income tax, Social Security and Medicare no matter where you live. **State income tax is the part that changes when you move.** For a single filer earning **$75,000** in 2026, federal tax and FICA take about **$13,400** a year in every state. State income tax then adds anything from **$0** in Texas to about **$3,600** in Illinois among the states below.

Use the [paycheck calculator](/us/tools/us-paycheck-calculator) to run your exact salary, filing status, 401(k) and health premiums for your state.

## What comes out of every paycheck

Before state tax, a W-2 employee pays:

- **Federal income tax** on wages minus pre-tax deductions and the standard deduction ($16,100 single, $32,200 married filing jointly, $24,150 head of household for 2026), using brackets from 10% to 37%.
- **Social Security**: 6.2% of wages up to the 2026 wage base of $184,500.
- **Medicare**: 1.45% of all wages, plus 0.9% on wages above $200,000.

On $75,000 single with no pre-tax deductions, that is about $7,670 federal income tax, $4,650 Social Security and $1,088 Medicare. In a no-tax state the take-home is about **$61,593 a year, or $2,369 every two weeks**.

## The three kinds of state income tax

**No tax on wages.** Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming. These states usually raise more from sales or property taxes instead, so lower paycheck tax does not always mean a lower total cost of living.

**Flat tax.** One rate on all taxable income. Pennsylvania (3.07%), Illinois (4.95%), North Carolina and Georgia work this way. The deduction or exemption still matters: Pennsylvania allows none, Illinois gives a personal exemption, and North Carolina and Georgia give a standard deduction.

**Progressive tax.** Rising brackets, like the federal system. California, New York and New Jersey are examples; Massachusetts is flat at 5% but adds a 4% surtax on very high incomes.

## State tax compared at three salaries

Single filer, 2026 federal rules, standard deduction and no pre-tax deductions. State tables are the latest our calculator uses; the year for each state is shown next to it in the [paycheck calculator](/us/tools/us-paycheck-calculator).

| State | State tax at $50,000 | State tax at $75,000 | State tax at $100,000 | Take-home at $75,000 | Per bi-weekly check at $75,000 |
|---|---|---|---|---|---|
| Texas (no income tax) | $0 | $0 | $0 | $61,593 | $2,369 |
| Pennsylvania | $1,535 | $2,303 | $3,070 | $59,290 | $2,280 |
| North Carolina | $1,486 | $2,484 | $3,481 | $59,109 | $2,273 |
| New Jersey | $1,215 | $2,596 | $4,180 | $58,997 | $2,269 |
| California | $1,040 | $2,775 | $5,055 | $58,818 | $2,262 |
| Georgia | $1,747 | $2,994 | $4,242 | $58,599 | $2,254 |
| New York (excl. NYC) | $2,103 | $3,453 | $4,860 | $58,140 | $2,236 |
| Massachusetts | $2,280 | $3,530 | $4,780 | $58,063 | $2,233 |
| Illinois | $2,330 | $3,568 | $4,805 | $58,025 | $2,232 |

Two patterns stand out. **Progressive states are cheap at lower incomes and expensive at higher ones**: California takes less than Pennsylvania at $50,000 but more at $100,000. **Flat states with no deduction** — Pennsylvania especially — tax from the first dollar, but at a low rate.

For a married couple filing jointly on $150,000, state tax ranges from about $4,600 in Pennsylvania to about $7,100 in Illinois and Massachusetts among the same states.

## State-by-state notes

**Texas, Florida, Washington, Nevada, Tennessee.** No tax on wages, so your paycheck has only federal tax and FICA. Washington employees still see paid family and medical leave and WA Cares long-term-care premiums on their payslips.

**Pennsylvania.** A flat 3.07% with no standard deduction or personal exemption, so tax starts with the first dollar. Unusually, employee 401(k) contributions are taxed by Pennsylvania. Almost every municipality also charges a local earned income tax, and Philadelphia has its own wage tax, which can cost more than the state tax.

**North Carolina and Georgia.** Flat rates that have been cut in recent years. North Carolina's rate is 3.99% for 2026 with a $12,750 standard deduction for single filers. Georgia cut its rate to 4.99% for 2026 and raised its standard deduction to $15,000 single and $30,000 married filing jointly; further annual cuts are scheduled from 2027.

**Illinois.** A flat 4.95% after a small personal exemption. Because the exemption is small, Illinois takes more than most flat-tax states at every income level in the table.

**Massachusetts.** A flat 5% after a personal exemption, plus a 4% surtax on taxable income above $1,107,750 in 2026 — which does not affect most paychecks.

**New Jersey.** Progressive brackets from 1.4% to 10.75% with a small personal exemption. Rates are low up to about $75,000 single, then step up to 6.37%. Married couples use a wider set of brackets.

**New York.** Brackets from 3.9% upward — the five lowest rates were each cut by 0.1 percentage point for 2026 — and a standard deduction of $8,000 for single filers. New York City residents pay city income tax on top, which the table excludes.

**California.** The most progressive system in the table: 1% on the first slice of income up to 13.3% above $1 million (including the 1% mental health services tax). A small personal exemption credit is subtracted from the tax. California SDI is also withheld from every paycheck.

## How filing status and 401(k) change the picture

States set their own deductions, exemptions and brackets by filing status, and they do not always mirror the federal rules. Married couples filing jointly usually get double the single deduction or exemption, and in progressive states wider brackets as well, so a couple on $150,000 pays less state tax than a single person on $150,000. Pre-tax 401(k) contributions lower state taxable wages in every state in the table except Pennsylvania, so contributing 5% of a $75,000 salary saves roughly 3–5% of $3,750 in state tax as well as federal tax. Section 125 health premiums lower both federal and state wages almost everywhere.

## What the table does not include

- **Local income taxes.** New York City, Yonkers, Philadelphia, most Pennsylvania municipalities (earned income tax), many Ohio cities, and Maryland and Indiana counties tax wages on top of state tax.
- **State payroll programs.** California SDI, New York disability and paid family leave, New Jersey disability and family leave insurance, and Washington's paid leave and long-term-care premiums are deducted from pay in those states.
- **Pre-tax deductions.** A traditional 401(k) lowers state taxable wages in most states, but **Pennsylvania taxes 401(k) contributions** — the paycheck calculator handles this.
- **Credits and itemized deductions** that you claim when you file the state return.

## Living in one state and working in another

Generally, the state where you physically work taxes those wages, and your home state taxes all your income but gives a credit for tax paid to the work state, so you are not taxed twice on the same pay. Some neighbouring states have **reciprocity agreements** — for example Pennsylvania and New Jersey — so the employer withholds only for your home state once you file the right exemption form. Remote workers should check whether their employer's state has a "convenience of the employer" rule, as New York does.

## How to estimate your own paycheck

1. Start from gross pay per paycheck (salary ÷ 26 for bi-weekly, or hourly rate × hours).
2. Subtract pre-tax deductions such as a traditional 401(k) and Section 125 health premiums.
3. Work out federal income tax on the annualised taxable wages, then divide by the number of paychecks.
4. Take 6.2% Social Security and 1.45% Medicare on wages after Section 125 deductions.
5. Apply your state's deduction or exemption and its rate or brackets.

The [paycheck calculator](/us/tools/us-paycheck-calculator) does all five steps. If you are comparing an hourly job with a salaried one, the [hourly to annual salary calculator](/us/tools/hourly-to-annual-salary) and the [salary and hourly tables](/us/salary) show take-home pay for every common amount. Contractors should also read [W-2 vs 1099 taxes](/us/guides/w2-vs-1099-contractor-tax-guide), because self-employment tax changes the picture more than state tax does.

## Withholding vs the tax you actually owe

The amount your employer withholds is an estimate. Federal withholding follows your W-4 and IRS Publication 15-T; state withholding follows each state's own tables and allowance forms, such as California's DE 4 or New York's IT-2104. If you never submitted a state form, most employers withhold as if you were single with no adjustments, which can over-withhold for married couples. When you file your state return, the tax is recalculated on your full-year income with any credits and itemized deductions, and you receive a refund or owe the difference. If you consistently get a large state refund, updating your state withholding form will increase every paycheck instead.

## Bonuses and second jobs

Many states withhold a flat supplemental rate on bonuses rather than running them through the brackets, so a bonus paycheck can look over- or under-taxed until you file. With two jobs, each employer withholds as if that job were your only income, which often under-withholds in progressive states such as California and New York. Use the paycheck calculator on your combined income to see your true state tax, then adjust withholding on one of the jobs.

## Is moving to a no-tax state worth it?

At $75,000 the gap between Texas and the highest state in the table is about $3,600 a year, or $138 a paycheck. At $100,000 it grows to about $5,000. That is real money, but compare it with rent, property tax, insurance and sales tax before deciding: Texas property taxes and Washington sales taxes are high, and housing costs often outweigh the income-tax difference.
`,
  },

  {
    slug: 'uk-student-loan-repayment-plans-explained',
    status: 'published',
    title: 'UK Student Loan Repayments: Plan 1, 2, 4, 5 and Postgraduate Explained',
    excerpt: 'Which student loan plan you are on, the repayment thresholds, how much comes out of your pay each month at £28k, £35k and £50k, when the loan is written off and whether overpaying makes sense.',
    country: 'UK',
    language: 'en-GB',
    category: 'Tax & Salary',
    clusterType: 'spoke',
    relatedToolSlug: 'ctc-calculator',
    author: 'Maurya Technologies Editorial Team',
    authorSlug: 'editorial-team',
    reviewerSlug: 'kuldeep-maurya',
    authorRole: 'Research & Review',
    readTime: '9 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'GOV.UK — Repaying your student loan: what you pay', url: 'https://www.gov.uk/repaying-your-student-loan/what-you-pay' },
      { name: 'GOV.UK — Which repayment plan you are on', url: 'https://www.gov.uk/repaying-your-student-loan/which-repayment-plan-you-are-on' },
      { name: 'GOV.UK — When your student loan gets written off', url: 'https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled' },
    ],
    seo: {
      title: 'UK Student Loan Repayments: Plans 1, 2, 4 & 5 Explained',
      description: 'UK student loan plans explained: repayment thresholds, 9% and 6% rates, monthly repayments at £28k, £35k and £50k, write-off dates and overpaying.',
      primaryKeyword: 'student loan repayment plans uk',
      faqSchema: [
        { question: 'How much student loan do I repay each month?', answer: '9% of your earnings above your plan’s threshold (6% above £21,000 for a Postgraduate Loan), worked out each pay period. On £35,000 a Plan 5 borrower repays about £75 a month.' },
        { question: 'Which student loan plan am I on?', answer: 'Plan 1 for English or Welsh courses started before September 2012 and all Northern Ireland loans; Plan 2 for English or Welsh courses started from September 2012 to July 2023; Plan 4 for Scottish loans; Plan 5 for English courses started from August 2023.' },
        { question: 'When is a student loan written off?', answer: 'Usually 25 years after you were first due to repay for Plan 1 (some older loans at age 65), 30 years for Plan 2, Plan 4 and Postgraduate Loans, and 40 years for Plan 5.' },
        { question: 'Is student loan repayment taken before or after tax?', answer: 'It is calculated on gross earnings, the same as National Insurance, and taken through payroll alongside Income Tax and NI. It does not reduce your taxable income.' },
        { question: 'Should I overpay my student loan?', answer: 'Only if you expect to clear it before it is written off. Many Plan 2 borrowers will never repay in full, so overpaying can be money they would never have had to pay.' },
        { question: 'What if I have two student loans?', answer: 'With two undergraduate plans you repay 9% above the lowest threshold, split between them. A Postgraduate Loan is charged on top, so you can repay 9% plus 6% at once.' },
      ],
    },
    content: `
## The short answer

UK student loans are repaid as a **percentage of your income above a threshold**, collected through payroll like Income Tax and National Insurance. Undergraduate loans cost **9%** of earnings above your plan's threshold; Postgraduate Loans cost **6%** above **£21,000**. The balance you owe does not change the monthly amount — only your pay does — and whatever is left is written off after 25 to 40 years depending on the plan.

To see what your salary leaves you after Income Tax and NI, use the [UK salary calculator](/uk/tools/ctc-calculator), then subtract the student loan figure from this guide.

## Which plan are you on?

| Plan | Who has it | Rate | Written off |
|---|---|---|---|
| Plan 1 | English or Welsh courses started before 1 September 2012; all Northern Ireland loans | 9% | Usually 25 years after first due to repay (some older loans at 65) |
| Plan 2 | English or Welsh courses started 1 September 2012 – 31 July 2023 | 9% | 30 years after first due to repay |
| Plan 4 | Scottish student loans | 9% | 30 years (some older loans at 65) |
| Plan 5 | English courses started on or after 1 August 2023 | 9% | 40 years after first due to repay |
| Postgraduate Loan | Master's and doctoral loans (England and Wales) | 6% | 30 years after first due to repay |

You can confirm your plan in your online student loan account or on your payslip, which shows the plan type next to the deduction.

## Repayment thresholds

Thresholds are set each tax year. For **2026/27** they are:

| Plan | Annual threshold | Monthly threshold | Weekly threshold |
|---|---|---|---|
| Plan 1 | £26,900 | £2,241 | £517 |
| Plan 2 | £29,385 | £2,448 | £565 |
| Plan 4 | £33,795 | £2,816 | £649 |
| Plan 5 | £25,000 | £2,083 | £480 |
| Postgraduate Loan | £21,000 | £1,750 | £403 |

Plan 1, Plan 2 and Plan 4 thresholds are normally reviewed each April; GOV.UK always shows the figures for the current tax year.

## How much you repay: worked examples

Annual repayments using the 2026/27 thresholds. Divide by 12 for the monthly deduction.

| Salary | Plan 1 | Plan 2 | Plan 4 | Plan 5 | Postgraduate |
|---|---|---|---|---|---|
| £28,000 | £99 (£8/mo) | £0 | £0 | £270 (£23/mo) | £420 (£35/mo) |
| £35,000 | £729 (£61/mo) | £505 (£42/mo) | £108 (£9/mo) | £900 (£75/mo) | £840 (£70/mo) |
| £50,000 | £2,079 (£173/mo) | £1,855 (£155/mo) | £1,458 (£122/mo) | £2,250 (£188/mo) | £1,740 (£145/mo) |

The formula is simply **(salary − threshold) × 9%** for undergraduate plans, or × 6% for a Postgraduate Loan. For take-home pay after tax and NI at these salaries, see [£35,000 after tax](/uk/salary/35000-after-tax) and [£50,000 after tax](/uk/salary/50000-after-tax).

## Repayments are worked out each pay period

Your employer applies the **monthly or weekly threshold**, not the annual one. If your pay jumps in one month — overtime, a bonus — you can repay that month even if your annual salary is below the threshold. If you end the tax year having earned less than the annual threshold, you can ask the Student Loans Company for a refund.

## Your real marginal rate

Student loan repayments sit on top of Income Tax and National Insurance, so they raise your marginal rate. For 2026/27 in England, Wales and Northern Ireland:

- **Basic-rate taxpayer above your threshold:** 20% Income Tax + 8% NI + 9% student loan = **37%** on each extra pound.
- **Higher-rate taxpayer:** 40% + 2% + 9% = **51%**.
- **With a Postgraduate Loan as well:** add another 6%.

This is one reason salary sacrifice into a pension can be attractive for graduates — it reduces the earnings that student loan repayments are calculated on. Our [UK tax bands guide](/uk/guides/uk-paye-tax-bands-explained-2026) explains the Income Tax and NI side in detail.

## Salary sacrifice and student loan repayments: an example

Suppose you earn £40,000, are on Plan 2 and pay 5% (£2,000) into a pension through salary sacrifice. Your contractual salary falls to £38,000, so Income Tax, National Insurance and student loan repayments are all worked out on £38,000:

| | No sacrifice | £2,000 salary sacrifice |
|---|---|---|
| Pay used for deductions | £40,000 | £38,000 |
| Plan 2 repayment (2026/27 threshold £29,385) | £955 | £775 |
| Income Tax + NI saved | — | £560 (20% + 8% of £2,000) |
| Student loan saved | — | £180 |
| Pension contribution | £0 | £2,000 |

The £2,000 in your pension costs you only about £1,260 in take-home pay. If your loan will be written off before you repay it in full, the £180 lower student loan repayment is a genuine saving rather than a delay.

## How it shows on your payslip and P60

Your payslip lists the student loan deduction separately from Income Tax and National Insurance, usually labelled with the plan type, for example "SL Plan 2" or "PGL". Your **P60** at the end of the tax year shows the total student loan deductions for the year. These figures are sent to the Student Loans Company through HMRC, so your online account can take a few weeks to show the latest payments. If your employer is deducting for the wrong plan, ask payroll to correct it — the Student Loans Company sends employers the plan type through HMRC.

## Plan 2 vs Plan 5: what changed for newer students

Students starting English courses from August 2023 moved to Plan 5. Compared with Plan 2, the threshold is lower (£25,000), interest is lower (RPI only, no extra percentage points) and the write-off period is longer (40 years instead of 30). In practice that means Plan 5 borrowers start repaying sooner, repay for longer, and are more likely to repay the loan in full — while lower interest means the balance grows more slowly. For anyone earning a middle income across their career, total repayments on Plan 5 are usually higher than they would have been on Plan 2.

## Earning close to the threshold

If your pay is just above the threshold, repayments are small: on Plan 5 at £26,000 you repay £90 a year, about £7.50 a month. Because the deduction is worked out on each pay period, a one-off overtime payment or bonus can trigger a repayment in that month even if your annual pay is below the threshold. You can claim that money back after the tax year ends if your total income for the year stayed under the annual threshold.

## Interest

Interest is added to the balance but does not change your monthly repayment.

- **Plan 1 and Plan 4:** the lower of RPI inflation or Bank Rate plus 1 percentage point.
- **Plan 2:** RPI plus up to 3 percentage points depending on income (RPI + 3% while studying), subject to caps.
- **Plan 5:** RPI only.
- **Postgraduate Loan:** RPI plus 3 percentage points.

## Student loans are not like other debt

A UK student loan behaves more like a graduate tax than a bank loan. It does not appear on your credit file, missed repayments cannot happen while you are on PAYE because payroll takes them automatically, and the monthly amount depends only on your income — not on the balance or the interest rate. A larger balance only matters if you are likely to repay in full before the write-off date. Mortgage lenders do, however, count your monthly student loan deduction when they assess affordability, because it reduces your take-home pay. Repayments stop when you earn below the threshold, for example during a career break or parental leave, and restart automatically when your pay rises again.

## Self-employed and other cases

If you are self-employed, repayments are collected through your **Self Assessment** tax return, based on your total income above the threshold. If you move abroad you must tell the Student Loans Company and repay on overseas thresholds. If you have **two undergraduate plans** (for example Plan 1 and Plan 2), you repay 9% above the lower threshold and it is split between them; a Postgraduate Loan is charged in addition.

## Should you overpay?

Overpaying only saves money if you would otherwise repay the loan **in full** before it is written off. Many Plan 2 borrowers on average earnings will never clear their balance, so for them extra payments are money they would not have had to pay. Plan 5 borrowers repay for longer (40 years) from a lower threshold, so more of them are expected to clear the loan, and the case for overpaying is stronger for high earners. If you are unsure, putting the money into a pension or ISA keeps your options open.

## Checklist

- Confirm your plan on your payslip or student loan account.
- Check this year's threshold on GOV.UK.
- Use the [UK salary calculator](/uk/tools/ctc-calculator) for take-home after tax and NI, then subtract 9% (or 6%) of pay above the threshold.
- Ask for a refund if you repaid in a year when your total income was below the annual threshold.
- Think twice before overpaying a Plan 2 loan.
`,
  },

  {
    slug: 'ats-resume-guide',
    title: 'ATS Resume Guide: How Applicant Tracking Systems Read Your Resume',
    excerpt: 'How applicant tracking systems parse and rank resumes, what formatting breaks them, how to match keywords honestly, and a step-by-step checklist to tailor your resume for each job.',
    country: 'US',
    language: 'en-US',
    category: 'Careers',
    clusterType: 'pillar',
    relatedToolSlug: 'ats-resume-checker',
    author: 'Kuldeep Maurya',
    authorSlug: 'kuldeep-maurya',
    reviewerSlug: 'editorial-team',
    authorRole: 'Founder & Lead Engineer, Maurya Technologies',
    readTime: '9 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'U.S. Department of Labor — CareerOneStop: Resumes', url: 'https://www.careeronestop.org/JobSearch/Resumes/resumes-and-applications.aspx' },
      { name: 'O*NET OnLine — Skills and occupation keywords', url: 'https://www.onetonline.org/' },
    ],
    seo: {
      title: 'ATS Resume Guide: Format, Keywords and Checklist',
      description: 'How applicant tracking systems read resumes, which formatting breaks parsing, how to match job keywords honestly, and a step-by-step ATS resume checklist.',
      primaryKeyword: 'ats resume guide',
      faqSchema: [
        { question: 'What is an ATS resume?', answer: 'A resume formatted so an applicant tracking system can extract your contact details, job titles, dates, education and skills correctly, and written with the same terms the job description uses.' },
        { question: 'Do ATS systems automatically reject resumes?', answer: 'Most rejections come from knockout questions (work authorization, location, required licences) or from a recruiter reviewing a ranked list, not from the software silently discarding resumes. Poor parsing still hurts because your details may be missing or misfiled.' },
        { question: 'Should I submit a PDF or Word resume?', answer: 'A text-based PDF exported from a word processor parses well in modern systems. Use .docx if the posting asks for it, and never upload a scanned or image-only PDF.' },
        { question: 'Can I use two columns on an ATS resume?', answer: 'It is safer not to. Some parsers read across columns line by line and mix up sections. A single-column layout with clear headings is the most reliable.' },
        { question: 'How many keywords should my resume have?', answer: 'There is no magic number. Include each important skill or tool from the job description that you genuinely have, in the wording the employer uses, and show it in context in your experience bullets.' },
        { question: 'Is keyword stuffing or white text a good idea?', answer: 'No. Recruiters read the parsed text, and hidden keywords are visible to them and look dishonest. Use real, specific evidence instead.' },
      ],
    },
    content: `
## The short answer

An **applicant tracking system (ATS)** is the software employers use to collect applications, parse resumes into structured fields and let recruiters search and rank candidates. Workday, Greenhouse, Lever, iCIMS, SAP SuccessFactors and Taleo are common examples. To get through it you need two things: a resume the software can **read correctly**, and one that uses the **same language as the job description** for skills you actually have.

Paste a job description and your resume into our free [ATS resume checker](/us/tools/ats-resume-checker) to see which keywords are missing and whether your sections are detected.

## What an ATS actually does

When you apply, the system:

1. **Stores your application** and asks screening questions such as work authorization, location or salary expectations. Failing a required "knockout" question is the most common automatic rejection.
2. **Parses your resume** into fields — name, email, phone, job titles, employers, dates, education and skills. This is where formatting matters.
3. **Makes you searchable.** Recruiters filter and search by keywords, titles, locations and skills. Some systems also score or rank applicants against the job.
4. **Shows a human the result.** In nearly every case a recruiter or hiring manager makes the decision, reading the parsed profile or your original file.

The popular claim that "75% of resumes are rejected by ATS" has no reliable source. The real risks are less dramatic but common: your job titles or dates end up in the wrong fields, your skills are not detected, or a recruiter's keyword search simply does not find you.

## Formatting that parses cleanly

| Element | Safe choice | Risky choice |
|---|---|---|
| Layout | Single column, top to bottom | Two or three columns, sidebars |
| Headings | Standard words: Experience, Education, Skills | Creative headings like "My Journey" |
| Contact details | In the body text at the top | Inside the page header or footer |
| Fonts | Common fonts (Calibri, Arial, Garamond, Georgia) at 10–12 pt | Decorative fonts, icons as text |
| Graphics | None, or a simple line divider | Skill bars, charts, photos, logos |
| Tables and text boxes | Avoid for core content | Experience or skills inside tables |
| Dates | "Jan 2023 – Present" or "01/2023 – Present" on the same line as the title | Dates in a separate column |
| File | Text-based PDF or .docx | Scanned or image-only PDF |

Our [resume builder](/us/tools/resume-builder) produces a single-column, ATS-friendly layout and exports a text-based PDF from your browser.

## Keywords: matching without stuffing

Keywords are the skills, tools, certifications and job titles in the posting. Recruiters search for them, and ranking features compare them with your resume.

**Find them.** Read the job description and highlight hard skills (Python, SQL, Salesforce, GAAP), tools, certifications (PMP, CPA, AWS Certified), domain terms and the exact job title. Requirements listed more than once, or under "required", matter most.

**Use the employer's wording.** If the posting says "customer success" and your resume says "client happiness", a search will miss you. Spell out acronyms once — "search engine optimization (SEO)" — so both forms match.

**Prove them in context.** A skills list helps parsing, but recruiters trust bullets that show the skill being used: "Built SQL dashboards in Looker that cut weekly reporting time from 6 hours to 1."

**Stay honest.** Only include what you can discuss in an interview. Hidden white-text keywords and copied job descriptions show up in the parsed text a recruiter reads.

## A resume structure that works

1. **Header:** name, city and state, phone, email, LinkedIn (and portfolio or GitHub if relevant).
2. **Summary (optional):** two or three lines naming your target role, years of experience and two or three headline skills.
3. **Experience:** reverse-chronological. For each role: title, employer, location, dates, then three to six bullets that start with a verb and include a result.
4. **Skills:** grouped plainly — Languages, Tools, Certifications.
5. **Education:** degree, school, year. Add GPA only if it is strong and recent.

One page is normal for under about ten years of experience; two pages are fine for senior roles.

## Tailoring for each application: step by step

1. Save the job description as text.
2. Run it with your resume through the [ATS resume checker](/us/tools/ats-resume-checker) and note the missing keywords.
3. For each missing keyword you genuinely have, add it to a relevant bullet or to Skills.
4. Match your most recent job title to the target title where it is accurate (for example "Software Engineer (Backend)").
5. Move the most relevant bullets to the top of each role.
6. Re-run the check, then read the resume aloud — it must still sound natural to a person.
7. Export as a text-based PDF and name the file "Firstname-Lastname-Resume.pdf".

## Bullets that work for the ATS and the recruiter

A good bullet does three jobs at once: it contains the keyword a recruiter searches for, it shows the skill being used, and it proves the result with a number. A simple pattern is **action verb + what you did + tool or skill + measurable result**.

| Weak bullet | Stronger bullet |
|---|---|
| Responsible for reporting | Built weekly sales dashboards in Tableau, cutting manual reporting from 6 hours to 1 |
| Worked on the website | Rebuilt the checkout in React and TypeScript, lifting mobile conversion by 12% |
| Helped customers | Resolved 40+ Zendesk tickets a day at a 96% satisfaction score |
| Managed projects | Led a 5-person team to ship a Salesforce migration two weeks early and under budget |
| Did data analysis | Wrote SQL and Python models that identified $250k of annual billing leakage |

If you do not have an exact number, use a scale (team size, users, budget, volume) or a before-and-after comparison. Never invent figures — interviewers ask about them.

## Skills sections: what to list and how

A skills section is the easiest place for a parser to find keywords, but it works best as a short, grouped list rather than a wall of buzzwords. Group by type — Languages, Frameworks, Tools, Certifications — and list the items the job description names first. Leave out soft skills such as "team player" or "hard-working"; nobody searches for them, and they are more convincing shown inside a bullet. Avoid rating yourself with bars or percentages, because parsers cannot read graphics and "80% Python" means nothing to a recruiter. Keep versions and certifications precise, for example "AWS Certified Solutions Architect – Associate" rather than "AWS certified", since recruiters often search for the full name of a credential.

## Does the ATS brand matter?

Different systems parse slightly differently, but the same rules work everywhere. Workday often asks you to re-enter your experience in form fields after uploading a resume; check what it auto-filled, because errors there are what recruiters see. Greenhouse and Lever usually show recruiters your original file next to the parsed profile, so design matters a little more there — but a clean single-column layout still reads best. iCIMS and Taleo are older and more sensitive to tables, columns and unusual headings. Rather than guessing which system an employer uses, write one clean resume that every parser can read.

## Cover letters, portfolios and LinkedIn

Cover letters are usually stored as a separate attachment and are rarely parsed for ranking, but recruiters read them for close calls; mirror two or three key requirements from the posting. Make sure your LinkedIn job titles and dates match your resume, because many recruiters check both, and some ATS import LinkedIn profiles directly. For technical roles, a GitHub or portfolio link in the header gives a human reviewer evidence that a keyword list cannot.

## Common mistakes

- Putting contact details in the header or footer, where some parsers ignore them.
- Using a two-column template from a design tool.
- Listing duties ("Responsible for reports") instead of results.
- Sending the same resume to every job.
- Leaving out the exact job title or core tools named in the posting.
- Using images of text, icons for phone and email, or skill-level bars.

## After the ATS: the human read

Once you are found, a recruiter usually spends well under a minute on the first read. Clear headings, numbers in your bullets, and a summary that names the target role all help. If you are weighing an offer, compare it properly: the [hourly to annual salary calculator](/us/tools/hourly-to-annual-salary) converts pay and shows take-home after tax, and our guide to [W-2 vs 1099 taxes](/us/guides/w2-vs-1099-contractor-tax-guide) explains why a contract rate needs to be higher than the equivalent salary.

## Checklist

- Single column, standard headings, no tables or text boxes for core content.
- Contact details in the body, not the header.
- Text-based PDF or .docx.
- Job title and top keywords from the posting, used honestly and in context.
- Bullets with results and numbers.
- Checked with the [ATS resume checker](/us/tools/ats-resume-checker) before you apply.
`,
  },
];
