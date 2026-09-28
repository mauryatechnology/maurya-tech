import { ToolZoneShell } from '@/components/layout/ToolZoneShell';

export const metadata = {
  title: { template: '%s | Maurya Tech', default: 'Maurya Tech' },
};

// Trust pages (authors, methodology, editorial policy) carry no ads.
export default function TrustLayout({ children }) {
  return <ToolZoneShell withAds={false}>{children}</ToolZoneShell>;
}
