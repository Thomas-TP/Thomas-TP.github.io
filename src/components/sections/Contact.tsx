'use client';

import { m } from 'framer-motion';
import { Mail, Linkedin, Github, Send, CheckCircle, AlertCircle, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/ui/theme-provider';
import { useState, useRef, useCallback, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

// ← Replace with your Worker URL after deploying (wrangler deploy)
const WORKER_URL = 'https://portfolio-contact.thomastp.workers.dev';

// Google reCAPTCHA v2 site key
const RECAPTCHA_SITE_KEY = '6LcK2YYsAAAAAPrOEWr5VVTLzsdsLV73pIQO0YkP';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
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

        if (!recaptchaToken) {
            setStatus('error');
            return;
        }

        try {
            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    lang: i18n.language?.startsWith('fr') ? 'fr' : 'en',
                    theme: resolvedTheme(),
                    recaptchaToken,
                }),
            });

            if (!res.ok) throw new Error('Failed');
            setStatus('success');
            setName(''); setEmail(''); setMessage('');
            setRecaptchaToken(null);
            recaptchaRef.current?.reset();
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
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        }
    };

    const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors";

    return (
        <section id="contact" className="py-32 container mx-auto px-4 cv-auto">
            <div className="max-w-4xl mx-auto">
                <m.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-border to-transparent p-px rounded-3xl"
                >
                    <div className="bg-card/80 rounded-[calc(1.5rem-1px)] p-8 md:p-12 border border-border">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tighter">{t('contact.title')}</h2>
                            <p className="text-base text-muted-foreground max-w-xl mx-auto">{t('contact.desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">

                            {/* Left — form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                                {/* reCAPTCHA v2 Checkbox */}
                                <div className="overflow-hidden rounded-xl">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        onChange={(token) => setRecaptchaToken(token)}
                                        onExpired={() => setRecaptchaToken(null)}
                                        onErrored={() => setRecaptchaToken(null)}
                                        theme={resolvedTheme() === 'dark' ? 'dark' : 'light'}
                                    />
                                </div>

                                <m.button
                                    type="submit"
                                    disabled={status === 'sending' || status === 'success' || !recaptchaToken}
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
                                            <Linkedin size={18} />
                                        </div>
                                        <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">LinkedIn</span>
                                    </a>
                                    <a href="https://github.com/Thomas-TP" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                        <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                                            <Github size={18} />
                                        </div>
                                        <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
                                    </a>
                                    <a href="https://wa.me/41763764551" target="_blank" rel="noopener noreferrer"
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
            </div>
        </section>
    );
}
