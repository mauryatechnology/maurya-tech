/**
 * Long-form, visible content for every tool page (Page Quality Standard §6.1).
 * Numbers that depend on tax rules are NOT written here — they are computed from
 * lib/tax via `blocks` (reference tables / worked examples) so text and calculator
 * can never disagree. Keyed by tool slug, then country code (or `default`).
 */

const inSources = [
  { name: 'Income Tax Department of India', url: 'https://www.incometax.gov.in/' },
  { name: 'Union Budget documents', url: 'https://www.indiabudget.gov.in/' },
  { name: 'EPFO — Employees’ Provident Fund', url: 'https://www.epfindia.gov.in/' },
];
const usSources = [
  { name: 'IRS — Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
  { name: 'SSA — Contribution and benefit base', url: 'https://www.ssa.gov/oact/cola/cbb.html' },
  { name: 'U.S. Department of Labor — Minimum wage', url: 'https://www.dol.gov/agencies/whd/minimum-wage' },
];
const ukSources = [
  { name: 'GOV.UK — Income Tax rates and Personal Allowances', url: 'https://www.gov.uk/income-tax-rates' },
  { name: 'GOV.UK — National Insurance rates', url: 'https://www.gov.uk/national-insurance-rates-letters' },
  { name: 'GOV.UK — Holiday entitlement', url: 'https://www.gov.uk/holiday-entitlement-rights' },
];

export const toolContent = {
  'ctc-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    IN: {
      summary:
        'Under the new tax regime (FY 2026-27), a salaried employee pays no income tax when taxable income is ₹12 lakh or less, thanks to the ₹75,000 standard deduction and the Section 87A rebate. That means a gross salary of up to ₹12.75 lakh is effectively tax-free — your in-hand pay is then CTC minus PF (employer and employee) and professional tax.',
      sections: [
        {
          heading: 'What CTC includes — and why in-hand is always lower',
          paragraphs: [
            'Cost to Company (CTC) is everything your employer spends on you in a year. Part of it never reaches your bank account: the employer’s PF contribution, gratuity provisions, insurance premiums and, often, a performance bonus that is paid later (or not at all).',
            'Your monthly in-hand salary is what remains after three deductions from your gross salary: your own PF contribution (12% of basic), professional tax (set by your state, capped at ₹2,500 a year), and income tax deducted at source (TDS).',
          ],
          list: [
            'Basic salary — usually 40–50% of CTC; PF and gratuity are calculated on it.',
            'HRA and special allowance — fully taxable under the new regime (no HRA exemption).',
            'Employer PF — 12% of basic, often capped at ₹1,800/month (12% of the ₹15,000 wage ceiling).',
            'Variable pay / bonus — part of CTC, but paid only if targets are met.',
          ],
        },
        {
          heading: 'How this calculator works',
          paragraphs: [
            'Step 1: Gross salary = CTC − employer PF (and gratuity, if your offer letter includes it in CTC).',
            'Step 2: Taxable income = gross salary − ₹75,000 standard deduction. Under the new regime you cannot claim HRA, 80C or professional-tax deductions.',
            'Step 3: Tax is calculated on the slabs below. If taxable income is ₹12 lakh or less, the Section 87A rebate (up to ₹60,000) brings tax to zero. Just above ₹12 lakh, marginal relief limits tax to the amount by which income exceeds ₹12 lakh. A 4% health & education cess is added, plus surcharge above ₹50 lakh.',
            'Step 4: In-hand = gross salary − employee PF − professional tax − income tax. Variable pay you enter is shown separately so your fixed monthly figure is not overstated.',
          ],
        },
      ],
      blocks: ['in-slab-table', 'in-ctc-examples'],
      faqs: [
        { question: 'Is the new tax regime the default for salaried employees?', answer: 'Yes. Since FY 2023-24 the new regime is the default. You can still opt for the old regime (with HRA, 80C and other deductions) by informing your employer and choosing it when you file your return.' },
        { question: 'How much CTC is tax-free under the new regime?', answer: 'Taxable income up to ₹12 lakh attracts no tax because of the Section 87A rebate. Adding the ₹75,000 standard deduction, a gross salary of about ₹12.75 lakh is tax-free. Since employer PF is part of CTC but not gross salary, the tax-free CTC is slightly higher.' },
        { question: 'What is marginal relief under Section 87A?', answer: 'If your taxable income is just above ₹12 lakh, the tax payable cannot exceed the amount by which your income exceeds ₹12 lakh. For example, at ₹12.10 lakh taxable income, tax is limited to ₹10,000 (plus cess) instead of the full slab tax.' },
        { question: 'Why is my in-hand salary lower than CTC divided by 12?', answer: 'Because CTC includes employer PF (and sometimes gratuity and insurance) that is never paid to you monthly, and your gross salary is further reduced by your own PF contribution, professional tax and income tax.' },
        { question: 'Should I choose capped PF (₹1,800/month) or 12% of full basic?', answer: 'Capped PF gives higher monthly in-hand pay. Uncapped PF lowers in-hand pay but builds a larger retirement corpus with a government-backed interest rate. Many IT companies cap it; check your offer letter.' },
        { question: 'Is HRA exemption available under the new regime?', answer: 'No. HRA exemption, Section 80C, 80D and most other deductions are available only under the old regime. Under the new regime the main deductions are the ₹75,000 standard deduction and the employer’s NPS contribution under Section 80CCD(2).' },
        { question: 'Does professional tax apply in every state?', answer: 'No. Professional tax is levied by some states (for example Maharashtra, Karnataka, West Bengal) and not others. It is capped at ₹2,500 a year. If your state does not levy it, set it to zero in your head — the calculator assumes ₹2,400 a year.' },
      ],
      sources: inSources,
      hub: { href: '/in/salary', label: 'In-hand salary for every CTC from 4 to 25 LPA' },
    },
    UK: {
      summary:
        'Your UK take-home pay is gross salary minus Income Tax and National Insurance. For 2026/27 the first £12,570 is tax-free (Personal Allowance), the next £37,700 is taxed at 20%, and employee National Insurance is 8% between £12,570 and £50,270 and 2% above.',
      sections: [
        {
          heading: 'How UK take-home pay is calculated',
          paragraphs: [
            'Income Tax is charged on income above your Personal Allowance: 20% basic rate, 40% higher rate and 45% additional rate above £125,140. Above £100,000 the Personal Allowance is withdrawn by £1 for every £2 earned, creating an effective 60% marginal rate between £100,000 and £125,140.',
            'Class 1 National Insurance is deducted separately: 8% on earnings between the Primary Threshold (£12,570) and the Upper Earnings Limit (£50,270), then 2% on everything above.',
          ],
          list: [
            'Assumes a standard 1257L tax code and England, Wales or Northern Ireland rates.',
            'Scotland has different Income Tax bands (National Insurance is the same).',
            'Pension contributions, student loan repayments and benefits in kind are not deducted — they would lower your take-home further.',
          ],
        },
      ],
      blocks: ['uk-band-table', 'uk-salary-examples'],
      faqs: [
        { question: 'How much of my salary is tax-free in the UK?', answer: 'The Personal Allowance is £12,570 for 2026/27. It is reduced by £1 for every £2 of income above £100,000 and disappears entirely at £125,140.' },
        { question: 'Why is my payslip different from this calculator?', answer: 'Payslips can include pension contributions (often salary sacrifice), student loan repayments, a non-standard tax code, or emergency tax. This calculator shows the standard position for a 1257L code.' },
        { question: 'What is the 60% tax trap?', answer: 'Between £100,000 and £125,140 you pay 40% tax and also lose £1 of Personal Allowance for every £2 earned, so each extra £1 costs 60p in tax (62p including National Insurance). Pension contributions can bring income back below £100,000.' },
        { question: 'Do Scottish taxpayers get different results?', answer: 'Yes. Scotland sets its own Income Tax bands and rates on non-savings income, including starter, intermediate, advanced and top rates. National Insurance is the same across the UK.' },
        { question: 'How much National Insurance do employees pay?', answer: '8% on earnings between £12,570 and £50,270 a year, and 2% on earnings above £50,270.' },
        { question: 'Is my employer’s National Insurance deducted from my pay?', answer: 'No. Employer National Insurance is a cost to your employer and is not taken from your salary.' },
      ],
      sources: ukSources,
      hub: { href: '/uk/salary', label: 'Take-home pay for every salary from £20k to £70k' },
    },
  },

  'hourly-to-annual-salary': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    US: {
      summary:
        'To convert an hourly wage to an annual salary, multiply by 2,080 — the hours in a 40-hour week worked for 52 weeks. $25 an hour is $52,000 a year before tax. Take-home pay then depends on federal income tax, FICA (7.65% for W-2 employees) or self-employment tax (15.3% for 1099 contractors), and your state.',
      sections: [
        {
          heading: 'Hourly to annual: the formulas',
          paragraphs: [
            'Annual salary = hourly rate × hours per week × paid weeks per year. With a standard 40-hour week and 52 paid weeks, that is hourly rate × 2,080. A quick mental shortcut: double the hourly rate and add three zeros ($25/hr ≈ $50,000; the exact figure is $52,000).',
            'Monthly pay = annual ÷ 12, bi-weekly = annual ÷ 26, weekly = annual ÷ 52. If you take unpaid time off, reduce the paid weeks — 50 weeks gives hourly × 2,000.',
          ],
        },
        {
          heading: 'W-2 employee vs 1099 contractor',
          paragraphs: [
            'W-2 employees pay 6.2% Social Security (up to the annual wage base) and 1.45% Medicare, with the employer paying a matching share. 1099 contractors pay both halves as self-employment tax — 15.3% on 92.35% of net earnings — but can deduct half of it and their business expenses.',
            'Federal income tax is progressive: after the standard deduction ($16,100 for a single filer in 2026), income is taxed at 10%, 12%, 22% and higher rates in bands. Nine states — Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming — do not tax wages; use the optional state field for others.',
          ],
        },
      ],
      blocks: ['us-bracket-table', 'us-hourly-examples'],
      faqs: [
        { question: 'How many working hours are in a year?', answer: '2,080 hours for a full-time 40-hour week worked 52 weeks. With two weeks of unpaid leave it is 2,000 hours.' },
        { question: 'Is the federal minimum wage still $7.25?', answer: 'Yes, the federal minimum wage is $7.25 an hour ($15,080 a year full-time), but many states and cities set higher minimums, which apply where they are higher.' },
        { question: 'How is overtime paid?', answer: 'Under the Fair Labor Standards Act, non-exempt employees must be paid at least 1.5× their regular rate for hours over 40 in a workweek. This calculator assumes no overtime; add extra hours to hours per week for a rough estimate.' },
        { question: 'Why do 1099 contractors take home less at the same hourly rate?', answer: 'Contractors pay the employer’s half of Social Security and Medicare as well as their own, and usually get no paid holidays, health insurance or retirement match — so a contractor rate should typically be well above the equivalent W-2 hourly wage.' },
        { question: 'Does this include state and local taxes?', answer: 'Only if you enter a state rate. State income tax ranges from 0% to over 10% and some cities (such as New York City) add local income tax.' },
        { question: 'What standard deduction does the calculator use?', answer: 'The 2026 standard deduction for a single filer, $16,100. Married couples filing jointly have a larger deduction and wider brackets, so their tax would be lower.' },
      ],
      sources: usSources,
      hub: { href: '/us/salary', label: 'Every hourly wage from $10 to $60 converted to annual pay' },
    },
    UK: {
      summary:
        'In the UK, a full-time week is commonly 37.5 hours, so annual pay ≈ hourly rate × 1,950 (37.5 hours × 52 weeks). Take-home pay is then gross pay minus Income Tax and National Insurance.',
      sections: [
        {
          heading: 'Hourly to annual in the UK',
          paragraphs: [
            'Annual pay = hourly rate × weekly hours × 52. At 37.5 hours a week that is hourly × 1,950; at 40 hours it is hourly × 2,080. Workers are entitled to 5.6 weeks of paid holiday a year, which is included in 52 paid weeks for salaried staff.',
            'Tax is then calculated on the annual figure using the current Personal Allowance, Income Tax bands and National Insurance thresholds shown below.',
          ],
        },
      ],
      blocks: ['uk-band-table', 'uk-salary-examples'],
      faqs: [
        { question: 'How many hours is a full-time job in the UK?', answer: 'There is no legal definition, but 35–40 hours is typical and 37.5 hours is very common. The calculator defaults to 37.5 hours.' },
        { question: 'How much paid holiday do UK workers get?', answer: 'Most workers who work a 5-day week are entitled to 28 days (5.6 weeks) of paid annual leave, which can include bank holidays.' },
        { question: 'Is the take-home figure exact?', answer: 'It assumes a 1257L tax code, England/Wales/Northern Ireland rates and no pension or student loan deductions, so treat it as an estimate.' },
        { question: 'How is National Insurance calculated on hourly pay?', answer: 'It is calculated per pay period on earnings above the threshold; this calculator uses the annual equivalent: 8% between £12,570 and £50,270 and 2% above.' },
        { question: 'Does the calculator handle Scottish tax rates?', answer: 'Not yet — it uses rest-of-UK bands. Scottish taxpayers pay different Income Tax rates, though National Insurance is the same.' },
      ],
      sources: ukSources,
      hub: { href: '/uk/salary', label: 'UK take-home pay for every salary from £20k to £70k' },
    },
  },

  'emi-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    IN: {
      summary:
        'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r the monthly interest rate (annual rate ÷ 12 ÷ 100) and n the number of monthly instalments. A longer tenure lowers the EMI but sharply increases the total interest you pay.',
      sections: [
        {
          heading: 'How EMI is calculated',
          paragraphs: [
            'Each EMI has two parts: interest on the outstanding balance and repayment of principal. In the early years most of your EMI goes towards interest; the principal share grows every month as the balance falls.',
            'Because of this, prepaying early in the loan saves the most interest. RBI rules do not allow banks to charge a prepayment penalty on floating-rate home loans taken by individuals.',
          ],
        },
        {
          heading: 'Choosing tenure and rate',
          paragraphs: [
            'Most floating home-loan rates in India are linked to an external benchmark such as the RBI repo rate, so your EMI or tenure changes when the repo rate changes. Lenders usually adjust tenure first and EMI only if tenure would exceed the limit.',
            'A common rule of thumb is to keep all EMIs below 40–50% of your monthly in-hand salary; lenders use a similar ratio (FOIR) to decide eligibility.',
          ],
          list: [
            'Tax: under the old regime, home-loan interest on a self-occupied house is deductible up to ₹2 lakh (Section 24(b)) and principal up to ₹1.5 lakh within 80C.',
            'Under the new regime these deductions are not available for a self-occupied house.',
          ],
        },
      ],
      blocks: ['emi-examples'],
      faqs: [
        { question: 'What is the EMI formula?', answer: 'EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where P is principal, r is the monthly interest rate and n is the number of months.' },
        { question: 'Is it better to reduce EMI or tenure after a prepayment?', answer: 'Reducing tenure saves more total interest; reducing EMI improves monthly cash flow. If your budget allows, keep the EMI and cut the tenure.' },
        { question: 'Do banks charge a penalty for prepaying a home loan?', answer: 'Not on floating-rate home loans to individual borrowers — RBI prohibits foreclosure and prepayment charges on these. Fixed-rate and business loans can carry charges.' },
        { question: 'Why does most of my early EMI go to interest?', answer: 'Interest is charged on the outstanding balance, which is highest at the start. As the balance falls, the interest part shrinks and the principal part grows.' },
        { question: 'How much home loan can I get on my salary?', answer: 'Lenders typically allow total EMIs of about 40–50% of net monthly income, then back-calculate the loan from the rate and tenure.' },
        { question: 'Does a 0.5% lower interest rate make a big difference?', answer: 'Yes. On long home loans a 0.5% lower rate can save several lakh rupees in total interest — compare the total-interest figure, not just the EMI.' },
      ],
      sources: [
        { name: 'Reserve Bank of India — foreclosure charges on floating-rate loans', url: 'https://www.rbi.org.in/' },
        { name: 'Income Tax Department — deductions', url: 'https://www.incometax.gov.in/' },
      ],
    },
  },

  'percentage-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    default: {
      summary:
        'To find X% of a number, multiply the number by X and divide by 100 (20% of 250 = 50). Percentage change = (new − old) ÷ old × 100. To reverse a percentage (find the original before a discount or tax), divide by (1 ± rate).',
      sections: [
        {
          heading: 'The five percentage formulas you actually need',
          list: [
            'X% of Y = Y × X ÷ 100.',
            'X is what % of Y = X ÷ Y × 100 (exam marks: 432 of 500 = 86.4%).',
            'Percentage increase or decrease = (new − old) ÷ old × 100.',
            'Add a percentage (price plus GST, VAT or sales tax) = price × (1 + rate ÷ 100).',
            'Remove a percentage (original price before a 20% discount) = sale price ÷ (1 − 0.20).',
          ],
        },
        {
          heading: 'Common mistakes',
          paragraphs: [
            'Percentages are not symmetric: a 50% fall followed by a 50% rise leaves you at 75% of where you started. And a “20% off, then another 10% off” deal is a 28% discount, not 30%.',
            'Percentage points are not percent: an interest rate rising from 8% to 9% is a 1 percentage-point increase but a 12.5% relative increase.',
          ],
        },
      ],
      blocks: ['percentage-examples'],
      faqs: [
        { question: 'How do I calculate a percentage of a number?', answer: 'Multiply the number by the percentage and divide by 100. For example, 15% of 480 = 480 × 15 ÷ 100 = 72.' },
        { question: 'How do I calculate percentage increase?', answer: 'Subtract the old value from the new value, divide by the old value and multiply by 100. From 80 to 100 is (100 − 80) ÷ 80 × 100 = 25%.' },
        { question: 'How do I work out my exam percentage?', answer: 'Divide marks obtained by total marks and multiply by 100. 432 out of 500 = 86.4%.' },
        { question: 'How do I remove tax from a price that includes it?', answer: 'Divide by 1 plus the tax rate. A ₹1,180 price that includes 18% GST has a pre-tax value of 1,180 ÷ 1.18 = ₹1,000.' },
        { question: 'Are two successive discounts added together?', answer: 'No. 20% off then 10% off equals 0.8 × 0.9 = 0.72 of the price, a 28% total discount.' },
        { question: 'What is the difference between percent and percentage points?', answer: 'Percentage points measure the arithmetic difference between two percentages (8% to 9% is +1 point); percent measures relative change (+12.5%).' },
      ],
      sources: [],
    },
  },

  'age-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    default: {
      summary:
        'Your exact age is the number of complete years, then complete months, then days between your date of birth and today. The calculator uses real calendar months and accounts for leap years, so it matches how ages are counted on official forms.',
      sections: [
        {
          heading: 'How age is calculated',
          paragraphs: [
            'Start with the difference in years; if this year’s birthday has not happened yet, subtract one. Then count complete months since the last birthday and the remaining days. Because months have 28–31 days, dividing total days by 365 gives a slightly wrong answer — calendar arithmetic does not.',
            'People born on 29 February have a birthday only in leap years; in other years most systems treat 28 February or 1 March as the anniversary, depending on the law or organisation.',
          ],
          list: [
            'Age in days is useful for infant milestones and some insurance forms.',
            'Age on a specific date (not today) is what exam and job eligibility rules usually ask for — set the “as on” date accordingly.',
          ],
        },
        {
          heading: 'Common reasons to check an exact age',
          list: [
            'Exam and government-job eligibility: notifications state a minimum and maximum age “as on” a fixed date, often with relaxations for some categories.',
            'School admission: many schools require a minimum age on a cut-off date (for example 1 April or 31 March).',
            'Retirement, pension and insurance: premiums and eligibility often change on a birthday, so the exact number of days matters.',
            'Date differences: the same calculator counts days between any two dates — notice periods, project durations or how long ago something happened.',
          ],
        },
      ],
      blocks: [],
      faqs: [
        { question: 'How do I calculate my exact age?', answer: 'Count complete years since your birth date, then complete months since your last birthday, then the remaining days. The calculator does this using real calendar dates.' },
        { question: 'Does the calculator handle leap years?', answer: 'Yes. It uses calendar arithmetic, so 29 February and months of different lengths are handled correctly.' },
        { question: 'How do I calculate age on a specific date?', answer: 'Set the comparison date to the cut-off date in the notification (for example an exam’s “age as on” date) instead of today.' },
        { question: 'How many days old am I?', answer: 'The calculator shows your total age in days as well as years, months and days.' },
        { question: 'Is my date of birth stored?', answer: 'No. The calculation runs entirely in your browser and nothing is sent to a server.' },
      ],
      sources: [],
    },
  },

  'ats-resume-checker': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    default: {
      summary:
        'An ATS (applicant tracking system) parses your {doc} into fields and lets recruiters search and filter it. To pass, use a simple single-column layout, standard section headings, the exact skills named in the job description, and bullet points that start with an action verb and end with a measurable result.',
      sections: [
        {
          heading: 'What this checker scores',
          list: [
            'Keywords: whether your {doc} contains the technical skills and tools recruiters search for.',
            'Action verbs: bullets that start with verbs like “built”, “reduced”, “led” rather than “responsible for”.',
            'Quantified impact: numbers, percentages and scale (users, revenue, latency) that prove results.',
            'Structure and length: clear sections and a length appropriate for your experience.',
          ],
        },
        {
          heading: 'How to raise your score',
          paragraphs: [
            'Copy the job description, list the skills it repeats, and make sure each one you genuinely have appears in your skills section and in at least one bullet. Avoid tables, text boxes, headers/footers and images for key information — many parsers skip them.',
            'Rewrite duty-style bullets as outcomes: “Reduced API latency by 40% by adding Redis caching” beats “Worked on backend performance”.',
          ],
        },
      ],
      blocks: [],
      faqs: [
        { question: 'What is an ATS?', answer: 'Software such as Workday, Greenhouse, Lever or Taleo that stores applications, parses {doc}s into structured fields and lets recruiters search and filter candidates.' },
        { question: 'Is my {doc} stored when I use this checker?', answer: 'No. The text is analysed entirely in your browser and is never sent to or stored on a server.' },
        { question: 'Should I use a PDF or Word file?', answer: 'Most modern ATS read text-based PDFs well. Follow the employer’s instructions if they specify a format, and never upload a scanned image.' },
        { question: 'Do fancy templates hurt ATS parsing?', answer: 'Often, yes. Multi-column layouts, tables, icons and text inside images can be parsed out of order or skipped. A clean single-column layout is safest.' },
        { question: 'How many keywords should I include?', answer: 'Include every relevant skill from the job description that you genuinely have, in context. Keyword stuffing or hidden text is easy for recruiters to spot and can get you rejected.' },
        { question: 'Is a high ATS score a guarantee of an interview?', answer: 'No. A score measures how well your {doc} matches common screening signals; recruiters still judge relevance, experience and impact.' },
      ],
      sources: [],
      productCta: true,
    },
  },

  'resume-builder': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    default: {
      summary:
        'A strong {doc} fits on one page for under ~10 years of experience ({ukLengthNote}), uses a single-column layout, lists experience newest first, and makes every bullet show a result. This builder formats all of that for you and exports a clean PDF from your browser — no signup, no watermark.',
      sections: [
        {
          heading: 'Sections to include, in this order',
          list: [
            'Header: name, phone, professional email, city, LinkedIn/GitHub/portfolio.',
            'Summary (2–3 lines): who you are, your core stack or domain, and what you are looking for.',
            'Experience: company, title, dates, and 3–5 bullets each — action verb + what you did + measurable result.',
            'Projects: especially for freshers — what you built, the stack, and a link.',
            'Skills: grouped (languages, frameworks, cloud, tools); only what you can discuss in an interview.',
            'Education and certifications.',
          ],
        },
        {
          heading: 'Country norms',
          list: [
            'US and India: called a resume; one page is standard early in your career, two pages for senior roles.',
            'UK: usually called a CV; two pages is normal. Do not include a photo, date of birth or marital status.',
            'In the US and UK, leave out photos and personal details such as age to avoid bias — many recruiters discard {doc}s that include them.',
          ],
        },
      ],
      blocks: [],
      faqs: [
        { question: 'Is this {doc} builder really free?', answer: 'Yes — no account, no watermark and no paywall. Your data stays in your browser.' },
        { question: 'How do I download my {doc} as a PDF?', answer: 'Use the export button and choose “Save as PDF” in your browser’s print dialog. Pick A4 for India/UK and Letter for the US.' },
        { question: 'How long should my {doc} be?', answer: 'One page for students and professionals with under ~10 years of experience; two pages is fine for senior roles and is common for UK CVs.' },
        { question: 'Should I add a photo?', answer: 'Not for US or UK applications. In India it is optional and increasingly uncommon for tech roles.' },
        { question: 'Is the output ATS-friendly?', answer: 'Yes. The template is a single-column, text-based layout with standard headings, which applicant tracking systems parse reliably.' },
        { question: 'Is my data saved anywhere?', answer: 'No. Everything you type stays in your browser; nothing is uploaded to our servers.' },
      ],
      sources: [],
      productCta: true,
    },
  },

  'unit-converter': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    default: {
      summary:
        'To convert units, multiply by the conversion factor between them: 1 inch = 2.54 cm exactly, 1 kg ≈ 2.2046 lb, °F = °C × 9/5 + 32. For storage, 1 GB is 1,000,000,000 bytes in the decimal (SI) system used by drive makers, while 1 GiB is 1,073,741,824 bytes in the binary system many operating systems use.',
      sections: [
        {
          heading: 'Conversion factors worth remembering',
          list: [
            'Length: 1 inch = 2.54 cm; 1 foot = 30.48 cm; 1 mile = 1.609344 km.',
            'Mass: 1 kg = 2.20462 lb; 1 lb = 453.592 g; 1 stone = 14 lb (≈ 6.35 kg).',
            'Temperature: °F = °C × 9/5 + 32; °C = (°F − 32) × 5/9; K = °C + 273.15.',
            'Speed: 1 km/h = 0.621371 mph; 1 mph = 1.609344 km/h.',
            'Storage: 1 KB = 1,000 bytes (SI) vs 1 KiB = 1,024 bytes (binary).',
          ],
        },
        {
          heading: 'Why your 1 TB drive shows about 931 GB',
          paragraphs: [
            'Drive manufacturers use decimal units (1 TB = 10¹² bytes), but Windows reports sizes in binary units (dividing by 1,024 repeatedly) while still labelling them “GB”. 10¹² ÷ 1,024³ ≈ 931, so no space is missing.',
          ],
        },
      ],
      blocks: ['unit-reference'],
      faqs: [
        { question: 'How many bytes are in a gigabyte?', answer: 'In the decimal (SI) definition used by storage makers, 1 GB = 1,000,000,000 bytes. In the binary definition, 1 GiB = 1,073,741,824 bytes (1,024³).' },
        { question: 'How do I convert Celsius to Fahrenheit?', answer: 'Multiply by 9/5 and add 32. 25 °C = 25 × 1.8 + 32 = 77 °F.' },
        { question: 'How many centimetres are in an inch?', answer: 'Exactly 2.54 cm — this is the international definition of the inch.' },
        { question: 'How many pounds are in a kilogram?', answer: 'About 2.20462 lb. The pound is defined as exactly 0.45359237 kg.' },
        { question: 'Why does my 1 TB drive show 931 GB?', answer: 'The drive uses decimal terabytes; the operating system reports binary units. The capacity is the same, just counted differently.' },
      ],
      sources: [
        { name: 'NIST — SI units and prefixes', url: 'https://www.nist.gov/pml/owm/metric-si-prefixes' },
      ],
    },
  },

  'cgpa-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    IN: {
      summary:
        'For CBSE, percentage = CGPA × 9.5, so a CGPA of 8.4 is about 79.8%. Universities use their own formulas, so always use the one printed on your mark sheet or published by your university for official applications.',
      sections: [
        {
          heading: 'CGPA, SGPA and percentage',
          paragraphs: [
            'SGPA is your grade point average for one semester (credit-weighted). CGPA is the credit-weighted average of all semesters so far. Percentage conversions are approximations used for eligibility cut-offs — they are not your “real” marks.',
            'The CBSE 9.5 multiplier came from the average marks of students scoring grade A1. Many universities publish a different formula; engineering universities often use (CGPA − 0.75) × 10 or similar. Employers and admission forms usually specify which formula to use.',
          ],
        },
        {
          heading: 'Converting to the US 4.0 GPA scale',
          paragraphs: [
            'US universities convert Indian grades through credential evaluators such as WES, which evaluate each course grade rather than applying one formula to your CGPA. The 4.0 estimate shown here is only a rough guide for shortlisting universities.',
          ],
        },
      ],
      blocks: ['cgpa-table'],
      faqs: [
        { question: 'How do I convert CGPA to percentage for CBSE?', answer: 'Multiply your CGPA by 9.5. For example, 8.4 × 9.5 = 79.8%.' },
        { question: 'Is the 9.5 formula valid for my university?', answer: 'Not necessarily. Many universities publish their own conversion formula; use that for official purposes and check your mark sheet.' },
        { question: 'What is the difference between SGPA and CGPA?', answer: 'SGPA is the average for one semester; CGPA is the cumulative credit-weighted average across all completed semesters.' },
        { question: 'How is CGPA calculated from semester SGPAs?', answer: 'CGPA = Σ(SGPA × credits of that semester) ÷ total credits. If all semesters have equal credits, it is the simple average of SGPAs.' },
        { question: 'How do US universities convert Indian CGPA?', answer: 'Most rely on credential evaluations (for example WES), which assess course-by-course grades. The 4.0 value here is an estimate only.' },
        { question: 'What CGPA is considered good?', answer: 'Many recruiters use 7.0 or 7.5 as a cut-off for campus placements; top programmes and some employers look for 8.0+.' },
      ],
      sources: [{ name: 'CBSE — official website', url: 'https://www.cbse.gov.in/' }],
    },
  },

  'freelance-rate-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-28',
    default: {
      summary:
        'Your minimum freelance hourly rate = (target annual income + business expenses + tax set-aside) ÷ billable hours per year. Because only part of your working time is billable, a freelance rate usually needs to be well above the hourly equivalent of a salaried job.',
      sections: [
        {
          heading: 'How to set a freelance rate',
          list: [
            'Target income: what you would need as a salary, plus the benefits an employer would pay (paid leave, insurance, retirement contributions).',
            'Expenses: software, hardware, internet, coworking, accounting, insurance.',
            'Taxes: self-employment or professional taxes you will owe on profit.',
            'Billable hours: working weeks × billable hours per week. Proposals, admin and learning are not billable.',
          ],
        },
        {
          heading: 'Hourly, day rate or project price?',
          paragraphs: [
            'Hourly billing is simplest for open-ended work. A day rate (typically 7–8 hours) suits consulting and contract work. Project pricing lets you earn more as you get faster, but requires a clear scope and change-request process.',
          ],
        },
      ],
      blocks: [],
      faqs: [
        { question: 'How many billable hours should I plan for?', answer: 'Many full-time freelancers bill 20–30 hours a week; the rest goes to sales, admin and learning. Plan conservatively and adjust after a few months of tracking.' },
        { question: 'Why should my freelance rate be higher than my salary’s hourly equivalent?', answer: 'You pay for your own leave, equipment, software, insurance and taxes, and not every hour is billable.' },
        { question: 'Should I charge international clients more?', answer: 'Price by the value and market of the client. Many freelancers quote in the client’s currency; account for payment-platform and currency-conversion fees.' },
        { question: 'What is a day rate?', answer: 'A fixed price for a working day (usually 7–8 hours). Divide your target annual income plus costs by your expected billable days.' },
        { question: 'How often should I raise my rates?', answer: 'Review at least once a year, and raise rates for new clients whenever your pipeline is consistently full.' },
      ],
      sources: [
        { name: 'IRS — Self-employment tax (US)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
        { name: 'GOV.UK — Working for yourself (UK)', url: 'https://www.gov.uk/working-for-yourself' },
        { name: 'Income Tax Department — Presumptive taxation for professionals (India)', url: 'https://www.incometax.gov.in/' },
      ],
    },
  },
};

