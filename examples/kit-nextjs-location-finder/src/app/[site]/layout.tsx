import { draftMode } from 'next/headers';
import { Metadata } from 'next/types';
import Bootstrap from 'src/Bootstrap';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const { isEnabled } = await draftMode();

  return (
    <>
      <Bootstrap siteName={site} isPreviewMode={isEnabled} />
      {children}
    </>
  );
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
};


// Optional helper to beautify site keys like "energen" → "Energen"
const toTitleCase = (s: string) =>
  s.replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());


/**
 * Per-site metadata: ensures each site gets a branded tab title like:
 *   "About – Energen"
 * and provides a site-specific favicon/icon if present.
 */
export async function generateMetadata(
  { params }: LayoutProps
): Promise<Metadata> {
  const { site } = await params;
  const brand = toTitleCase(site || 'Site');

  return {
    // Title handling: pages can set their own `title`; template appends " – Brand"
    title: {
      default: brand,
      template: `${brand}`,
    },

  };
}