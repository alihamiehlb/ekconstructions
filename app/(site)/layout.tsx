import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { CsrfBootstrap } from "@/components/security/CsrfBootstrap";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { MobileChromeProvider } from "@/components/providers/MobileChromeProvider";
import { BackToTop } from "@/components/ui/BackToTop";
import { MobileQuoteBar } from "@/components/ui/MobileQuoteBar";
import { SkipLink } from "@/components/ui/SkipLink";
import { readCms } from "@/lib/cms";
import { getDefaultCms } from "@/lib/cms/defaults";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cms;
  try {
    cms = await readCms();
  } catch (error) {
    console.error("site layout readCms:", error);
    cms = getDefaultCms();
  }

  return (
    <SiteProvider cms={cms}>
        <MobileChromeProvider>
          <CsrfBootstrap />
          <SkipLink />
          <PageViewTracker />
          {children}
          <MobileQuoteBar />
          <BackToTop />
        </MobileChromeProvider>
      </SiteProvider>
  );
}
