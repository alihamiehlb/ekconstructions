export function buildGmailComposeUrl(opts: {
  to: string;
  subject: string;
  body: string;
}): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: opts.to,
    su: opts.subject,
    body: opts.body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildEnquiryEmailBody(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}): string {
  const lines = [
    "New enquiry from ekconstructions.com.au",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.service ? `Service: ${data.service}` : null,
    "",
    "Message:",
    data.message,
  ].filter(Boolean);
  return lines.join("\n");
}
