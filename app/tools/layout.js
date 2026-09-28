import { ToolZoneShell } from '@/components/layout/ToolZoneShell';
import { GLOBAL_MARKET } from '@/lib/market/globalMarket';

export const metadata = {
  title: {
    default: 'Free Everyday Calculators & Converters',
    template: '%s | Maurya Tech',
  },
};

export default function GlobalToolsLayout({ children }) {
  return <ToolZoneShell market={GLOBAL_MARKET}>{children}</ToolZoneShell>;
}
