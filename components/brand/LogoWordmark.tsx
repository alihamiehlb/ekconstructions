type Props = {
  className?: string;
  height?: number;
};

/** Instagram / brand wordmark — orange + black, blends on light backgrounds */
export function LogoWordmark({ className = "", height = 36 }: Props) {
  const width = Math.round(height * (220 / 52));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 52"
      fill="none"
      role="img"
      aria-label="EK Constructions"
      width={width}
      height={height}
      className={`logo-wordmark ${className}`}
    >
      <rect width="36" height="36" rx="4" fill="#EF6C00" />
      <text
        x="18"
        y="24"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="var(--font-montserrat), Montserrat, Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
      >
        04
      </text>
      <text
        x="46"
        y="30"
        fill="#1A1A1A"
        fontFamily="var(--font-montserrat), Montserrat, Arial, sans-serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="-0.03em"
      >
        E
      </text>
      <text
        x="70"
        y="30"
        fill="#1A1A1A"
        fontFamily="var(--font-montserrat), Montserrat, Arial, sans-serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="-0.03em"
      >
        K
      </text>
      <path d="M84.5 9.5 92.5 9.5 92.5 17.5 84.5 11.5 84.5 9.5Z" fill="#EF6C00" />
      <text
        x="46"
        y="45"
        fill="#EF6C00"
        fontFamily="var(--font-montserrat), Montserrat, Arial, sans-serif"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.32em"
      >
        CONSTRUCTIONS
      </text>
    </svg>
  );
}
