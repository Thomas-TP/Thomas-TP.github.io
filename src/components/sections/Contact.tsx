'use client';

import { m, useReducedMotion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/ui/theme-provider';
import { useState, useRef, useCallback, FormEvent, useEffect } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

// ← Replace with your Worker URL after deploying (wrangler deploy)
const WORKER_URL = 'https://portfolio-contact.thomastp.workers.dev';

// Cloudflare Turnstile site key
// Test key (always passes): '1x00000000000000000000AA'
// Real key: create at dash.cloudflare.com → Turnstile → Add site
const TURNSTILE_SITE_KEY = '0x4AAAAAAClx2gXi6bWmEyc7';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [honey, setHoney] = useState(''); // Honeypot state
    const [status, setStatus] = useState<Status>('idle');
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        // Record the time when the form component mounts
        startTimeRef.current = Date.now();
    }, []);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [copied, setCopied] = useState(false);

    const copyEmail = useCallback(() => {
        navigator.clipboard.writeText('thomas@prudhomme.li').then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, []);

    const resolvedTheme = (): 'dark' | 'light' => {
        if (theme === 'system') {
            if (typeof window === 'undefined') return 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme === 'light' ? 'light' : 'dark';
    };

    const validate = (): boolean => {
        const errors: { name?: string; email?: string; message?: string } = {};
        if (!name.trim()) errors.name = t('contact.form.error_required');
        if (!email.trim()) errors.email = t('contact.form.error_required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t('contact.form.error_email');
        if (!message.trim()) errors.message = t('contact.form.error_required');
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus('sending');

        if (!turnstileToken) {
            setStatus('error');
            return;
        }
        const duration = Date.now() - startTimeRef.current;

        try {
            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    companyWebsite: honey, // Send honeypot
                    duration,              // Send time taken
                    lang: i18n.language?.startsWith('fr') ? 'fr' : 'en',
                    theme: resolvedTheme(),
                    turnstileToken,
                }),
            });

            if (!res.ok) throw new Error('Failed');
            setStatus('success');
            setName(''); setEmail(''); setMessage(''); setHoney('');
            setTurnstileToken(null);
            turnstileRef.current?.reset();
            // Success feedback: soft chime + vibration
            try {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.18, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
            } catch { /* AudioContext not available */ }
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([80, 40, 80]);
        } catch {
            setStatus('error');
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        }
    };

    const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors";

    const prefersReduced = useReducedMotion();

    /* ── Lac Léman – real OpenStreetMap geographic outline ── */

    const cities = [
        { name: 'Genève', cx: 2.7, cy: 120, htmlTransform: 'translate(4px, -150%)' },
        { name: 'Nyon', cx: 249, cy: 23, htmlTransform: 'translate(-50%, -150%)' },
        { name: 'Lausanne', cx: 618.7, cy: 0.5, htmlTransform: 'translate(-50%, 50%)' },
    ];

    // Card background fill: y=0 → north shore → y=0
    const cardFill =
        'M 0 0 L 0 120 C 4.6 114.5 8.6 96.8 29 85.7 C 49.4 74.6 106.1 56.4 127.2 50.6 C 148.3 44.8 152.1 51.6 161.1 49.4 C 170.1 47.2 168.5 41 183.2 36.6 C 197.9 32.2 230.2 24.2 252.9 22 C 275.6 19.8 303.8 23.7 324.8 22.9 C 345.8 22.1 362.4 20.7 383.9 17.2 C 405.4 13.7 437.2 3.1 459.2 1 C 481.2 -1.1 504.3 4.4 521.3 4.2 C 538.3 4 540.7 -0.2 565.4 0 C 590.1 0.2 648.7 3.4 675.5 5.4 C 702.3 7.4 712.4 10.5 733.2 12.4 C 754 14.3 782.8 16 805.2 17.1 C 827.6 18.2 856.2 17.7 872.9 19.4 C 889.6 21.1 894.5 25.7 909.5 27.5 C 924.5 29.3 954.1 29.5 966.9 30.8 C 979.7 32.1 984.2 34 989.5 35.7 C 994.8 37.4 998.2 40.7 999.9 41.6 L 1000 0 Z';

    // Northern shore stroke (Swiss side = card bottom border)
    const shoreNorth =
        'M 0 120 C 4.6 114.5 8.6 96.8 29 85.7 C 49.4 74.6 106.1 56.4 127.2 50.6 C 148.3 44.8 152.1 51.6 161.1 49.4 C 170.1 47.2 168.5 41 183.2 36.6 C 197.9 32.2 230.2 24.2 252.9 22 C 275.6 19.8 303.8 23.7 324.8 22.9 C 345.8 22.1 362.4 20.7 383.9 17.2 C 405.4 13.7 437.2 3.1 459.2 1 C 481.2 -1.1 504.3 4.4 521.3 4.2 C 538.3 4 540.7 -0.2 565.4 0 C 590.1 0.2 648.7 3.4 675.5 5.4 C 702.3 7.4 712.4 10.5 733.2 12.4 C 754 14.3 782.8 16 805.2 17.1 C 827.6 18.2 856.2 17.7 872.9 19.4 C 889.6 21.1 894.5 25.7 909.5 27.5 C 924.5 29.3 954.1 29.5 966.9 30.8 C 979.7 32.1 984.2 34 989.5 35.7 C 994.8 37.4 998.2 40.7 999.9 41.6';

    // Southern shore stroke (French side, faint)
    const shoreSouth =
        'M 0 120 C 5.1 119.7 21.7 121.4 32 117.9 C 42.3 114.4 51.5 102.7 64.3 98 C 77.1 93.3 95.8 93.6 111.8 88.3 C 127.8 83 146.5 70 164.5 64.9 C 182.5 59.8 209.2 57.6 224.3 56.5 C 239.4 55.4 251.5 56.8 258.9 58.2 C 266.3 59.6 264 63.4 270.4 65 C 276.8 66.6 292.6 67.9 298.8 68.5 C 305 69.1 302.6 69.8 308.9 68.6 C 315.2 67.4 320.4 63.1 338.3 61 C 356.2 58.9 406.2 57.2 420.7 55.2 C 435.2 53.2 421.6 50.1 429 48.3 C 436.4 46.5 454 43.8 466.7 43.7 C 479.4 43.6 483.3 47.7 508.4 47.6 C 533.5 47.5 599.2 43.9 623.5 43.3 C 647.8 42.7 642.3 43.9 660.3 43.8 C 678.3 43.7 710.2 41.8 735.8 42.5 C 761.4 43.2 793.4 46.9 820.3 48.3 C 847.2 49.7 884.6 51.7 904.2 51.3 C 923.8 50.9 930.3 46.3 943 45.7 C 955.7 45.1 974.4 48.5 983.5 47.8 C 992.6 47.1 997.3 42.6 999.9 41.6';

    // Lake body (closed shape between both shores)
    const lakeBody =
        'M 0 120 C 4.6 114.5 8.6 96.8 29 85.7 C 49.4 74.6 106.1 56.4 127.2 50.6 C 148.3 44.8 152.1 51.6 161.1 49.4 C 170.1 47.2 168.5 41 183.2 36.6 C 197.9 32.2 230.2 24.2 252.9 22 C 275.6 19.8 303.8 23.7 324.8 22.9 C 345.8 22.1 362.4 20.7 383.9 17.2 C 405.4 13.7 437.2 3.1 459.2 1 C 481.2 -1.1 504.3 4.4 521.3 4.2 C 538.3 4 540.7 -0.2 565.4 0 C 590.1 0.2 648.7 3.4 675.5 5.4 C 702.3 7.4 712.4 10.5 733.2 12.4 C 754 14.3 782.8 16 805.2 17.1 C 827.6 18.2 856.2 17.7 872.9 19.4 C 889.6 21.1 894.5 25.7 909.5 27.5 C 924.5 29.3 954.1 29.5 966.9 30.8 C 979.7 32.1 984.2 34 989.5 35.7 C 994.8 37.4 998.2 40.7 999.9 41.6 L 999.9 41.6 C 997.3 42.6 992.6 47.1 983.5 47.8 C 974.4 48.5 955.7 45.1 943 45.7 C 930.3 46.3 923.8 50.9 904.2 51.3 C 884.6 51.7 847.2 49.7 820.3 48.3 C 793.4 46.9 761.4 43.2 735.8 42.5 C 710.2 41.8 678.3 43.7 660.3 43.8 C 642.3 43.9 647.8 42.7 623.5 43.3 C 599.2 43.9 533.5 47.5 508.4 47.6 C 483.3 47.7 479.4 43.6 466.7 43.7 C 454 43.8 436.4 46.5 429 48.3 C 421.6 50.1 435.2 53.2 420.7 55.2 C 406.2 57.2 356.2 58.9 338.3 61 C 320.4 63.1 315.2 67.4 308.9 68.6 C 302.6 69.8 305 69.1 298.8 68.5 C 292.6 67.9 276.8 66.6 270.4 65 C 264 63.4 266.3 59.6 258.9 58.2 C 251.5 56.8 239.4 55.4 224.3 56.5 C 209.2 57.6 182.5 59.8 164.5 64.9 C 146.5 70 127.8 83 111.8 88.3 C 95.8 93.6 77.1 93.3 64.3 98 C 51.5 102.7 42.3 114.4 32 117.9 C 21.7 121.4 5.1 119.7 0 120 Z';

    // Text guide path: north shore shifted up by 18 units for "floating" text
    const shoreNorthTextGuide =
        'M 0 102 C 4.6 96.5 8.6 78.8 29 67.7 C 49.4 56.6 106.1 38.4 127.2 32.6 C 148.3 26.8 152.1 33.6 161.1 31.4 C 170.1 29.2 168.5 23 183.2 18.6 C 197.9 14.2 230.2 6.2 252.9 4 C 275.6 1.8 303.8 5.7 324.8 4.9 C 345.8 4.1 362.4 2.7 383.9 -0.8 C 405.4 -4.3 437.2 -14.9 459.2 -17 C 481.2 -19.1 504.3 -13.6 521.3 -13.8 C 538.3 -14 540.7 -18.2 565.4 -18 C 590.1 -17.8 648.7 -14.6 675.5 -12.6 C 702.3 -10.6 712.4 -7.5 733.2 -5.6 C 754 -3.7 782.8 -2 805.2 -0.9 C 827.6 0.2 856.2 -0.3 872.9 1.4 C 889.6 3.1 894.5 7.7 909.5 9.5 C 924.5 11.3 954.1 11.5 966.9 12.8 C 979.7 14.1 984.2 16 989.5 17.7 C 994.8 19.4 998.2 22.7 999.9 23.6';

    return (
        <section id="contact" className="py-32 container mx-auto px-4 cv-auto">
            <div className="max-w-4xl mx-auto">
                <m.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-border to-transparent pt-px px-px pb-0 rounded-t-3xl"
                >
                    <div className="bg-card/80 rounded-t-[calc(1.5rem-1px)] p-8 md:p-12 border border-border border-b-0">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tighter">{t('contact.title')}</h2>
                            <p className="text-base text-muted-foreground max-w-xl mx-auto">{t('contact.desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">

                            {/* Left — form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                {/* Honeypot field (hidden from real users, attractive to bots) */}
                                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                                    <label htmlFor="companyWebsite">Company Website</label>
                                    <input
                                        type="text"
                                        id="companyWebsite"
                                        name="companyWebsite"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={honey}
                                        onChange={e => setHoney(e.target.value)}
                                        placeholder="Leave this field empty"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                        {t('contact.form.name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                                        placeholder={t('contact.form.name_placeholder')}
                                        className={`${inputClass}${fieldErrors.name ? ' border-destructive focus:ring-destructive/40' : ''}`}
                                        disabled={status === 'sending' || status === 'success'}
                                    />
                                    {fieldErrors.name && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                        {t('contact.form.email')}
                                    </label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                                        placeholder={t('contact.form.email_placeholder')}
                                        className={`${inputClass}${fieldErrors.email ? ' border-destructive focus:ring-destructive/40' : ''}`}
                                        disabled={status === 'sending' || status === 'success'}
                                    />
                                    {fieldErrors.email && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                                        {t('contact.form.message')}
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={message}
                                        onChange={e => { setMessage(e.target.value); setFieldErrors(p => ({ ...p, message: undefined })); }}
                                        placeholder={t('contact.form.message_placeholder')}
                                        className={`${inputClass} resize-none${fieldErrors.message ? ' border-destructive focus:ring-destructive/40' : ''}`}
                                        disabled={status === 'sending' || status === 'success'}
                                    />
                                    {fieldErrors.message && <p className="mt-1.5 text-xs text-destructive">{fieldErrors.message}</p>}
                                </div>

                                {/* Feedback */}
                                {status === 'success' && (
                                    <m.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm text-emerald-500"
                                    >
                                        <CheckCircle size={16} />
                                        {t('contact.form.success')}
                                    </m.div>
                                )}
                                {status === 'error' && (
                                    <m.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm text-destructive"
                                    >
                                        <AlertCircle size={16} />
                                        {t('contact.form.error')}
                                    </m.div>
                                )}

                                {/* Turnstile — seamless, only shows if bot suspected */}
                                <div style={{ filter: 'grayscale(1)' }}>
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={TURNSTILE_SITE_KEY}
                                        onSuccess={setTurnstileToken}
                                        onError={() => setTurnstileToken(null)}
                                        onExpire={() => setTurnstileToken(null)}
                                        options={{ appearance: 'interaction-only', theme: resolvedTheme() }}
                                    />
                                </div>

                                <m.button
                                    type="submit"
                                    disabled={status === 'sending' || status === 'success' || !turnstileToken}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <Send size={16} />
                                    {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
                                </m.button>
                            </form>

                            {/* Right — contact info */}
                            <div className="flex flex-col gap-6">

                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{t('contact.say_hello')}</p>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href="mailto:thomas@prudhomme.li"
                                            className="flex-1 flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">thomas@prudhomme.li</span>
                                        </a>
                                        <button
                                            onClick={copyEmail}
                                            className="p-2.5 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/40 transition-colors cursor-pointer"
                                            aria-label="Copy email"
                                        >
                                            {copied
                                                ? <Check size={16} className="text-green-500" />
                                                : <Copy size={16} className="text-muted-foreground" />
                                            }
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-border" />

                                {/* Socials */}
                                <div className="flex flex-col gap-2">
                                    <a href="https://www.linkedin.com/in/thomas-tp" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                        <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                                            <FaLinkedin size={18} />
                                        </div>
                                        <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">LinkedIn</span>
                                    </a>
                                    <a href="https://github.com/Thomas-TP" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                        <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                                            <FaGithub size={18} />
                                        </div>
                                        <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
                                    </a>
                                    <a href="https://wa-redirect.thomastp.workers.dev" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                        <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </div>
                                        <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">WhatsApp</span>
                                    </a>
                                    <a href="https://links.thomastp.ch" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                        <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                                            <LinkIcon size={18} />
                                        </div>
                                        <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">Links</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </m.div>

                {/* ── Lac Léman bottom edge ── */}
                <div className="px-px relative">
                    <m.svg
                        viewBox="0 0 1000 130"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full block -mt-px"
                        style={{ overflow: 'visible' }}
                        role="img"
                        aria-label={t('service_area.map_alt')}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Card background continuation down to the northern shore */}
                        <path d={cardFill} className="fill-card/80" />

                        {/* Side borders extending from card down to lake extremities */}
                        <line x1={0} y1={0} x2={0} y2={120} className="stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                        <line x1={1000} y1={0} x2={1000} y2={41.6} className="stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke" />

                        {/* Lake body fill — the recognisable crescent between both shores */}
                        <m.path
                            d={lakeBody}
                            className="fill-muted/15 dark:fill-muted/8"
                            initial={prefersReduced ? {} : { opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />

                        {/* Southern shore outline (faint, French side) */}
                        <m.path
                            d={shoreSouth}
                            className="stroke-border/30 dark:stroke-zinc-700/30"
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            fill="none"
                            initial={prefersReduced ? {} : { pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
                        />

                        {/* Northern shore stroke (= card bottom border, Swiss side) */}
                        <m.path
                            d={shoreNorth}
                            className="stroke-border"
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            fill="none"
                            initial={prefersReduced ? {} : { pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.1 }}
                        />

                        {/* "Zone d'activité" text following the north shore curve */}
                        <defs>
                            <path id="shoreTextGuide" d={shoreNorthTextGuide} />
                        </defs>
                        <m.text
                            className="fill-muted-foreground/40 font-bold uppercase"
                            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 28, letterSpacing: '0.2em' }}
                            initial={prefersReduced ? {} : { opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                        >
                            <textPath href="#shoreTextGuide" startOffset="43%" textAnchor="middle">
                                {t('service_area.label')}
                            </textPath>
                        </m.text>

                        {/* City dot markers (SVG only — labels are HTML below) */}
                        {cities.map((city, i) => (
                            <g key={city.name}>
                                {!prefersReduced && (
                                    <m.circle
                                        cx={city.cx} cy={city.cy} r={6}
                                        className="fill-none stroke-foreground/15"
                                        strokeWidth={1}
                                        initial={{ r: 6, opacity: 0 }}
                                        whileInView={{ r: [6, 18, 18], opacity: [0.4, 0.08, 0] }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2.8, delay: 1 + i * 0.3, repeat: Infinity, repeatDelay: 2.2, ease: 'easeOut' }}
                                    />
                                )}
                                <m.circle
                                    cx={city.cx} cy={city.cy} r={6}
                                    className="fill-foreground"
                                    initial={prefersReduced ? {} : { scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 + i * 0.25 }}
                                />
                                <m.circle
                                    cx={city.cx} cy={city.cy} r={2.5}
                                    className="fill-background"
                                    initial={prefersReduced ? {} : { scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.7 + i * 0.25 }}
                                />
                            </g>
                        ))}
                    </m.svg>

                    {/* HTML labels for city names — CSS sizes for mobile readability */}
                    {cities.map((city, i) => (
                        <m.span
                            key={city.name}
                            className="absolute text-xs text-foreground pointer-events-none whitespace-nowrap"
                            style={{
                                left: `${city.cx / 10}%`,
                                top: `${city.cy / 1.3}%`,
                                transform: city.htmlTransform,
                            }}
                            initial={prefersReduced ? {} : { opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.9 + i * 0.25 }}
                        >
                            {city.name}
                        </m.span>
                    ))}
                </div>
            </div>
        </section>
    );
}
