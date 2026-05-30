"use client";

const hotspots = [
  { label: "Aluminium Windows", top: "19%", left: "76%" },
  { label: "Frameless Glass Balustrades", top: "33%", left: "68%" },
  { label: "Steel Fabrication", top: "47%", left: "74%" },
  { label: "Custom Joinery", top: "61%", left: "66%" },
];

export function HeroHotspots() {
  return (
    <div className="hero-hotspots pointer-events-none absolute inset-0 z-[5] lg:hidden" aria-hidden>
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
