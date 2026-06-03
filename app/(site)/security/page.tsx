import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { businessLegal } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description: `Security practices and protections used on the ${businessLegal.name} website.`,
};

export default function SecurityPage() {
  return (
    <LegalLayout
      title="Security"
      summary="We apply defence-in-depth controls to protect visitors, enquiries and admin content."
    >
      <LegalSection title="Transport & headers">
        <ul>
          <li>HTTPS enforced in production (HSTS)</li>
          <li>Content Security Policy (CSP) limiting script and resource origins</li>
          <li>X-Frame-Options, X-Content-Type-Options, Referrer-Policy</li>
          <li>Permissions-Policy restricting camera, microphone and geolocation</li>
        </ul>
      </LegalSection>

      <LegalSection title="Application protections">
        <ul>
          <li>
            <strong>CSRF protection</strong> on state-changing requests using synchronised tokens
          </li>
          <li>
            <strong>Input validation & sanitisation</strong> — Zod schemas plus HTML/script stripping
            to mitigate XSS and injection attempts
          </li>
          <li>
            <strong>Rate limiting</strong> on contact, login and analytics endpoints
          </li>
          <li>
            <strong>Origin checks</strong> on API mutations to reduce cross-site abuse
          </li>
          <li>
            <strong>Honeypot field</strong> on the contact form to deter bots
          </li>
          <li>
            <strong>Parameterized database access</strong> when Supabase is enabled (no raw SQL from
            user input)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Admin access">
        <ul>
          <li>Password verified with timing-safe comparison</li>
          <li>Short-lived signed JWT session cookie (HTTP-only, SameSite=Lax)</li>
          <li>Admin routes blocked at middleware without valid session</li>
          <li>Failed login attempts logged and rate limited</li>
          <li>Admin pages marked no-store to reduce caching of sensitive views</li>
        </ul>
      </LegalSection>

      <LegalSection title="Data handling">
        <p>
          Enquiry data is stored with access limited to authorised staff. We do not publish contact
          submissions on the public site. CMS content is validated before being written to disk or
          database.
        </p>
      </LegalSection>

      <LegalSection title="Reporting issues">
        <p>
          If you believe you have found a security vulnerability, please email{" "}
          <a href={`mailto:${businessLegal.email}`}>{businessLegal.email}</a> with details. Please do
          not publicly disclose issues until we have had a reasonable opportunity to investigate.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
