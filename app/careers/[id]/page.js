import { cache } from 'react';
import { notFound } from 'next/navigation';
import { jobs as fallbackJobs } from '@/data/jobs';
import { JobDetailPage } from '@/components/pages/careers/JobDetailPage';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import { serializeJsonLd } from '@/lib/utils';

export const revalidate = 60;

// Cached so generateMetadata and the page share one query per request.
const getJobById = cache(async (id) => {
  try {
    await connectToDatabase();
    const dbJob = await Job.findOne({
      $or: [
        { customId: id },
        { slug: id },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    }).lean();

    if (dbJob) {
      const posted = dbJob.createdAt ? new Date(dbJob.createdAt) : new Date();
      const expires = new Date(posted.getTime() + 90 * 24 * 60 * 60 * 1000);
      return {
        id: dbJob.customId || dbJob.slug || dbJob._id.toString(),
        slug: dbJob.slug || dbJob.customId,
        title: dbJob.title,
        department: dbJob.department,
        location: dbJob.location,
        type: dbJob.type,
        experience: dbJob.experience,
        salary: dbJob.salary || '',
        skills: dbJob.skills || [],
        description: dbJob.description,
        responsibilities: dbJob.responsibilities || [],
        requirements: dbJob.requirements || [],
        benefits: dbJob.benefits || [],
        isActive: dbJob.isActive,
        createdAt: dbJob.createdAt,
        datePosted: posted.toISOString(),
        validThrough: expires.toISOString(),
      };
    }
  } catch (err) {
    console.warn('MongoDB Job detail lookup fallback:', err.message);
  }

  const fallback = (fallbackJobs.jobs || []).find((j) => j.id === id || j.slug === id);
  if (fallback) {
    const posted = fallback.createdAt ? new Date(fallback.createdAt) : new Date('2026-01-01');
    const expires = new Date(posted.getTime() + 90 * 24 * 60 * 60 * 1000);
    return {
      ...fallback,
      datePosted: posted.toISOString(),
      validThrough: expires.toISOString(),
    };
  }
  return null;
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return {
      title: 'Position Not Found | Careers | Maurya Technologies Bhopal',
    };
  }

  // Generate 25+ dynamic high-ranking keywords for this role in Bhopal
  const roleKeywords = [
    job.title,
    `${job.title} Jobs in Bhopal`,
    `${job.title} Bhopal`,
    `Jobs in Bhopal`,
    `IT Jobs in Bhopal`,
    `Software Developer Jobs in Bhopal`,
    `Tech Jobs Bhopal Madhya Pradesh`,
    `${job.title} Hiring Bhopal`,
    `${job.title} Internship Bhopal 2026`,
    `IT Fresher Jobs in Bhopal`,
    `Software Company in Bhopal Hiring`,
    `${job.department} Careers Bhopal`,
    ...(job.skills || []),
    ...(job.skills || []).map((s) => `${s} Jobs in Bhopal`),
    'Maurya Technologies Bhopal Careers',
    'Best IT Companies in Bhopal for Freshers',
    'Tech Internships in Bhopal',
  ];

  return {
    title: `${job.title} (${job.type}) in Bhopal | Maurya Technologies`,
    description: `Apply for ${job.title} (${job.type}, ${job.experience}) at Maurya Technologies in Bhopal, MP, India. Tech Stack: ${(job.skills || []).join(', ')}. ${(job.description || '').slice(0, 140)}...`,
    alternates: {
      canonical: `/careers/${job.id || job.slug}`,
    },
    keywords: roleKeywords,
    openGraph: {
      title: `Hiring in Bhopal: ${job.title} | Maurya Technologies`,
      description: `Join Maurya Technologies in Bhopal as a ${job.title} (${job.type}). ${job.location}. Best-in-class compensation & fast career growth.`,
      url: `https://maurya-tech.com/careers/${job.id || job.slug}`,
      type: 'website',
      siteName: 'Maurya Technologies Bhopal Careers',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Hiring in Bhopal: ${job.title} at Maurya Technologies`,
      description: `Apply now for ${job.title} (${job.type}) in Bhopal, MP, India.`,
    },
  };
}

export default async function JobDetail({ params }) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  // Google Jobs Structured Data (JSON-LD) with Bhopal Location
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: `${job.title} in Bhopal`,
    description: `<p>${job.description}</p><p><strong>Job Location:</strong> Bhopal, Madhya Pradesh, India (Hybrid | First 3 Months Office Mandate)</p><h3>Key Responsibilities:</h3><ul>${(job.responsibilities || []).map((r) => `<li>${r}</li>`).join('')}</ul><h3>Qualifications & Requirements:</h3><ul>${(job.requirements || []).map((req) => `<li>${req}</li>`).join('')}</ul>`,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.type === 'Internship' ? 'INTERN' : 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Maurya Technologies',
      sameAs: 'https://maurya-tech.com',
      logo: 'https://maurya-tech.com/favicon.ico',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
    skills: (job.skills || []).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <JobDetailPage job={job} />
    </>
  );
}
