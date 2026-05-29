type LogoMarkProps = {
  className?: string;
  animate?: boolean;
};

export function LogoMark({ className = "h-[38px] w-auto", animate = false }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 220 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="EK Constructions"
    >
      <rect
        width="36"
        height="36"
        fill="#3BB2B8"
        className={animate ? "origin-center animate-[logoBadge_1.2s_ease-out_forwards]" : undefined}
      />
      <text
        x="18"
        y="24"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        className={animate ? "opacity-0 animate-[logoText_0.6s_ease-out_0.35s_forwards]" : undefined}
      >
        04
      </text>
      <text
        x="46"
        y="22"
        fill="#0B1D26"
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="28"
        fontWeight="900"
        letterSpacing="-0.02em"
        className={animate ? "opacity-0 animate-[logoText_0.6s_ease-out_0.5s_forwards]" : undefined}
      >
        EK
      </text>
      <text
        x="46"
        y="40"
        fill="#3BB2B8"
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="0.34em"
        className={animate ? "opacity-0 animate-[logoText_0.6s_ease-out_0.65s_forwards]" : undefined}
      >
        CONSTRUCTIONS
      </text>
    </svg>
  );
}
