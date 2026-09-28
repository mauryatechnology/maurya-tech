import { CountryHeader } from '@/components/layout/CountryHeader';
import { CountryFooter } from '@/components/layout/CountryFooter';
import { AdSenseScript } from '@/components/ads/AdSenseScript';

/** Light "global-authority" chrome used by country-neutral tool and trust pages. */
export function ToolZoneShell({ market, children, withAds = true }) {
  return (
    <div
      data-theme="global-authority"
      className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-cyan-500 selection:text-white"
    >
      {withAds && market && <AdSenseScript market={market} />}
      <CountryHeader currentCountry="in" marketName="India" />
      <main className="flex-1">{children}</main>
      <CountryFooter currentCountry="in" marketName="India" />
    </div>
  );
}
