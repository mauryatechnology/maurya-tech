import { AdSlot } from '@/components/ads/AdSlot';
import { ADSENSE_CLIENT, adsAllowedFor, slotId } from '@/lib/ads/config';

/** Server wrapper: resolves env + market rules, then renders the client slot (or nothing). */
export function Ad({ market, placement = 'toolMid', minHeight = 280, className = '' }) {
  const enabled = adsAllowedFor(market);
  if (!enabled) return null;
  return (
    <AdSlot
      enabled
      client={ADSENSE_CLIENT}
      slot={slotId(placement)}
      placement={placement}
      minHeight={minHeight}
      className={className}
    />
  );
}
