'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Responsive AdSense unit.
 * - Reserves its height before the ad loads → no layout shift (CLS).
 * - Only requests an ad when it is ~300px from the viewport.
 * - Renders nothing when `enabled` is false (decided server-side from env + market).
 */
export function AdSlot({ enabled = false, client, slot, placement = 'content', minHeight = 280, className = '' }) {
  const ref = useRef(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !slot || !ref.current) return undefined;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, slot]);

  useEffect(() => {
    if (!visible || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blocked or script not loaded yet — the reserved space simply stays empty.
    }
  }, [visible]);

  if (!enabled || !slot) return null;

  return (
    <aside
      ref={ref}
      aria-label="Advertisement"
      data-placement={placement}
      className={`my-8 w-full overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      <p className="text-[10px] uppercase tracking-wider text-slate-400 text-center mb-1">Advertisement</p>
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: minHeight - 16 }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </aside>
  );
}
