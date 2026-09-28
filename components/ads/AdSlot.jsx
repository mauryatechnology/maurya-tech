'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * AdSense unit.
 * - `size` omitted → responsive in-content unit with a reserved min-height.
 * - `size={{ width, height }}` → fixed-size unit (rails, anchor) whose box is reserved
 *   exactly, so it can never shift layout (CLS = 0).
 * - Requests an ad only when within ~300px of the viewport.
 * - Renders nothing when `enabled` is false (decided server-side from env + market).
 */
export function AdSlot({
  enabled = false,
  client,
  slot,
  placement = 'content',
  minHeight = 280,
  size = null,
  showLabel = true,
  className = '',
}) {
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

  const label = showLabel ? <p className="text-[10px] uppercase tracking-wider text-slate-400 text-center mb-1">Advertisement</p> : null;

  if (size) {
    return (
      <aside ref={ref} aria-label="Advertisement" data-placement={placement} className={className} style={{ width: size.width }}>
        {label}
        <div style={{ width: size.width, height: size.height }} className="overflow-hidden">
          {visible && (
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: size.width, height: size.height }}
              data-ad-client={client}
              data-ad-slot={slot}
            />
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside
      ref={ref}
      aria-label="Advertisement"
      data-placement={placement}
      className={`my-8 w-full overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {label}
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
