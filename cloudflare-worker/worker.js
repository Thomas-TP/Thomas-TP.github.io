/**
 * Cloudflare Worker — Contact form endpoint for thomastp.ch
 *
 * Deploy:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler deploy
 *   4. wrangler secret put RESEND_API_KEY
 */

const ALLOWED_ORIGINS = [
  'https://thomastp.ch',
  'https://www.thomastp.ch',
  'https://thomas-tp.github.io',
  'http://localhost:3000',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const date = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich',
    });

    const notificationHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Inter',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#18181b 0%,#27272a 100%);border:1px solid #3f3f46;border-radius:16px 16px 0 0;padding:40px 40px 32px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td><p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;">Portfolio Contact</p>
<h1 style="margin:0;font-size:26px;font-weight:700;color:#fafafa;">New message &#x1F4EC;</h1></td>
<td align="right" style="vertical-align:top;"><div style="background:#27272a;border:1px solid #3f3f46;border-radius:8px;padding:8px 14px;">
<span style="font-size:12px;color:#a1a1aa;">${date}</span></div></td>
</tr></table></td></tr>
<tr><td style="background:#18181b;border-left:1px solid #3f3f46;border-right:1px solid #3f3f46;padding:32px 40px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;border:1px solid #27272a;border-radius:12px;margin-bottom:24px;">
<tr><td style="padding:20px 24px;border-bottom:1px solid #27272a;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">From</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#fafafa;">${escapeHtml(name)}</p>
<a href="mailto:${escapeHtml(email)}" style="font-size:14px;color:#a78bfa;text-decoration:none;">${escapeHtml(email)}</a>
</td></tr>
<tr><td style="padding:20px 24px;">
<p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Message</p>
<p style="margin:0;font-size:15px;color:#d4d4d8;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
</td></tr></table>
<table cellpadding="0" cellspacing="0"><tr><td style="border-radius:50px;background:#a78bfa;">
<a href="mailto:${escapeHtml(email)}?subject=Re:%20Your%20message%20on%20thomastp.ch" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#09090b;text-decoration:none;">Reply to ${escapeHtml(name)} &#x2192;</a>
</td></tr></table></td></tr>
<tr><td style="background:#18181b;border:1px solid #3f3f46;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
<p style="margin:0;font-size:12px;color:#52525b;">Sent from <a href="https://thomastp.ch" style="color:#71717a;text-decoration:none;">thomastp.ch</a></p>
</td></tr></table></td></tr></table></body></html>`;

    const autoReplyHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Inter',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#18181b 0%,#1e1b4b 100%);border:1px solid #3f3f46;border-radius:16px 16px 0 0;padding:48px 40px 40px;text-align:center;">
<div style="width:56px;height:56px;background:linear-gradient(135deg,#a78bfa,#818cf8);border-radius:50%;margin:0 auto 20px;font-size:28px;line-height:56px;text-align:center;">&#x2713;</div>
<h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#fafafa;">Message received!</h1>
<p style="margin:0;font-size:16px;color:#a1a1aa;line-height:1.6;">Hi ${escapeHtml(name)}, thanks for reaching out.<br>I&#39;ll get back to you as soon as possible.</p>
</td></tr>
<tr><td style="background:#18181b;border-left:1px solid #3f3f46;border-right:1px solid #3f3f46;padding:32px 40px;">
<p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Your message</p>
<div style="background:#09090b;border:1px solid #27272a;border-left:3px solid #a78bfa;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:24px;">
<p style="margin:0;font-size:15px;color:#d4d4d8;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
</div>
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="background:#09090b;border:1px solid #27272a;border-radius:12px;padding:20px 24px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Typical response time</p>
<p style="margin:0;font-size:15px;color:#fafafa;font-weight:500;">Within 24&#x2013;48 hours &#x26A1;</p>
</td></tr></table></td></tr>
<tr><td style="background:#18181b;border-left:1px solid #3f3f46;border-right:1px solid #3f3f46;padding:0 40px 32px;text-align:center;">
<p style="margin:0 0 16px;font-size:13px;color:#71717a;">In the meantime, feel free to connect</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
<td style="padding:0 6px;"><a href="https://www.linkedin.com/in/thomas-tp" style="display:inline-block;background:#27272a;border:1px solid #3f3f46;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;color:#d4d4d8;text-decoration:none;">LinkedIn</a></td>
<td style="padding:0 6px;"><a href="https://github.com/Thomas-TP" style="display:inline-block;background:#27272a;border:1px solid #3f3f46;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;color:#d4d4d8;text-decoration:none;">GitHub</a></td>
<td style="padding:0 6px;"><a href="https://thomastp.ch" style="display:inline-block;background:#27272a;border:1px solid #3f3f46;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;color:#d4d4d8;text-decoration:none;">Portfolio</a></td>
</tr></table></td></tr>
<tr><td style="background:#18181b;border:1px solid #3f3f46;border-top:1px solid #27272a;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
<p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#fafafa;">Thomas Prudhomme</p>
<p style="margin:0;font-size:12px;color:#52525b;">Computer Science Student &middot; <a href="https://thomastp.ch" style="color:#71717a;text-decoration:none;">thomastp.ch</a></p>
</td></tr></table></td></tr></table></body></html>`;

    const resendHeaders = {
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
          html: notificationHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: resendHeaders,
        body: JSON.stringify({
          from: 'Thomas Prudhomme <contact@thomastp.ch>',
          to: [email],
          subject: `Message received — thomastp.ch`,
          html: autoReplyHtml,
        }),
      }),
    ]);

    if (!notifRes.ok) {
      const err = await notifRes.text();
      console.error('Resend notification error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    if (!replyRes.ok) {
      const err = await replyRes.text();
      console.warn('Auto-reply error (non-fatal):', err);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
