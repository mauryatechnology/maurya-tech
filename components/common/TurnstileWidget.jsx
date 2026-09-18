'use client';

import React, { useEffect, useRef, useState } from 'react';

export function TurnstileWidget({
  onVerify,
  onExpire,
  theme = 'auto',
  className = '',
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  }, [onVerify, onExpire]);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;

    // Check if script already loaded
    if (window.turnstile) {
      queueMicrotask(() => setLoaded(true));
      return;
    }

    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setLoaded(true);
      script.onerror = () => console.warn('Failed to load Cloudflare Turnstile script.');
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setLoaded(true));
    }
  }, [siteKey]);

  useEffect(() => {
    if (!loaded || !window.turnstile || !containerRef.current || !siteKey) {
      return;
    }

    // Clean up old widget if re-rendering
    if (widgetIdRef.current !== null) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {}
      widgetIdRef.current = null;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        callback: (token) => {
          if (onVerifyRef.current) onVerifyRef.current(token);
        },
        'expired-callback': () => {
          if (onExpireRef.current) onExpireRef.current();
        },
        'error-callback': () => {
          if (onExpireRef.current) onExpireRef.current();
        },
      });
    } catch (err) {
      console.warn('Turnstile render error:', err);
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [loaded, siteKey, theme]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className={`my-2 flex justify-start ${className}`}>
      <div ref={containerRef} className="turnstile-wrapper min-h-[65px]" />
    </div>
  );
}

export default TurnstileWidget;
