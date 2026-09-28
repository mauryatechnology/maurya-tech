/**
 * Tool registry. `localized[COUNTRY]` overrides name/SEO for that country so each
 * country URL has its own title, description and target keyword (no duplicates).
 */
export const defaultTools = [
  {
    slug: 'ctc-calculator',
    name: 'CTC to In-Hand Salary Calculator',
    category: 'salary',
    countries: ['IN', 'UK'],
    scope: 'LOCALIZED',
    computeConfig: { engine: 'lib/tax', rules: ['IN', 'UK'] }, // rates: lib/tax/index.js
    localized: {
      UK: {
        name: 'UK Salary Calculator: Take-Home Pay After Tax',
        seo: {
          title: 'UK Salary Calculator 2026/27: Take-Home Pay After Tax',
          description: 'Work out your UK take-home pay after Income Tax and National Insurance for 2026/27, including the £100k Personal Allowance taper. Monthly and weekly figures.',
          primaryKeyword: 'uk salary calculator take home pay',
        },
      },
    },
    seo: {
      title: 'CTC to In-Hand Salary Calculator FY 2025-26 (New Regime)',
      description: 'Convert CTC to monthly in-hand salary under the new tax regime: ₹75,000 standard deduction, ₹12 lakh 87A rebate, marginal relief, PF and professional tax.',
      primaryKeyword: 'ctc to in hand salary calculator',
      faqSchema: [
        {
          question: 'What is the standard deduction under the new tax regime (FY 2025-26)?',
          answer: 'The standard deduction for salaried employees under the New Tax Regime is ₹75,000 per financial year.',
        },
        {
          question: 'How is in-hand salary calculated from annual CTC?',
          answer: 'Monthly in-hand salary is calculated as: (Gross Monthly Salary - Employee EPF Contribution - Professional Tax - Monthly Income Tax TDS).',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'hourly-to-annual-salary',
    name: 'Hourly to Annual Salary & Tax Calculator',
    category: 'salary',
    countries: ['US', 'UK'],
    scope: 'LOCALIZED',
    computeConfig: { engine: 'lib/tax', rules: ['US', 'UK'] }, // rates: lib/tax/index.js
    localized: {
      UK: {
        name: 'Hourly Wage to Annual Salary Calculator (UK)',
        seo: {
          title: 'Hourly to Annual Salary Calculator UK (After Tax)',
          description: 'Convert a UK hourly wage to annual, monthly and weekly pay, with Income Tax and National Insurance deducted using 2026/27 HMRC rates.',
          primaryKeyword: 'hourly to annual salary calculator uk',
        },
      },
    },
    seo: {
      title: 'Hourly to Annual Salary Calculator 2026 (After Tax)',
      description: 'Convert hourly pay to yearly, monthly and bi-weekly income and see take-home pay after federal tax and FICA or self-employment tax (W-2 and 1099).',
      primaryKeyword: 'hourly to annual salary calculator',
      faqSchema: [
        {
          question: 'How many work hours are in a year for a 40-hour work week?',
          answer: 'There are 2,080 work hours in a standard year (40 hours per week multiplied by 52 weeks).',
        },
        {
          question: 'What is the difference between W-2 and 1099 take-home pay?',
          answer: 'W-2 employees share FICA taxes (7.65% paid by employee, 7.65% by employer). 1099 independent contractors pay the full 15.3% self-employment tax.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'emi-calculator',
    name: 'Home & Personal Loan EMI Calculator',
    category: 'finance',
    countries: ['IN'],
    scope: 'COUNTRY_EXCLUSIVE',
    computeConfig: {
      IN: {
        defaultPrincipal: 2500000,
        defaultInterestRate: 8.5,
        defaultTenureYears: 20,
      },
    },
    seo: {
      title: 'EMI Calculator for Home, Car & Personal Loans (India)',
      description: 'Calculate loan EMI, total interest and the full amortization split instantly. Compare tenures and interest rates before you borrow — free, no signup.',
      primaryKeyword: 'emi calculator india',
      faqSchema: [
        {
          question: 'What is the formula used to calculate EMI?',
          answer: 'EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is tenure in months.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage & Discount Calculator',
    category: 'general',
    countries: ['IN', 'US', 'UK'],
    scope: 'GLOBAL',
    computeConfig: {
      defaultMode: 'percentage_of',
    },
    seo: {
      title: 'Percentage Calculator: % Of, Increase, Decrease & Discount',
      description: 'Find X% of a number, percentage change, exam percentage, discounts and tax-inclusive prices instantly — with formulas and worked examples.',
      primaryKeyword: 'percentage calculator',
      faqSchema: [
        {
          question: 'How do you calculate percentage increase?',
          answer: 'Percentage Increase = [(New Value - Original Value) / Original Value] x 100.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'age-calculator',
    name: 'Exact Age & Date Difference Calculator',
    category: 'general',
    countries: ['IN', 'US', 'UK'],
    scope: 'GLOBAL',
    computeConfig: {
      calculateTimeUnits: true,
    },
    seo: {
      title: 'Age Calculator: Exact Age in Years, Months & Days',
      description: 'Calculate your exact age in years, months and days, your age on any date, and days until your next birthday. Leap years handled correctly.',
      primaryKeyword: 'age calculator online',
      faqSchema: [
        {
          question: 'How accurate is this online age calculator?',
          answer: 'This age calculator runs exact Gregorian calendar math in your browser, precisely accounting for leap years and different month lengths.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'ats-resume-checker',
    name: 'Free ATS Resume Checker & Parser 2026',
    category: 'career',
    countries: ['IN', 'US', 'UK'],
    scope: 'LOCALIZED',
    computeConfig: {},
    localized: {
      UK: {
        name: 'Free ATS CV Checker',
        seo: {
          title: 'Free ATS CV Checker: Score Your CV Instantly (UK)',
          description: 'Check how well your CV passes applicant tracking systems: keywords, action verbs, measurable impact and structure. Runs privately in your browser.',
          primaryKeyword: 'ats cv checker free',
        },
      },
      IN: {
        seo: {
          title: 'Free ATS Resume Checker for Freshers & IT Jobs (India)',
          description: 'Check your resume against applicant tracking systems used by Indian IT companies and MNCs: keywords, action verbs, impact and structure. Private, in-browser.',
          primaryKeyword: 'ats resume checker india',
        },
      },
    },
    seo: {
      title: 'Free ATS Resume Checker: Score Your Resume Instantly',
      description: 'Check how well your resume passes applicant tracking systems: keywords, action verbs, measurable impact and structure. Runs privately in your browser.',
      primaryKeyword: 'ats resume checker free',
      faqSchema: [
        {
          question: 'What is an ATS and why does my score matter?',
          answer: 'Applicant Tracking Systems (ATS) like Workday and Greenhouse screen out 75%+ of resumes before recruiters read them. Scoring 80+ ensures your application passes keyword filtering.',
        },
        {
          question: 'Does this ATS checker save my resume data?',
          answer: 'No. All parsing runs 100% client-side in your web browser. Your resume text is never transmitted or saved to any database.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'cgpa-calculator',
    name: 'CGPA to Percentage & US 4.0 GPA Calculator',
    category: 'general',
    countries: ['IN'],
    scope: 'COUNTRY_EXCLUSIVE',
    computeConfig: {
      defaultMultiplier: 9.5,
    },
    seo: {
      title: 'CGPA to Percentage Calculator (CBSE ×9.5 & SGPA)',
      description: 'Convert CGPA to percentage with the CBSE 9.5 formula, calculate CGPA from semester SGPAs, and estimate a US 4.0 GPA.',
      primaryKeyword: 'cgpa to percentage calculator',
      faqSchema: [
        {
          question: 'How do you convert CGPA to percentage in CBSE?',
          answer: 'Multiply your CGPA by 9.5. For example, a CGPA of 8.4 equals 8.4 × 9.5 = 79.8%.',
        },
        {
          question: 'How does Indian 10-point CGPA convert to US 4.0 GPA?',
          answer: 'A CGPA of 9.0–10.0 converts to a 4.0 (A), 8.0–8.9 converts to roughly 3.7–3.9 (A-), and 7.0–7.9 converts to 3.3–3.6 (B+).',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'resume-builder',
    name: 'Free ATS Resume & CV Builder 2026',
    category: 'career',
    countries: ['IN', 'US', 'UK'],
    scope: 'LOCALIZED',
    computeConfig: {},
    localized: {
      UK: {
        name: 'Free CV Builder (UK)',
        seo: {
          title: 'Free CV Builder UK: ATS-Friendly, No Signup, PDF',
          description: 'Build a UK-style, ATS-friendly CV with live preview and export a clean PDF from your browser. No signup, no watermark, nothing uploaded.',
          primaryKeyword: 'free cv builder uk',
        },
      },
      IN: {
        seo: {
          title: 'Free Resume Builder for Freshers: ATS-Friendly PDF',
          description: 'Create an ATS-friendly resume for campus placements and IT jobs in India. Live preview, clean PDF export, no signup and no watermark.',
          primaryKeyword: 'free resume builder for freshers',
        },
      },
    },
    seo: {
      title: 'Free Resume Builder: ATS-Friendly, No Signup, PDF',
      description: 'Build an ATS-friendly resume or CV with live preview and export a clean PDF from your browser. No signup, no watermark, nothing uploaded.',
      primaryKeyword: 'free ats resume builder online',
      faqSchema: [
        {
          question: 'Is this resume builder truly free with no watermarks?',
          answer: 'Yes, 100% free with no watermarks, no account signup required, and zero hidden paywalls.',
        },
        {
          question: 'Can I export my resume directly as a PDF?',
          answer: 'Yes, click "Print or Export as PDF" to save a clean, high-resolution A4 or Letter PDF directly via your browser print dialog.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'unit-converter',
    name: 'Universal Unit & Measurement Converter',
    category: 'general',
    countries: ['IN', 'US', 'UK'],
    scope: 'GLOBAL',
    computeConfig: {},
    seo: {
      title: 'Unit Converter: Length, Weight, Temperature & Data',
      description: 'Convert length, weight, temperature, speed and data storage (KB, MB, GB, TB, GiB) instantly, with exact conversion factors.',
      primaryKeyword: 'unit converter online free',
      faqSchema: [
        {
          question: 'How many bytes are in a Gigabyte (GB)?',
          answer: 'In binary computing (base-2), 1 Gigabyte (GB) = 1,073,741,824 bytes (1,024 Megabytes).',
        },
        {
          question: 'How do you convert Celsius to Fahrenheit?',
          answer: 'Formula: °F = (°C × 9/5) + 32.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'freelance-rate-calculator',
    name: 'Freelance & Consultant Rate Calculator',
    category: 'finance',
    countries: ['IN', 'US', 'UK'],
    scope: 'LOCALIZED',
    computeConfig: {},
    localized: {
      IN: {
        seo: {
          title: 'Freelance Rate Calculator India: Hourly & Project Pricing',
          description: 'Work out your freelance hourly rate in rupees from target income, expenses, taxes and realistic billable hours — plus day and project rates.',
          primaryKeyword: 'freelance hourly rate calculator india',
        },
      },
      UK: {
        seo: {
          title: 'Freelance Day Rate Calculator UK: Price Your Work',
          description: 'Work out a UK freelance or contractor day rate and hourly rate from target income, expenses, tax and realistic billable days.',
          primaryKeyword: 'freelance day rate calculator uk',
        },
      },
    },
    seo: {
      title: 'Freelance Hourly Rate Calculator: Price Your Work',
      description: 'Work out your freelance hourly rate, day rate and project price from target income, expenses, taxes and realistic billable hours.',
      primaryKeyword: 'freelance rate calculator',
      faqSchema: [
        {
          question: 'Why should freelancers charge more than their equivalent hourly employee wage?',
          answer: 'Freelancers must cover non-billable business development hours, software subscriptions, self-employment taxes, hardware depreciation, and health insurance.',
        },
        {
          question: 'How many billable hours are realistic per week?',
          answer: 'Most full-time freelancers average 25–30 billable hours per week, with the remaining 10–15 hours dedicated to administration, proposals, and skill development.',
        },
      ],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'us-paycheck-calculator',
    name: 'US Paycheck Calculator',
    category: 'salary',
    countries: ['US'],
    scope: 'COUNTRY_EXCLUSIVE',
    computeConfig: { engine: 'lib/tax', rules: ['US'] }, // rates: lib/tax/us.js
    seo: {
      title: 'Paycheck Calculator 2026: Take-Home Pay by State',
      description: 'Take-home pay per paycheck after 2026 federal tax, Social Security, Medicare, state tax, 401(k) and health insurance — single, joint or head of household.',
      primaryKeyword: 'paycheck calculator',
      faqSchema: [],
    },
    status: 'published',
    enabled: true,
  },
  {
    slug: 'income-tax-calculator',
    name: 'Income Tax Calculator: New vs Old Regime',
    category: 'salary',
    countries: ['IN'],
    scope: 'COUNTRY_EXCLUSIVE',
    computeConfig: { engine: 'lib/tax', rules: ['IN'] }, // rates: lib/tax/index.js + indiaOld.js
    seo: {
      title: 'Income Tax Calculator FY 2025-26: New vs Old Regime',
      description: 'Compare new vs old regime tax for FY 2025-26 with HRA, 80C, 80D, NPS and home-loan interest. See taxable income, cess and how much each regime saves.',
      primaryKeyword: 'income tax calculator new vs old regime',
      faqSchema: [],
    },
    status: 'published',
    enabled: true,
  },
];

/** Applies a tool's per-country name/SEO overrides. */
export function localizeTool(tool, countryCode) {
  if (!tool) return tool;
  const code = (countryCode || '').toUpperCase();
  const base = defaultTools.find((t) => t.slug === tool.slug);
  const loc = tool.localized?.[code] || base?.localized?.[code];
  if (!loc) return tool;
  return {
    ...tool,
    name: loc.name || tool.name,
    seo: { ...(tool.seo || {}), ...(loc.seo || {}) },
  };
}
