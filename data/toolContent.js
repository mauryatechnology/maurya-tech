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
        'Under the new tax regime (FY 2025-26), a salaried employee pays no income tax when taxable income is ₹12 lakh or less, thanks to the ₹75,000 standard deduction and the Section 87A rebate. That means a gross salary of up to ₹12.75 lakh is effectively tax-free — your in-hand pay is then CTC minus PF (employer and employee) and professional tax.',
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
      sources: [],
    },
  },
};

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
