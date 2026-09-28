import { AdSlot } from '@/components/ads/AdSlot';
import { MobileAnchorAd } from '@/components/ads/MobileAnchorAd';
import { ADSENSE_CLIENT, adsAllowedFor, slotId } from '@/lib/ads/config';

/*
 * Page-level ad furniture for tool/guide zones. Everything is fixed-size, so it can
 * never shift layout (CLS = 0).
 *
 * Desktop side rails sit in the empty margins OUTSIDE the 1152px content column and only
 * appear when that margin can hold them without touching content:
 *   160×600 from 1536px wide, 300×600 from 1800px wide.
 * (At 1280px the margin is only 64px, so a rail there would overlap the page.)
 * They are rendered inside the main-content wrapper and stick while scrolling, so they
 * stop before the footer instead of covering it.
 */

function RailColumn({ side, slot }) {
  const pos = side === 'left' ? { right: 'calc(50% + 576px + 16px)' } : { left: 'calc(50% + 576px + 16px)' };
  return (
    <div className="hidden 2xl:block absolute top-0 bottom-0 pointer-events-none" style={pos}>
      <div className="sticky top-24 pointer-events-auto">
        <div className="min-[1800px]:hidden">
          <AdSlot enabled client={ADSENSE_CLIENT} slot={slot} placement={`rail-${side}`} size={{ width: 160, height: 600 }} />
        </div>
        <div className="hidden min-[1800px]:block">
          <AdSlot enabled client={ADSENSE_CLIENT} slot={slot} placement={`rail-${side}`} size={{ width: 300, height: 600 }} />
        </div>
      </div>
    </div>
  );
}

/** Place inside a `relative` wrapper around <main>. */
export function AdRails({ market }) {
  const slot = slotId('rail');
  if (!adsAllowedFor(market) || !slot) return null;
  return (
    <>
      <RailColumn side="left" slot={slot} />
      <RailColumn side="right" slot={slot} />
    </>
  );
}

/** Mobile 320×50 anchor (after scroll, dismissible). Place once per layout. */
export function MobileAnchor({ market }) {
  const slot = slotId('anchor');
  if (!adsAllowedFor(market) || !slot) return null;
  return <MobileAnchorAd client={ADSENSE_CLIENT} slot={slot} />;
}
