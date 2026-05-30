import { Montserrat } from "next/font/google";
import { BrandLoader } from "@/components/branding/BrandLoader";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { CsrfBootstrap } from "@/components/security/CsrfBootstrap";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { MobileChromeProvider } from "@/components/providers/MobileChromeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { BackToTop } from "@/components/ui/BackToTop";
import { MobileQuoteBar } from "@/components/ui/MobileQuoteBar";
import { SkipLink } from "@/components/ui/SkipLink";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { siteConfig } from "@/content/site";
import { readCms } from "@/lib/cms";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekconstructions.com.au"),
  title: {
    default: `${siteConfig.name} | Aluminium, Glass & Construction Sydney`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "EK Constructions — aluminium windows & doors, glass balustrades, steel work, privacy screens and carpentry across Sydney NSW.",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: [{ url: "/images/design-reference.png" }],
  },
  robots: { index: true, follow: true },
  alternates: {
    types: {
      "text/plain": [{ url: "/llms.txt", title: "LLM site summary" }],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cms;
  try {
    cms = await readCms();
  } catch (error) {
    console.error("layout readCms:", error);
    const { getDefaultCms } = await import("@/lib/cms/defaults");
    cms = getDefaultCms();
  }

  return (
    <html lang="en-AU" className={montserrat.variable}>
      <body className="min-h-dvh antialiased">
        <SiteProvider cms={cms}>
          <MobileChromeProvider>
            <CsrfBootstrap />
            <SmoothScroll>
              <SkipLink />
              <BrandLoader />
              <ScrollProgress />
              <PageViewTracker />
              {children}
              <MobileQuoteBar />
              <BackToTop />
            </SmoothScroll>
          </MobileChromeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
