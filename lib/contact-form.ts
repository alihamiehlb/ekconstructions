/** Client-side check — mirrors contactSchema minimums before submit. */
export function isContactFormReady(fields: {
  name: string;
  email: string;
  message: string;
}): boolean {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();
  if (name.length < 2) return false;
  if (message.length < 10) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return true;
}

export function readContactFields(form: HTMLFormElement) {
  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
  const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
  const service = (form.elements.namedItem("service") as HTMLSelectElement).value;
  const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
  return { name, email, phone, service, message };
}
