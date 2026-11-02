import { defineEventHandler, readBody, getHeader, sendRedirect, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Body required' });
  }

  const { name, company, phone, address, email, comment } = body;
  const turnstileToken = body['cf-turnstile-response'] || body.turnstileToken;

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileToken) {
    try {
      const ip = getHeader(event, 'cf-connecting-ip');
      const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const verifyRes = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip,
        }),
      });
      const outcome = await verifyRes.json() as any;
      if (!outcome.success) {
        console.warn('Turnstile verification failed:', outcome);
      }
    } catch (err) {
      console.error('Error verifying turnstile token:', err);
    }
  }

  // Log inquiry details
  console.log('Received Customer Inquiry:', { name, company, phone, address, email, comment });

  // Optional: If email notification is needed, REST API (Resend/SendGrid/etc.) can be plugged in here
  // Redirect back to home with success status or return JSON
  const acceptHeader = getHeader(event, 'accept') || '';
  if (acceptHeader.includes('application/json')) {
    return { success: true, message: 'Inquiry received successfully' };
  }
  return sendRedirect(event, '/home?inquiry=success');
});