Object.assign(toolContent, {
  'us-paycheck-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-29',
    US: {
      summary:
        'Your paycheck is gross pay minus federal income tax, Social Security (6.2% up to the wage base), Medicare (1.45%, plus 0.9% on high earnings), state income tax and any pre-tax deductions such as 401(k) and health insurance. A single filer earning $75,000 in a state with no income tax takes home about $2,370 every two weeks before other deductions.',
      sections: [
        {
          heading: 'How your paycheck is calculated',
          paragraphs: [
            'Step 1: Start from gross pay for the period (salary ÷ number of paychecks, or hourly rate × hours).',
            'Step 2: Subtract pre-tax deductions. Traditional 401(k) contributions lower the wages subject to federal and state income tax but not Social Security and Medicare. Health, dental and vision premiums paid through a Section 125 cafeteria plan lower all three.',
            'Step 3: Federal income tax is estimated on annualised taxable wages minus the standard deduction for your filing status, using the 2026 brackets, then divided back into each paycheck.',
            'Step 4: FICA is 6.2% Social Security on wages up to the annual wage base plus 1.45% Medicare on all wages; an extra 0.9% Additional Medicare Tax applies above $200,000 (single/head of household) or $250,000 (married filing jointly).',
            'Step 5: State income tax uses that state’s brackets, deduction and exemption. Texas, Florida, Washington, Nevada and Tennessee do not tax wages.',
          ],
        },
        {
          heading: 'Why your real paycheck may differ',
          list: [
            'Your W-4: extra withholding, dependents credit (Step 3) or other income (Step 4) change federal withholding.',
            'Local and city taxes (e.g. New York City, many Ohio and Pennsylvania localities) are not included.',
            'State payroll programs such as California SDI, New York SDI/PFL and Washington’s WA Cares/PFML premiums are not included.',
            'Bonuses are often withheld at a flat supplemental rate rather than through the brackets.',
            'Roth 401(k) contributions are after-tax: enter them as 0% here and subtract them from take-home yourself.',
          ],
        },
      ],
      blocks: ['us-filing-status-table', 'us-paycheck-examples'],
      faqs: [
        { question: 'How much federal tax is taken out of my paycheck?', answer: 'It depends on filing status and pay. Your annual taxable wages (after pre-tax deductions and the standard deduction) are taxed at 10%, 12%, 22% and higher rates in bands, and the total is spread across your paychecks.' },
        { question: 'What is the 2026 standard deduction?', answer: '$16,100 for single filers, $32,200 for married couples filing jointly and $24,150 for heads of household.' },
        { question: 'How much Social Security and Medicare is withheld?', answer: '6.2% Social Security on wages up to the annual wage base ($184,500 in 2026) and 1.45% Medicare on all wages, plus 0.9% Additional Medicare Tax above $200,000 of wages.' },
        { question: 'Does a 401(k) contribution reduce my taxes?', answer: 'A traditional 401(k) reduces federal and (in most states) state income tax, but not Social Security or Medicare. Each $100 contributed typically lowers take-home pay by less than $100.' },
        { question: 'Which states have no income tax on wages?', answer: 'Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming do not tax wages.' },
        { question: 'Is bi-weekly or semi-monthly pay better?', answer: 'Annual pay is the same. Bi-weekly means 26 smaller paychecks (two months a year have three); semi-monthly means 24 slightly larger paychecks on fixed dates.' },
        { question: 'Why is my first paycheck of the year different?', answer: 'Deduction elections, benefit premiums and 401(k) percentages often reset in January, and the Social Security wage base restarts each calendar year.' },
      ],
      sources: [
        { name: 'IRS — Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
        { name: 'IRS — Publication 15-T (withholding methods)', url: 'https://www.irs.gov/publications/p15t' },
        { name: 'SSA — Contribution and benefit base', url: 'https://www.ssa.gov/oact/cola/cbb.html' },
        { name: 'IRS — 401(k) contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' },
      ],
      hub: { href: '/us/salary', label: 'Annual and hourly salary breakdowns for every common amount' },
    },
  },

  'income-tax-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-09-29',
    IN: {
      summary:
        'For FY 2026-27 the new regime is better for most salaried people: taxable income up to ₹12 lakh is tax-free and the standard deduction is ₹75,000. The old regime only wins when your deductions — HRA, 80C, 80D, NPS and home-loan interest — are large; this calculator shows the exact break-even for your salary.',
      sections: [
        {
          heading: 'New vs old regime at a glance',
          list: [
            'Standard deduction: ₹75,000 (new) vs ₹50,000 (old).',
            'Section 87A rebate: tax-free up to ₹12 lakh taxable income (new) vs ₹5 lakh (old).',
            'Deductions: new regime allows almost none (employer NPS under 80CCD(2) is an exception); old regime allows HRA, 80C (₹1.5 lakh), 80D, 80CCD(1B) (₹50,000), home-loan interest under 24(b) (₹2 lakh) and professional tax.',
            'Slabs: new regime rises in ₹4 lakh steps to 30% above ₹24 lakh; old regime reaches 30% above ₹10 lakh.',
          ],
        },
        {
          heading: 'How the comparison is calculated',
          paragraphs: [
            'Both regimes start from the same gross salary (if you enter CTC, employer PF is removed first). The new regime subtracts only the ₹75,000 standard deduction. The old regime subtracts the ₹50,000 standard deduction plus each deduction you enter, capped at its legal limit.',
            'HRA exemption is the least of: HRA received, rent paid minus 10% of basic pay, and 50% of basic (metro) or 40% (non-metro). Tax is then computed on each regime’s slabs, with the 87A rebate, marginal relief (new regime), surcharge above ₹50 lakh and 4% cess.',
          ],
        },
        {
          heading: 'Who should still consider the old regime?',
          paragraphs: [
            'Typically people paying high rent in a metro (large HRA exemption) who also use the full ₹1.5 lakh 80C limit, pay health insurance for parents, and have a home loan on a self-occupied house. If your total deductions are below the break-even figure shown above the table, stay with the new regime.',
            'Salaried taxpayers can choose a regime every year when filing their return, whatever they declared to their employer for TDS. People with business income can switch back to the old regime only once.',
          ],
        },
      ],
      blocks: ['in-old-slab-table', 'in-slab-table', 'in-regime-examples'],
      faqs: [
        { question: 'Which tax regime is better for FY 2026-27?', answer: 'For most salaried employees the new regime, because income up to ₹12 lakh is tax-free and slabs are lower. The old regime wins only when total deductions are large — use the break-even figure in the calculator.' },
        { question: 'Is the new regime the default?', answer: 'Yes. Unless you opt for the old regime, your employer deducts TDS and your return is processed under the new regime.' },
        { question: 'Can I switch between regimes every year?', answer: 'Salaried individuals without business income can choose either regime each year while filing their return. Those with business or professional income can switch back to the old regime only once.' },
        { question: 'Can I claim HRA in the new regime?', answer: 'No. HRA exemption, 80C, 80D, 80CCD(1B) and home-loan interest on a self-occupied property are available only in the old regime.' },
        { question: 'What is the old-regime 87A rebate?', answer: 'If taxable income is ₹5 lakh or less, a rebate of up to ₹12,500 makes tax zero under the old regime. Under the new regime the limit is ₹12 lakh (rebate up to ₹60,000).' },
        { question: 'How is HRA exemption calculated?', answer: 'It is the lowest of HRA received, rent paid minus 10% of basic salary, and 50% of basic for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% elsewhere.' },
        { question: 'Is employer NPS contribution deductible in the new regime?', answer: 'Yes. Employer contribution under Section 80CCD(2) is allowed in both regimes (up to 14% of basic + DA in the new regime and 10% in the old). This calculator does not include it.' },
      ],
      sources: [
        { name: 'Income Tax Department — Tax slabs and regimes', url: 'https://www.incometax.gov.in/' },
        { name: 'Income Tax Department — Deductions under Chapter VI-A', url: 'https://www.incometax.gov.in/iec/foportal/help/individual-business-profession' },
        { name: 'Union Budget 2025-26 documents', url: 'https://www.indiabudget.gov.in/' },
      ],
      hub: { href: '/in/salary', label: 'In-hand salary for every CTC from 4 to 25 LPA' },
    },
  },

  'mortgage-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    US: {
      summary:
        'Your monthly mortgage payment is principal and interest on the loan plus property tax, homeowners insurance, private mortgage insurance (PMI) if you put down less than 20%, and any HOA dues. A $320,000 loan at 6.5% over 30 years costs about $2,023 a month in principal and interest alone.',
      sections: [
        {
          heading: 'How the monthly payment is calculated',
          paragraphs: [
            'Principal and interest use the standard amortization formula: M = P × r ÷ (1 − (1 + r)^−n), where P is the loan amount, r is the annual rate divided by 12 and n is the number of monthly payments (360 for a 30-year loan). The payment stays the same every month, but early payments are mostly interest and later ones mostly principal.',
            'Property tax is the annual rate you enter applied to the home price and divided by 12. Homeowners insurance is your annual premium divided by 12. Lenders usually collect both through an escrow account, which is why they appear in the same monthly payment (often called PITI: principal, interest, taxes and insurance).',
            'PMI is charged on conventional loans with less than 20% down. It is calculated here as an annual percentage of the loan amount, and it stops automatically once your scheduled balance falls to 78% of the original home price.',
          ],
        },
        {
          heading: 'What changes your payment the most',
          list: [
            'Interest rate: one percentage point on a $320,000 loan changes the 30-year payment by roughly $200 a month.',
            'Down payment: 20% or more avoids PMI and lowers the loan amount.',
            'Loan term: a 15-year loan has a much higher payment but less than half the total interest of a 30-year loan.',
            'Location: property tax ranges from well under 1% to over 2% of the home’s value depending on the state and county.',
            'Points and closing costs are paid upfront and are not part of this monthly figure.',
          ],
        },
      ],
      blocks: ['us-mortgage-examples', 'us-mortgage-term-compare'],
      faqs: [
        { question: 'How is a mortgage payment calculated?', answer: 'Principal and interest use the amortization formula M = P × r ÷ (1 − (1 + r)^−n), with r the monthly rate and n the number of payments. Property tax, insurance, PMI and HOA dues are then added on top.' },
        { question: 'What is PITI?', answer: 'Principal, interest, taxes and insurance — the four parts of a typical monthly mortgage payment when the lender collects property tax and homeowners insurance through escrow.' },
        { question: 'When does PMI go away?', answer: 'Under the Homeowners Protection Act, PMI on a conventional loan ends automatically when the scheduled balance reaches 78% of the original value. You can usually ask to cancel it at 80%.' },
        { question: 'Is a 15-year or 30-year mortgage better?', answer: 'A 15-year loan saves a large amount of interest and usually has a lower rate, but the monthly payment is much higher. A 30-year loan keeps payments affordable and you can still prepay when you have spare cash.' },
        { question: 'How much house can I afford?', answer: 'A common guideline is to keep total housing costs under about 28% of gross monthly income and all debt payments under about 36%. Lenders look at your full debt-to-income ratio and credit score.' },
        { question: 'Does this include closing costs?', answer: 'No. Closing costs (typically 2–5% of the price) and any points you buy are paid at closing and are not part of the monthly payment shown.' },
        { question: 'Does paying extra principal help?', answer: 'Yes. Extra payments go straight to principal, reduce the interest charged every month after, and shorten the loan. Check that your loan has no prepayment penalty.' },
      ],
      sources: [
        { name: 'Consumer Financial Protection Bureau — Owning a home', url: 'https://www.consumerfinance.gov/owning-a-home/' },
        { name: 'CFPB — When can I remove PMI?', url: 'https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/' },
        { name: 'Freddie Mac — Primary Mortgage Market Survey (current rates)', url: 'https://www.freddiemac.com/pmms' },
      ],
      hub: { href: '/us/salary', label: 'Take-home pay for every common salary — check what you can afford' },
    },
    UK: {
      summary:
        'Your monthly mortgage repayment depends on the amount borrowed, the interest rate and the term. A £270,000 repayment mortgage at 4.5% over 25 years costs about £1,501 a month and about £180,000 in interest over the full term; on interest-only the same loan costs £1,013 a month but the £270,000 is still owed at the end.',
      sections: [
        {
          heading: 'How UK mortgage repayments are calculated',
          paragraphs: [
            'On a repayment (capital and interest) mortgage each monthly payment is the same: M = P × r ÷ (1 − (1 + r)^−n), with P the loan, r the annual rate divided by 12 and n the number of months. Early payments are mostly interest; by the final years most of each payment clears the balance.',
            'On an interest-only mortgage you pay just the interest each month (loan × rate ÷ 12) and repay the whole loan at the end of the term, usually from savings, investments or a property sale. Lenders require a credible repayment plan.',
            'Loan-to-value (LTV) is the mortgage divided by the property price. Rates usually get cheaper at 90%, 85%, 75% and 60% LTV, so a slightly larger deposit can lower your rate as well as your loan.',
          ],
        },
        {
          heading: 'Stamp Duty and other upfront costs',
          paragraphs: [
            'In England and Northern Ireland, Stamp Duty Land Tax on a main home is charged in bands: nothing up to £125,000, 2% to £250,000, 5% to £925,000, 10% to £1.5 million and 12% above. First-time buyers pay nothing up to £300,000 and 5% from £300,000 to £500,000; above £500,000 they pay the standard rates. Buying an additional property adds a surcharge.',
            'Scotland charges Land and Buildings Transaction Tax and Wales charges Land Transaction Tax, with different bands. Budget also for lender arrangement fees, a survey, solicitor fees and moving costs.',
          ],
        },
        {
          heading: 'Fixed rates and remortgaging',
          list: [
            'Most UK mortgages are fixed for 2 or 5 years, then revert to the lender’s standard variable rate (SVR), which is usually much higher.',
            'Remortgaging or taking a product transfer before the fix ends avoids the SVR; enter your new rate here to see the new payment.',
            'Overpayments of up to 10% of the balance a year are allowed without penalty on most fixed deals.',
          ],
        },
      ],
      blocks: ['uk-mortgage-examples', 'uk-stamp-duty-table'],
      faqs: [
        { question: 'How much are monthly repayments on a £200,000 mortgage?', answer: 'Over 25 years, about £1,056 a month at 4%, £1,112 at 4.5% and £1,169 at 5% on a repayment basis. See the table above for other amounts.' },
        { question: 'What is the difference between repayment and interest-only?', answer: 'A repayment mortgage clears the loan by the end of the term. Interest-only has lower monthly payments, but you still owe the full amount borrowed at the end.' },
        { question: 'How much Stamp Duty will I pay?', answer: 'In England and Northern Ireland, nothing on the first £125,000, 2% on £125,001–£250,000 and 5% on £250,001–£925,000 for a main home. First-time buyers pay nothing up to £300,000 if the price is £500,000 or less.' },
        { question: 'What is loan-to-value (LTV)?', answer: 'The mortgage as a percentage of the property price. A £270,000 mortgage on a £300,000 home is 90% LTV. Lower LTV usually means a lower interest rate.' },
        { question: 'How long should my mortgage term be?', answer: '25 years is the traditional term, but 30–35 years is common for first-time buyers to lower monthly payments. A longer term means paying more interest overall.' },
        { question: 'How much can I borrow?', answer: 'Lenders typically offer around 4 to 4.5 times household income, subject to affordability checks on your outgoings and a stress test at a higher rate.' },
        { question: 'Does this include Scotland or Wales?', answer: 'Repayments apply anywhere in the UK, but the Stamp Duty figure is for England and Northern Ireland. Scotland uses LBTT and Wales uses LTT.' },
      ],
      sources: [
        { name: 'GOV.UK — Stamp Duty Land Tax: residential property rates', url: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates' },
        { name: 'MoneyHelper — Buying a home', url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home' },
        { name: 'Bank of England — Bank Rate', url: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate' },
      ],
      hub: { href: '/uk/salary', label: 'UK take-home pay for every salary from £15,000 to £100,000' },
    },
  },

  'sip-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    IN: {
      summary:
        'A SIP (systematic investment plan) invests a fixed amount in a mutual fund every month. At an assumed 12% annual return, ₹10,000 a month for 10 years — ₹12 lakh invested — grows to about ₹23.2 lakh. Returns on equity funds are not guaranteed, so use a conservative rate and treat the result as an estimate, not a promise.',
      sections: [
        {
          heading: 'How the SIP value is calculated',
          paragraphs: [
            'Each instalment is treated as invested at the start of the month and compounded monthly at the annual rate divided by 12: FV = P × [((1 + i)^n − 1) ÷ i] × (1 + i), where P is the monthly amount, i the monthly rate and n the number of months. This is the convention most fund houses and AMFI-style calculators use.',
            'With a step-up, the monthly amount rises by the chosen percentage at the start of every year — matching the "top-up SIP" option many funds offer, and the way most people’s savings grow with their salary.',
          ],
        },
        {
          heading: 'Tax on mutual fund gains',
          list: [
            'Equity funds held more than 12 months: long-term gains above ₹1.25 lakh a year are taxed at 12.5%.',
            'Equity funds sold within 12 months: short-term gains are taxed at 20%.',
            'Debt funds bought on or after 1 April 2023: gains are added to your income and taxed at your slab rate.',
            'ELSS funds qualify for Section 80C (old regime only) and have a 3-year lock-in for each instalment.',
            'Each SIP instalment has its own purchase date, so the holding period is counted per instalment.',
          ],
        },
        {
          heading: 'Getting realistic numbers',
          paragraphs: [
            'Large-cap equity funds have historically returned roughly 10–12% a year over long periods, with sharp falls along the way; debt funds return less but are steadier. Inflation of 5–6% a year means ₹1 crore in 20 years buys far less than ₹1 crore today — divide the result by about 3 to see it in today’s money at 6% inflation.',
          ],
        },
      ],
      blocks: ['sip-examples', 'sip-rate-compare'],
      faqs: [
        { question: 'How is SIP return calculated?', answer: 'Each monthly instalment compounds at the monthly rate (annual rate ÷ 12) from the month it is invested. The future value formula is P × [((1 + i)^n − 1) ÷ i] × (1 + i).' },
        { question: 'What will ₹10,000 a month in SIP become in 10 years?', answer: 'About ₹23.2 lakh at an assumed 12% annual return, of which ₹12 lakh is your own money. At 10% it would be about ₹20.7 lakh.' },
        { question: 'What is a step-up SIP?', answer: 'A SIP whose monthly amount increases by a fixed percentage every year, usually in line with salary increases. A 10% yearly step-up on ₹10,000 for 10 years grows to about ₹33.7 lakh at 12%.' },
        { question: 'Are SIP returns guaranteed?', answer: 'No. Mutual fund returns depend on markets and can be negative over short periods. The calculator shows what a constant average return would produce.' },
        { question: 'How are SIP gains taxed?', answer: 'For equity funds, gains on units held over 12 months are long-term and taxed at 12.5% above ₹1.25 lakh a year; gains on units held 12 months or less are taxed at 20%.' },
        { question: 'Is SIP better than an FD?', answer: 'Equity SIPs have historically beaten FDs over long periods but can fall in value; FDs are predictable and insured up to ₹5 lakh per bank. Many people use both for different goals.' },
      ],
      sources: [
        { name: 'SEBI — Investor education', url: 'https://investor.sebi.gov.in/' },
        { name: 'AMFI — Mutual fund investor corner', url: 'https://www.amfiindia.com/investor' },
        { name: 'Income Tax Department — Capital gains', url: 'https://www.incometax.gov.in/' },
      ],
      hub: { href: '/in/tools', label: 'All free calculators for India' },
    },
  },

  'fd-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    IN: {
      summary:
        'A fixed deposit grows at a fixed rate, usually compounded every quarter. ₹1,00,000 at 7% for 5 years with quarterly compounding matures at about ₹1,41,478 — ₹41,478 of interest, an effective yield of 7.19% a year. The interest is taxable at your slab rate, and banks deduct 10% TDS above ₹50,000 of interest a year (₹1 lakh for senior citizens).',
      sections: [
        {
          heading: 'How FD maturity is calculated',
          paragraphs: [
            'For a cumulative (reinvestment) deposit: Maturity = P × (1 + r ÷ n)^(n × t), where P is the deposit, r the annual rate, n the number of compounding periods a year (4 for quarterly) and t the term in years. Compounding more often slightly raises the effective yield.',
            'With interest paid out monthly or quarterly instead, the interest is not reinvested, so the total is simple interest: P × r × t. Choose "Interest paid out" to see that case.',
          ],
        },
        {
          heading: 'Tax, TDS and deposit insurance',
          list: [
            'FD interest is added to your income and taxed at your slab rate every year, even on cumulative deposits where you receive it only at maturity.',
            'Banks deduct 10% TDS when interest from all your deposits with that bank exceeds ₹50,000 in a financial year (₹1,00,000 for senior citizens). Submit Form 15G (or 15H if 60+) if your total income is below the taxable limit.',
            'Tax-saver FDs have a 5-year lock-in and qualify for Section 80C, but only under the old tax regime.',
            'DICGC insures deposits up to ₹5 lakh per depositor per bank, including interest.',
            'Breaking an FD early usually costs a penalty of 0.5–1% on the rate.',
          ],
        },
      ],
      blocks: ['fd-examples'],
      faqs: [
        { question: 'How is FD interest calculated?', answer: 'Most banks compound quarterly: Maturity = P × (1 + r/4)^(4t). ₹1 lakh at 7% for 5 years becomes about ₹1,41,478.' },
        { question: 'Is FD interest taxable?', answer: 'Yes. It is taxed at your income-tax slab rate in the year it accrues, whether paid out or reinvested.' },
        { question: 'When does the bank deduct TDS on FD interest?', answer: 'When your interest from that bank exceeds ₹50,000 in a financial year, or ₹1 lakh for senior citizens. TDS is 10% if your PAN is linked, 20% if not.' },
        { question: 'What is the effective yield of an FD?', answer: 'The annual return after compounding. A 7% FD compounded quarterly has an effective yield of about 7.19%.' },
        { question: 'Are fixed deposits safe?', answer: 'Deposits in banks are insured by DICGC up to ₹5 lakh per depositor per bank, covering principal and interest.' },
        { question: 'Do senior citizens get higher FD rates?', answer: 'Most banks pay an extra 0.25–0.75 percentage points to depositors aged 60 and above. Enter your bank’s senior rate in the calculator.' },
      ],
      sources: [
        { name: 'Reserve Bank of India', url: 'https://www.rbi.org.in/' },
        { name: 'DICGC — Deposit insurance', url: 'https://www.dicgc.org.in/' },
        { name: 'Income Tax Department — TDS and Form 15G/15H', url: 'https://www.incometax.gov.in/' },
      ],
      hub: { href: '/in/tools', label: 'All free calculators for India' },
    },
  },

  'ppf-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    IN: {
      summary:
        'The Public Provident Fund pays 7.1% a year (October–December 2026 quarter), compounded annually, over a 15-year term, and the interest and maturity amount are tax-free. Depositing the maximum ₹1.5 lakh every year before 5 April builds ₹22.5 lakh of deposits into about ₹40.68 lakh at maturity.',
      sections: [
        {
          heading: 'How PPF interest works',
          paragraphs: [
            'Interest is calculated every month on the lowest balance between the 5th and the last day of the month, and credited once a year on 31 March. That is why depositing before 5 April — or before the 5th of any month — earns the most interest.',
            'The rate is set by the government every quarter. It has been 7.1% for many consecutive quarters, but it can change, and a change applies to your whole balance from that quarter onwards.',
          ],
        },
        {
          heading: 'Rules you need to know',
          list: [
            'Deposit at least ₹500 and at most ₹1.5 lakh in a financial year (the limit covers your own account and any account you hold for a minor).',
            'The account matures after 15 full financial years and can be extended in blocks of 5 years, with or without new deposits.',
            'Partial withdrawals are allowed from the 7th financial year; loans against the balance from the 3rd to the 6th year.',
            'Deposits qualify for Section 80C under the old tax regime; interest and maturity are tax-free under both regimes (EEE).',
            'One PPF account per person; NRIs cannot open a new account.',
          ],
        },
      ],
      blocks: ['ppf-examples'],
      faqs: [
        { question: 'What is the PPF interest rate now?', answer: '7.1% a year for the October–December 2026 quarter. The government reviews small savings rates every quarter.' },
        { question: 'How much will ₹1.5 lakh a year in PPF become in 15 years?', answer: 'About ₹40.68 lakh at 7.1%, if deposited before 5 April each year. You deposit ₹22.5 lakh and earn about ₹18.18 lakh of tax-free interest.' },
        { question: 'Is PPF interest taxable?', answer: 'No. PPF has EEE status: deposits qualify for 80C (old regime), and interest and maturity are tax-free.' },
        { question: 'Can I extend PPF after 15 years?', answer: 'Yes, in blocks of 5 years, with or without fresh deposits. To keep depositing you must apply for the extension within a year of maturity.' },
        { question: 'When can I withdraw from PPF?', answer: 'Partial withdrawals are allowed from the 7th financial year, once a year, up to a limit linked to your balance four years earlier. Full withdrawal is at maturity.' },
        { question: 'What is the best date to deposit in PPF?', answer: 'Before 5 April for a yearly deposit, or before the 5th of the month for monthly deposits, so the money earns interest for that month.' },
      ],
      sources: [
        { name: 'Ministry of Finance — Department of Economic Affairs (small savings rates)', url: 'https://dea.gov.in/' },
        { name: 'India Post — Public Provident Fund', url: 'https://www.indiapost.gov.in/' },
        { name: 'National Savings Institute', url: 'https://www.nsiindia.gov.in/' },
      ],
      hub: { href: '/in/tools', label: 'All free calculators for India' },
    },
  },

  '401k-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    US: {
      summary:
        'In 2026 you can defer up to $24,500 of salary into a 401(k), plus $8,000 in catch-up contributions from age 50 ($11,250 at ages 60–63). Contributing 6% of an $80,000 salary with a 50% employer match on the first 6% puts $7,200 a year into your account — $4,800 from you and $2,400 of free money from your employer.',
      sections: [
        {
          heading: 'How the projection works',
          paragraphs: [
            'Each year your contribution is your salary times your contribution percentage, capped at the IRS limit for your age. The employer match is the match rate times what you contribute, on contributions up to the matched percentage of pay. Your balance grows at the return you enter; contributions made during the year earn about half a year of growth.',
            'Salary rises by your raise percentage each year. The IRS limits are held at 2026 levels, so long projections are slightly conservative — the real limits rise with inflation.',
          ],
        },
        {
          heading: 'Getting the most from your 401(k)',
          list: [
            'Always contribute at least enough to collect the full employer match — it is an instant 50–100% return on that money.',
            'Traditional contributions lower your taxable income now; Roth contributions are taxed now but qualified withdrawals are tax-free.',
            'From 2026, catch-up contributions must be Roth if your wages from that employer were above about $150,000 the previous year.',
            'Check your vesting schedule: employer contributions may only become fully yours after several years of service.',
            'Withdrawals before age 59½ usually incur a 10% penalty on top of income tax.',
          ],
        },
      ],
      blocks: ['401k-limits-table', '401k-growth-examples'],
      faqs: [
        { question: 'What is the 401(k) contribution limit for 2026?', answer: '$24,500 for employee deferrals. If you are 50 or older you can add $8,000 of catch-up contributions, or $11,250 if you are 60 to 63.' },
        { question: 'What is the total 401(k) limit including the employer match?', answer: 'Employee and employer contributions together are limited to $72,000 in 2026, plus any catch-up contributions.' },
        { question: 'How does an employer match work?', answer: 'A common formula is 50% of what you contribute, up to 6% of pay: contribute 6% and the employer adds 3%. Contribute less and you lose part of the match.' },
        { question: 'How much should I put in my 401(k)?', answer: 'At least enough to get the full match. Many planners suggest saving 10–15% of pay for retirement in total, including the employer match.' },
        { question: 'Should I choose traditional or Roth 401(k)?', answer: 'Traditional saves tax now and is usually better if you expect a lower tax rate in retirement; Roth is usually better if you expect a higher rate later or are early in your career.' },
        { question: 'What return should I assume?', answer: 'Many projections use 5–7% a year for a diversified stock-heavy portfolio after fees. Use a lower figure for a more cautious plan.' },
      ],
      sources: [
        { name: 'IRS — 401(k) limit increases to $24,500 for 2026', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
        { name: 'IRS — Catch-up contributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions' },
        { name: 'U.S. Department of Labor — Employee Benefits Security Administration', url: 'https://www.dol.gov/agencies/ebsa' },
      ],
      hub: { href: '/us/salary', label: 'Take-home pay for every common US salary' },
    },
  },

  'student-loan-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    UK: {
      summary:
        'UK student loan repayments are 9% of your income above your plan’s threshold (6% above £21,000 for a Postgraduate Loan), taken through payroll. For 2026/27 the thresholds are £26,900 (Plan 1), £29,385 (Plan 2), £33,795 (Plan 4) and £25,000 (Plan 5). On a £35,000 salary a Plan 2 borrower repays about £505 a year, or £42 a month.',
      sections: [
        {
          heading: 'How repayments are calculated',
          paragraphs: [
            'Repayment = (earnings − threshold) × 9% for undergraduate plans, or × 6% for a Postgraduate Loan. Your employer applies the monthly or weekly threshold to each payslip, so a one-off bonus can trigger a repayment in that month. If your annual income ends up below the yearly threshold, you can claim the money back.',
            'The amount you owe and the interest rate do not change your monthly repayment — only your earnings do. Interest only decides how long you repay and how much is written off at the end.',
          ],
        },
        {
          heading: 'Will you repay it in full?',
          paragraphs: [
            'Each plan is written off after a fixed period: 25 years for most Plan 1 loans, 30 years for Plan 2, Plan 4 and Postgraduate Loans, and 40 years for Plan 5. The projection adds interest each year, takes that year’s repayment, and raises your salary by the growth you enter until the balance is cleared or written off.',
            'If a large balance is likely to be written off, overpaying usually just means paying money you would never have been asked for. If you are on track to clear the loan, overpaying can reduce the total interest.',
          ],
        },
      ],
      blocks: ['uk-student-loan-thresholds', 'uk-student-loan-examples'],
      faqs: [
        { question: 'How much is my student loan repayment each month?', answer: '9% of what you earn above your plan’s threshold, divided across your payslips. On £35,000, that is about £42 a month on Plan 2 and £75 a month on Plan 5.' },
        { question: 'What are the 2026/27 student loan thresholds?', answer: 'Plan 1 £26,900, Plan 2 £29,385, Plan 4 £33,795, Plan 5 £25,000 and Postgraduate Loan £21,000 a year.' },
        { question: 'Which plan am I on?', answer: 'Plan 1 for English or Welsh courses started before September 2012 and all Northern Ireland loans; Plan 2 for English or Welsh courses from September 2012 to July 2023; Plan 4 for Scottish loans; Plan 5 for English courses from August 2023.' },
        { question: 'Is student loan repayment taken before or after tax?', answer: 'It is worked out on your gross pay and deducted alongside Income Tax and National Insurance. It does not reduce your taxable income.' },
        { question: 'Can I have two student loans at once?', answer: 'Yes. A Postgraduate Loan is repaid at 6% on top of your undergraduate plan’s 9%, so you can repay 15% of earnings above the thresholds.' },
        { question: 'When is my student loan written off?', answer: 'After 25 years for most Plan 1 loans, 30 years for Plan 2, Plan 4 and Postgraduate Loans, and 40 years for Plan 5, counted from the April after you were first due to repay.' },
      ],
      sources: [
        { name: 'GOV.UK — Repaying your student loan: what you pay', url: 'https://www.gov.uk/repaying-your-student-loan/what-you-pay' },
        { name: 'GOV.UK — Which repayment plan you are on', url: 'https://www.gov.uk/repaying-your-student-loan/which-repayment-plan-you-are-on' },
        { name: 'GOV.UK — When your student loan gets written off', url: 'https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled' },
      ],
      hub: { href: '/uk/salary', label: 'UK take-home pay for every salary from £15,000 to £100,000' },
    },
  },

  'gst-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    IN: {
      summary:
        'Since GST 2.0 took effect on 22 September 2025, most goods and services fall in three slabs — 5%, 18% and 40% — plus nil-rated items and 3% on gold and silver. To add GST, multiply the price by (1 + rate); to remove it from an inclusive price, divide by (1 + rate). ₹11,800 including 18% GST is ₹10,000 plus ₹1,800 GST, split as ₹900 CGST and ₹900 SGST within a state.',
      sections: [
        {
          heading: 'How GST is calculated',
          paragraphs: [
            'Adding GST: GST = taxable value × rate, and the invoice total is taxable value + GST. At 18%, a ₹10,000 service carries ₹1,800 GST and a total of ₹11,800.',
            'Removing GST from an inclusive price: taxable value = inclusive price ÷ (1 + rate). The GST is the difference. A common mistake is to take 18% of the inclusive price, which overstates the tax — 18% of ₹11,800 is ₹2,124, but the GST inside ₹11,800 is only ₹1,800.',
          ],
        },
        {
          heading: 'CGST, SGST and IGST',
          list: [
            'Intra-state supply (seller and buyer in the same state): GST is split equally between CGST (central) and SGST or UTGST (state or union territory).',
            'Inter-state supply and imports: the whole amount is IGST.',
            'The total rate is the same either way — only who collects it changes.',
            'Registered businesses claim input tax credit for GST paid on purchases against GST collected on sales.',
            'Registration is generally required above ₹40 lakh of annual turnover for goods and ₹20 lakh for services (lower limits apply in some special-category states).',
          ],
        },
        {
          heading: 'What changed with GST 2.0',
          paragraphs: [
            'The GST Council removed the 12% and 28% slabs from 22 September 2025. Most items that were taxed at 12% moved to 5%, most items at 28% — including air conditioners, televisions and most cars — moved to 18%, and a new 40% rate applies to tobacco products, sugary and aerated drinks and luxury goods. Always check the rate for the specific HSN or SAC code on your invoice.',
          ],
        },
      ],
      blocks: ['gst-rate-table', 'gst-examples'],
      faqs: [
        { question: 'How do I calculate GST on a price?', answer: 'Multiply the price before GST by the rate. ₹10,000 at 18% has ₹1,800 GST, so the total is ₹11,800.' },
        { question: 'How do I remove GST from an inclusive amount?', answer: 'Divide the inclusive amount by (1 + rate). ₹11,800 ÷ 1.18 = ₹10,000 taxable value, so the GST is ₹1,800.' },
        { question: 'What are the GST rates now?', answer: 'Nil, 5%, 18% and 40% since 22 September 2025, with 3% on gold and silver. The 12% and 28% slabs were removed.' },
        { question: 'What is the difference between CGST, SGST and IGST?', answer: 'Within a state, GST is split equally into CGST and SGST. Between states, the full amount is IGST. The total tax is the same.' },
        { question: 'Is GST charged on the MRP?', answer: 'The MRP printed on packaged goods already includes GST. Use "remove GST" to see the tax inside it.' },
        { question: 'When does a business need to register for GST?', answer: 'Generally when annual turnover exceeds ₹40 lakh for goods or ₹20 lakh for services; lower limits apply in some states, and some businesses must register regardless of turnover.' },
      ],
      sources: [
        { name: 'CBIC — GST', url: 'https://cbic-gst.gov.in/' },
        { name: 'GST Council', url: 'https://gstcouncil.gov.in/' },
        { name: 'GST portal', url: 'https://www.gst.gov.in/' },
      ],
      hub: { href: '/in/tools', label: 'All free calculators for India' },
    },
  },

  'sales-tax-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    US: {
      summary:
        'Sales tax is set by each state, and most counties and cities add their own rate on top. State rates in 2026 range from 0% in Alaska, Delaware, Montana, New Hampshire and Oregon to 7.25% in California. A $100 purchase in a place with a combined 8.25% rate costs $108.25; to find the pre-tax price from a receipt total, divide by 1.0825.',
      sections: [
        {
          heading: 'How sales tax is calculated',
          paragraphs: [
            'Sales tax = price × combined rate, where the combined rate is the state rate plus any county, city and special-district rates. The total you pay is price + tax.',
            'To work backwards from a total that already includes tax, divide by (1 + combined rate). On a $108.25 receipt at 8.25%, the pre-tax price is $108.25 ÷ 1.0825 = $100.',
          ],
        },
        {
          heading: 'What is and is not taxed',
          list: [
            'Many states exempt groceries or tax them at a lower rate; others tax them in full.',
            'Prescription drugs are exempt almost everywhere; clothing is exempt in a few states (for example Pennsylvania, New Jersey and Minnesota for most items).',
            'Services are taxed in some states and not in others.',
            'Online purchases are taxed based on where the item is delivered.',
            'Alaska has no state sales tax but many Alaskan cities levy local sales tax.',
          ],
        },
        {
          heading: 'Sales tax and your federal return',
          paragraphs: [
            'If you itemize deductions, you can deduct either state income tax or state and local sales tax on Schedule A, within the state and local tax (SALT) cap. People in states with no income tax often choose sales tax. Most taxpayers take the standard deduction instead, in which case sales tax is not deductible.',
          ],
        },
      ],
      blocks: ['us-sales-tax-table'],
      faqs: [
        { question: 'How do I calculate sales tax?', answer: 'Multiply the price by the combined state and local rate. $250 at 7% is $17.50 of tax, for a total of $267.50.' },
        { question: 'How do I find the price before tax?', answer: 'Divide the total by (1 + rate). $53.50 at 7% ÷ 1.07 = $50 before tax.' },
        { question: 'Which states have no sales tax?', answer: 'Alaska, Delaware, Montana, New Hampshire and Oregon have no statewide sales tax, although some Alaskan cities charge local sales tax.' },
        { question: 'Which state has the highest sales tax?', answer: 'California has the highest state rate at 7.25%. Combined with local taxes, some places in Louisiana, Tennessee, Arkansas, Washington and Alabama exceed 9%.' },
        { question: 'Why is my receipt rate higher than the state rate?', answer: 'Counties, cities and special districts add their own rates. Enter the extra percentage as the local rate in the calculator.' },
        { question: 'Is sales tax charged on online purchases?', answer: 'Yes, in states with a sales tax. Online sellers collect tax based on the delivery address.' },
      ],
      sources: [
        { name: 'Tax Foundation — State and local sales tax rates, 2026', url: 'https://taxfoundation.org/data/all/state/sales-tax-rates/' },
        { name: 'IRS — Topic 503, Deductible taxes', url: 'https://www.irs.gov/taxtopics/tc503' },
        { name: 'Federation of Tax Administrators', url: 'https://taxadmin.org/' },
      ],
      hub: { href: '/us/tools', label: 'All free calculators for the United States' },
    },
  },

  'vat-calculator': {
    author: 'kuldeep-maurya',
    reviewer: 'editorial-team',
    lastReviewed: '2026-10-04',
    UK: {
      summary:
        'UK VAT is 20% on most goods and services, 5% on a few items such as home energy, and 0% on most food, books and children’s clothes. To add 20% VAT multiply by 1.2; to remove it from a VAT-inclusive price divide by 1.2 — so the VAT in a gross price is one sixth of the total. £120 including VAT is £100 plus £20 VAT.',
      sections: [
        {
          heading: 'How to add and remove VAT',
          paragraphs: [
            'Adding VAT: gross = net × (1 + rate). At 20%, a £250 net invoice becomes £300.',
            'Removing VAT: net = gross ÷ (1 + rate). At 20%, the VAT is gross ÷ 6; at 5%, it is gross ÷ 21. Taking 20% off a VAT-inclusive price is a common mistake — 20% of £120 is £24, but the VAT inside £120 is only £20.',
          ],
        },
        {
          heading: 'VAT for businesses',
          list: [
            'You must register for VAT when your taxable turnover goes over £90,000 in any rolling 12-month period, or you expect it to in the next 30 days.',
            'VAT-registered businesses charge VAT on sales, reclaim VAT on business purchases and pay the difference to HMRC, usually quarterly through Making Tax Digital software.',
            'The Flat Rate Scheme lets small businesses pay a fixed percentage of gross turnover instead of tracking input VAT.',
            'Exempt supplies (such as most insurance, finance and education) are different from zero-rated supplies: zero-rated sales still count towards the registration threshold and allow VAT on costs to be reclaimed.',
          ],
        },
      ],
      blocks: ['vat-examples'],
      faqs: [
        { question: 'How do I add VAT to a price?', answer: 'Multiply the net price by 1.2 for 20% VAT. £50 net becomes £60 including VAT.' },
        { question: 'How do I remove VAT from a price?', answer: 'Divide the VAT-inclusive price by 1.2 to get the net price. The VAT is the difference, or one sixth of the gross amount.' },
        { question: 'What are the UK VAT rates?', answer: 'Standard rate 20%, reduced rate 5% and zero rate 0%. Some supplies are exempt from VAT altogether.' },
        { question: 'What is the VAT registration threshold?', answer: '£90,000 of taxable turnover in any rolling 12-month period. You can register voluntarily below it.' },
        { question: 'Is food zero-rated for VAT?', answer: 'Most food for home consumption is zero-rated, but restaurant meals, hot takeaway food, confectionery, crisps and soft drinks are standard-rated.' },
        { question: 'What is the difference between exempt and zero-rated?', answer: 'Both have no VAT on the sale, but zero-rated sales count towards the registration threshold and let businesses reclaim VAT on costs; exempt sales do not.' },
      ],
      sources: [
        { name: 'GOV.UK — VAT rates', url: 'https://www.gov.uk/vat-rates' },
        { name: 'GOV.UK — VAT registration', url: 'https://www.gov.uk/vat-registration' },
        { name: 'GOV.UK — VAT rates on different goods and services', url: 'https://www.gov.uk/guidance/rates-of-vat-on-different-goods-and-services' },
      ],
      hub: { href: '/uk/tools', label: 'All free calculators for the UK' },
    },
  },
});

