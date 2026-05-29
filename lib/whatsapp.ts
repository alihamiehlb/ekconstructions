/** Strip to digits for wa.me links (handles AU numbers like 04xx → 614xx). */
export function toWhatsAppNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return `61${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppChatUrl(
  phone: string,
  message = "Hi EK Constructions, I'd like to get a quote.",
): string | null {
  const num = toWhatsAppNumber(phone);
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function displayPhone(phone: string): string {
  return phone.trim();
}
