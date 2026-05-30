import Image from "next/image";

type LogoMarkProps = {
  className?: string;
  animate?: boolean;
};

/** Real EK Constructions logo — white mark + Architectural Red, for dark backgrounds. */
export function LogoMark({ className = "h-[38px] w-auto", animate = false }: LogoMarkProps) {
  const ratio = 1011 / 481; // intrinsic aspect of the on-dark artwork
  return (
    <Image
      src="/images/ek-logo-ondark.png"
      alt="EK Constructions"
      width={Math.round(38 * ratio)}
      height={38}
      priority
      className={`${className}${animate ? " animate-[logoText_0.6s_ease-out_forwards]" : ""}`}
    />
  );
}
