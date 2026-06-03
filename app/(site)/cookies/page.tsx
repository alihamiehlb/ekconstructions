import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { businessLegal } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${businessLegal.name} uses cookies and similar technologies.`,
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      summary="We use a small number of essential cookies for security, admin access and basic analytics."
    >
      <LegalSection title="What are cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a website. They help
          sites remember preferences, keep sessions secure and understand how pages are used.
        </p>
      </LegalSection>

      <LegalSection title="Cookies we use">
        <ul>
          <li>
            <strong>ek_csrf</strong> — protects forms from cross-site request forgery (CSRF). Short
            lived, strict same-site.
          </li>
          <li>
            <strong>ek_admin_session</strong> — secure admin login session (HTTP-only). Only set for
            authorised administrators.
          </li>
          <li>
            <strong>sessionStorage (ek-brand-v2)</strong> — remembers that the loading animation was
            shown in your current browser session (not a persistent cookie).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          We record anonymous page view counts (path and referrer) to understand site usage. We do
          not use third-party advertising trackers on this website.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can block or delete cookies in your browser settings. Blocking essential cookies may
          prevent forms or admin login from working correctly.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions: <a href={`mailto:${businessLegal.email}`}>{businessLegal.email}</a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
