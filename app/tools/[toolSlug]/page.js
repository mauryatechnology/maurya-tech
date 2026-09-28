import { notFound } from 'next/navigation';
import { getAllTools } from '@/lib/market/getTool';
import { CALCULATOR_COMPONENTS } from '@/components/tools/registry';
import { ToolPage } from '@/components/tools/ToolPage';
import { GLOBAL_TOOL_SLUGS } from '@/lib/seo/related';
import { absoluteUrl } from '@/lib/seo/schema';
import { GLOBAL_MARKET } from '@/lib/market/globalMarket';

export const dynamicParams = false;

export function generateStaticParams() {
  return GLOBAL_TOOL_SLUGS.map((toolSlug) => ({ toolSlug }));
}

async function getGlobalTool(slug) {
  if (!GLOBAL_TOOL_SLUGS.includes(slug)) return null;
  const tools = await getAllTools();
  return tools.find((t) => t.slug === slug && CALCULATOR_COMPONENTS[t.slug]) || null;
}

export async function generateMetadata({ params }) {
  const { toolSlug } = await params;
  const tool = await getGlobalTool(toolSlug);
  if (!tool) return {};
  const title = tool.seo?.title || tool.name;
  const description = tool.seo?.description || tool.name;
  const url = absoluteUrl(`/tools/${tool.slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Maurya Technologies', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function GlobalToolPage({ params }) {
  const { toolSlug } = await params;
  const tool = await getGlobalTool(toolSlug);
  if (!tool) notFound();

  const path = `/tools/${tool.slug}`;
  const breadcrumbs = [
    { name: 'Tools', href: '/tools' },
    { name: tool.name, href: path },
  ];

  return <ToolPage tool={tool} market={GLOBAL_MARKET} country={null} path={path} breadcrumbs={breadcrumbs} />;
}
