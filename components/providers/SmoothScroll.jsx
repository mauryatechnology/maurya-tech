'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Tool, guide and trust pages keep native scrolling: smooth-scroll libraries add JS,
// hurt INP and fight in-page anchors on content-heavy pages.
const NATIVE_SCROLL_ROUTES = /^\/(in|us|uk|tools|authors|methodology|editorial-policy)(\/|$)/;

export default function SmoothScroll() {
  const pathname = usePathname();
  const disabled = NATIVE_SCROLL_ROUTES.test(pathname || '');

  useEffect(() => {
    if (disabled) return undefined;
    // Disable on touch devices to maximize performance and avoid TBT
    if (typeof window === 'undefined') return undefined;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return undefined;

    let lenisInstance = null;
    let reqId = null;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
      });

      function raf(time) {
        lenisInstance?.raf(time);
        reqId = requestAnimationFrame(raf);
      }

      reqId = requestAnimationFrame(raf);

      // Tell CSS that Lenis owns scrolling, so native `scroll-behavior: smooth`
      // stops competing with it on anchor jumps and scrollIntoView calls.
      document.documentElement.setAttribute('data-lenis-active', '');
    });

    return () => {
      cancelled = true;
      if (reqId) cancelAnimationFrame(reqId);
      if (lenisInstance) lenisInstance.destroy();
      document.documentElement.removeAttribute('data-lenis-active');
    };
  }, [disabled]);

  return null;
}
