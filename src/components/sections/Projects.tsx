import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { loadGsap } from '@/lib/gsap-init';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface Project {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    year: string;
}





const EmpireTerminal = () => {
    const [lines, setLines] = useState<Array<{ type: 'input' | 'output', content: React.ReactNode }>>([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Animate new lines as they appear
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        loadGsap().then(({ gsap }) => {
            const items = el.querySelectorAll('.empire-line');
            if (!items.length) return;
            const last = items[items.length - 1];
            gsap.to(last, { opacity: 1, duration: 0.15, ease: 'power2.out' });
        });
    }, [lines]);

    // Cursor blink
    useEffect(() => {
        if (!cursorRef.current) return;
        let tween: { kill: () => void } | undefined;
        loadGsap().then(({ gsap }) => {
            if (!cursorRef.current) return;
            tween = gsap.to(cursorRef.current, { opacity: 0, duration: 0.8, repeat: -1, yoyo: true, ease: 'steps(1)' });
        });
        return () => { tween?.kill(); };
    }, []);

    // Pause animation when terminal is out of viewport — avoids running
    // 60+ setState calls/sec for a component the user can't even see
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return; // Don't animate when off-screen
        let timeout: ReturnType<typeof setTimeout> | undefined;

        const processStep = async () => {
            // Helper to simulate typing
            const typeCommand = async (cmd: string) => {
                for (let i = 0; i <= cmd.length; i++) {
                    setCurrentCommand(cmd.slice(0, i));
                    await new Promise(r => setTimeout(r, 50 + Math.random() * 30)); // Realistic typing speed
                }
                await new Promise(r => setTimeout(r, 300)); // Pause before enter
            };

            const addLine = (type: 'input' | 'output', content: React.ReactNode) => {
                setLines(prev => [...prev, { type, content }]);
            };

            switch (step) {
                case 0: // Initial delay
                    timeout = setTimeout(() => setStep(1), 1000);
                    break;
                case 1: // Type "./empire"
                    await typeCommand('./empire');
                    addLine('input', <span><span className="text-emerald-500">root@kali</span>:<span className="text-blue-500">~</span>$ ./empire</span>);
                    setCurrentCommand('');
                    setStep(2);
                    break;
                case 2: // Empire loading output - Step by step
                    await new Promise(r => setTimeout(r, 400));
                    addLine('output', <div className="text-white/60"><span className="text-blue-400 font-bold">[*]</span> Empire post-exploitation framework</div>);

                    await new Promise(r => setTimeout(r, 300));
                    addLine('output', <div className="text-white/60"><span className="text-emerald-400 font-bold">[+]</span> Agents loaded: 0</div>);

                    await new Promise(r => setTimeout(r, 300));
                    addLine('output', <div className="text-white/60 mb-2"><span className="text-emerald-400 font-bold">[+]</span> Modules loaded: 396</div>);

                    setStep(3);
                    break;
                case 3: // Type "uselistener http"
                    await new Promise(r => setTimeout(r, 1000));
                    await typeCommand('uselistener http');
                    addLine('input', <span><span className="underline decoration-white/30 text-white">(Empire)</span> &gt; uselistener http</span>);
                    setCurrentCommand('');
                    setStep(4);
                    break;
                case 4: // Type "set Port 80"
                    await new Promise(r => setTimeout(r, 500));
                    await typeCommand('set Port 80');
                    addLine('input', <span><span className="underline decoration-white/30 text-white">(Empire: <span className="text-emerald-400">listeners/http</span>)</span> &gt; set Port 80</span>);
                    setCurrentCommand('');
                    setStep(5);
                    break;
                case 5: // Type "execute"
                    await new Promise(r => setTimeout(r, 500));
                    await typeCommand('execute');
                    addLine('input', <span><span className="underline decoration-white/30 text-white">(Empire: <span className="text-emerald-400">listeners/http</span>)</span> &gt; execute</span>);
                    setCurrentCommand('');
                    setStep(6);
                    break;
                case 6: // Execute output - Step by step
                    await new Promise(r => setTimeout(r, 600));
                    addLine('output', <div className="text-white/80"><span className="text-emerald-400 font-bold">[*]</span> Starting listener &apos;http&apos;</div>);

                    await new Promise(r => setTimeout(r, 800));
                    addLine('output', <div className="text-white/80"><span className="text-emerald-400 font-bold">[+]</span> Listener successfully started!</div>);

                    setStep(7);
                    break;
                case 7: // Wait then clear
                    timeout = setTimeout(() => {
                        setLines([]);
                        setStep(0);
                    }, 3000);
                    break;
            }
        };

        processStep();

        return () => clearTimeout(timeout);
    }, [step, isVisible]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black flex flex-col p-4 font-mono text-[10px] sm:text-xs overflow-hidden leading-relaxed text-left">
            {/* Terminal Header */}
            <div className="flex gap-1.5 mb-2 opacity-50 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>

            <div className="flex-1 flex flex-col relative z-10 space-y-1">
                {lines.map((line, i) => (
                    <div key={`line-${i}`} className="empire-line" style={{ opacity: 0 }}>
                        {line.content}
                    </div>
                ))}

                {/* Active Prompt Line */}
                {step < 7 && (
                    <div className="flex items-center gap-1">
                        {step <= 2 ? (
                            <>
                                <span className="text-emerald-500 shrink-0">root@kali</span>
                                <span className="text-white shrink-0">:</span>
                                <span className="text-blue-500 shrink-0">~</span>
                                <span className="text-white shrink-0">$</span>
                            </>
                        ) : step === 3 ? (
                            <>
                                <span className="underline decoration-white/30 text-white shrink-0">(Empire)</span>
                                <span className="text-white shrink-0">&gt;</span>
                            </>
                        ) : (
                            <>
                                <span className="underline decoration-white/30 text-white shrink-0">(Empire: <span className="text-emerald-400">listeners/http</span>)</span>
                                <span className="text-white shrink-0">&gt;</span>
                            </>
                        )}
                        <span className="text-white">{currentCommand}</span>
                        <div
                            ref={cursorRef}
                            className="w-1.5 h-3 bg-white ml-0.5"
                        />
                    </div>
                )}
            </div>
            {/* Matrix/Code Rain Overlay (Subtle) */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
        </div>
    );
};

const mealDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const mealNames = ['Pasta Bolognese', 'Chicken Wrap', 'Rice & Salmon', 'Veggie Bowl', 'Beef Stir-fry'];

const MealsPhoneMockup = () => {
    const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
    const genBtnRef = useRef<HTMLDivElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const mealsRef = useRef<HTMLDivElement>(null);

    const restart = useCallback(() => {
        setPhase('idle');
        const t1 = setTimeout(() => setPhase('loading'), 1500);
        const t2 = setTimeout(() => setPhase('done'), 2800);
        const t3 = setTimeout(() => setPhase('idle'), 8000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    useEffect(() => {
        const cleanup = restart();
        const loop = setInterval(() => restart(), 8000);
        return () => { cleanup(); clearInterval(loop); };
    }, [restart]);

    // Generate button pulse
    useEffect(() => {
        if (phase !== 'idle' || !genBtnRef.current) return;
        let pulse: { kill: () => void } | undefined;
        loadGsap().then(({ gsap }) => {
            if (!genBtnRef.current) return;
            gsap.fromTo(genBtnRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
            pulse = gsap.to(genBtnRef.current, { scale: 1.03, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
        return () => { pulse?.kill(); };
    }, [phase]);

    // Spinner rotate
    useEffect(() => {
        if (phase !== 'loading' || !spinnerRef.current) return;
        let spin: { kill: () => void } | undefined;
        loadGsap().then(({ gsap }) => {
            if (!spinnerRef.current) return;
            spin = gsap.to(spinnerRef.current, { rotation: 360, duration: 0.8, repeat: -1, ease: 'none' });
        });
        return () => { spin?.kill(); };
    }, [phase]);

    // Meal items stagger
    useEffect(() => {
        if (phase !== 'done' || !mealsRef.current) return;
        loadGsap().then(({ gsap }) => {
            if (!mealsRef.current) return;
            const items = mealsRef.current.querySelectorAll('.meal-item');
            gsap.fromTo(items, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.1, ease: 'power2.out' });
        });
    }, [phase]);

    // Ambient glow
    useEffect(() => {
        if (!glowRef.current) return;
        let glow: { kill: () => void } | undefined;
        loadGsap().then(({ gsap }) => {
            if (!glowRef.current) return;
            glow = gsap.to(glowRef.current, { opacity: 0.6, scale: 1.15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
        return () => { glow?.kill(); };
    }, []);

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            {/* Phone frame — fits within the box */}
            <div className="relative w-[130px] h-[250px] sm:w-[150px] sm:h-[290px] rounded-[22px] border-2 border-white/20 bg-neutral-950 overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.06)] z-10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-b-xl z-20" />

                {/* Status bar */}
                <div className="flex items-center justify-between px-3 pt-4 pb-0.5">
                    <span className="text-[6px] text-white/40 font-medium">12:30</span>
                    <div className="w-2.5 h-1.5 border border-white/30 rounded-[2px]"><div className="w-1.5 h-full bg-white/40 rounded-[1px]" /></div>
                </div>

                {/* Content */}
                <div className="px-2.5 flex flex-col gap-1.5 mt-1">
                    {phase === 'idle' && (
                        <>
                            {/* App logo + description */}
                            <div className="flex flex-col items-center gap-1.5 pt-2 pb-2">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                                    </svg>
                                </div>
                                <div className="text-[8px] font-bold text-white/80 text-center">Meals Planner</div>
                                <div className="text-[6px] text-white/30 text-center leading-relaxed px-1">Generate 5 grab-and-go meals for your work week</div>
                            </div>
                            {/* Generate button */}
                            <div
                                ref={genBtnRef}
                                className="flex items-center justify-center py-2 bg-white/10 rounded-lg border border-white/10"
                                style={{ opacity: 0 }}
                            >
                                <span className="text-[7px] font-bold text-white/70 tracking-wide">Generate</span>
                            </div>
                        </>
                    )}

                    {phase === 'loading' && (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <div
                                ref={spinnerRef}
                                className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/70"
                            />
                            <span className="text-[6px] text-white/40">Generating...</span>
                        </div>
                    )}

                    {phase === 'done' && (
                        <div ref={mealsRef}>
                            <div className="text-[7px] font-bold text-white/60 px-0.5 mb-0.5">This Week</div>
                            {mealDays.map((day, i) => (
                                <div
                                    key={day}
                                    className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2 py-1.5 border border-white/[0.06] mb-1.5 meal-item"
                                    style={{ opacity: 0 }}
                                >
                                    <div className="w-5 h-5 rounded bg-white/10 shrink-0 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[6px] font-semibold text-white/60">{day}</div>
                                        <div className="text-[5px] text-white/30 truncate">{mealNames[i]}</div>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ambient glow */}
            <div
                ref={glowRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/[0.03] rounded-full blur-[50px] pointer-events-none"
                style={{ opacity: 0.3 }}
            />
        </div>
    );
};

const XCloneVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const topLogo = el.querySelector('.x-top-logo') as HTMLElement;
        const mirror = el.querySelector('.x-mirror') as HTMLElement;
        const bottomLogo = el.querySelector('.x-bottom-logo') as HTMLElement;
        const glow = el.querySelector('.x-glow') as HTMLElement;

        let ctx: { revert: () => void } | undefined;
        loadGsap().then(({ gsap }) => {
            if (!el.isConnected) return;
            ctx = gsap.context(() => {
                const tl = gsap.timeline({ repeat: -1, ease: 'sine.inOut' });
                tl.fromTo(topLogo, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1.6 }, 0)
                  .fromTo(mirror, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0)
                  .fromTo(bottomLogo, { opacity: 0, y: 40 }, { opacity: 0.4, y: 0, duration: 1.6 }, 0)
                  .to({}, { duration: 0.8 })
                  .to(topLogo, { opacity: 0, y: -40, duration: 1.6 })
                  .to(mirror, { scaleX: 0, opacity: 0, duration: 1.6 }, '<')
                  .to(bottomLogo, { opacity: 0, y: 40, duration: 1.6 }, '<');

                gsap.to(glow, { opacity: 0.8, scale: 1.1, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            }, el);
        });

        return () => ctx?.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4">
                <svg className="x-top-logo drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" width="50" height="50" viewBox="0 0 24 24" fill="white" style={{ opacity: 0 }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <div className="x-mirror w-40 h-[2px] bg-gradient-to-r from-transparent via-blue-200/50 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ opacity: 0 }} />
                <div className="x-bottom-logo transform scale-y-[-1]" style={{ opacity: 0 }}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </div>
            </div>
            <div className="x-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-[50px] pointer-events-none" style={{ opacity: 0.5 }} />
        </div>
    );
};

const TankIoVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const leftTank = el.querySelector('.tank-left') as HTMLElement;
        const leftBody = el.querySelector('.tank-left-body') as HTMLElement;
        const rightTank = el.querySelector('.tank-right') as HTMLElement;
        const rightBody = el.querySelector('.tank-right-body') as HTMLElement;
        const leftShot = el.querySelector('.shot-left') as HTMLElement;
        const rightShot = el.querySelector('.shot-right') as HTMLElement;
        const impactLeft = el.querySelector('.impact-left') as HTMLElement;
        const impactRight = el.querySelector('.impact-right') as HTMLElement;

        let ctx: { revert: () => void } | undefined;
        loadGsap().then(({ gsap }) => {
            if (!el.isConnected) return;
            ctx = gsap.context(() => {
                gsap.to(leftTank, { y: -15, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                gsap.to(rightTank, { y: 20, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

                const leftTl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });
                leftTl.to(leftBody, { x: -4, duration: 0.1, ease: 'power2.out' })
                      .to(leftBody, { x: 0, duration: 0.15 })
                      .fromTo(leftShot, { opacity: 0, left: '80px', scale: 0.5 }, { opacity: 1, left: '200px', scale: 1, duration: 0.3, ease: 'none' }, 0.05)
                      .to(leftShot, { opacity: 0, scale: 0.8, duration: 0.1 })
                      .fromTo(impactLeft, { scale: 0.95, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.4 }, 0.35);

                const rightTl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 1 });
                rightTl.to(rightBody, { x: 4, duration: 0.1, ease: 'power2.out' })
                       .to(rightBody, { x: 0, duration: 0.15 })
                       .fromTo(rightShot, { opacity: 0, right: '80px', scale: 0.5 }, { opacity: 1, right: '200px', scale: 1, duration: 0.3, ease: 'none' }, 0.05)
                       .to(rightShot, { opacity: 0, scale: 0.8, duration: 0.1 })
                       .fromTo(impactRight, { scale: 0.95, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.4 }, 0.35);
            }, el);
        });

        return () => ctx?.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="tank-left absolute left-10 z-20">
                <div className="tank-left-body flex flex-col items-center">
                    <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-5 h-5 bg-white/10 rounded-sm" />
                        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-2 bg-neutral-700 rounded-r-full border border-l-0 border-white/10" />
                    </div>
                    <div className="absolute -top-1 w-8 h-12 border-x-2 border-dashed border-white/10 -z-10 rounded-sm" />
                </div>
            </div>
            <div className="tank-right absolute right-10 z-20">
                <div className="tank-right-body flex flex-col items-center">
                    <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-5 h-5 bg-white/10 rounded-sm" />
                        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-2 bg-neutral-700 rounded-l-full border border-r-0 border-white/10" />
                    </div>
                    <div className="absolute -top-1 w-8 h-12 border-x-2 border-dashed border-white/10 -z-10 rounded-sm" />
                </div>
            </div>
            <div className="shot-left absolute w-3 h-1 bg-white rounded-full shadow-[0_0_8px_white]" style={{ opacity: 0, top: '50%' }} />
            <div className="shot-right absolute w-3 h-1 bg-white rounded-full shadow-[0_0_8px_white]" style={{ opacity: 0, top: '50%' }} />
            <div className="impact-left absolute w-8 h-8 rounded-full border border-white/30" style={{ left: '45%', opacity: 0 }} />
            <div className="impact-right absolute w-8 h-8 rounded-full border border-white/30" style={{ right: '45%', opacity: 0 }} />
        </div>
    );
};

export function Projects() {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Header reveal — word-by-word staggered lift
    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        let ctx: { revert: () => void } | undefined;
        loadGsap().then(({ gsap, ScrollTrigger }) => {
            if (!el.isConnected) return;
            ctx = gsap.context(() => {
                const title = el.querySelector('.projects-title') as HTMLElement | null;
                const subtitle = el.querySelector('.projects-subtitle') as HTMLElement | null;
                const link = el.querySelector('.projects-github-link') as HTMLElement | null;

                if (title) {
                    const words = (title.textContent || '').split(' ');
                    title.innerHTML = words
                        .map(w => `<span class="proj-word inline-block"><span class="proj-word-inner inline-block">${w}</span></span>`)
                        .join(' ');
                    const inners = title.querySelectorAll('.proj-word-inner');
                    gsap.fromTo(inners,
                        { y: '110%', rotateX: -40, opacity: 0 },
                        { y: '0%', rotateX: 0, opacity: 1, duration: 0.8, stagger: 0.06,
                          ease: 'power3.out', delay: 0.1,
                          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
                    );
                }
                if (subtitle) {
                    gsap.fromTo(subtitle,
                        { opacity: 0, y: 18 },
                        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.35,
                          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
                    );
                }
                if (link) {
                    gsap.fromTo(link,
                        { opacity: 0, x: 20 },
                        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.45,
                          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
                    );
                }

                void ScrollTrigger;
            }, el);
        });
        return () => ctx?.revert();
    }, []);

    // Project cards — individual ScrollTrigger per card (fix shared trigger bug)
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        let triggers: Array<{ kill: () => void }> = [];
        loadGsap().then(({ gsap, ScrollTrigger }) => {
            if (!el.isConnected) return;
            const cards = el.querySelectorAll('.project-card');
            cards.forEach((card, i) => {
                const visual = card.querySelector('.project-visual') as HTMLElement | null;
                const content = card.querySelector('.project-content') as HTMLElement | null;

                // Set initial state imperatively so no flash
                gsap.set(card, { opacity: 0, y: 50 });

                const st = ScrollTrigger.create({
                    trigger: card as HTMLElement,
                    start: 'top 95%',
                    once: true,
                    onEnter: () => {
                        gsap.to(card, {
                            opacity: 1, y: 0,
                            duration: 0.55, ease: 'power3.out',
                        });
                        if (content) {
                            const children = Array.from(content.children) as HTMLElement[];
                            gsap.fromTo(children,
                                { opacity: 0, y: 18 },
                                { opacity: 1, y: 0, duration: 0.45, stagger: 0.05,
                                  ease: 'power3.out', delay: 0.15 }
                            );
                        }
                        if (visual) {
                            gsap.fromTo(visual,
                                { opacity: 0, scale: 0.95 },
                                { opacity: 1, scale: 1, duration: 0.5,
                                  ease: 'power3.out', delay: 0.1 }
                            );
                        }
                    },
                });
                triggers.push(st);
            });
        });
        return () => { triggers.forEach(t => t.kill()); };
    }, []);

    const projects: Project[] = [
        {
            title: "X-clone",
            description: t('projects.items.x_clone.description'),
            tags: ["HTML/CSS", "JavaScript", "AI Integration", "Responsive"],
            link: "https://x-clone-teal-phi.vercel.app/",
            github: "https://github.com/Thomas-TP/X-clone",
            year: "2024"
        },
        {
            title: "PowerShell Empire",
            description: t('projects.items.empire.description'),
            tags: ["PowerShell", "Cybersecurity", "Automation", "Scripting"],
            link: "https://vimeo.com/1085791100/a588dbfdf3?fl=pl&fe=sh",
            github: "https://github.com/Thomas-TP/Powershell-Empire-test",
            year: "2024"
        },
        {
            title: "Tank.io",
            description: t('projects.items.tank_io.description'),
            tags: ["React", "Canvas API", "Multiplayer", "Game Dev"],
            link: "https://tank-io-wr49.onrender.com/",
            github: "https://github.com/Thomas-TP/Tank.io",
            year: "2025"
        },
        {
            title: "Meals Planner",
            description: t('projects.items.meals_planner.description'),
            tags: ["Flutter", "Dart", "C++", "CMake", "Swift"],
            github: "https://github.com/Thomas-TP/meals-app",
            year: "2026"
        },
    ];

    return (
        <section ref={sectionRef} id="projects" className="py-32 container mx-auto px-4 cv-auto">
            <div
                ref={headerRef}
                className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
            >
                <div>
                    <h2 className="projects-title text-4xl md:text-6xl font-bold mb-4" style={{ perspective: '800px' }}>{t('projects.title')}</h2>
                    <p className="projects-subtitle text-muted-foreground text-lg max-w-md">
                        {t('projects.subtitle')}
                    </p>
                </div>
                <a
                    href="https://github.com/Thomas-TP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projects-github-link group flex items-center gap-2 text-foreground border-b border-border pb-1 hover:border-foreground transition-colors"
                >
                    {t('projects.view_all')} <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" size={18} />
                </a>
            </div>

            <div className="grid gap-8">
                {projects.map((project) => (
                    <div
                        key={project.title}
                        className="project-card group relative bg-card border border-border rounded-3xl p-8 md:p-12 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row gap-8 justify-between">
                            <div className="project-content flex flex-col justify-between flex-1">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="font-mono text-sm text-muted-foreground">{project.year}</span>
                                        <div className="h-px bg-border w-12" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 group-hover:text-foreground/90 transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground text-lg mb-8 max-w-xl leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground border border-border">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-secondary rounded-full hover:bg-foreground hover:text-background transition-all"
                                            aria-label="View on GitHub"
                                        >
                                            <FaGithub size={20} />
                                        </a>
                                    )}
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-secondary rounded-full hover:bg-foreground hover:text-background transition-all font-medium"
                                        >
                                            {t('projects.view_project')} <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Project Visualization Block */}
                            <div className="project-visual w-full md:w-1/3 aspect-video bg-black rounded-2xl border border-border flex items-center justify-center overflow-hidden relative group-hover:border-primary/20 transition-all shadow-2xl">
                                <div className="absolute inset-0 bg-grid-white/[0.05]" />

                                {project.title === "X-clone" ? (
                                    <XCloneVisual />
                                ) : project.title === "Tank.io" ? (
                                    <TankIoVisual />
                                ) : project.title === "Meals Planner" ? (
                                    <MealsPhoneMockup />
                                ) : (
                                    <EmpireTerminal />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
