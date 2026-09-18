import { Inter, Montserrat, Open_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { globalKeywordsList, seoData } from "@/data/seo-keywords";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { serializeJsonLd } from "@/lib/utils";
import { ThemeScript } from "@/contexts/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0f1d" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1d" },
  ],
};

export const metadata = {
  metadataBase: new URL('https://maurya-tech.com'),
  title: {
    default: "Maurya Technologies | Scalable Software & Enterprise Solutions",
    template: "%s | Maurya Technologies"
  },
  description: "Maurya Technologies: Leading Software Engineering & IT Company in Bhopal, India. We build scalable SaaS, Web Applications, Mobile Apps, Cloud Infrastructure, and AI Solutions with a risk-free Pilot Model.",
  keywords: globalKeywordsList,
  authors: [{ name: "Kuldeep Maurya" }, { name: "Maurya Technologies Team" }],
  creator: "Maurya Technologies",
  publisher: "Maurya Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Maurya Technologies | Scalable Software & Enterprise Solutions",
    description: "Expert Software Development Services. We build scalable, high-performance web and mobile applications using modern technologies.",
    url: 'https://maurya-tech.com',
    siteName: 'Maurya Technologies',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maurya Technologies & Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Maurya Technologies",
    description: "Innovative software solutions. From Idea to Production. Start your risk-free pilot today.",
    images: ['/og-image.png'],
    creator: '@mauryatech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  // public/site.webmanifest and the sized PNG icons existed but were never
  // linked, so no browser or install prompt could find them.
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  category: 'technology',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Maurya Technologies",
    "alternateName": seoData.typos,
    "url": "https://maurya-tech.com",
    "logo": "https://maurya-tech.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bhopal",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://github.com/kuldeepmaurya4296",
      "https://linkedin.com/company/maurya-technologies"
    ]
  };

  return (
    <html lang="en" data-theme="engineer-dark" className="dark" suppressHydrationWarning>
      <head>
        {/* Pre-paint theme sync: applies the stored theme before first paint
            so the CSS default never flashes. Validates against data/themes.js. */}
        <ThemeScript />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${openSans.variable} ${firaCode.variable} antialiased bg-[#0a0f1d] text-[#f8fafc]`} suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
