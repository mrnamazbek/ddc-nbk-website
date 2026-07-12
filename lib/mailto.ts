const EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface MailtoDraft {
  to: string;
  subject: string;
  lines: readonly string[];
}

/**
 * Builds a local mail-client handoff without sending or storing visitor data.
 * Dynamic content stays URL-encoded so form fields cannot alter mail headers.
 */
export function createMailtoDraft({ to, subject, lines }: MailtoDraft): string {
  if (!EMAIL_ADDRESS.test(to)) {
    throw new Error("A valid recipient email address is required.");
  }

  const body = lines.filter(Boolean).join("\r\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
