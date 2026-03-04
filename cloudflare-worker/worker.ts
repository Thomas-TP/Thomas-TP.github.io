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

// ── SVG assets ───────────────────────────────────────────────────────────────

function svgColors(theme: Theme) {
  return theme === 'dark'
    ? { stroke: '#ffffff', fill: '#ffffff', arrowStroke: '#000000' }
    : { stroke: '#000000', fill: '#000000', arrowStroke: '#ffffff' };
}

function svgEnvelope(theme: Theme): string {
  const c = svgColors(theme);
  return `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="12" width="44" height="30" rx="3" stroke="${c.stroke}" stroke-width="2"/><path d="M4 17L26 31L48 17" stroke="${c.stroke}" stroke-width="2" stroke-linejoin="round"/><path d="M4 42L18 28" stroke="${c.stroke}" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/><path d="M48 42L34 28" stroke="${c.stroke}" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/></svg>`;
}

function svgCheck(theme: Theme): string {
  const c = svgColors(theme);
  return `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="26" r="22" stroke="${c.stroke}" stroke-width="2"/><path d="M15 26L22 33L37 18" stroke="${c.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgLinkedin(theme: Theme) {
  const c = svgColors(theme);
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${c.fill}" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.065 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
}

function svgGithub(theme: Theme) {
  const c = svgColors(theme);
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${c.fill}" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
}

function svgGlobe(theme: Theme) {
  const c = svgColors(theme);
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
}

function svgMail(theme: Theme) {
  const c = svgColors(theme);
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
}

const SVG_ARROW_DARK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const SVG_ARROW_LIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

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
  const arrow = SVG_ARROW_DARK;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${p.bg};font-family:'Inter',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.bg};padding:48px 20px;">
<tr><td align="center"><table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">
<tr><td style="background:${p.card};border:1px solid ${p.border};border-radius:16px 16px 0 0;padding:40px 44px 36px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="vertical-align:middle;">${svgEnvelope('dark')}</td>
<td style="vertical-align:middle;padding-left:20px;">
<p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:600;">Portfolio · thomastp.ch</p>
<h1 style="margin:0;font-size:24px;font-weight:700;color:${p.text};letter-spacing:-0.3px;line-height:1.2;">New contact message</h1>
</td>
<td align="right" style="vertical-align:top;white-space:nowrap;">
<span style="display:inline-block;background:${p.blockBg};border:1px solid ${p.borderInner};border-radius:6px;padding:6px 12px;font-size:11px;color:${p.subtle};">${escapeHtml(date)}</span>
</td></tr></table></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:0 44px;"><div style="height:1px;background:${p.divider};"></div></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:32px 44px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.blockBg};border:1px solid ${p.blockBorder};border-radius:10px;">
<tr><td style="padding:18px 22px;border-bottom:1px solid ${p.borderInner};">
<p style="margin:0 0 3px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${p.subtle};font-weight:600;">From</p>
<p style="margin:0 0 2px;font-size:16px;font-weight:600;color:${p.text};">${escapeHtml(name)}</p>
<a href="mailto:${escapeHtml(email)}" style="font-size:13px;color:${p.muted};text-decoration:none;">${escapeHtml(email)}</a>
</td></tr>
<tr><td style="padding:18px 22px;">
<p style="margin:0 0 10px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${p.subtle};font-weight:600;">Message</p>
<p style="margin:0;font-size:15px;color:#cccccc;line-height:1.75;white-space:pre-wrap;">${escapeHtml(message)}</p>
</td></tr></table></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:28px 44px 36px;">
<table cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${p.ctaBg};border-radius:50px;">
<a href="mailto:${escapeHtml(email)}?subject=Re:%20Your%20message%20on%20thomastp.ch" style="display:inline-flex;align-items:center;gap:8px;padding:11px 24px;font-size:13px;font-weight:600;color:${p.ctaText};text-decoration:none;">Reply to ${escapeHtml(name)}&nbsp;&nbsp;${arrow}</a>
</td></tr></table></td></tr>
<tr><td style="background:${p.blockBg};border:1px solid ${p.borderInner};border-top:1px solid ${p.divider};border-radius:0 0 16px 16px;padding:18px 44px;text-align:center;">
<p style="margin:0;font-size:11px;color:#333333;">Sent automatically from <a href="https://thomastp.ch" style="color:#555555;text-decoration:none;">thomastp.ch</a></p>
</td></tr></table></td></tr></table></body></html>`;
}

