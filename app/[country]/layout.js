import React from 'react';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { CountryHeader } from '@/components/layout/CountryHeader';
import { CountryFooter } from '@/components/layout/CountryFooter';
import { AdSenseScript } from '@/components/ads/AdSenseScript';

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

export async function generateMetadata({ params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();

  if (!SUPPORTED_COUNTRIES.includes(normalized)) {
    return { title: 'Country Not Supported' };
  }

  const market = await getMarketProfile(normalized);

  return {
    title: {
      default: market.seoRules?.defaultMetaTitle || `Free Calculators & Digital Utility Tools ${market.name} | Maurya Technologies`,
      template: '%s | Maurya Tech',
    },
    description: market.seoRules?.defaultMetaDescription || `Free online calculators, salary estimators, and productivity tools customized for ${market.name}. Fast, privacy-focused, zero backend storage.`,
    alternates: {
      canonical: `/${normalized}`,
      languages: {
        'en-IN': '/in',
        'en-US': '/us',
        'en-GB': '/uk',
        'x-default': '/in',
      },
    },
    openGraph: {
      title: `${market.name} Digital Utilities & Free Online Calculators | Maurya Technologies`,
      description: `Accurate salary, tax, EMI, and productivity calculators localized for ${market.name}.`,
      url: `https://maurya-tech.com/${normalized}`,
      type: 'website',
      siteName: `Maurya Technologies ${market.name}`,
    },
  };
}

export default async function CountryLayout({ children, params }) {
  const { country } = await params;
  const normalized = (country || '').toLowerCase();

  if (!SUPPORTED_COUNTRIES.includes(normalized)) {
    notFound();
  }

  const market = await getMarketProfile(normalized);

  return (
    <div
      data-theme="global-authority"
      className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-cyan-500 selection:text-white"
    >
      <AdSenseScript market={market} />
      <CountryHeader currentCountry={normalized} marketName={market.name} />
      <main className="flex-1">{children}</main>
      <CountryFooter currentCountry={normalized} marketName={market.name} />
    </div>
  );
}
