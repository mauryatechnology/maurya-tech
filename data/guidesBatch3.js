/**
 * Guides batch 3 (plan §3.3, one per group). Finance guides ship with
 * `status: 'review'` until a person has read them; figures were computed with
 * lib/finance and lib/tax on 2026-10-04 and checked against the cited sources.
 */
export const guidesBatch3 = [
  {
    slug: '401k-basics-employer-match-2026',
    status: 'published',
    title: '401(k) Basics for 2026: Limits, Employer Match, Roth vs Traditional',
    excerpt: 'How a 401(k) works in 2026 — the $24,500 limit and catch-up rules, how employer matches are calculated, traditional vs Roth, vesting, withdrawals and what to do when you change jobs.',
    country: 'US',
    language: 'en-US',
    category: 'Retirement & Payroll',
    clusterType: 'spoke',
    relatedToolSlug: '401k-calculator',
    author: 'Maurya Technologies Editorial Team',
    authorSlug: 'editorial-team',
    reviewerSlug: 'kuldeep-maurya',
    authorRole: 'Research & Review',
    readTime: '10 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'IRS — 401(k) limit increases to $24,500 for 2026', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
      { name: 'IRS — Catch-up contributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions' },
      { name: 'IRS — Notice 2025-67 (2026 retirement plan amounts)', url: 'https://www.irs.gov/pub/irs-drop/n-25-67.pdf' },
      { name: 'IRS — Hardships, early withdrawals and loans', url: 'https://www.irs.gov/retirement-plans/hardships-early-withdrawals-and-loans' },
    ],
    seo: {
      title: '401(k) Basics 2026: Limits, Match and Roth vs Traditional',
      description: '401(k) rules for 2026: the $24,500 limit, catch-up at 50 and 60–63, how employer matches work, Roth vs traditional, vesting and withdrawals explained.',
      primaryKeyword: '401k basics 2026',
      faqSchema: [
        { question: 'How much can I put in a 401(k) in 2026?', answer: '$24,500 of your own salary deferrals, plus $8,000 of catch-up contributions if you are 50 or older ($11,250 if you are 60 to 63).' },
        { question: 'How does a 401(k) match work?', answer: 'Your employer adds money based on what you contribute. A 50% match up to 6% of pay means contributing 6% of a $60,000 salary ($3,600) earns $1,800 from your employer.' },
        { question: 'Should I choose a Roth or traditional 401(k)?', answer: 'Traditional contributions cut your tax now and are taxed when withdrawn; Roth contributions are taxed now and qualified withdrawals are tax-free. Roth tends to suit people who expect a higher tax rate in retirement.' },
        { question: 'Do catch-up contributions have to be Roth?', answer: 'From 2026, yes if your FICA wages from that employer exceeded $150,000 in the previous year.' },
        { question: 'Can I withdraw from my 401(k) early?', answer: 'Withdrawals before age 59½ are usually taxed as income plus a 10% additional tax, with some exceptions. Many plans also allow loans.' },
        { question: 'What happens to my 401(k) when I leave a job?', answer: 'It stays yours (once vested). You can leave it in the old plan if allowed, roll it into your new employer’s plan or an IRA, or cash it out — usually the most expensive option.' },
      ],
    },
    content: `
## The short answer

A 401(k) is a workplace retirement account. You choose a percentage of each paycheck to contribute, your employer often adds a **match**, and the money is invested until retirement. For **2026** you can defer up to **$24,500** of salary, plus **$8,000** in catch-up contributions from age 50 — or **$11,250** at ages 60 to 63. Contributions can be **traditional** (tax break now, taxed later) or **Roth** (taxed now, tax-free later).

The single most important rule: **contribute at least enough to get the full employer match**. It is an immediate 50–100% return on that money. Our [401(k) calculator](/us/tools/401k-calculator) shows how much your balance could grow and whether you are leaving match on the table.

## 2026 contribution limits

| Limit | 2026 amount |
|---|---|
| Employee elective deferrals | $24,500 |
| Catch-up, age 50–59 and 64+ | $8,000 (total $32,500) |
| Catch-up, age 60–63 | $11,250 (total $35,750) |
| Total of employee + employer contributions | $72,000 (plus catch-up) |
| Roth catch-up wage threshold | $150,000 of prior-year FICA wages |

The employee limit applies across every 401(k), 403(b) and similar plan you have in a year, so two jobs in one year share one $24,500 limit. The $72,000 total limit applies per employer and includes the match and any profit-sharing contributions.

## How employer matching works

A match is expressed as a percentage of what you contribute, up to a cap measured as a percentage of your pay. Three common formulas, with the match you would receive by contributing enough to collect all of it:

| Salary | 50% of the first 6% | 100% of the first 4% | 100% of the first 3% + 50% of the next 2% |
|---|---|---|---|
| $60,000 | $1,800 | $2,400 | $2,400 |
| $80,000 | $2,400 | $3,200 | $3,200 |
| $120,000 | $3,600 | $4,800 | $4,800 |

To collect the whole match under the first formula you must contribute 6% of pay; under the second, 4%; under the third (a common "safe harbor" design), 5%. Contributing less than the cap leaves free money behind. If you contribute so much that you hit the $24,500 limit early in the year, check whether your plan "trues up" the match — otherwise you can miss matching contributions in the months after you stop contributing.

## How much it can grow

Balance at 65 for someone earning $60,000, with raises of 3% a year, a 50% match on the first 6% and a 7% annual return, starting from $0:

| Start at | Contribute 6% (+3% match) | Contribute 10% (+3% match) |
|---|---|---|
| 25 | $1,636,518 | $2,363,859 |
| 35 | $724,473 | $1,046,461 |
| 45 | $288,333 | $416,481 |

These are future dollars before tax, and returns will not be smooth, but the pattern is clear: **starting early matters more than contributing a lot later**. Ten years' delay roughly halves the result.

## Traditional vs Roth

**Traditional** contributions come out of your pay before federal income tax (and before state tax in most states), so a $100 contribution costs less than $100 of take-home pay. Withdrawals in retirement are taxed as ordinary income. **Roth** contributions are made after tax, but qualified withdrawals — after age 59½ and at least five years after your first Roth contribution — are completely tax-free, including the growth.

- Choose **traditional** if you expect a lower tax rate in retirement than now, or need the lower take-home cost today.
- Choose **Roth** if you are early in your career or in a low bracket now, or want tax-free income later.
- Many people split contributions between the two to hedge.

Employer matches have traditionally gone into the pre-tax account; since 2023 plans may let you take the match as Roth, in which case it is taxable to you in the year it is made. From 2026, if your FICA wages from your employer exceeded **$150,000** last year, any catch-up contributions you make must be Roth.

## Vesting

Your own contributions are always 100% yours. Employer contributions may vest over time — for example 20% a year over five years ("graded") or all at once after three years ("cliff"). If you leave before you are fully vested, you forfeit the unvested part of the match. Check your plan's summary plan description before deciding when to change jobs.

## Getting money out

- **Normal withdrawals** start from age 59½ without the 10% additional tax. Traditional withdrawals are taxed as income.
- **Early withdrawals** before 59½ usually cost income tax plus a 10% additional tax. Exceptions include leaving your employer in or after the year you turn 55, disability, and certain medical expenses.
- **Loans:** many plans let you borrow up to half your vested balance (maximum $50,000) and repay it through payroll. If you leave your job, the outstanding balance may become due.
- **Required minimum distributions** from traditional accounts start at age 73 for most people today. Roth 401(k) accounts no longer require distributions during the owner's lifetime.

## Changing jobs

When you leave an employer you can usually:

1. **Leave the money in the old plan** (often allowed for balances above $7,000).
2. **Roll it into your new employer's plan**, keeping everything in one place.
3. **Roll it into an IRA**, which typically offers more investment choice.
4. **Cash it out** — taxable, usually with the 10% additional tax if you are under 59½, and the money stops growing for retirement.

Ask for a **direct rollover** so no tax is withheld. With an indirect rollover the plan withholds 20%, and you must make up that amount from other savings within 60 days to avoid tax on it.

## How a 401(k) shows on your paycheck

A traditional contribution reduces the wages subject to federal income tax but not Social Security and Medicare, so your take-home pay falls by less than the amount you save. The [paycheck calculator](/us/tools/us-paycheck-calculator) shows the effect for your state and filing status, and the [salary and hourly tables](/us/salary) show take-home pay for every common salary before 401(k) contributions.

## Checklist

- Contribute at least enough to get the full match.
- Raise your percentage by 1 point each year or with every raise until you reach 10–15% including the match.
- Pick traditional, Roth or a split deliberately.
- Choose a diversified, low-cost investment such as a target-date fund if you do not want to manage it yourself.
- Check your vesting schedule before changing jobs.
- Roll old 401(k)s over directly rather than cashing out.
`,
  },

  {
    slug: 'uk-salary-sacrifice-explained',
    status: 'published',
    title: 'Salary Sacrifice Explained: Pension, Tax and National Insurance Savings (2026/27)',
    excerpt: 'How salary sacrifice works in the UK, how much it saves compared with other pension schemes at £40k, £60k and £110k, its effect on student loans and Child Benefit, and the £2,000 NI cap from April 2029.',
    country: 'UK',
    language: 'en-GB',
    category: 'Tax & Salary',
    clusterType: 'spoke',
    relatedToolSlug: 'ctc-calculator',
    author: 'Maurya Technologies Editorial Team',
    authorSlug: 'editorial-team',
    reviewerSlug: 'kuldeep-maurya',
    authorRole: 'Research & Review',
    readTime: '10 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'GOV.UK — Salary sacrifice for employers', url: 'https://www.gov.uk/guidance/salary-sacrifice-and-the-effects-on-paye' },
      { name: 'GOV.UK — Tax on your private pension contributions', url: 'https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief' },
      { name: 'GOV.UK — Budget 2025: salary sacrifice pension contributions', url: 'https://www.gov.uk/government/publications/budget-2025-document' },
      { name: 'GOV.UK — National Insurance rates', url: 'https://www.gov.uk/national-insurance-rates-letters' },
    ],
    seo: {
      title: 'Salary Sacrifice Explained: Tax & NI Savings (2026/27)',
      description: 'How UK salary sacrifice saves Income Tax and National Insurance, worked examples at £40k, £60k and £110k, effects on student loans and the 2029 NI cap.',
      primaryKeyword: 'salary sacrifice explained',
      faqSchema: [
        { question: 'What is salary sacrifice?', answer: 'An agreement to give up part of your salary in exchange for a non-cash benefit, most often an employer pension contribution. Because your contractual pay is lower, you pay less Income Tax and National Insurance.' },
        { question: 'How much does salary sacrifice save?', answer: 'Compared with a normal pension contribution it saves your employee National Insurance — 8% for basic-rate taxpayers and 2% above £50,270. On a £2,000 pension contribution at £40,000 that is £160 a year.' },
        { question: 'Is salary sacrifice changing?', answer: 'From April 2029 the National Insurance saving will only apply to the first £2,000 a year of pension contributions made by salary sacrifice. Income Tax relief is unaffected.' },
        { question: 'Can salary sacrifice reduce my pay below minimum wage?', answer: 'No. Your cash pay after the sacrifice must not fall below the National Minimum Wage or National Living Wage.' },
        { question: 'Does salary sacrifice reduce student loan repayments?', answer: 'Yes. Repayments are based on your pay after the sacrifice, so they fall by 9% of the amount sacrificed if you earn above your plan’s threshold.' },
        { question: 'Are there any downsides?', answer: 'A lower contractual salary can reduce statutory pay such as maternity pay, some life cover and mortgage affordability, unless your employer uses your pre-sacrifice salary for those.' },
      ],
    },
    content: `
## The short answer

**Salary sacrifice** means agreeing with your employer to give up part of your salary in return for a non-cash benefit — usually an extra employer pension contribution, but sometimes an electric car, a bike or childcare-related benefits. Because your contractual salary is lower, you pay less **Income Tax** and less **National Insurance**, and your employer pays less employer National Insurance too.

Compared with paying the same amount into a pension in the ordinary way, salary sacrifice saves your **employee National Insurance**: 8% for most earners and 2% on earnings above £50,270 in 2026/27. Use the [UK salary calculator](/uk/tools/ctc-calculator) to see your take-home pay at your new, lower salary.

## The three ways to pay into a workplace pension

| Method | Income Tax relief | National Insurance saving | How it appears on your payslip |
|---|---|---|---|
| Relief at source | Basic rate added by the provider; higher and additional rate claimed through Self Assessment | None | Contribution taken from pay after tax |
| Net pay arrangement | Full relief at your marginal rate, automatically | None | Contribution taken before tax |
| Salary sacrifice | Full relief at your marginal rate, automatically | Yes — employee NI on the amount sacrificed | Lower gross salary; employer pays the contribution |

## Worked example: £40,000 and a £2,000 pension contribution

| | Net pay / relief at source | Salary sacrifice |
|---|---|---|
| Salary used for Income Tax | £38,000 | £38,000 |
| Salary used for National Insurance | £40,000 | £38,000 |
| Pension contribution | £2,000 | £2,000 |
| Take-home pay | £30,720 | £30,880 |
| Cost of the £2,000 contribution | £1,600 | £1,440 |

Both routes give 20% Income Tax relief (£400). Salary sacrifice also avoids 8% National Insurance on £2,000 — **£160 a year** — so the same £2,000 in the pension costs £1,440 instead of £1,600. Many employers also pass some or all of their own 15% employer National Insurance saving into your pension, which can add up to another £300.

## Higher earners

At **£60,000**, sacrificing 10% (£6,000) brings your salary to £54,000. Every pound of that £6,000 would have been taxed at 40% plus 2% National Insurance, so take-home pay falls from £45,357 to £41,877 — the £6,000 pension contribution costs **£3,480**.

At **£110,000**, the Personal Allowance taper makes the effect much larger: sacrificing £10,000 to bring your salary back to £100,000 restores £5,000 of Personal Allowance, so the £10,000 contribution reduces take-home pay by only **£3,800** — an effective 62% relief. Our [UK tax bands guide](/uk/guides/uk-paye-tax-bands-explained-2026) explains the 60% band in detail.

Because adjusted net income falls, salary sacrifice can also reduce or remove the **High Income Child Benefit Charge** (which starts at £60,000) and help parents keep **tax-free childcare** and free childcare hours, which are lost if either parent's adjusted net income exceeds £100,000.

## Student loans

Student loan repayments are calculated on your pay after the sacrifice, so they fall by 9% of the amount sacrificed (6% more with a Postgraduate Loan) when you earn above your plan's threshold. For a Plan 2 borrower on £40,000 sacrificing £2,000, repayments fall from £955 to £775 a year. Use the [student loan repayment calculator](/uk/tools/student-loan-calculator) to see the effect on your plan.

## The change coming in April 2029

At the Autumn Budget 2025 the government announced that from **April 2029** the National Insurance exemption for pension contributions made through salary sacrifice will be capped at **£2,000 a year**. Contributions above that will attract employee and employer National Insurance as if they were paid as salary. Income Tax relief is not affected, and pension contributions paid directly by your employer (not funded by a sacrifice) remain free of National Insurance.

Until then the full saving applies. After April 2029, salary sacrifice will still be the most efficient route for the first £2,000 a year, and still gives full Income Tax relief on the rest.

## Things to check before you sign

- **Minimum wage:** your cash pay after the sacrifice cannot fall below the National Minimum Wage or National Living Wage.
- **Statutory pay:** statutory maternity, paternity and sick pay are based on your actual earnings, so a large sacrifice can reduce them. Some employers keep the sacrifice going during leave or use your pre-sacrifice salary.
- **Mortgages and loans:** lenders may use your lower salary when assessing affordability; ask your employer for a letter showing your pre-sacrifice salary.
- **Life cover and pay rises:** check whether death-in-service benefits and future pay rises are based on your pre-sacrifice salary.
- **Changing it:** most schemes only let you change the amount once a year or after a life event.

## Other salary sacrifice benefits

Pension contributions are the most common, but employers also offer salary sacrifice for **electric company cars** (with a low benefit-in-kind rate), the **cycle to work scheme**, and in some cases technology or extra holiday. Most other benefits lost their tax advantage in 2017, so outside pensions, cycles and ultra-low-emission cars, salary sacrifice usually only saves National Insurance on the price — or nothing at all.

## Checklist

- Ask whether your employer offers pension salary sacrifice and whether it shares its employer National Insurance saving.
- Calculate take-home pay at the lower salary with the [UK salary calculator](/uk/tools/ctc-calculator).
- If you earn £60,000–£125,140, check how much sacrifice would protect Child Benefit, childcare support or your Personal Allowance.
- Check the effect on statutory pay and mortgage applications before a big sacrifice.
- Plan for the £2,000 National Insurance cap from April 2029.
`,
  },

  {
    slug: 'sip-vs-fd-vs-ppf',
    status: 'published',
    title: 'SIP vs FD vs PPF: Returns, Tax and Risk Compared (FY 2026-27)',
    excerpt: 'How a mutual fund SIP, a bank fixed deposit and PPF compare on returns, tax, risk, lock-in and liquidity — with ₹10,000 a month for 15 years worked out for each, before and after tax.',
    country: 'IN',
    language: 'en-IN',
    category: 'Investing',
    clusterType: 'spoke',
    relatedToolSlug: 'sip-calculator',
    author: 'Kuldeep Maurya',
    authorSlug: 'kuldeep-maurya',
    reviewerSlug: 'editorial-team',
    authorRole: 'Founder & Lead Engineer, Maurya Technologies',
    readTime: '10 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'Ministry of Finance — small savings interest rates', url: 'https://dea.gov.in/' },
      { name: 'SEBI — Investor education', url: 'https://investor.sebi.gov.in/' },
      { name: 'DICGC — Deposit insurance', url: 'https://www.dicgc.org.in/' },
      { name: 'Income Tax Department — Capital gains and TDS', url: 'https://www.incometax.gov.in/' },
    ],
    seo: {
      title: 'SIP vs FD vs PPF: Returns, Tax and Risk Compared',
      description: 'SIP vs FD vs PPF compared for FY 2026-27: ₹10,000 a month for 15 years in each, returns before and after tax, risk, lock-in and which suits which goal.',
      primaryKeyword: 'sip vs fd vs ppf',
      faqSchema: [
        { question: 'Which is better: SIP, FD or PPF?', answer: 'It depends on the goal. Equity SIPs have historically given the highest long-term returns but can fall in value; PPF gives a guaranteed, tax-free 7.1% with a 15-year lock-in; FDs are flexible and safe but fully taxable.' },
        { question: 'What will ₹10,000 a month become in 15 years?', answer: 'About ₹50.5 lakh in an equity SIP at 12% a year, about ₹32.5 lakh in PPF at 7.1%, and about ₹32.8 lakh in FDs at 7% before tax — ₹18 lakh invested in each case.' },
        { question: 'Is PPF better than FD after tax?', answer: 'For most taxpayers, yes. PPF interest is tax-free, while FD interest is taxed at your slab rate every year — at the 30% slab a 7% FD earns under 5% after tax.' },
        { question: 'Are SIP returns guaranteed?', answer: 'No. Mutual fund returns depend on markets. Equity funds have historically returned around 10–12% a year over long periods, with large falls along the way.' },
        { question: 'How are SIP, FD and PPF taxed?', answer: 'Equity fund gains held over a year are taxed at 12.5% above ₹1.25 lakh a year; FD interest is taxed at your slab rate; PPF interest and maturity are tax-free.' },
        { question: 'Can I invest in all three?', answer: 'Yes, and many people do: an FD for the emergency fund, PPF for safe long-term savings, and equity SIPs for long-term growth.' },
      ],
    },
    content: `
## The short answer

All three are ways to save regularly, but they behave very differently:

- **SIP (systematic investment plan)** invests a fixed amount every month in a mutual fund. Equity funds have the highest long-term growth potential but no guarantee and real short-term risk.
- **FD (fixed deposit)** locks a lump sum with a bank at a fixed rate. It is safe and flexible, but the interest is fully taxable every year.
- **PPF (Public Provident Fund)** is a government scheme paying **7.1%** (October–December 2026), tax-free, with a 15-year lock-in and a ₹1.5 lakh yearly limit.

Use the [SIP calculator](/in/tools/sip-calculator), [FD calculator](/in/tools/fd-calculator) and [PPF calculator](/in/tools/ppf-calculator) to run your own numbers.

## Side by side

| | Equity SIP | Bank FD | PPF |
|---|---|---|---|
| Return | Market-linked; historically ~10–12% a year over long periods | Fixed, about 6–7.5% today | 7.1% now, reset every quarter |
| Risk | Can fall sharply in the short term | Very low; insured up to ₹5 lakh per bank by DICGC | Government-backed |
| Tax on returns | 12.5% on long-term gains above ₹1.25 lakh a year; 20% if sold within a year | Taxed at your slab rate every year | Tax-free |
| Section 80C (old regime) | Only ELSS funds | Only 5-year tax-saver FDs | Yes, up to ₹1.5 lakh |
| Lock-in | None (ELSS: 3 years) | Chosen term; early withdrawal penalty | 15 years; partial withdrawals from year 7 |
| Investment limit | None | None | ₹500 – ₹1.5 lakh a year |

## ₹10,000 a month for 15 years

₹18 lakh invested in each case. SIP at an assumed constant return; FD as a new one-year deposit of ₹1.2 lakh each year, all reinvested at 7% compounded quarterly; PPF at 7.1% with the yearly ₹1.2 lakh deposited before 5 April.

| | Value after 15 years (before tax) | After tax (30% slab investor) |
|---|---|---|
| Equity SIP at 12% | ₹50,45,760 | ₹46,55,665 (12.5% on gains above ₹1.25 lakh, if withdrawn in one year) |
| Equity SIP at 10% | ₹41,79,243 | ₹38,97,462 |
| FD at 7% | ₹32,78,834 | about ₹27,06,000 (interest taxed yearly at 31.2% incl. cess) |
| PPF at 7.1% | ₹32,54,567 | ₹32,54,567 (tax-free) |

Before tax, a 7% FD and PPF finish almost level. After tax, PPF is clearly ahead for anyone in the 20% or 30% slab, because FD interest is taxed every year — at the 30% slab a 7% FD earns under 5% after tax. The equity SIP finishes highest, but only if markets deliver; a run of bad years near the end could leave it behind PPF.

## Risk: what can go wrong with each

**SIP.** Equity markets can fall 30–50% in a crisis and take years to recover. Over 10–15 years, regular investing smooths the entry price (rupee cost averaging), but there is no guarantee. Equity is best for goals at least 7–10 years away.

**FD.** The main risks are inflation and tax: a 7% FD taxed at 30% barely keeps pace with 5–6% inflation. Bank deposits are insured by DICGC up to ₹5 lakh per depositor per bank, so spreading large sums across banks reduces risk further.

**PPF.** The capital is safe and the interest is tax-free, but the rate can be cut in any quarter, the yearly limit is ₹1.5 lakh, and the money is locked for 15 years, with only partial withdrawals from the seventh year.

## Liquidity

You can stop a SIP or sell mutual fund units at any time (except ELSS), usually receiving the money within a few working days. FDs can be broken early with a small penalty on the rate. PPF is the least liquid: loans are allowed from the third year and partial withdrawals from the seventh, but full withdrawal only at maturity, apart from limited premature closure for reasons such as serious illness or higher education.

## Which to use for which goal

| Goal | Good fit |
|---|---|
| Emergency fund (3–6 months of expenses) | FD or a liquid fund — safety and quick access matter most |
| Goal in 1–3 years (car, wedding, course fees) | FD or debt fund — avoid equity this close to the goal |
| Goal in 5–7 years | Mix of FD/PPF and balanced or hybrid funds |
| Retirement, child's education in 10+ years | Equity SIP for growth plus PPF for a tax-free, guaranteed base |

## Tax: old regime vs new regime

Under the **new tax regime** — the default for FY 2026-27 — there is no Section 80C deduction, so PPF, ELSS and tax-saver FDs give no tax saving when you invest. PPF still keeps its tax-free interest, which is often its biggest advantage anyway. Under the **old regime**, PPF, ELSS and 5-year tax-saver FDs share the ₹1.5 lakh 80C limit. Check which regime suits you with the [income tax calculator](/in/tools/income-tax-calculator).

## A simple combined plan

Many salaried investors use all three: keep three to six months of expenses in FDs, put the full ₹1.5 lakh a year into PPF for a safe tax-free core if they can, and run equity SIPs for long-term goals, stepping the SIP up each year with their salary. The [CTC to in-hand calculator](/in/tools/ctc-calculator) helps you see how much of your monthly pay you can realistically invest.

## Checklist

- Build the emergency fund (FD or liquid fund) first.
- Match the product to the goal's time horizon, not to last year's returns.
- Compare FD returns after tax at your slab rate.
- Use PPF for safe, tax-free long-term savings up to ₹1.5 lakh a year.
- Use equity SIPs only for goals at least 7–10 years away, and step them up yearly.
`,
  },

  {
    slug: 'resume-vs-cv-by-country',
    title: 'Resume vs CV: The Difference and What Each Country Expects',
    excerpt: 'The difference between a resume and a CV, and what employers expect in the US, Canada, the UK, India, Europe, the Middle East and Australia — length, photo, personal details and format.',
    country: 'US',
    language: 'en-US',
    category: 'Careers',
    clusterType: 'spoke',
    relatedToolSlug: 'resume-builder',
    author: 'Kuldeep Maurya',
    authorSlug: 'kuldeep-maurya',
    reviewerSlug: 'editorial-team',
    authorRole: 'Founder & Lead Engineer, Maurya Technologies',
    readTime: '9 min read',
    date: '2026-10-04',
    lastReviewed: '2026-10-04',
    sources: [
      { name: 'U.S. Department of Labor — CareerOneStop: Resumes', url: 'https://www.careeronestop.org/JobSearch/Resumes/resumes-and-applications.aspx' },
      { name: 'National Careers Service (UK) — CV sections', url: 'https://nationalcareers.service.gov.uk/careers-advice/cv-sections' },
      { name: 'Europass — CV', url: 'https://europass.europa.eu/en/create-europass-cv' },
      { name: 'U.S. EEOC — Prohibited employment practices', url: 'https://www.eeoc.gov/prohibited-employment-policiespractices' },
    ],
    seo: {
      title: 'Resume vs CV: Differences and Rules by Country',
      description: 'Resume vs CV explained: length, photo, personal details and format expected in the US, Canada, UK, India, Europe, the Middle East and Australia.',
      primaryKeyword: 'resume vs cv',
      faqSchema: [
        { question: 'What is the difference between a resume and a CV?', answer: 'In the US and Canada a resume is a short, targeted summary of experience (one to two pages), while a CV is a longer academic record. In the UK, Ireland and much of the world, "CV" simply means the document called a resume in the US.' },
        { question: 'How long should a resume or CV be?', answer: 'One page for under about ten years of experience in the US, up to two for senior roles; two pages is normal for a UK CV; academic CVs can be much longer.' },
        { question: 'Should I put a photo on my CV?', answer: 'Not in the US, Canada, the UK, Ireland or Australia. Photos are still common in parts of Europe, the Middle East and Asia, but are increasingly optional.' },
        { question: 'Should I include my date of birth or marital status?', answer: 'Not in the US, Canada, the UK or Australia, where employers avoid information that could lead to discrimination. In India and the Middle East it is still sometimes included but no longer expected.' },
        { question: 'Do I need a different resume for each job?', answer: 'You should tailor the summary, skills and top bullets to each job description, especially the keywords, while keeping the same structure.' },
        { question: 'Does an ATS treat a resume and a CV differently?', answer: 'No. Applicant tracking systems parse both the same way, so a single-column layout with standard headings works best for either.' },
      ],
    },
    content: `
## The short answer

The words mean different things depending on where you are:

- In the **United States and Canada**, a **resume** is a concise, targeted summary of your experience — usually one page, two for senior people. A **CV** (curriculum vitae) is a long, complete record used mainly for **academic, research and medical** jobs.
- In the **UK, Ireland, Australia, New Zealand, India and most of Europe**, **CV** is simply the everyday word for the document Americans call a resume. "Resume" is understood, especially in India, but CV is more common.

So the real question is not "resume or CV" but **what does an employer in this country expect** — length, photo, personal details and format. The table below summarises it, and our free [resume builder](/us/tools/resume-builder) produces a clean, ATS-friendly layout you can adapt for any of them.

## Expectations by country

| Country / region | What it is called | Typical length | Photo | Personal details (age, marital status) |
|---|---|---|---|---|
| United States | Resume (CV for academia) | 1 page; 2 for senior roles | No | No |
| Canada | Resume (CV for academia) | 1–2 pages | No | No |
| United Kingdom & Ireland | CV | 2 pages | No | No |
| India | Resume or CV (used interchangeably) | 1–2 pages; 2–3 for senior roles | Optional, declining | Sometimes included, not needed |
| Germany, Austria, Switzerland | Lebenslauf / CV | 1–2 pages | Common but optional | Sometimes date of birth |
| France, Spain, Italy | CV | 1–2 pages | Common | Sometimes |
| Middle East (UAE, Saudi Arabia, Qatar) | CV | 2–3 pages | Common | Nationality and visa status often included |
| Australia & New Zealand | Resume or CV | 2–3 pages | No | No |
| Academia (anywhere) | CV | As long as needed | No | No |

## United States and Canada

US employers expect a **resume**: short, achievement-focused and tailored to the job. Leave out the photo, date of birth, marital status, religion and nationality — US anti-discrimination law means many employers prefer not to see them. Use reverse-chronological order, start each bullet with an action verb, and include numbers wherever you can. A city and state is enough for location; a full street address is unnecessary. Canadian conventions are almost identical, though resumes of up to two pages are more common.

Use a **CV** in North America only for academic, scientific or medical roles. An academic CV lists education, research, publications, presentations, grants, teaching and service in full, and grows throughout a career.

## United Kingdom and Ireland

A UK **CV** is usually **two pages**. Start with your name and contact details (no photo, date of birth or marital status), then a short personal profile, work experience in reverse order, education and skills. "References available on request" is no longer needed. Employers often ask for a **cover letter** as well. Spelling follows British English — "organisation", "programme" — and CV keyword checks work the same way as resume checks, so our [ATS resume checker](/us/tools/ats-resume-checker) works for CVs too.

## India

In India "resume" and "CV" are used interchangeably. For most private-sector jobs, especially in IT, a **one- to two-page** document like a US resume works best, with your **CGPA or percentage** for recent graduates and a clear list of technologies. Photos, father's name, date of birth and a signed declaration were once standard but are now optional and increasingly left out by multinational employers. Government and some PSU applications still use prescribed formats, so follow the notification exactly.

## Europe

Conventions vary. In **Germany, Austria and Switzerland**, a professional photo and date of birth are still common, although anti-discrimination rules mean they are optional. **Europass**, the European Union's CV format, is widely recognised for applications across EU countries and for public-sector and education roles. In **France, Spain and Italy** a photo is common, and language skills are often shown with levels on the Common European Framework (A1–C2).

## Middle East

CVs for the **UAE, Saudi Arabia and Qatar** often include a photo, nationality, visa status and notice period, because employers need to plan visas and start dates. Two to three pages is normal, and listing licences and certifications prominently helps.

## Australia and New Zealand

"Resume" and "CV" are both used. Two to three pages is acceptable, photos and personal details are left out, and many applications ask you to address **selection criteria** separately, especially in government jobs.

## One document, several versions

If you apply in more than one country, keep a **master document** with everything, then make shorter versions:

1. **US/Canada resume:** one page, no photo or personal details, strongest results first.
2. **UK/Ireland CV:** two pages, a short profile and slightly more context per role.
3. **Regional CV** (Europe or Middle East): add a photo and the personal details that are expected locally.
4. **Academic CV:** the full record of publications, grants and teaching.

Whatever the version, keep a **single-column layout with standard headings**, because applicant tracking systems parse resumes and CVs the same way. Our [ATS resume guide](/us/guides/ats-resume-guide) explains formatting and keywords in detail.

## Salary expectations by country

When you apply abroad, check what the salary on offer means after tax — it differs a lot between countries. Use the [hourly to annual salary calculator](/us/tools/hourly-to-annual-salary) for US offers, the [UK salary calculator](/uk/tools/ctc-calculator) for UK offers and the [CTC to in-hand calculator](/in/tools/ctc-calculator) for Indian offers.

## Checklist

- Use the word and format the employer's country expects.
- Match the length to the market: one page (US), two pages (UK), longer only for academia.
- Leave out photo and personal details for the US, Canada, UK, Ireland and Australia.
- Keep one column and standard headings for every version.
- Tailor the summary and top bullets to each job, then run the [ATS resume checker](/us/tools/ats-resume-checker).
`,
  },
];
