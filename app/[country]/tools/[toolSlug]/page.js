import React from 'react';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { getToolBySlug, getToolsForCountry } from '@/lib/market/getTool';
import { SalaryCtcCalculator } from '@/components/tools/calculators/SalaryCtcCalculator';
import { HourlyToAnnualCalculator } from '@/components/tools/calculators/HourlyToAnnualCalculator';
import { EmiCalculator } from '@/components/tools/calculators/EmiCalculator';
import { PercentageCalculator } from '@/components/tools/calculators/PercentageCalculator';
import { AgeDateCalculator } from '@/components/tools/calculators/AgeDateCalculator';
import { AtsResumeChecker } from '@/components/tools/calculators/AtsResumeChecker';
import { CgpaCalculator } from '@/components/tools/calculators/CgpaCalculator';
import { ResumeBuilder } from '@/components/tools/calculators/ResumeBuilder';
import { UnitConverter } from '@/components/tools/calculators/UnitConverter';
import { FreelanceRateCalculator } from '@/components/tools/calculators/FreelanceRateCalculator';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

const CALCULATOR_COMPONENTS = {
  'ctc-calculator': SalaryCtcCalculator,
  'hourly-to-annual-salary': HourlyToAnnualCalculator,
  'emi-calculator': EmiCalculator,
  'percentage-calculator': PercentageCalculator,
  'age-calculator': AgeDateCalculator,
  'ats-resume-checker': AtsResumeChecker,
  'cgpa-calculator': CgpaCalculator,
  'resume-builder': ResumeBuilder,
  'unit-converter': UnitConverter,
  'freelance-rate-calculator': FreelanceRateCalculator,
};

export async function generateStaticParams() {
  const params = [];
  for (const country of SUPPORTED_COUNTRIES) {
    const tools = await getToolsForCountry(country);
    for (const tool of tools) {
      params.push({
        country,
        toolSlug: tool.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { country, toolSlug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) return {};

  const market = await getMarketProfile(normalizedCountry);
  const tool = await getToolBySlug(toolSlug, normalizedCountry);
  if (!tool) return {};

  // Build hreflangs for countries supporting this tool
  const languageAlternates = {};
  const toolCountries = tool.countries || ['IN', 'US', 'UK'];
  if (toolCountries.includes('IN')) languageAlternates['en-IN'] = `https://maurya-tech.com/in/tools/${tool.slug}`;
  if (toolCountries.includes('US')) languageAlternates['en-US'] = `https://maurya-tech.com/us/tools/${tool.slug}`;
  if (toolCountries.includes('UK')) languageAlternates['en-GB'] = `https://maurya-tech.com/uk/tools/${tool.slug}`;

  const title = tool.seo?.title || `${tool.name} for ${market.name} (2026)`;
  const description = tool.seo?.description || `Free online ${tool.name} for ${market.name}. Instant accurate calculations with 2026 rules.`;

  return {
    title,
    description,
    keywords: tool.seo?.primaryKeyword ? [tool.seo.primaryKeyword, tool.category, market.name] : undefined,
    alternates: {
      canonical: `https://maurya-tech.com/${normalizedCountry}/tools/${tool.slug}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `https://maurya-tech.com/${normalizedCountry}/tools/${tool.slug}`,
      siteName: 'Maurya Technologies',
      locale: normalizedCountry === 'in' ? 'en_IN' : normalizedCountry === 'uk' ? 'en_GB' : 'en_US',
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }) {
  const { country, toolSlug } = await params;
  const normalizedCountry = (country || '').toLowerCase();
  if (!SUPPORTED_COUNTRIES.includes(normalizedCountry)) notFound();

  const market = await getMarketProfile(normalizedCountry);
  const tool = await getToolBySlug(toolSlug, normalizedCountry);
  if (!tool) notFound();

  const CalculatorComponent = CALCULATOR_COMPONENTS[tool.slug];
  if (!CalculatorComponent) notFound();

  // Country specific config extract
  const computeConfig = tool.computeConfig?.[market.code] || tool.computeConfig || {};

  // SoftwareApplication JSON-LD Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'Any',
    applicationCategory: tool.category === 'salary' || tool.category === 'finance' ? 'FinanceApplication' : 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: market.currency || 'USD',
    },
    description: tool.seo?.description || `${tool.name} by Maurya Technologies`,
    url: `https://maurya-tech.com/${normalizedCountry}/tools/${tool.slug}`,
  };

  // FAQPage JSON-LD Schema
  const faqSchema = tool.seo?.faqSchema && tool.seo.faqSchema.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.seo.faqSchema.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Render Selected Dynamic Client Calculator */}
      <CalculatorComponent
        country={normalizedCountry}
        countryName={market.name}
        computeConfig={computeConfig}
        tool={tool}
      />
    </div>
  );
}
