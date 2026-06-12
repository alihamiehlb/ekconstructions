import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { businessLegal } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${businessLegal.name} collects, uses and protects personal information under Australian privacy law.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      summary="We collect only what we need to respond to enquiries and deliver our construction services. We do not sell personal information."
    >
      <LegalSection title="Who we are">
        <p>
          {businessLegal.name} (ABN {businessLegal.abn}) is a Sydney-based construction business
          specialising in aluminium glazing, glass balustrades, steel work and privacy screens.
          This policy explains how we handle personal information under the{" "}
          <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <ul>
          <li>Contact details you submit (name, email, phone)</li>
          <li>Project details and service preferences in your message</li>
          <li>Basic website analytics (pages viewed, referrer, approximate timing)</li>
          <li>Technical data such as IP address for security and spam prevention</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>We use personal information to:</p>
        <ul>
          <li>Respond to quotes and enquiries</li>
          <li>Deliver and manage construction services</li>
          <li>Improve our website and measure interest in services</li>
          <li>Protect the site from abuse, fraud and security incidents</li>
        </ul>
        <p>We do not sell or rent your personal information to third parties.</p>
      </LegalSection>

      <LegalSection title="Legal basis & consent">
        <p>
          By submitting our contact form you consent to us using your details to respond to your
          enquiry. Where required, we may rely on legitimate business purposes such as record-keeping
          and legal compliance.
        </p>
      </LegalSection>

      <LegalSection title="Storage & retention">
        <p>
          Enquiries may be stored in secure infrastructure (for example Vercel hosting and/or
          Supabase database). We retain enquiry records only as long as needed for business,
          accounting or legal purposes, then delete or de-identify them where reasonable.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use HTTPS, access controls, input validation, rate limiting and CSRF protection on
          forms. No online system is perfectly secure; please avoid sending highly sensitive
          documents via the contact form unless requested.
        </p>
        <p>
          See our <a href="/security">Security page</a> for more detail.
        </p>
      </LegalSection>

      <LegalSection title="Third parties">
        <ul>
          <li>Hosting and infrastructure providers (e.g. Vercel)</li>
          <li>Optional email delivery (e.g. Resend) when configured</li>
          <li>Instagram/Meta when you follow links to our social profile</li>
        </ul>
        <p>These providers process data under their own privacy policies.</p>
      </LegalSection>

      <LegalSection title="Your rights (Australia)">
        <p>You may request access to, or correction of, personal information we hold about you.</p>
        <p>
          Contact:{" "}
          <a href={`mailto:${businessLegal.email}`}>{businessLegal.email}</a>
        </p>
        <p>
          If you are not satisfied with our response, you may contact the Office of the Australian
          Information Commissioner (OAIC) at{" "}
          <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
            oaic.gov.au
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy from time to time. Material changes will be reflected on this
          page with an updated date.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
