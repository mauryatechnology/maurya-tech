/**
 * People and teams credited on tools, guides and salary pages (E-E-A-T).
 *
 * RULES
 * - Keep everything factual and verifiable. Never add a credential, degree, licence or
 *   employer a person does not actually hold.
 * - `credentials` must list only qualifications that can be verified (issuer + name).
 *   It is intentionally empty until real credentials are provided.
 * - `verifiedProfiles` are profiles the person controls; they become `sameAs` in JSON-LD.
 */

export const REVIEW_STANDARDS = {
  methodologyUrl: '/methodology',
  editorialPolicyUrl: '/editorial-policy',
  checklist: [
    'Every rate, slab, threshold and limit is checked against the official government source listed on the page.',
    'Each calculator is tested against hand-worked examples before publication, and again after every rule change.',
    'Reference tables and salary pages are generated from the same calculation engine as the calculators, so they cannot disagree.',
    'Finance pages are re-reviewed at least once a year and whenever a budget or tax-year change affects them; the review date is shown on the page.',
    'AI may help draft explanatory text; a person verifies every number before anything is published.',
  ],
};

export const authors = [
  {
    slug: 'kuldeep-maurya',
    type: 'person',
    name: 'Kuldeep Maurya',
    role: 'Founder & Lead Engineer, Maurya Technologies',
    bio: 'Kuldeep founded Maurya Technologies, a software company based in Bhopal, India, and builds and maintains the calculators on this site. He is responsible for the calculation logic, the test cases behind every tool, and keeping each tool in line with the published rules it implements.',
    professionalBackground: [
      'Founder of Maurya Technologies, building web, mobile and cloud software for clients.',
      'Designs and maintains the shared calculation engine behind every salary, tax and loan tool on this site.',
    ],
    expertise: ['Software engineering', 'Calculator and tax-engine logic', 'Web performance', 'Next.js', 'Payroll calculation methods'],
    credentials: [],
    verifiedProfiles: [{ label: 'GitHub', url: 'https://github.com/kuldeepmaurya4296' }],
    responsibilities: ['Calculation logic and tests', 'Programmatic salary pages', 'Tool accuracy fixes'],
    reviews: ['Calculator logic against worked examples', 'Guides for technical accuracy'],
  },
  {
    slug: 'editorial-team',
    type: 'team',
    name: 'Maurya Technologies Editorial Team',
    role: 'Research & Review',
    bio: 'The editorial team researches tax slabs, contribution limits and statutory rates from official government sources, cross-checks each calculator against worked examples, and re-reviews every finance page at the start of each tax year or whenever a budget changes the rules.',
    professionalBackground: [
      'Maintains the source list for Indian income tax (Income Tax Department, Union Budget documents, EPFO), US payroll tax (IRS, SSA) and UK PAYE (GOV.UK/HMRC).',
      'Runs the annual review cycle for India (February–April), the US (October–December) and the UK (March–April).',
    ],
    expertise: ['Indian income tax (new and old regime)', 'US federal payroll tax and FICA', 'US state income tax', 'UK PAYE & National Insurance'],
    credentials: [],
    verifiedProfiles: [{ label: 'LinkedIn', url: 'https://linkedin.com/company/maurya-technologies' }],
    responsibilities: ['Source research', 'Annual rate reviews', 'Corrections'],
    reviews: ['All finance calculators', 'Salary breakdown pages', 'Tax guides'],
  },
];

export function getAuthor(slug) {
  return authors.find((a) => a.slug === slug) || authors[1];
}
