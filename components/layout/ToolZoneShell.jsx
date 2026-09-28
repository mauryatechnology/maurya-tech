import { CountryHeader } from '@/components/layout/CountryHeader';
import { CountryFooter } from '@/components/layout/CountryFooter';
import { AdSenseScript } from '@/components/ads/AdSenseScript';
import { AdRails, MobileAnchor } from '@/components/ads/AdChrome';

/** Light "global-authority" chrome used by country-neutral tool and trust pages. */
export function ToolZoneShell({ market, children, withAds = true }) {
  const ads = withAds && market;
  return (
    <div
      data-theme="global-authority"
      className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-cyan-500 selection:text-white"
    >
      {ads && <AdSenseScript market={market} />}
      <CountryHeader currentCountry="in" marketName="India" />
      <div className="relative flex-1 flex flex-col">
        {ads && <AdRails market={market} />}
        <main className="flex-1">{children}</main>
      </div>
      <CountryFooter currentCountry="in" marketName="India" />
      {ads && <MobileAnchor market={market} />}
    </div>
  );
}
