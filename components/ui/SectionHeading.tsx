import { SectionReveal } from "@/components/ui/SectionReveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  delay?: number;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  className = "",
  delay = 0,
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const titleColor = theme === "dark" ? "text-white" : "text-ek-navy";
  const descColor = theme === "dark" ? "text-white/65" : "text-ek-muted";

  return (
    <SectionReveal delay={delay} className={className}>
      <div className={`max-w-2xl ${alignClass}`.trim()}>
        {eyebrow ? (
          <div
            className={`flex items-center gap-2.5 sm:gap-3 ${align === "center" ? "justify-center" : ""}`}
          >
            <p className="text-[9px] font-semibold tracking-[0.24em] text-ek-teal uppercase sm:text-[10px] sm:tracking-[0.28em]">
              {eyebrow}
            </p>
            <span
              className={`h-px max-w-16 bg-ek-teal/80 sm:max-w-32 ${align === "center" ? "hidden sm:block" : "flex-1"}`}
              aria-hidden
            />
          </div>
        ) : null}
        <h2
          className={`${eyebrow ? "mt-2" : ""} text-2xl font-black tracking-[0.12em] uppercase sm:text-3xl lg:text-4xl lg:tracking-[0.14em] ${titleColor}`}
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
