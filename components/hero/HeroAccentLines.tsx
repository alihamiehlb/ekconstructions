export function HeroAccentLines() {
  return (
    <div
      className="hero-accent-lines pointer-events-none absolute inset-0 hidden overflow-hidden opacity-40 lg:block"
      aria-hidden
    >
      <span className="hero-accent-ring" />
      <span className="hero-accent-ring hero-accent-ring--delay" />
      <svg
        className="hero-accent-svg absolute inset-0 h-full w-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          className="hero-accent-line hero-accent-line--slow"
          d="M20 240 C120 180, 220 260, 380 200"
          fill="none"
          stroke="rgba(219,32,34,0.35)"
          strokeWidth="1.5"
        />
        <path
          className="hero-accent-line hero-accent-line--delay hero-accent-line--pulse"
          d="M40 80 C160 120, 280 40, 360 100"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
