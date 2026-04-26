import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { GlitchText } from '@/components/ui/glitch-text';
import { loadGsap } from '@/lib/gsap-init';
import { useMagnetic } from '@/hooks/useGsap';

/* Inline SVG to avoid pulling lucide-react (59 kB) into the sync bundle */
function FileTextIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
        </svg>
    );
}

const CVModal = lazy(() =>
    import('@/components/modals/CVModal').then(mod => ({ default: mod.CVModal }))
);

const HeroShader = lazy(() =>
    import('@/components/ui/hero-shader').then(mod => ({ default: mod.HeroShader }))
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
    }, [roles[0]]);

    return text;
}

export function Hero() {
    const { t } = useTranslation();
    const [cvOpen, setCvOpen] = useState(false);
    const [mountBg, setMountBg] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    // Magnetic buttons via GSAP quickTo
    const cvBtnRef = useMagnetic(0.3);
    const contactBtnRef = useMagnetic(0.3);

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

    // Parallax: content fades + moves up as user scrolls past hero
    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const indicator = scrollIndicatorRef.current;
        if (!section || !content) return;

        let ctx: { revert: () => void } | undefined;

        loadGsap().then(({ gsap }) => {
            ctx = gsap.context(() => {
                gsap.to(content, {
                    y: -80,
                    opacity: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.5,
                    },
                });
                if (indicator) {
                    gsap.to(indicator, {
                        opacity: 0,
                        y: -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: '20% top',
                            end: '40% top',
                            scrub: true,
                        },
                    });
                }
            }, section);
        });

        return () => ctx?.revert();
    }, []);

    const roles = t('hero.roles', { returnObjects: true }) as string[];
    const typedRole = useTypingAnimation(Array.isArray(roles) ? roles : []);

    return (
        <>
        {cvOpen && <Suspense><CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} /></Suspense>}
        <section ref={sectionRef} id="home" className="min-h-screen flex flex-col justify-center items-center relative pt-20">
            {mountBg && <Suspense><HeroShader /></Suspense>}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div ref={contentRef} className="container px-4 mx-auto z-10 flex-1 flex items-center">
                <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-10 lg:gap-12">

                    <div className="max-w-xl text-center md:text-left">
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
                                ref={cvBtnRef as React.Ref<HTMLButtonElement>}
                                onClick={() => setCvOpen(true)}
                                className="group bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
                            >
                                <FileTextIcon size={18} />
                                {t('hero.view_cv', 'Voir le CV')}
                            </button>

                            <a
                                ref={contactBtnRef as React.Ref<HTMLAnchorElement>}
                                href="#contact"
                                className="px-8 py-4 rounded-full border border-border hover:bg-muted/50 transition-colors text-foreground"
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

                    <div className="shrink-0">
                        <div className="relative w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64">
                            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-110" />
                            <div className="absolute inset-[-6px] rounded-full border border-dashed border-border/40 animate-spin-slow" />
                            <div className="relative w-full h-full rounded-full ring-1 ring-border overflow-hidden bg-secondary/30">
                                <img
                                    src="/images/memoji-nobg.webp"
                                    alt="Thomas P."
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover object-center scale-110"
                                    loading="eager"
                                    decoding="sync"
                                    fetchPriority="high"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div ref={scrollIndicatorRef} className="pb-12 flex flex-col items-center gap-2 text-muted-foreground z-20">
                <span className="text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
                <div className="w-px h-12 bg-gradient-to-b from-border to-transparent" />
            </div>
        </section>
        </>
    );
}
