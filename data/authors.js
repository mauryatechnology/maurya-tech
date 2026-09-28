/**
 * People and teams credited on tools and guides (E-E-A-T).
 * Keep bios factual — never add credentials a person does not hold.
 */
export const authors = [
  {
    slug: 'kuldeep-maurya',
    name: 'Kuldeep Maurya',
    role: 'Founder & Lead Engineer, Maurya Technologies',
    bio: 'Kuldeep founded Maurya Technologies, a software company based in Bhopal, India, and builds and maintains the calculators on this site. He is responsible for the calculation logic, the test cases behind every tool, and keeping each tool in line with the published rules it implements.',
    sameAs: ['https://github.com/kuldeepmaurya4296'],
    expertise: ['Software engineering', 'Calculator logic', 'Web performance'],
  },
  {
    slug: 'editorial-team',
    name: 'Maurya Technologies Editorial Team',
    role: 'Research & Review',
    bio: 'The editorial team researches tax slabs, contribution limits and statutory rates from official government sources, cross-checks each calculator against worked examples, and re-reviews every finance page at the start of each tax year or whenever a budget changes the rules.',
    sameAs: [],
    expertise: ['Indian income tax (new regime)', 'US federal payroll tax', 'UK PAYE & National Insurance'],
  },
];

export function getAuthor(slug) {
  return authors.find((a) => a.slug === slug) || authors[1];
}
