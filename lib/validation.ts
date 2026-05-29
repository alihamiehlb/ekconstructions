import { sanitizeContactInput, sanitizeEmail, sanitizeText } from "@/lib/security/sanitize";
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(100)
    .transform((v) => sanitizeText(v, 100)),
  email: z
    .string()
    .email("Please enter a valid email")
    .max(254)
    .transform((v) => sanitizeEmail(v)),
  phone: z
    .string()
    .max(30)
    .optional()
    .transform((v) => (v ? sanitizeText(v, 30) : undefined)),
  service: z
    .string()
    .max(80)
    .optional()
    .transform((v) => (v ? sanitizeText(v, 80) : undefined)),
  message: z
    .string()
    .min(10, "Please include a few details about your project")
    .max(5000)
    .transform((v) => sanitizeText(v, 5000)),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function sanitizeContactPayload(data: Record<string, unknown>) {
  return sanitizeContactInput(data);
}
