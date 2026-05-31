import { SectionReveal } from "@/components/ui/SectionReveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  delay?: number;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  className = "",
  delay = 0,
  id,
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const titleColor = theme === "dark" ? "text-white" : "text-ek-navy";
  const descColor = theme === "dark" ? "text-white/70" : "text-ek-muted";
  const eyebrowClass =
    theme === "dark" ? "section-eyebrow section-eyebrow--dark" : "section-eyebrow section-eyebrow--light";

  return (
    <SectionReveal delay={delay} className={className}>
      <div className={`max-w-2xl ${alignClass}`.trim()}>
        {eyebrow ? (
          <p className={`${eyebrowClass} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>
        ) : null}
        <h2
          id={id}
          className={`section-title ${eyebrow ? "mt-3" : ""} text-2xl sm:text-3xl lg:text-4xl ${titleColor}`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`mt-3 text-sm leading-relaxed sm:text-base lg:mt-4 ${descColor}`}>
            {description}
          </p>
        ) : null}
      </div>
    </SectionReveal>
  );
}
