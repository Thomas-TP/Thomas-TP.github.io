'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';

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
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {line.content}
                    </motion.div>
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
                        <motion.div
                            className="w-1.5 h-3 bg-white ml-0.5"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
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

    return (
        <div className="relative w-full h-full bg-black flex items-end justify-center overflow-hidden">
            {/* Phone frame — centered, bottom-anchored, peeks out of the box */}
            <div className="relative mb-[-40px] w-[180px] h-[360px] sm:w-[200px] sm:h-[400px] rounded-[28px] border-2 border-white/20 bg-neutral-950 overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.06)] z-10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20" />

                {/* Status bar */}
                <div className="flex items-center justify-between px-4 pt-6 pb-1">
                    <span className="text-[8px] text-white/40 font-medium">12:30</span>
                    <div className="flex gap-1 items-center">
                        <div className="w-3 h-1.5 border border-white/30 rounded-[2px]"><div className="w-2 h-full bg-white/40 rounded-[1px]" /></div>
                    </div>
                </div>

                {/* App header */}
                <div className="px-4 pt-2 pb-3">
                    <div className="text-[11px] font-bold text-white/90 tracking-wide">Meals Planner</div>
                    <div className="text-[8px] text-white/30 mt-0.5">Weekly meal prep</div>
                </div>

                {/* Divider */}
                <div className="mx-4 h-px bg-white/[0.06] mb-3" />

                {/* Generate button / Loading / Meal list */}
                <div className="px-3 flex flex-col gap-2">
                    {phase === 'idle' && (
                        <motion.div
                            className="flex items-center justify-center py-3 bg-white/10 rounded-xl border border-white/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: [1, 1.03, 1] }}
                            transition={{ scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }}
                        >
                            <span className="text-[10px] font-bold text-white/70 tracking-wide">Generate</span>
                        </motion.div>
                    )}

                    {phase === 'loading' && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <motion.div
                                className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/70"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="text-[8px] text-white/40">Generating...</span>
                        </div>
                    )}

                    {phase === 'done' && mealDays.map((day, i) => (
                        <motion.div
                            key={day}
                            className="flex items-center gap-2.5 bg-white/[0.04] rounded-xl px-3 py-2 border border-white/[0.06]"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.3, ease: 'easeOut' }}
                        >
                            <div className="w-7 h-7 rounded-lg bg-white/10 shrink-0 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[8px] font-semibold text-white/60">{day}</div>
                                <div className="text-[7px] text-white/30 truncate">{mealNames[i]}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ambient glow behind phone */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/[0.03] rounded-full blur-[60px] pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
};

