export const siteConfig = {
  name: "EK Constructions",
  tagline: "Premium aluminium, glass, steel and carpentry solutions built with precision and experience.",
  headline: "WE TURN IDEAS INTO",
  headlineAccent: "ICONIC SPACES",
  url: "https://ekconstructions.vercel.app",
  locale: "en-AU",
  instagram: {
    handle: "ekconstructions",
    url: "https://www.instagram.com/ekconstructions/",
  },
  location: {
    area: "Sydney & Greater NSW",
    suburb: "169 Walker Street, Helensburgh",
    state: "NSW",
    country: "Australia",
  },
  business: {
    abn: "97 112 073 048",
    memberSince: 1993,
    yearsExperience: "30+",
    projectsDelivered: "500+",
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ekconstructions.com.au",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  },
} as const;

export const navLinks = [
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
      "Premium, custom-made aluminium windows and doors, precision-built to fit any opening perfectly. Choose energy-efficient double glazing for maximum comfort or sleek single glazing for cost-effective styling — backed by 30 years of family-owned fabrication expertise and flawless finishes for builders and homeowners.",
    icon: "window",
  },
  {
    id: "balustrade",
    title: "Framed & Frameless Glass",
    description:
      "Transform your commercial or residential space with premium framed and frameless glass balustrades or sleek office partitions, custom-fabricated to your exact specifications. Choose frameless options for completely uninterrupted views, or framed designs optimised for maximum structural integrity.",
    icon: "balustrade",
  },
  {
    id: "entry-door",
    title: "Aluminium Front Entry Doors",
    description:
      "Make a powerful first impression with our custom, wood-look aluminium entry doors, engineered to deliver the timeless beauty of natural timber without the risk of rotting, warping, or high maintenance. Built for absolute structural robustness, these weather-resistant doors combine advanced safety and security features with ultimate long-term durability to protect your home beautifully in any environment.",
    icon: "window",
  },
  {
    id: "steel",
    title: "Steel Work",
    description: "Engineered for strength. Built for longevity.",
    icon: "steel",
  },
  {
    id: "privacy",
    title: "Aluminium Privacy Screens & Gates",
    description:
      "Secure and elevate your property with our custom aluminium privacy screens and gates, precision-engineered for maximum structural strength, long-term durability, and zero rust. Available in low-maintenance, weather-resistant finishes — including realistic timber looks — they provide the ultimate blend of premium privacy, advanced security, and modern curb appeal.",
    icon: "fence",
  },
  {
    id: "carpentry",
    title: "Carpentry",
    description: "Custom carpentry with precision and care.",
    icon: "hammer",
  },
] as const;

export const whyChooseUs = [
  {
    title: "Expert Team",
    description:
      "Skilled installers and glaziers with 30+ years of combined on-site experience across Sydney.",
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
  "Twenty Years of Precision. Family-Owned and Operated.",
  "For over two decades, our family-owned business has been the trusted fabrication partner for premium homeowners and elite builders. We specialize in custom-made architectural windows, doors, framed and frameless glass balustrades, office partitions, and bespoke metal privacy screens and gates.",
  "We bridge the gap between design and reality by combining 20+ years of technical expertise with a hand-selected network of premium suppliers. Our business is built on an unwavering commitment to integrity, absolute reliability, and meticulous attention to detail. Whether you are building a luxury dream home or managing a complex commercial project, we deliver the high-end finishes and flawless execution your project demands.",
] as const;

export const materials = [
  "Tempered & laminated safety glass",
  "Double-glazed aluminium window systems",
  "Powder-coated aluminium (marine-grade options)",
  "Stainless stand-offs & channel systems",
  "Privacy slat & gate hardware",
  "Australian Standards–compliant fixings",
] as const;
