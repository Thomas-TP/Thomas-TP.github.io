import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, X, Send, RotateCcw, Loader2 } from 'lucide-react';

// Decide how a chatbot link should behave when clicked.
//   - Hash-only ("#xxx") or same-site hash ("https://thomastp.ch/#xxx"): SPA smooth scroll
//     to the target section without a full reload (a target="_blank" anchor would otherwise
//     reopen the site and land at the top before the browser resolves the hash).
//   - Same-site full path: open in same tab without closing the chat (e.g. /documents/CV.pdf).
//   - Anything else: open in a new tab.
type LinkKind = 'anchor' | 'same-origin' | 'external';
function classifyLink(href: string): { kind: LinkKind; anchor?: string; resolved: string } {
    if (typeof window === 'undefined') return { kind: 'external', resolved: href };
    if (href.startsWith('#')) return { kind: 'anchor', anchor: href, resolved: href };
    try {
        const url = new URL(href, window.location.href);
        const sameSite = url.hostname === window.location.hostname || url.hostname === 'thomastp.ch' || url.hostname === 'www.thomastp.ch';
        if (sameSite && url.hash) return { kind: 'anchor', anchor: url.hash, resolved: url.hash };
        if (sameSite) return { kind: 'same-origin', resolved: url.pathname + url.search + url.hash };
        return { kind: 'external', resolved: href };
    } catch {
        return { kind: 'external', resolved: href };
    }
}

// Inline markdown renderer — handles the subset the AI produces.
// `onAnchorNavigate` is called when the user clicks a link that should resolve as
// in-app navigation (hash anchor) — the parent uses it to close the chat panel and
// smooth-scroll to the target section.
function renderInline(text: string, onAnchorNavigate?: (anchor: string) => void): ReactNode[] {
    const parts: ReactNode[] = [];
    // Patterns: **bold**, *italic*, `code`, [text](url)
    const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
    let last = 0, key = 0, m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        if (m[2]) parts.push(<strong key={key++} className="font-semibold">{m[2]}</strong>);
        else if (m[3]) parts.push(<em key={key++}>{m[3]}</em>);
        else if (m[4]) parts.push(<code key={key++} className="bg-foreground/10 rounded px-1 py-0.5 font-mono text-xs">{m[4]}</code>);
        else if (m[5]) {
            const linkText = m[5];
            const href = m[6];
            const info = classifyLink(href);
            if (info.kind === 'anchor' && info.anchor) {
                const anchor = info.anchor;
                parts.push(
                    <a
                        key={key++}
                        href={anchor}
                        onClick={(e) => {
                            e.preventDefault();
                            onAnchorNavigate?.(anchor);
                        }}
                        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                        {linkText}
                    </a>
                );
            } else if (info.kind === 'same-origin') {
                // Same-tab navigation for same-site non-hash URLs (CV download, etc.)
                parts.push(
                    <a
                        key={key++}
                        href={info.resolved}
                        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                        {linkText}
                    </a>
                );
            } else {
                parts.push(
                    <a
                        key={key++}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                        {linkText}
                    </a>
                );
            }
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

function MdMessage({ content, onAnchorNavigate }: { content: string; onAnchorNavigate?: (anchor: string) => void }) {
    const nodes: ReactNode[] = [];
    const lines = content.split('\n');
    let i = 0, key = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Fenced code block
        if (line.startsWith('```')) {
            const lang = line.slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
            nodes.push(
                <pre key={key++} className="bg-foreground/10 rounded-md px-3 py-2 font-mono text-xs my-2 overflow-x-auto whitespace-pre">
                    {lang && <span className="text-muted-foreground text-[10px] block mb-1">{lang}</span>}
                    {codeLines.join('\n')}
                </pre>
            );
            i++; continue;
        }

        // Headers
        if (line.startsWith('### ')) { nodes.push(<h3 key={key++} className="font-semibold mt-2 mb-0.5 first:mt-0">{renderInline(line.slice(4), onAnchorNavigate)}</h3>); i++; continue; }
        if (line.startsWith('## ')) { nodes.push(<h2 key={key++} className="font-bold text-base mt-3 mb-1 first:mt-0">{renderInline(line.slice(3), onAnchorNavigate)}</h2>); i++; continue; }
        if (line.startsWith('# ')) { nodes.push(<h2 key={key++} className="font-bold text-base mt-3 mb-1 first:mt-0">{renderInline(line.slice(2), onAnchorNavigate)}</h2>); i++; continue; }

        // Blockquote
        if (line.startsWith('> ')) { nodes.push(<blockquote key={key++} className="border-l-2 border-foreground/20 pl-3 italic text-foreground/70 my-1">{renderInline(line.slice(2), onAnchorNavigate)}</blockquote>); i++; continue; }

        // Bullet list — collect consecutive items
        if (/^[-*] /.test(line)) {
            const items: ReactNode[] = [];
            while (i < lines.length && /^[-*] /.test(lines[i])) {
                items.push(<li key={i} className="leading-relaxed">{renderInline(lines[i].slice(2), onAnchorNavigate)}</li>);
                i++;
            }
            nodes.push(<ul key={key++} className="list-disc pl-4 my-1 space-y-0.5">{items}</ul>);
            continue;
        }

        // Ordered list
        if (/^\d+\. /.test(line)) {
            const items: ReactNode[] = [];
            while (i < lines.length && /^\d+\. /.test(lines[i])) {
                items.push(<li key={i} className="leading-relaxed">{renderInline(lines[i].replace(/^\d+\. /, ''), onAnchorNavigate)}</li>);
                i++;
            }
            nodes.push(<ol key={key++} className="list-decimal pl-4 my-1 space-y-0.5">{items}</ol>);
            continue;
        }

        // Empty line → spacing
        if (line.trim() === '') { nodes.push(<div key={key++} className="h-1" />); i++; continue; }

        // Paragraph
        nodes.push(<p key={key++} className="mb-1 last:mb-0">{renderInline(line, onAnchorNavigate)}</p>);
        i++;
    }

    return <div className="text-sm leading-relaxed">{nodes}</div>;
}

const ASK_URL = 'https://portfolio-contact.thomastp.workers.dev/ask';
const STORAGE_KEY = 'ask-thomas-history-v1';
const MAX_INPUT = 500;

interface Msg {
    role: 'user' | 'assistant';
    content: string;
}

function loadHistory(): Msg[] {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveHistory(msgs: Msg[]) {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-12))); } catch { /* noop */ }
}

