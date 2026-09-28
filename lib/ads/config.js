/**
 * Display-ad configuration. Everything is env-driven so ads can be switched on the day
 * AdSense approves the site, without a code change:
 *
 *   NEXT_PUBLIC_ADS_ENABLED=true
 *   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT=1234567890          (any responsive display unit)
 *   NEXT_PUBLIC_ADSENSE_SLOT_TOOL_RESULT / _TOOL_MID / _TOOL_BOTTOM / _ARTICLE   (optional overrides)
 *
 * Per-country kill switch: MarketProfile.monetizationRules.adNetwork ('adsense' | 'none'),
 * editable in /admin/markets.
 */

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' && /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);

const SLOTS = {
  toolResult: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_RESULT,
  toolMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_MID,
  toolBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM,
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE,
};

export function slotId(placement) {
  return SLOTS[placement] || process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT || '';
}

/** True when ads may render for this market (global switch + country switch). */
export function adsAllowedFor(market) {
  if (!ADS_ENABLED) return false;
  const network = market?.monetizationRules?.adNetwork;
  return network === 'adsense';
}

/** The publisher ID without the "ca-" prefix, as used in ads.txt. */
export function publisherId() {
  return ADSENSE_CLIENT.replace(/^ca-/, '');
}
