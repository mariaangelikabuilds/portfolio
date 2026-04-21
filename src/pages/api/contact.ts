import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { contactSchema } from './contact-schema';

export const prerender = false;

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_DESTINATION?: string;
}

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (locals as { runtime?: { env?: Env } }).runtime?.env;
  const TURNSTILE_SECRET = runtimeEnv?.TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET_KEY;
  const RESEND_API_KEY = runtimeEnv?.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const DESTINATION =
    runtimeEnv?.CONTACT_DESTINATION ?? process.env.CONTACT_DESTINATION ?? 'hi@mariaangelika.com';

  if (!TURNSTILE_SECRET || !RESEND_API_KEY) {
    return json({ error: 'Server not configured' }, 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? 'Invalid payload' }, 400);
  }

  const { name, email, message, turnstileToken } = parsed.data;

  const verified = await verifyTurnstile(turnstileToken, TURNSTILE_SECRET);
  if (!verified) {
    return json({ error: 'Verification failed' }, 403);
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Contact Form <noreply@mariaangelika.com>',
    to: DESTINATION,
    replyTo: email,
    subject: `Contact form. ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return json({ error: 'Failed to send' }, 500);
  }

  return json({ ok: true }, 200);
};
