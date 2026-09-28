import React from 'react';
import { CareersPage } from '@/components/pages/careers/CareersPage';
import { jobs as initialJobsData } from '@/data/jobs';

// Static Edge Pre-rendering with background ISR - Delivers < 50ms TTFB
export const revalidate = 3600; // 1 hour static cache for instant LCP

export const metadata = {
  title: 'IT Jobs in Bhopal | Careers at Maurya Technologies Bhopal',
  description:
    'Explore top software engineering jobs & tech internships in Bhopal, MP at Maurya Technologies. Hiring Full Stack Mobile Developers (Flutter/Node), MERN + Next.js Developers, DevOps Engineers, Cyber Security Engineers, and QA Test Engineers in Bhopal.',
  alternates: {
    canonical: '/careers',
  },
};

export default function Careers() {
  return <CareersPage jobsData={initialJobsData} />;
}
