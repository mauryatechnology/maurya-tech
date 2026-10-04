'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Layout } from '@/components/layout';
import { Section, SectionHeader, FeatureCard, ProcessStep, CTASection, TestimonialCard } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import {
  Check,
  Users,
  Building2,
  Briefcase,
  UserCheck,
  HeartHandshake,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Code2,
  Layers,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FREE_TOOL_LINKS = [
  { name: 'India salary & tax', href: '/in', description: 'CTC to in-hand, new vs old regime, EMI' },
  { name: 'US paycheck & wages', href: '/us', description: 'Paycheck by state, hourly to salary' },
  { name: 'UK take-home pay', href: '/uk', description: 'Salary after Income Tax and NI' },
  { name: 'Resume & career tools', href: '/tools', description: 'ATS resume checker, resume builder' },
];

// Lazy-load Advertisement Dialog so it doesn't block critical page render
const AdvertisementDialog = dynamic(() => import('@/components/AdvertisementDialog'), {
  ssr: false,
});

export function HomePage({ homeData: serverHomeData, clientData: serverClientData }) {
  const { homeData: contextHomeData, clientData: contextClientData } = useData();
  const homeData = serverHomeData || contextHomeData;
  const clientData = serverClientData || contextClientData;
  const { hero, problem, engagementModel, whyChooseUs, cta } = homeData;

  return (
    <Layout page="home">
      {/* 1. HERO SECTION: High-Converting Two-Column Layout (Instant LCP & Zero-TBT) */}
      <section className="relative min-h-[85dvh] flex items-center pt-32 pb-16 md:pb-24 w-full overflow-hidden bg-background text-foreground border-b border-border/50">
        {/* Hardware-accelerated ambient glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & CTAs (Standard HTML for instant LCP) */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Risk-Free Pilot Model &bull; {hero.subheadline || 'From Idea to Production'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-[1.15] tracking-tight">
                We Build Scalable Software —{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-blue-600 bg-clip-text text-transparent">
                  Without Upfront Risk.
                </span>
              </h1>

              {/* Sub-description */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {hero.description ||
                  'Maurya Technologies is a product engineering and cloud architecture company helping startups and enterprises build world-class SaaS, mobile apps, and scalable systems.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link href={hero.ctaPrimary?.link || '/contact'}>
                  <Button
                    size="lg"
                    aria-label="Start a Risk-Free Pilot"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm px-8 py-6 rounded-2xl shadow-lg shadow-accent/20 transition hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
                  >
                    <span>{hero.ctaPrimary?.text || 'Start a Risk-Free Pilot'}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/projects">
                  <Button
                    size="lg"
                    variant="outline"
                    aria-label="Explore Case Studies"
                    className="border-border bg-card/80 hover:bg-muted text-foreground font-semibold text-sm px-8 py-6 rounded-2xl backdrop-blur-md transition hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
                  >
                    <Layers className="w-4 h-4 mr-2 text-accent" />
                    <span>Explore Case Studies</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Stats Strip */}
              {hero.stats && hero.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border/60">
                  {hero.stats.map((stat, index) => (
                    <div key={index} className="space-y-0.5">
                      <div className="text-2xl sm:text-3xl font-heading font-bold text-accent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Hero Visual & Tech Telemetry */}
            <div className="lg:col-span-5 relative">
              {/* Outer Glow Card */}
              <div className="relative mx-auto max-w-lg rounded-3xl p-3 bg-gradient-to-b from-accent/20 via-border to-card border border-border shadow-2xl overflow-hidden group">
                <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-950">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                    alt="Maurya Technologies High-Performance Software Architecture Dashboard"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Inside Card Header */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold">Maurya Cloud Engine</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400">v2.4 Active</span>
                  </div>

                  {/* Inside Bottom Metrics */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Pilot Test Success</span>
                      <span className="font-bold text-emerald-400">100% Risk-Free</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[94%]" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Latency: 42ms</span>
                      <span>Uptime: 99.98%</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Top Right */}
                <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-accent/40 shadow-xl text-foreground text-xs font-semibold">
                  <Code2 className="w-4 h-4 text-accent" />
                  <span>Next.js 15 & Flutter</span>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-emerald-500/40 shadow-xl text-foreground text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Enterprise Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONNECT SECTION */}
      <Section className="bg-muted/30 py-16">
        <SectionHeader
          title={homeData.connect?.title || 'Start Your Journey With Us'}
          subtitle={homeData.connect?.subtitle || 'Connect & Collaborate'}
          description={
            homeData.connect?.description ||
            "Whether you're looking for solutions, partnerships, or career growth, we welcome everyone."
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeData.connect?.items.map((item, index) => {
            const iconMap = {
              Users,
              Building2,
              Briefcase,
              UserCheck,
              HeartHandshake,
              GraduationCap,
            };
            const Icon = iconMap[item.icon] || Users;

            return (
              <div
                key={index}
                className="group p-6 bg-card rounded-3xl border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-accent transition-colors text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 3. PROBLEM & GUARANTEE SECTION */}
      <Section variant="muted">
        <SectionHeader title={problem.title} subtitle={problem.subtitle} />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-3.5">
            {problem.problems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-accent/30 transition-colors shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="p-8 md:p-10 bg-card rounded-3xl border border-accent/25 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <ShieldCheck className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground">{problem.solution}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Our unique Pilot Model ensures you test, inspect, and evaluate a fully working version of your product before making any financial commitment.
              </p>
              <div className="pt-2">
                <Link href="/contact">
                  <Button aria-label="Experience the Pilot Model" className="bg-accent text-accent-foreground font-bold text-xs px-6 py-5 rounded-xl">
                    Experience the Pilot Model
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. ENGAGEMENT MODEL */}
      <Section>
        <SectionHeader
          title={engagementModel.title}
          subtitle={engagementModel.subtitle}
          description={engagementModel.description}
        />
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-0">
            {engagementModel.steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                isLast={index === engagementModel.steps.length - 1}
                index={index}
              />
            ))}
          </div>
          <div className="p-8 md:p-10 bg-card border border-border rounded-3xl sticky top-28 overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h4 className="font-heading font-bold text-xl mb-6 text-foreground">What You Get</h4>
              <div className="space-y-4">
                {engagementModel.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. WHY CHOOSE US */}
      <Section variant="muted">
        <SectionHeader title={whyChooseUs.title} subtitle={whyChooseUs.subtitle} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.reasons.map((reason, index) => (
            <FeatureCard
              key={index}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
              index={index}
            />
          ))}
        </div>
      </Section>

      {/* 5b. FREE TOOLS — passes agency equity to the calculator hubs */}
      <Section>
        <SectionHeader
          title="Free Salary & Tax Calculators"
          subtitle="Built and maintained by our team — no sign-up, everything runs in your browser."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FREE_TOOL_LINKS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/60 transition-colors"
            >
              <span className="flex items-center gap-2 font-semibold text-foreground">
                <Calculator className="w-4 h-4 text-primary" aria-hidden="true" />
                {t.name}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">{t.description}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/tools" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            See all free tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Section>

      {/* 6. TESTIMONIALS */}
      <Section>
        <SectionHeader
          title={clientData.testimonials.title}
          subtitle={clientData.testimonials.subtitle}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientData.clients.slice(0, 3).map(
            (client, index) =>
              client.testimonial && (
                <TestimonialCard
                  key={client.id}
                  quote={client.testimonial.quote}
                  author={client.testimonial.author}
                  role={client.testimonial.role}
                  index={index}
                />
              )
          )}
        </div>
      </Section>

      {/* 7. BOTTOM CTA SECTION */}
      <CTASection
        title={cta.title}
        description={cta.description}
        buttonText={cta.buttonText}
        buttonLink={cta.buttonLink}
      />

      {/* Dynamic Advertisement Dialog */}
      <AdvertisementDialog />
    </Layout>
  );
}
