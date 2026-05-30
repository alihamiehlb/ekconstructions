import Image from "next/image";

type Props = {
  className?: string;
  height?: number;
};

/** Real EK Constructions logo — black mark + Architectural Red, for light backgrounds. */
export function LogoWordmark({ className = "", height = 36 }: Props) {
  const ratio = 683 / 364; // intrinsic aspect of the real artwork
  const width = Math.round(height * ratio);

  return (
    <Image
      src="/images/ek-logo-onlight.png"
      alt="EK Constructions"
      width={width}
      height={height}
      priority
      className={`logo-wordmark ${className}`}
    />
  );
}
