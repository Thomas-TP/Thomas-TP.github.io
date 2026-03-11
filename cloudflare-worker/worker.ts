/**
 * Cloudflare Worker — Contact form endpoint for thomastp.ch
 * TypeScript · B&W styled emails · auto-reply · i18n + theme-aware
 *
 * Deploy:
 *   wrangler deploy
 *   wrangler secret put RESEND_API_KEY
 *   wrangler secret put TURNSTILE_SECRET_KEY
 */

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  RATE_LIMIT: KVNamespace;
}

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  lang?: string;
  theme?: string;
  turnstileToken?: string;
}

type Lang = 'en' | 'fr';
type Theme = 'dark' | 'light';

// ── i18n ─────────────────────────────────────────────────────────────────────

const i18n: Record<Lang, {
  subject: string;
  title: string;
  subtitle: (name: string) => string;
  yourMessage: string;
  responseTime: string;
  responseValue: string;
  connect: string;
  footer: string;
}> = {
  en: {
    subject: 'Message received — thomastp.ch',
    title: 'Message received',
    subtitle: (name) => `Hi ${name}, thanks for getting in touch. I'll reply as soon as possible.`,
    yourMessage: 'Your message',
    responseTime: 'Typical response time',
    responseValue: 'Within 24 – 48 hours',
    connect: 'Connect with me',
    footer: 'Computer Science Student',
  },
  fr: {
    subject: 'Message reçu — thomastp.ch',
    title: 'Message reçu',
    subtitle: (name) => `Bonjour ${name}, merci de m'avoir contacté. Je vous répondrai dans les plus brefs délais.`,
    yourMessage: 'Votre message',
    responseTime: 'Délai de réponse habituel',
    responseValue: '24 à 48 heures',
    connect: 'Me retrouver sur',
    footer: 'Étudiant en informatique',
  },
};

// ── PNG assets (no SVGs for better email support) ─────────────────────────────

function getIconImg(icon: string, theme: Theme, size = 20): string {
  // Use a neutral color (a1a1aa - Zinc 400) that has good contrast on both light and dark backgrounds
  const color = 'a1a1aa';
  const src = `https://img.icons8.com/ios-filled/100/${color}/${icon}.png`;
  return `<img src="${src}" width="${size}" height="${size}" alt="${icon}" style="display:block;border:0;outline:none;text-decoration:none;" />`;
}

function getReversedIconImg(icon: string, theme: Theme, size = 20): string {
  // The CTA button is always white in Dark mode and Black in Light mode
  const color = theme === 'dark' ? '000000' : 'ffffff';
  const src = `https://img.icons8.com/ios-filled/100/${color}/${icon}.png`;
  return `<img src="${src}" width="${size}" height="${size}" alt="${icon}" style="display:block;border:0;outline:none;text-decoration:none;" />`;
}

// ── Theme palettes ────────────────────────────────────────────────────────────

interface Palette {
  bg: string; card: string; header: string;
  border: string; borderInner: string;
  text: string; muted: string; subtle: string;
  blockBg: string; blockBorder: string;
  btnBg: string; btnText: string; btnBorder: string;
  divider: string; accentBorder: string;
  ctaBg: string; ctaText: string;
}

const darkPalette: Palette = {
  bg: '#000000', card: '#111111', header: '#111111',
  border: '#222222', borderInner: '#1e1e1e',
  text: '#ffffff', muted: '#777777', subtle: '#444444',
  blockBg: '#0a0a0a', blockBorder: '#1e1e1e',
  btnBg: '#1a1a1a', btnText: '#cccccc', btnBorder: '#2a2a2a',
  divider: '#1e1e1e', accentBorder: '#ffffff',
  ctaBg: '#ffffff', ctaText: '#000000',
};

