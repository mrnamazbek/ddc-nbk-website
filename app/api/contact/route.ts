import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().optional(),
});

type ContactSubmission = z.infer<typeof contactSchema>;

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
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
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "website_contact",
      submittedAt: new Date().toISOString(),
      ...submission,
    }),
    cache: "no-store",
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
  });

  return response.ok;
}

export async function POST(request: Request) {
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
  } catch (error) {
    console.error("Contact delivery failed", error);
    return noStoreJson({ ok: false, error: "delivery_failed" }, 502);
  }

  // The production domain remains usable before mail delivery credentials are
  // configured: the client opens an editable mail draft instead of pretending
  // that a message was submitted.
  return noStoreJson({ ok: false, fallback: true, error: "delivery_unavailable" }, 503);
}