export function AskThomas() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Msg[]>(() => loadHistory());
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [footerVisible, setFooterVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [labelWidth, setLabelWidth] = useState(0);

    // Hide the launcher when the footer is in view so it never overlaps it.
    // Independent of navbar — same trigger, separate observer.
    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;
        const obs = new IntersectionObserver(
            ([entry]) => setFooterVisible(entry.isIntersecting),
            { threshold: 0, rootMargin: '40px' },
        );
        obs.observe(footer);
        return () => obs.disconnect();
    }, []);

    // Measure the natural label width once so the expand-on-hover is smooth
    useEffect(() => {
        const el = labelRef.current;
        if (!el) return;
        // Force visible to measure
        const prev = { w: el.style.width, v: el.style.visibility };
        el.style.width = 'auto';
        el.style.visibility = 'hidden';
        const w = el.scrollWidth;
        el.style.width = prev.w;
        el.style.visibility = prev.v;
        setLabelWidth(w);
    }, [i18n.language]);

    // Persist on change
    useEffect(() => { saveHistory(history); }, [history]);

    // Auto-scroll to latest message
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [history, sending]);

    // Focus input when opening
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const send = useCallback(async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;
        if (trimmed.length > MAX_INPUT) {
            setError(`Max ${MAX_INPUT} chars.`);
            return;
        }
        setError(null);
        const newHistory: Msg[] = [...history, { role: 'user', content: trimmed }];
        setHistory(newHistory);
        setInput('');
        setSending(true);

        try {
            const res = await fetch(ASK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    // Send only prior turns (assistant + user) so the model has context
                    history: newHistory.slice(-7, -1),
                }),
            });
            const data = await res.json() as { reply?: string; error?: string };
            if (!res.ok || data.error) {
                throw new Error(data.error ?? `HTTP ${res.status}`);
            }
            setHistory(h => [...h, { role: 'assistant', content: data.reply ?? '' }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setSending(false);
        }
    }, [history, sending]);

    const reset = useCallback(() => {
        setHistory([]);
        setError(null);
        setInput('');
        if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    }, []);

    // SPA-aware navigation when the AI emits a hash anchor like #contact:
    // close the panel, update history.hash so the URL reflects the section,
    // and smooth-scroll to it. Avoids a full page reload that would land at the top.
    const handleAnchorNavigate = useCallback((anchor: string) => {
        setOpen(false);
        const id = anchor.startsWith('#') ? anchor.slice(1) : anchor;
        if (!id) return;
        // Defer scroll until the panel-close transition has started so the layout
        // doesn't shift mid-animation.
        requestAnimationFrame(() => {
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (typeof window !== 'undefined' && window.history?.replaceState) {
                    window.history.replaceState(null, '', `#${id}`);
                }
            }
        });
    }, []);

    const isFr = i18n.language?.startsWith('fr');
    const placeholder = isFr ? 'Posez une question…' : 'Ask anything…';
    const greeting = isFr
        ? 'Salut ! Je suis l\'assistant de Thomas. Demandez-moi tout ce que vous voulez sur sa stack, ses projets ou son parcours.'
        : 'Hi! I\'m Thomas\'s assistant. Ask me anything about his stack, projects, or background.';
    const suggestions = isFr
        ? ['Quelle est sa stack ?', 'Parle-moi de ses projets', 'Est-il dispo pour un stage ?']
        : ['What\'s his tech stack?', 'Tell me about his projects', 'Is he available for an internship?'];

    return (
        <>
            {/* Floating launcher — round icon by default, expands on hover */}
            <button
                onClick={() => { setOpen(o => !o); }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className={`fixed z-[60] bottom-6 right-6 group flex items-center justify-center transition-[transform,opacity] duration-300 ${
                    open || footerVisible
                        ? 'scale-0 opacity-0 pointer-events-none'
                        : 'scale-100 opacity-100'
                }`}
                aria-label={isFr ? 'Demander à Thomas' : 'Ask Thomas'}
                title={isFr ? 'Demander à Thomas' : 'Ask Thomas'}
            >
                {/* Soft glow halo */}
                <span className="absolute inset-0 rounded-full bg-foreground/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Pill — icon anchored left, label slides in on hover */}
                <span
                    className="relative flex items-center bg-foreground text-background rounded-full shadow-lg shadow-black/15 overflow-hidden pl-3"
                    style={{
                        height: '40px',
                        // 12 (pl-3) + 16 (icon) + 12 (pr collapsed) = 40px exactly
                        // expanded: + 8 (gap) + labelWidth + 4 (pr expanded extra) → see below
                        width: hovered ? `${40 + 8 + labelWidth + 4}px` : '40px',
                        transition: 'width 280ms cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    <Sparkles size={16} className="shrink-0" />
                    <span
                        ref={labelRef}
                        className="whitespace-nowrap font-medium text-sm pl-2"
                        style={{
                            opacity: hovered ? 1 : 0,
                            transition: 'opacity 200ms ease',
                            transitionDelay: hovered ? '120ms' : '0ms',
                        }}
                    >
                        {isFr ? 'Demander à Thomas' : 'Ask Thomas'}
                    </span>
                </span>
            </button>

            {/* Chat panel */}
            <div
                className={`fixed z-[60] bottom-6 right-6 w-[calc(100vw-3rem)] max-w-md bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}`}
                style={{ height: 'min(560px, calc(100vh - 3rem))' }}
                role="dialog"
                aria-label="Ask Thomas chat"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full bg-foreground/5 border border-border flex items-center justify-center">
                            <Sparkles size={14} className="text-foreground" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground leading-tight">Ask Thomas</div>
                            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                                {isFr ? 'Propulsé par Llama 3 · Cloudflare AI' : 'Powered by Llama 3 · Cloudflare AI'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {history.length > 0 && (
                            <button
                                onClick={reset}
                                className="p-2 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Reset conversation"
                                title={isFr ? 'Réinitialiser' : 'Reset'}
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                        <button
                            onClick={() => { setOpen(false); }}
                            className="p-2 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Close chat"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 custom-scrollbar" onWheel={e => e.stopPropagation()}>
                    {history.length === 0 ? (
                        <div className="flex flex-col gap-4">
                            <div className="text-sm text-muted-foreground leading-relaxed">{greeting}</div>
                            <div className="flex flex-col gap-2">
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono">
                                    {isFr ? 'Suggestions' : 'Try asking'}
                                </div>
                                {suggestions.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => send(s)}
                                        className="text-left text-sm px-3 py-2 rounded-lg border border-border bg-foreground/[0.02] hover:bg-foreground/[0.06] hover:border-foreground/20 text-foreground transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        history.map((m, i) => (
                            <div
                                key={`${m.role}-${i}`}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                                        m.role === 'user'
                                            ? 'bg-foreground text-background rounded-br-sm whitespace-pre-wrap'
                                            : 'bg-foreground/5 border border-border text-foreground rounded-bl-sm prose-chat'
                                    }`}
                                >
                                    {m.role === 'user' ? m.content : <MdMessage content={m.content} onAnchorNavigate={handleAnchorNavigate} />}
                                </div>
                            </div>
                        ))
                    )}

                    {sending && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-foreground/5 border border-border">
                                <Loader2 size={14} className="animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-mono">
                                    {isFr ? 'réflexion…' : 'thinking…'}
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={(e) => { e.preventDefault(); send(input); }}
                    className="border-t border-border p-3 bg-card"
                >
                    <div className="flex items-end gap-2 bg-foreground/[0.04] border border-border rounded-xl px-3 py-2 focus-within:border-foreground/30 transition-colors">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    send(input);
                                }
                            }}
                            rows={1}
                            maxLength={MAX_INPUT}
                            placeholder={placeholder}
                            disabled={sending}
                            aria-label="Message"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground resize-none max-h-24 leading-relaxed disabled:opacity-50"
                            style={{ scrollbarWidth: 'none' }}
                        />
                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                            className="p-2 rounded-lg bg-foreground text-background disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
                            aria-label="Send message"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-[9px] text-muted-foreground/60 font-mono">
                            {isFr ? 'Réponses générées par IA · peuvent contenir des erreurs' : 'AI-generated · may contain mistakes'}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60 font-mono tabular-nums">
                            {input.length}/{MAX_INPUT}
                        </span>
                    </div>
                </form>
            </div>
        </>
    );
}
