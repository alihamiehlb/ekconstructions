import Image from "next/image";

type Props = {
  className?: string;
  height?: number;
  /** `light` = dark logo for white backgrounds; `dark` = light logo for hero/dark backgrounds */
  variant?: "light" | "dark";
};

/** Real EK Constructions logo artwork. */
export function LogoWordmark({ className = "", height = 36, variant = "light" }: Props) {
  const ratio = 683 / 364;
  const width = Math.round(height * ratio);
  const src = variant === "dark" ? "/images/ek-logo-ondark.png" : "/images/ek-logo-onlight.png";

  return (
    <Image
      src={src}
      alt="EK Constructions"
      width={width}
      height={height}
      priority
      className={`logo-wordmark ${className}`}
    />
  );
}
