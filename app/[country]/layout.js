import React from 'react';
import { notFound } from 'next/navigation';
import { getMarketProfile } from '@/lib/market/getMarketProfile';
import { CountryHeader } from '@/components/layout/CountryHeader';
import { CountryFooter } from '@/components/layout/CountryFooter';
import { AdSenseScript } from '@/components/ads/AdSenseScript';
import { AdRails, MobileAnchor } from '@/components/ads/AdChrome';

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
    // canonical/hreflang/og:url live on each page: anything set here is inherited by
    // every child that does not override it, pointing those pages at the hub.
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
      <div className="relative flex-1 flex flex-col">
        <AdRails market={market} />
        <main className="flex-1">{children}</main>
      </div>
      <CountryFooter currentCountry={normalized} marketName={market.name} />
      <MobileAnchor market={market} />
    </div>
  );
}
