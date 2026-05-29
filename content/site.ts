export const siteConfig = {
  name: "EK Constructions",
  tagline: "Innovative construction solutions tailored to your vision.",
  headline: "WE TURN IDEAS INTO",
  headlineAccent: "ICONIC SPACES.",
  url: "https://ekconstructions.com.au",
  locale: "en-AU",
  instagram: {
    handle: "ekconstructions",
    url: "https://www.instagram.com/ekconstructions/",
  },
  location: {
    area: "Sydney & Greater NSW",
    suburb: "North Ryde",
    state: "NSW",
    country: "Australia",
  },
  business: {
    abn: "97 112 073 048",
    memberSince: 2020,
    projectsDelivered: "500+",
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ekconstructions.com.au",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  },
} as const;

export const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#materials", label: "Materials" },
  { href: "/#contact", label: "Contact" },
] as const;

export const services = [
  {
    id: "aluminium",
    title: "Aluminium Windows & Doors",
    description:
      "Supply and installation of aluminium windows, sliding doors, bi-fold, casement, and double-glazed systems.",
    icon: "window",
    iconSrc: "/images/icon-window.png",
  },
  {
    id: "balustrade",
    title: "Glass Balustrade",
    description:
      "Frameless glass balustrades for stairs, balconies, voids, and pool areas — clean lines and compliant fixings.",
    icon: "balustrade",
    iconSrc: "/images/icon-balustrade.png",
  },
  {
    id: "steel",
    title: "Steel Work",
    description:
      "Structural and decorative steel for gates, screens, handrails, and custom architectural features.",
    icon: "steel",
    iconSrc: "/images/icon-steel.png",
  },
  {
    id: "privacy",
    title: "Privacy Screens & Gates",
    description:
      "Aluminium slat screens, automated gates, and secure entries designed for privacy without blocking light.",
    icon: "fence",
    iconSrc: "/images/icon-fence.png",
  },
  {
    id: "carpentry",
    title: "Carpentry",
    description:
      "Custom timber and composite work for interiors, facades, and finishing details on residential builds.",
    icon: "hammer",
    iconSrc: "/images/icon-hammer.png",
  },
] as const;

export const whyChooseUs = [
  {
    title: "Expert Team",
    description: "Skilled installers and glaziers with years of on-site experience across Sydney.",
    icon: "team",
  },
  {
    title: "Premium Materials",
    description: "Compliant glass and aluminium systems selected for durability and finish.",
    icon: "shield",
  },
  {
    title: "Custom Solutions",
    description: "Every project measured and built to your plans — no one-size-fits-all shortcuts.",
    icon: "tools",
  },
  {
    title: "On Time Delivery",
    description: "Clear timelines, responsive communication, and reliable site attendance.",
    icon: "calendar",
  },
  {
    title: "Fully Licensed & Insured",
    description: "Registered business with verified ABN and professional workmanship standards.",
    icon: "badge",
  },
] as const;

export const aboutParagraphs = [
  "EK Constructions is a Sydney-based specialist in aluminium glazing, glass balustrades, steel work, privacy screens, and quality carpentry for residential and light commercial projects.",
  "From frameless stair balustrades to full window replacements, we focus on precision installation, compliant products, and finishes that elevate your space.",
  "Follow our latest work on Instagram — real projects, real craftsmanship, across Greater Sydney.",
] as const;

export const materials = [
  "Tempered & laminated safety glass",
  "Double-glazed aluminium window systems",
  "Powder-coated aluminium (marine-grade options)",
  "Stainless stand-offs & channel systems",
  "Privacy slat & gate hardware",
  "Australian Standards–compliant fixings",
] as const;
