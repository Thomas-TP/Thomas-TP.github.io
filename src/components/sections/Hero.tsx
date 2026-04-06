import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { GlitchText } from '@/components/ui/glitch-text';

const CVModal = lazy(() =>
    import('@/components/modals/CVModal').then(m => ({ default: m.CVModal }))
);

const Hero3D = lazy(() =>
    import('@/components/ui/hero-3d').then(m => ({ default: m.Hero3D }))
);

function useTypingAnimation(roles: string[]) {
    const [text, setText] = useState('');
    const stateRef = useRef({ roleIndex: 0, charIndex: 0, deleting: false });

    useEffect(() => {
        if (!roles.length) return;

        let timeout: ReturnType<typeof setTimeout>;

        const tick = () => {
            const s = stateRef.current;
            const current = roles[s.roleIndex];

            if (!s.deleting) {
                if (s.charIndex < current.length) {
                    s.charIndex++;
                    setText(current.slice(0, s.charIndex));
                    timeout = setTimeout(tick, 65);
                } else {
                    // full word shown — pause then erase
                    timeout = setTimeout(() => {
                        s.deleting = true;
                        tick();
                    }, 1800);
                }
            } else {
                if (s.charIndex > 0) {
                    s.charIndex--;
                    setText(current.slice(0, s.charIndex));
                    timeout = setTimeout(tick, 35);
                } else {
                    // erased — next role
                    s.deleting = false;
                    s.roleIndex = (s.roleIndex + 1) % roles.length;
                    timeout = setTimeout(tick, 300);
                }
            }
        };

        stateRef.current = { roleIndex: 0, charIndex: 0, deleting: false };
        setText('');
        timeout = setTimeout(tick, 500);

        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roles[0]]); // re-run only on language change

    return text;
}

function useMagneticHover(strength = 0.3) {
    const ref = useRef<HTMLElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setOffset({
            x: (e.clientX - cx) * strength,
            y: (e.clientY - cy) * strength,
        });
    }, [strength]);

    const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

    return { ref, offset, onMouseMove: handleMouseMove, onMouseLeave: reset };
}

export function Hero() {
    const { t } = useTranslation();
    const [cvOpen, setCvOpen] = useState(false);
    // Defer Three.js background until browser is idle — keeps it out of the TBT window
    const [mountBg, setMountBg] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if ('requestIdleCallback' in window) {
            const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number })
                .requestIdleCallback(() => setMountBg(true), { timeout: 3000 });
            return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
        const id = setTimeout(() => setMountBg(true), 800);
        return () => clearTimeout(id);
    }, []);

    const roles = t('hero.roles', { returnObjects: true }) as string[];
    const typedRole = useTypingAnimation(Array.isArray(roles) ? roles : []);

    const cvBtn = useMagneticHover(0.3);
    const contactBtn = useMagneticHover(0.3);

    return (
        <>
        {cvOpen && <Suspense><CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} /></Suspense>}
        <section id="home" className="min-h-screen flex flex-col justify-center items-center relative pt-20">
            {/* Background 3D & Effects — deferred to idle to avoid blocking TBT */}
            {mountBg && <Suspense><Hero3D /></Suspense>}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto z-10 flex-1 flex items-center">
                <div
                    className="w-full flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-10 lg:gap-12"
                >

                    {/* Text — left */}
                    <div
                        className="max-w-xl text-center md:text-left hero-fade-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-foreground pb-2">
                            <GlitchText text={t('hero.name')} />
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10 font-light mx-auto md:mx-0">
                            {t('hero.role_prefix')} <span className="text-foreground font-medium">{t('hero.school')}</span>.
                            <br className="hidden md:block" />
                            <span className="text-foreground font-medium">
                                {typedRole}
                                <span className="inline-block w-[2px] h-[1.1em] bg-foreground align-middle ml-0.5 animate-pulse" />
                            </span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                            <button
                                ref={cvBtn.ref as React.Ref<HTMLButtonElement>}
                                onMouseMove={(e) => cvBtn.onMouseMove(e.nativeEvent)}
                                onMouseLeave={cvBtn.onMouseLeave}
                                onClick={() => setCvOpen(true)}
                                style={{ transform: `translate(${cvBtn.offset.x}px,${cvBtn.offset.y}px)` }}
                                className="group bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:opacity-90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                                {t('hero.view_cv', 'Voir le CV')}
                            </button>

                            <a
                                ref={contactBtn.ref as React.Ref<HTMLAnchorElement>}
                                onMouseMove={(e) => contactBtn.onMouseMove(e.nativeEvent)}
                                onMouseLeave={contactBtn.onMouseLeave}
                                href="#contact"
                                style={{ transform: `translate(${contactBtn.offset.x}px,${contactBtn.offset.y}px)` }}
                                className="px-8 py-4 rounded-full border border-border hover:bg-muted/50 hover:scale-105 active:scale-95 transition-all text-foreground"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.scrollTo({
                                        top: document.body.scrollHeight,
                                        behavior: 'smooth'
                                    });
                                    setTimeout(() => window.history.pushState(null, '', '#contact'), 10);
                                }}
                            >
                                {t('hero.contact_me')}
                            </a>
                        </div>
                    </div>

                    {/* Photo — right */}
                    <div
                        className="shrink-0 hero-fade-in"
                        style={{ animationDelay: '0.22s' }}
                    >
                        <div className="relative w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64">
                            {/* Glow */}
                            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-110" />
                            {/* Rotating dashed ring */}
                            <div className="absolute inset-[-6px] rounded-full border border-dashed border-border/40 animate-spin-slow" />
                            {/* Photo */}
                            <div className="relative w-full h-full rounded-full ring-1 ring-border overflow-hidden bg-secondary/30">
                                <img
                                    src="/images/memoji-nobg.webp"
                                    alt="Thomas P."
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover object-center scale-110"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator — CSS only, no framer-motion */}
            <div
                className="pb-12 flex flex-col items-center gap-2 text-muted-foreground z-20 hero-fade-up"
                style={{ animationDelay: '0.8s' }}
            >
                <span className="text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
                <div className="w-px h-12 bg-gradient-to-b from-border to-transparent" />
            </div>
        </section>
        </>
    );
}
