import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { businessLegal } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Important disclaimers for ${businessLegal.name} website content and project imagery.`,
};

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      summary="Website content is indicative only. Always confirm scope, compliance and pricing in writing."
    >
      <LegalSection title="General">
        <p>
          Information on this website is provided in good faith for general description of{" "}
          {businessLegal.name} services. It is not a substitute for on-site assessment, engineering
          certification or regulatory approval where required.
        </p>
      </LegalSection>

      <LegalSection title="Compliance & standards">
        <p>
          Glass, balustrade and structural work must comply with applicable Australian Standards,
          National Construction Code requirements and local council conditions. Final compliance is
          confirmed per project specification.
        </p>
      </LegalSection>

      <LegalSection title="Project photos">
        <p>
          Gallery images represent past projects and may not reflect current pricing, lead times or
          product availability. Finishes and colours may vary on screen.
        </p>
      </LegalSection>

      <LegalSection title="External links">
        <p>
          Links to Instagram or other third-party sites are provided for convenience. We are not
          responsible for their content or privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="Consumer guarantees">
        <p>
          Nothing in this disclaimer excludes, restricts or modifies guarantees under the Australian
          Consumer Law that cannot be excluded.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
