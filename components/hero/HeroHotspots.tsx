"use client";

const hotspots = [
  { label: "Pool glazing", top: "28%", left: "72%" },
  { label: "Glass balustrade", top: "42%", left: "78%" },
  { label: "Aluminium windows", top: "22%", left: "58%" },
  { label: "Outdoor living", top: "55%", left: "68%" },
];

export function HeroHotspots() {
  return (
    <div className="hero-hotspots pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden>
      {hotspots.map((spot) => (
        <div
          key={spot.label}
          className="hero-hotspot hero-hotspot--right"
          style={{ top: spot.top, left: spot.left }}
        >
          <span className="hero-hotspot-label">{spot.label}</span>
          <span className="hero-hotspot-line" />
          <span className="hero-hotspot-dot" />
        </div>
      ))}
    </div>
  );
}
