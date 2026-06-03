import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { businessLegal } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing use of the ${businessLegal.name} website.`,
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      summary="By using this website you agree to these terms. Quotes and project commitments are confirmed separately in writing."
    >
      <LegalSection title="Agreement">
        <p>
          By accessing {businessLegal.name} at{" "}
          <a href={businessLegal.siteUrl}>{businessLegal.siteUrl}</a>, you agree to these Terms of
          Use. If you do not agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="Business information">
        <p>
          {businessLegal.name} · ABN {businessLegal.abn} · {businessLegal.jurisdiction}
        </p>
      </LegalSection>

      <LegalSection title="Website content">
        <p>
          Content is provided for general information about our services and completed projects. It
          does not constitute professional advice or a binding quotation unless confirmed in
          writing by us.
        </p>
      </LegalSection>

      <LegalSection title="Quotes & contracts">
        <p>
          Enquiries submitted through the website are invitations to treat only. A contract is formed
          when we issue written acceptance of scope, price and timing agreed with you.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Logos, photographs, text and design elements on this site are owned by {businessLegal.name}{" "}
          or used under licence. You must not copy, scrape or redistribute content without written
          permission.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You must not:</p>
        <ul>
          <li>Attempt to gain unauthorised access to admin areas or systems</li>
          <li>Submit malicious code, spam or automated abuse through forms</li>
          <li>Interfere with site security or availability</li>
          <li>Misrepresent your identity or affiliation</li>
        </ul>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the maximum extent permitted by Australian Consumer Law and other applicable law, we
          exclude liability for indirect or consequential loss arising from use of this website.
          Nothing in these terms limits rights that cannot be excluded by law.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>These terms are governed by the laws of {businessLegal.jurisdiction}.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${businessLegal.email}`}>{businessLegal.email}</a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