function autoReplyHtml(name: string, message: string, lang: Lang, theme: Theme): string {
  const p = theme === 'dark' ? darkPalette : lightPalette;
  const t = i18n[lang];
  const arrow = theme === 'dark' ? SVG_ARROW_DARK : SVG_ARROW_LIGHT;
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${p.bg};font-family:'Inter',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${p.bg};padding:48px 20px;">
<tr><td align="center"><table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">
<tr><td style="background:${p.header};border:1px solid ${p.border};border-radius:16px 16px 0 0;padding:48px 44px 40px;text-align:center;">
<div style="margin:0 auto 24px;">${svgCheck(theme)}</div>
<h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:${p.text};letter-spacing:-0.4px;">${t.title}</h1>
<p style="margin:0;font-size:15px;color:${p.muted};line-height:1.6;">${t.subtitle(escapeHtml(name))}</p>
</td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:0 44px;"><div style="height:1px;background:${p.divider};"></div></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:32px 44px 0;">
<p style="margin:0 0 14px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${p.subtle};font-weight:600;">${t.yourMessage}</p>
<div style="border-left:2px solid ${p.accentBorder};padding-left:18px;margin-bottom:28px;">
<p style="margin:0;font-size:15px;color:${p.muted};line-height:1.75;white-space:pre-wrap;">${escapeHtml(message)}</p>
</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="background:${p.blockBg};border:1px solid ${p.blockBorder};border-radius:10px;padding:18px 22px;">
<p style="margin:0 0 3px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${p.subtle};font-weight:600;">${t.responseTime}</p>
<p style="margin:0;font-size:15px;color:${p.text};font-weight:600;">${t.responseValue}</p>
</td></tr></table></td></tr>
<tr><td style="background:${p.card};border-left:1px solid ${p.border};border-right:1px solid ${p.border};padding:28px 44px 36px;">
<p style="margin:0 0 14px;font-size:11px;color:${p.subtle};text-align:center;">${t.connect}</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
<td style="padding:0 4px;"><a href="https://www.linkedin.com/in/thomas-tp" style="display:inline-flex;align-items:center;gap:6px;background:${p.btnBg};border:1px solid ${p.btnBorder};border-radius:8px;padding:9px 14px;font-size:12px;font-weight:500;color:${p.btnText};text-decoration:none;">${svgLinkedin(theme)}&nbsp;LinkedIn</a></td>
<td style="padding:0 4px;"><a href="https://github.com/Thomas-TP" style="display:inline-flex;align-items:center;gap:6px;background:${p.btnBg};border:1px solid ${p.btnBorder};border-radius:8px;padding:9px 14px;font-size:12px;font-weight:500;color:${p.btnText};text-decoration:none;">${svgGithub(theme)}&nbsp;GitHub</a></td>
<td style="padding:0 4px;"><a href="https://thomastp.ch" style="display:inline-flex;align-items:center;gap:6px;background:${p.btnBg};border:1px solid ${p.btnBorder};border-radius:8px;padding:9px 14px;font-size:12px;font-weight:500;color:${p.btnText};text-decoration:none;">${svgGlobe(theme)}&nbsp;Portfolio</a></td>
<td style="padding:0 4px;"><a href="mailto:thomas@prudhomme.ch" style="display:inline-flex;align-items:center;gap:6px;background:${p.btnBg};border:1px solid ${p.btnBorder};border-radius:8px;padding:9px 14px;font-size:12px;font-weight:500;color:${p.btnText};text-decoration:none;">${svgMail(theme)}&nbsp;Email</a></td>
</tr></table></td></tr>
<tr><td style="background:${p.blockBg};border:1px solid ${p.borderInner};border-top:1px solid ${p.divider};border-radius:0 0 16px 16px;padding:18px 44px;text-align:center;">
<p style="margin:0 0 3px;font-size:13px;font-weight:600;color:${p.text};">Thomas Prudhomme</p>
<p style="margin:0;font-size:11px;color:${p.subtle};">${t.footer} &nbsp;&middot;&nbsp; <a href="https://thomastp.ch" style="color:${p.muted};text-decoration:none;">thomastp.ch</a></p>
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

    const name         = body.name?.trim()           ?? '';
    const email        = body.email?.trim()          ?? '';
    const message      = body.message?.trim()        ?? '';
    const lang: Lang   = body.lang?.startsWith('fr') ? 'fr' : 'en';
    const theme: Theme = body.theme === 'light'      ? 'light' : 'dark';
    const cfToken      = body.turnstileToken?.trim() ?? '';

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
          from: 'Portfolio Contact <noreply@thomastp.ch>',
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
          from: 'Thomas Prudhomme <noreply@thomastp.ch>',
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
