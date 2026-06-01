import Image from "next/image";

const HERO_IMAGE = "/images/hero-home.jpg";

export function HeroVisual() {
  return (
    <div className="hero-unified-bg" aria-hidden>
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={88}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-unified-gradient" />
    </div>
  );
}