export function Projects() {
    const { t } = useTranslation();

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
            title: "Tank.io",
            description: t('projects.items.tank_io.description'),
            tags: ["React", "Canvas API", "Multiplayer", "Game Dev"],
            link: "https://tank-io-wr49.onrender.com/",
            github: "https://github.com/Thomas-TP/Tank.io",
            year: "2025"
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
            title: "Meals Planner",
            description: t('projects.items.meals_planner.description'),
            tags: ["Flutter", "Dart", "C++", "CMake", "Swift"],
            github: "https://github.com/Thomas-TP/meals-app",
            year: "2026"
        },
    ];

    return (
        <section id="projects" className="py-32 container mx-auto px-4 cv-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
            >
                <div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">{t('projects.title')}</h2>
                    <p className="text-muted-foreground text-lg max-w-md">
                        {t('projects.subtitle')}
                    </p>
                </div>
                <a
                    href="https://github.com/Thomas-TP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-foreground border-b border-border pb-1 hover:border-foreground transition-colors"
                >
                    {t('projects.view_all')} <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" size={18} />
                </a>
            </motion.div>

            <div className="grid gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative bg-card border border-border rounded-3xl p-8 md:p-12 hover:bg-muted/50 transition-colors`}
                    >
                        <div className="flex flex-col md:flex-row gap-8 justify-between">
                            <div className="flex flex-col justify-between flex-1">
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
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground border border-border">
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
                                            <Github size={20} />
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

                            {/* Optional: Placeholder for image or visual element */}
                            {/* Project Visualization Block */}
                            <div className="w-full md:w-1/3 aspect-video bg-black rounded-2xl border border-border flex items-center justify-center overflow-hidden relative group-hover:border-primary/20 transition-all shadow-2xl">
                                <div className="absolute inset-0 bg-grid-white/[0.05]" />

                                {project.title === "X-clone" ? (
                                    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
                                        <div className="relative z-10 flex flex-col items-center gap-4">

                                            {/* Top Main X Logo - Moves Down to Mirror */}
                                            <motion.svg
                                                width="50"
                                                height="50"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                animate={{
                                                    opacity: [0, 1, 1, 0],
                                                    y: [-40, 0, 0, -40]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    times: [0, 0.4, 0.6, 1],
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </motion.svg>

                                            {/* Center Mirror Object - Expands when they meet */}
                                            <motion.div
                                                className="w-40 h-[2px] bg-gradient-to-r from-transparent via-blue-200/50 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                                animate={{
                                                    scaleX: [0, 1, 1, 0],
                                                    opacity: [0, 1, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    times: [0, 0.4, 0.6, 1],
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />

                                            {/* Bottom Reflected X Logo - Moves Up to Mirror */}
                                            <motion.div
                                                className="transform scale-y-[-1] mask-image:linear-gradient(to_bottom,transparent_10%,white_90%) opacity-50"
                                                animate={{
                                                    opacity: [0, 0.4, 0.4, 0],
                                                    y: [40, 0, 0, 40]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    times: [0, 0.4, 0.6, 1],
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </motion.div>
                                        </div>

                                        {/* Ambient Glow - Pulsing */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-[50px] pointer-events-none"
                                            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>
                                ) : project.title === "Tank.io" ? (
                                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                                        {/* Grid Background */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                                        {/* Left Tank Container */}
                                        <motion.div
                                            className="absolute left-10 z-20"
                                            animate={{ y: [0, -15, 0, 15, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            {/* Tank Body & Recoil */}
                                            <motion.div
                                                className="flex flex-col items-center"
                                                animate={{ x: [0, -4, 0] }}
                                                transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }} // Recoil on shoot
                                            >
                                                <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                                    <div className="w-5 h-5 bg-white/10 rounded-sm" />
                                                    {/* Barrel */}
                                                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-2 bg-neutral-700 rounded-r-full border border-l-0 border-white/10" />
                                                </div>
                                                {/* Tracks */}
                                                <div className="absolute -top-1 w-8 h-12 border-x-2 border-dashed border-white/10 -z-10 rounded-sm" />
                                            </motion.div>
                                        </motion.div>

                                        {/* Right Tank Container */}
                                        <motion.div
                                            className="absolute right-10 z-20"
                                            animate={{ y: [0, 20, 0, -10, 0] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            {/* Tank Body & Recoil */}
                                            <motion.div
                                                className="flex flex-col items-center"
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 0.2, delay: 1.1, ease: "easeOut" }} // Recoil on shoot
                                            >
                                                <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                                    <div className="w-5 h-5 bg-white/10 rounded-sm" />
                                                    {/* Barrel */}
                                                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-2 bg-neutral-700 rounded-l-full border border-r-0 border-white/10" />
                                                </div>
                                                {/* Tracks */}
                                                <div className="absolute -top-1 w-8 h-12 border-x-2 border-dashed border-white/10 -z-10 rounded-sm" />
                                            </motion.div>
                                        </motion.div>

                                        {/* Projectiles Wrapper - Needs to follow Y movement loosely or be independent */}
                                        {/* To keep it simple and performant, we'll simulate shots hitting center */}

                                        {/* Left Shot */}
                                        <motion.div
                                            className="absolute w-3 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
                                            initial={{ opacity: 0, left: "80px", top: "50%" }}
                                            animate={{
                                                opacity: [0, 1, 1, 0],
                                                left: ["80px", "200px"],
                                                scale: [0.5, 1, 0.8]
                                            }}
                                            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.6, delay: 0.1, ease: "linear" }}
                                        />

                                        {/* Right Shot */}
                                        <motion.div
                                            className="absolute w-3 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
                                            initial={{ opacity: 0, right: "80px", top: "50%" }}
                                            animate={{
                                                opacity: [0, 1, 1, 0],
                                                right: ["80px", "200px"],
                                                scale: [0.5, 1, 0.8]
                                            }}
                                            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.6, delay: 1.1, ease: "linear" }}
                                        />

                                        {/* Impact Effects (Center) */}
                                        <motion.div
                                            className="absolute w-8 h-8 rounded-full border border-white/30"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                                            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.6, delay: 0.45 }}
                                            style={{ left: "45%" }}
                                        />
                                        <motion.div
                                            className="absolute w-8 h-8 rounded-full border border-white/30"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                                            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.6, delay: 1.45 }}
                                            style={{ right: "45%" }}
                                        />
                                    </div>
                                ) : project.title === "Meals Planner" ? (
                                    <MealsPhoneMockup />
                                ) : (
                                    <EmpireTerminal />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