/** Resolves content for a tool/country with `{doc}` wording localised (resume vs CV). */
export function getToolContent(slug, countryCode = 'IN') {
  const entry = toolContent[slug];
  if (!entry) return null;
  const code = (countryCode || 'IN').toUpperCase();
  const body = entry[code] || entry.default || entry.IN || entry.US || entry.UK;
  if (!body) return null;

  const isUK = code === 'UK';
  const replacements = {
    '{doc}': isUK ? 'CV' : 'resume',
    '{ukLengthNote}': isUK ? 'two pages is normal for UK CVs' : 'two pages for senior roles',
  };
  const fill = (text) =>
    typeof text === 'string' ? Object.entries(replacements).reduce((t, [k, v]) => t.split(k).join(v), text) : text;

  return {
    author: entry.author,
    reviewer: entry.reviewer,
    lastReviewed: entry.lastReviewed,
    summary: fill(body.summary),
    sections: (body.sections || []).map((s) => ({
      heading: fill(s.heading),
      paragraphs: (s.paragraphs || []).map(fill),
      list: (s.list || []).map(fill),
    })),
    blocks: body.blocks || [],
    faqs: (body.faqs || []).map((f) => ({ question: fill(f.question), answer: fill(f.answer) })),
    sources: body.sources || [],
    hub: body.hub || null,
    productCta: Boolean(body.productCta),
  };
}
