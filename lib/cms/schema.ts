import { z } from "zod";

export const beforeAfterItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  location: z.string().max(120),
  beforeSrc: z.string().min(1),
  afterSrc: z.string().min(1),
  beforeAlt: z.string().min(1),
  afterAlt: z.string().min(1),
});

export const beforeAfterSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  src: z.string().min(1),
  images: z.array(z.string().min(1)).optional(),
  alt: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(z.string()).optional(),
  objectPosition: z.string().optional(),
  instagramUrl: z
    .string()
    .max(300)
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
});

export const cmsSchema = z.object({
  site: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    headline: z.string().min(1),
    headlineAccent: z.string().min(1),
    contactEmail: z.string().email(),
    contactPhone: z.string(),
    projectsDelivered: z.string().min(1),
    yearsExperience: z.string().min(1),
    memberSince: z.string().min(1),
    abn: z.string().min(1),
    instagramHandle: z.string().min(1),
    instagramUrl: z.string().url(),
    locationArea: z.string().min(1),
    suburb: z.string().min(1),
    aboutParagraphs: z.array(z.string().min(1)).min(1),
  }),
  services: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
  ),
  whyChooseUs: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
  ),
  materials: z.array(z.string().min(1)),
  projects: z.array(projectSchema),
  beforeAfterSection: beforeAfterSectionSchema.optional(),
  beforeAfterItems: z.array(beforeAfterItemSchema).optional(),
});
