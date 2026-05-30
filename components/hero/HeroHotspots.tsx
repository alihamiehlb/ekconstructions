"use client";

const hotspots = [
  { label: "Aluminium Windows", top: "22%", left: "62%" },
  { label: "Frameless Glass Balustrades", top: "36%", left: "58%" },
  { label: "Steel Fabrication", top: "50%", left: "64%" },
  { label: "Custom Joinery", top: "64%", left: "56%" },
];

export function HeroHotspots() {
  return (
    <div className="hero-hotspots pointer-events-none absolute inset-0 z-[5] lg:hidden" aria-hidden>
      {hotspots.map((spot) => (
        <div
          key={spot.label}
          className="hero-hotspot"
          style={{ top: spot.top, left: spot.left }}
        >
          <span className="hero-hotspot-dot" />
          <span className="hero-hotspot-line" />
          <span className="hero-hotspot-label">{spot.label}</span>
        </div>
      ))}
    </div>
  );
}
