'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Gift,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { JobApplicationForm } from './JobApplicationForm';
import ShareButtons from '@/components/ui/ShareButtons';
import { CrossPromoBanner } from './CrossPromoBanner';

export const JobDetailPage = ({ job }) => {
  if (!job) return null;

  return (
    <Layout page={`careers-job-${job.id}`}>
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pb-20 overflow-hidden bg-background text-foreground border-b border-border/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-accent/10 blur-3xl pointer-events-none -z-10" />

        <div className="container-custom relative z-10 max-w-6xl">
          <Link
            href="/careers"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-accent mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to All Openings
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {job.department}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border">
                {job.type}
              </span>
              {job.experience && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border">
                  {job.experience}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground mb-4 leading-tight">
              {job.title}
            </h1>

            {/* Compensation Badge */}
            {job.salary && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-6">
                <span>💰 {job.salary}</span>
              </div>
            )}

            {/* Meta Strip & Share */}
            <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-muted-foreground pt-5 border-t border-border">
              <div className="flex flex-wrap items-center gap-5">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="w-4 h-4 text-accent shrink-0" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  {job.type}
                </span>
              </div>

              {/* Share Buttons */}
              <ShareButtons
                title={`Hiring in Bhopal: ${job.title} at Maurya Technologies`}
                description={`Apply for ${job.title} (${job.type}) in Bhopal at Maurya Technologies.`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Application Form */}
      <section className="py-16 md:py-24 bg-background text-foreground">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left: Job Details */}
            <div className="lg:col-span-7 space-y-10">
              {/* Skills / Tech Stack Grid */}
              {job.skills && job.skills.length > 0 && (
                <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-md space-y-3.5">
                  <div className="flex items-center gap-2 text-sm font-heading font-bold text-foreground">
                    <Cpu className="w-4 h-4 text-accent" />
                    Required Tech Stack & Capabilities
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted/80 text-foreground border border-border hover:border-accent/30 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  About the Position & Work Model
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-foreground leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    Qualifications & Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-foreground leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* In-body links to the free career tools (plan §6.6) */}
              <div className="p-6 md:p-8 rounded-3xl bg-muted/40 border border-border space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">Before you apply</h2>
                <p className="text-sm text-foreground leading-relaxed">
                  Run your resume through our free{' '}
                  <Link href="/in/tools/ats-resume-checker" className="font-semibold text-accent hover:underline">ATS resume checker</Link>{' '}
                  to see which of this role&apos;s keywords it is missing, and use the{' '}
                  <Link href="/in/tools/ctc-calculator" className="font-semibold text-accent hover:underline">CTC to in-hand salary calculator</Link>{' '}
                  to see what an offer is worth each month after tax and PF.
                </p>
              </div>

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="p-6 md:p-8 rounded-3xl bg-muted/40 border border-border space-y-4">
                  <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                    <Gift className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Perks, Benefits & PPO Path
                  </h2>
                  <ul className="space-y-3">
                    {job.benefits.map((ben, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-foreground leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Sticky Apply Form */}
            <div className="lg:col-span-5 sticky top-28">
              <JobApplicationForm jobTitle={job.title} jobId={job.id || job.customId} />
            </div>
          </div>

          {/* Career Acceleration Cross-Promotion */}
          <div className="mt-12">
            <CrossPromoBanner />
          </div>
        </div>
      </section>
    </Layout>
  );
};
