'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';

const DISMISS_KEY = 'anchor-ad-dismissed';

/**
 * Mobile-only 320×50 anchor unit.
 * - Appears only after the visitor scrolls 400px (never on first paint, never over the
 *   calculator on load).
 * - One-tap dismiss, remembered for the browser session.
 * - Fixed-position, so it never moves page content; a matching spacer at the end of the
 *   page (rendered whenever the anchor may appear) keeps the footer from being covered.
 */
export function MobileAnchorAd({ client, slot }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed) return undefined;
    const onScroll = () => {
      if (window.scrollY > 400) {
        setShow(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  return (
    <>
      {/* Spacer so the fixed anchor never hides the last content on the page */}
      <div aria-hidden="true" className="lg:hidden" style={{ height: 'calc(66px + env(safe-area-inset-bottom, 0px))' }} />
      {show && !dismissed && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-slate-200 bg-white/95 backdrop-blur"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="relative py-2">
            <AdSlot enabled client={client} slot={slot} placement="anchor" size={{ width: 320, height: 50 }} showLabel={false} />
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close advertisement"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-300 shadow flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