const lightPalette: Palette = {
  bg: '#f5f5f5', card: '#ffffff', header: '#ffffff',
  border: '#e5e5e5', borderInner: '#eeeeee',
  text: '#000000', muted: '#666666', subtle: '#888888',
  blockBg: '#fafafa', blockBorder: '#e5e5e5',
  btnBg: '#f0f0f0', btnText: '#333333', btnBorder: '#dddddd',
  divider: '#eeeeee', accentBorder: '#000000',
  ctaBg: '#000000', ctaText: '#ffffff',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json<{ success: boolean }>();
  return data.success === true;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function corsHeaders(origin: string): Record<string, string> {
  const ALLOWED_ORIGINS = [
    'https://thomastp.ch', 'https://www.thomastp.ch',
    'https://thomas-tp.github.io', 'http://localhost:3000',
  ];
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResp(data: unknown, status = 200, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

// ── Email templates ───────────────────────────────────────────────────────────

function notificationHtml(name: string, email: string, message: string, date: string): string {
  const p = darkPalette;
  const arrow = getReversedIconImg('forward', 'dark', 14);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${p.bg};font-family:'Inter',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.bg};padding:48px 20px;">
<tr><td align="center"><table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">
<tr><td style="background:${p.card};border:1px solid ${p.border};border-radius:24px 24px 0 0;padding:40px 44px 36px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="vertical-align:middle;width:48px;">
<div style="width:36px;height:36px;background:linear-gradient(135deg,#a78bfa,#818cf8);border-radius:12px;margin:0;font-size:18px;line-height:36px;text-align:center;color:#ffffff;">&#x1F4EC;</div>
</td>
<td style="vertical-align:middle;padding-left:16px;">
<p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:700;">Portfolio · thomastp.ch</p>
<h1 style="margin:0;font-size:24px;font-weight:800;color:${p.text};letter-spacing:-0.4px;line-height:1.2;">New contact message</h1>
</td>
<td align="right" style="vertical-align:top;white-space:nowrap;">
<span style="display:inline-block;background:${p.blockBg};border:1px solid ${p.borderInner};border-radius:6px;padding:6px 12px;font-size:11px;color:${p.subtle};font-weight:600;">${escapeHtml(date)}</span>
</td></tr></table></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:0 44px;"><div style="height:1px;background:${p.divider};"></div></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:32px 44px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.blockBg};border:1px solid ${p.blockBorder};border-radius:16px;">
<tr><td style="padding:24px;border-bottom:1px solid ${p.borderInner};">
<p style="margin:0 0 6px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:700;">From</p>
<p style="margin:0 0 2px;font-size:16px;font-weight:700;color:${p.text};">${escapeHtml(name)}</p>
<a href="mailto:${escapeHtml(email)}" style="font-size:14px;color:${p.muted};text-decoration:none;font-weight:500;">${escapeHtml(email)}</a>
</td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:700;">Message</p>
<p style="margin:0;font-size:15px;color:#dddddd;line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</p>
</td></tr></table></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:32px 44px 40px;">
<table cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${p.ctaBg};border-radius:12px;">
<a href="mailto:${escapeHtml(email)}?subject=Re:%20Your%20message%20on%20thomastp.ch" style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;font-size:14px;font-weight:700;color:${p.ctaText};text-decoration:none;">Reply to ${escapeHtml(name)}&nbsp;&nbsp;${arrow}</a>
</td></tr></table></td></tr>
<tr><td style="background:${p.blockBg};border:1px solid ${p.borderInner};border-top:1px solid ${p.divider};border-radius:0 0 24px 24px;padding:24px 44px;text-align:center;">
<p style="margin:0;font-size:12px;color:#555555;font-weight:500;">Sent automatically from <a href="https://thomastp.ch" style="color:#777777;text-decoration:none;">thomastp.ch</a></p>
</td></tr></table></td></tr></table></body></html>`;
}

function autoReplyHtml(name: string, message: string, lang: Lang, theme: Theme): string {
  const p = theme === 'dark' ? darkPalette : lightPalette;
  const t = i18n[lang];
  // GitHub Readme Stats outputs SVG which is blocked by Gmail/Outlook.
  // Using GitHub's native OpenGraph PNG which works flawlessly in emails.
  const githubStatsUrl = `https://opengraph.githubassets.com/1/Thomas-TP/Thomas-TP.github.io`;

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${p.bg};font-family:'Inter',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.bg};padding:60px 20px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
<tr><td style="background:${p.card};border:1px solid ${p.border};border-radius:24px 24px 0 0;padding:60px 48px 40px;text-align:center;">
<div style="width:56px;height:56px;background:linear-gradient(135deg,#a78bfa,#818cf8);border-radius:50%;margin:0 auto 28px;font-size:28px;line-height:56px;text-align:center;color:#ffffff;">&#x2713;</div>
<h1 style="margin:0 0 12px;font-size:32px;font-weight:800;color:${p.text};letter-spacing:-0.03em;">${t.title}</h1>
<p style="margin:0;font-size:18px;color:${p.muted};line-height:1.6;font-weight:500;">${t.subtitle(escapeHtml(name))}</p>
</td></tr>

<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:0 48px 32px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.blockBg};border:1px solid ${p.blockBorder};border-radius:16px;">
<tr><td style="padding:28px;">
<p style="margin:0 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:700;">${t.yourMessage}</p>
<p style="margin:0;font-size:16px;color:${p.text};line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid ${p.borderInner};background:${p.bg};border-radius:0 0 16px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${p.subtle};font-weight:700;">${t.responseTime}</p></td>
<td align="right"><p style="margin:0;font-size:14px;color:${p.text};font-weight:600;">${t.responseValue}</p></td>
</tr></table>
</td></tr></table></td></tr>

<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:0 48px 40px;text-align:center;">
<p style="margin:0 0 16px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:700;">GitHub Activity</p>
<a href="https://github.com/Thomas-TP" style="display:inline-block;border-radius:16px;overflow:hidden;border:1px solid ${p.blockBorder};width:100%;">
  <img src="${githubStatsUrl}" width="100%" style="display:block;max-width:100%;object-fit:cover;" alt="Thomas-TP GitHub Stats" />
</a>
</td></tr>

<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:0 48px 60px;text-align:center;">
<p style="margin:0 0 24px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:700;">${t.connect}</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px;"><tr>
<td style="padding:0 8px;"><a href="https://thomastp.ch" style="display:inline-block;background:${p.ctaBg};color:${p.ctaText};padding:14px 32px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.02em;">Visit thomastp.ch</a></td>
</tr></table>
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
<td style="padding:0 12px;"><a href="https://www.linkedin.com/in/thomas-tp" style="display:inline-block;">${getIconImg('linkedin', theme, 24)}</a></td>
<td style="padding:0 12px;"><a href="https://github.com/Thomas-TP" style="display:inline-block;">${getIconImg('github', theme, 24)}</a></td>
<td style="padding:0 12px;"><a href="mailto:thomas@prudhomme.ch" style="display:inline-block;">${getIconImg('new-post', theme, 24)}</a></td>
</tr></table>
</td></tr>

<tr><td style="background:${p.blockBg};border:1px solid ${p.borderInner};border-top:1px solid ${p.divider};border-radius:0 0 24px 24px;padding:32px 48px;text-align:center;">
<p style="margin:0 0 6px;font-size:15px;font-weight:700;color:${p.text};letter-spacing:-0.01em;">Thomas Prudhomme</p>
<p style="margin:0;font-size:13px;color:${p.subtle};font-weight:500;">${t.footer} &nbsp;&middot;&nbsp; <a href="https://thomastp.ch" style="color:${p.muted};text-decoration:none;">thomastp.ch</a></p>
</td></tr></table></td></tr></table></body></html>`;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResp({ error: 'Method not allowed' }, 405, origin);
    }

    let body: ContactBody;
    try {
      body = await request.json<ContactBody>();
    } catch {
      return jsonResp({ error: 'Invalid JSON' }, 400, origin);
    }

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const message = body.message?.trim() ?? '';
    const lang: Lang = body.lang?.startsWith('fr') ? 'fr' : 'en';
    const theme: Theme = body.theme === 'light' ? 'light' : 'dark';
    const cfToken = body.turnstileToken?.trim() ?? '';

    if (!name || !email || !message) {
      return jsonResp({ error: 'Missing required fields' }, 400, origin);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResp({ error: 'Invalid email address' }, 400, origin);
    }

    // Verify Turnstile CAPTCHA token
    const clientIp = request.headers.get('CF-Connecting-IP') ?? '';
    const turnstileOk = await verifyTurnstile(cfToken, env.TURNSTILE_SECRET_KEY, clientIp);
    if (!turnstileOk) {
      return jsonResp({ error: 'CAPTCHA verification failed' }, 403, origin);
    }

    // Rate limiting — max 3 messages per IP per hour
    const rateLimitKey = `rate:${clientIp}`;
    const currentCount = await env.RATE_LIMIT.get(rateLimitKey);
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    if (count >= 3) {
      return jsonResp({ error: 'Rate limit exceeded. Please try again later.' }, 429, origin);
    }
    await env.RATE_LIMIT.put(rateLimitKey, String(count + 1), { expirationTtl: 3600 });

    const date = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Europe/Zurich',
    });

    const resendHeaders: HeadersInit = {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const [notifRes, replyRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: resendHeaders,
        body: JSON.stringify({
          from: 'Portfolio Contact <contact@thomastp.ch>',
          to: ['thomas@prudhomme.li'],
          reply_to: email,
          subject: `New message from ${name}`,
          html: notificationHtml(name, email, message, date),
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: resendHeaders,
        body: JSON.stringify({
          from: 'Thomas Prudhomme <contact@thomastp.ch>',
          to: [email],
          subject: i18n[lang].subject,
          html: autoReplyHtml(name, message, lang, theme),
        }),
      }),
    ]);

    if (!notifRes.ok) {
      const err = await notifRes.text();
      console.error('Resend notification error:', err);
      return jsonResp({ error: 'Failed to send email' }, 500, origin);
    }

    if (!replyRes.ok) {
      const err = await replyRes.text();
      console.warn('Auto-reply error (non-fatal):', err);
    }

    return jsonResp({ success: true }, 200, origin);
  },
} satisfies ExportedHandler<Env>;
