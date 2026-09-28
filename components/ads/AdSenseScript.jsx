import Script from 'next/script';
import { ADSENSE_CLIENT, adsAllowedFor } from '@/lib/ads/config';

/**
 * Loads adsbygoogle.js once, after the page is interactive, only on ad-eligible routes
 * (tools, guides, programmatic pages). Google's certified consent message (Funding
 * Choices, configured in AdSense → Privacy & messaging) is delivered by this same tag
 * for UK/EEA visitors.
 */
export function AdSenseScript({ market }) {
  if (!adsAllowedFor(market)) return null;
  return (
    <Script
      id="adsbygoogle-init"
      strategy="lazyOnload"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
