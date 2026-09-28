import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared 1200×630 social card (light "global-authority" style). */
export function renderOg({ eyebrow = 'Maurya Tech', title, subtitle = '' }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0A2540 0%, #0D3B66 60%, #0E7490 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#67E8F9', fontWeight: 700, letterSpacing: 1 }}>{eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', fontSize: title.length > 60 ? 54 : 66, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          {subtitle && <div style={{ display: 'flex', fontSize: 30, color: '#CBD5E1', lineHeight: 1.3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#E2E8F0' }}>
          <span>maurya-tech.com</span>
          <span>Free · Instant · Private</span>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
