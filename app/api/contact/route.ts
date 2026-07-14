import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_CONTACT_BODY_BYTES = 24 * 1024;
const DELIVERY_TIMEOUT_MS = 8_000;

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().trim().max(200).optional(),
});

type ContactSubmission = z.infer<typeof contactSchema>;

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function acceptsJson(request: Request) {
  return request.headers.get("content-type")?.toLowerCase().startsWith("application/json") ?? false;
}

function isBodyTooLarge(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;

  const length = Number(contentLength);
  return !Number.isSafeInteger(length) || length > MAX_CONTACT_BODY_BYTES;
}

function validWebhookUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function formatEmailText(submission: ContactSubmission) {
  return [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Organization: ${submission.organization}`,
    "",
    submission.message,
  ].join("\n");
}

async function deliverToWebhook(submission: ContactSubmission) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl || !validWebhookUrl(webhookUrl)) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "website_contact",
      submittedAt: new Date().toISOString(),
      ...submission,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });

  return response.ok;
}

async function deliverWithResend(submission: ContactSubmission) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_RECIPIENT_EMAIL;
  if (!apiKey || !from || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: submission.email,
      subject: `DDC website enquiry from ${submission.name}`,
      text: formatEmailText(submission),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });

  return response.ok;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ ok: false, error: "forbidden_origin" }, 403);
  }

  if (!acceptsJson(request)) {
    return noStoreJson({ ok: false, error: "unsupported_media_type" }, 415);
  }

  if (isBodyTooLarge(request)) {
    return noStoreJson({ ok: false, error: "payload_too_large" }, 413);
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return noStoreJson({ ok: false, error: "invalid_request" }, 400);
  }

  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) {
    return noStoreJson({ ok: false, error: "invalid_submission" }, 422);
  }

  // A filled invisible field is a bot signal. Responding successfully avoids
  // giving automated submitters feedback while ensuring no message is sent.
  if (parsed.data.website) {
    return noStoreJson({ ok: true });
  }

  try {
    const delivered = (await deliverToWebhook(parsed.data)) || (await deliverWithResend(parsed.data));
    if (delivered) return noStoreJson({ ok: true });
  } catch {
    // Do not emit provider responses or webhook URLs into server logs.
    console.error("Contact delivery provider failed");
    return noStoreJson({ ok: false, error: "delivery_failed" }, 502);
  }

  // The production domain remains usable before mail delivery credentials are
  // configured: the client opens an editable mail draft instead of pretending
  // that a message was submitted.
  return noStoreJson({ ok: false, fallback: true, error: "delivery_unavailable" }, 503);
}
