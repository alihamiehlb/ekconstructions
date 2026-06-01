import { Hero3DCanvas } from "@/components/three/Hero3DCanvas";
import Image from "next/image";

const HERO_IMAGE = "/images/hero-home.jpg";

export function HeroVisual() {
  return (
    <div className="hero-media" aria-hidden>
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={88}
        sizes="(max-width: 1023px) 100vw, 58vw"
        className="hero-media-img object-cover"
      />
      <Hero3DCanvas />
      <div className="hero-media-shade" aria-hidden />
      <div className="hero-glass-frame" aria-hidden />
    </div>
  );
}
