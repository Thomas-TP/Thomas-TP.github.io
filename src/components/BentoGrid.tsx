import { type ReactNode, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Brain, Code2, Database, Coffee, GraduationCap, Zap, Tv, Lightbulb, Wifi, Briefcase, Search, Loader, ShieldCheck, ExternalLink } from 'lucide-react';

// Bento Grid Utilities
const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | ReactNode;
    description?: string | ReactNode;
    header?: ReactNode;
    icon?: ReactNode;
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black/40 dark:border-white/10 bg-white border border-border justify-between flex flex-col space-y-4 backdrop-blur-sm",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-bold font-sans text-foreground mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-muted-foreground text-xs">
                    {description}
                </div>
            </div>
        </motion.div>
    );
};


function WebDevBlock() {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setResults([]);

        // Simulate network delay
        setTimeout(() => {
            setIsSearching(false);
            setResults([
                { id: 1, title: `${query} - ${t('bento.web_dev.title')}`, desc: t('bento.web_dev.desc') },
                { id: 2, title: `How to use ${query}`, desc: t('bento.web_dev.desc') },
                { id: 3, title: `${query} vs Others`, desc: t('bento.web_dev.desc') },
            ]);
        }, 1500);
    };

    return (
        <div
            ref={containerRef}
            className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden relative group/image"
        >
            <div className="absolute inset-0 bg-grid-white/[0.05]" />

            <motion.div
                initial={{}}
                className="relative z-10 w-[90%] h-[85%] bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Browser Toolbar */}
                <div className="h-10 w-full bg-muted/50 border-b border-border flex items-center px-3 gap-3 shrink-0 z-20 relative select-none">
                    <div className="flex gap-1.5 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                    </div>
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 h-6 bg-muted rounded-md border border-border flex items-center px-2 relative focus-within:border-primary/20 transition-colors">
                        <Search size={10} className="text-muted-foreground mr-2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}

                            aria-label={t('bento.web_dev.searching')}
                            placeholder={t('bento.web_dev.searching')}
                            className="flex-1 bg-transparent border-none outline-none text-[10px] text-foreground placeholder:text-muted-foreground h-full font-mono"
                        />
                        {isSearching && <Loader size={10} className="text-white/50 animate-spin" />}
                    </form>
                </div>

                {/* Browser Content */}
                <div className="flex-1 p-4 overflow-y-auto relative min-h-0 custom-scrollbar">
                    {!hasSearched ? (
                        // Initial State (Placeholder Mockup)
                        <div className="flex h-full flex-col gap-4 opacity-30 select-none pb-4">
                            {/* Hero Mockup */}
                            <div className="w-full h-24 bg-gradient-to-br from-foreground/10 to-transparent rounded-lg border border-border flex flex-col justify-center p-4 gap-3 shrink-0">
                                <div className="w-1/2 h-5 bg-foreground/20 rounded-md" />
                                <div className="w-3/4 h-3 bg-foreground/5 rounded-md" />
                            </div>
                            {/* Grid Mockup */}
                            <div className="grid grid-cols-2 gap-3 shrink-0">
                                <div className="bg-foreground/5 rounded-md h-24" />
                                <div className="bg-foreground/5 rounded-md h-24" />
                                <div className="bg-foreground/5 rounded-md h-24" />
                                <div className="bg-foreground/5 rounded-md h-24" />
                                <div className="bg-foreground/5 rounded-md h-24" />
                                <div className="bg-foreground/5 rounded-md h-24" />
                            </div>
                        </div>
                    ) : (
                        // Search Results State
                        <div className="flex flex-col gap-3">
                            <div className="text-[10px] text-muted-foreground font-mono mb-1">
                                {isSearching ? t('bento.web_dev.searching') : `${results.length} results found for "${query}"`}
                            </div>

                            {isSearching ? (
                                // Loading Skeletons
                                [1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-2 animate-pulse">
                                        <div className="w-1/3 h-3 bg-foreground/10 rounded" />
                                        <div className="w-2/3 h-2 bg-foreground/5 rounded" />
                                    </div>
                                ))
                            ) : (
                                // Actual Results
                                results.map((result) => (
                                    <motion.div
                                        key={result.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: result.id * 0.1 }}
                                        className="p-3 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer group"
                                    >
                                        <h4 className="text-[11px] font-bold text-foreground group-hover:underline mb-1">{result.title}</h4>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">{result.desc}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}


function TerminalBlock() {
    const [history, setHistory] = useState<string[]>([
        "Welcome to system v1.0",
        "Type 'help' for available commands."
    ]);
    const [input, setInput] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of terminal content only
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const cmd = input.trim();
        if (!cmd) return;

        // Add command to history
        const newHistory = [...history, `$ ${cmd}`];

        // Process command
        if (cmd === "clear") {
            setHistory([]);
            setInput("");
            return;
        }

        if (cmd === "sudo apt update") {
            newHistory.push("Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease");
            newHistory.push("Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]");
            newHistory.push("Fetched 110 kB in 1s (123 kB/s)");
            newHistory.push("Reading package lists... Done");
            newHistory.push("Building dependency tree... Done");
            newHistory.push("All packages are up to date.");
        } else if (cmd === "help") {
            newHistory.push("Available commands: sudo apt update, ls, whoami, clear");
        } else if (cmd === "ls") {
            newHistory.push("monitor_sys.ps1  config.json  server.log  notes.txt");
        } else if (cmd === "whoami") {
            newHistory.push("root");
        } else {
            newHistory.push(`bash: ${cmd}: command not found`);
        }

        setHistory(newHistory);
        setInput("");
    };

    return (
        <div
            className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-muted flex items-center justify-center relative overflow-hidden group/terminal"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-white/[0.05]" />

            {/* Terminal Window */}
            <div className="relative z-10 w-3/4 h-3/4 bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden group-hover/terminal:border-primary/20 transition-colors">
                {/* Title Bar */}
                <div className="h-6 bg-muted/50 border-b border-border flex items-center px-2 gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-border" />
                    <div className="w-2 h-2 rounded-full bg-border" />
                    <div className="w-2 h-2 rounded-full bg-border" />
                    <div className="ml-2 text-[8px] font-mono text-muted-foreground tracking-wide">bash — 80x24</div>
                </div>

                {/* Terminal Content */}
                <div
                    ref={containerRef}
                    className="flex-1 p-3 font-mono text-[10px] text-muted-foreground overflow-y-auto cursor-text"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {history.map((line, i) => (
                        <div key={i} className="mb-1 break-words leading-tight">{line}</div>
                    ))}

                    <form onSubmit={handleCommand} className="flex gap-1.5 items-center">
                        <span className="text-muted-foreground shrink-0 select-none">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent border-none outline-none text-foreground w-full opacity-90 focus:opacity-100 p-0 m-0 h-auto min-w-0"
                            spellCheck={false}
                            autoComplete="off"
                            aria-label="Terminal Command Input"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}


function IoTBlock() {
    const { t } = useTranslation();
    const [lightOn, setLightOn] = useState(false);
    const [brightness, setBrightness] = useState(50);
    const [tvOn, setTvOn] = useState(false);
    const [ovenOn, setOvenOn] = useState(false);

    return (
        <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden group/iot">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />

            {/* Phone Interface */}
            <div className="absolute left-4 bottom-3 top-3 md:bottom-1 md:top-1 w-32 bg-card border border-border rounded-2xl p-2 shadow-2xl flex flex-col z-20 transform scale-[1.1] md:scale-[0.9] origin-left">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-1 mb-1 opacity-50">
                    <span className="text-[8px] text-foreground">09:41</span>
                    <div className="flex gap-1">
                        <Wifi size={8} className="text-foreground" />
                        <div className="w-3 h-1.5 border border-foreground rounded-[1px] relative">
                            <div className="absolute left-0 top-0 bottom-0 bg-foreground w-[70%]" />
                        </div>
                    </div>
                </div>

                {/* App Content */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden justify-center md:justify-start">
                    <div className="text-[9px] font-bold text-foreground mb-0.5 ml-1">Home</div>

                    {/* Light Control */}
                    <div className="bg-foreground/5 rounded-lg p-1 flex flex-col gap-1 transition-colors duration-300"
                        style={{ backgroundColor: lightOn ? 'rgba(251, 191, 36, 0.1)' : 'rgba(128,128,128,0.05)' }}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded-full bg-foreground/5">
                                    <Lightbulb size={10} className={lightOn ? "text-yellow-500" : "text-muted-foreground"} />
                                </div>
                                <span className="text-[9px] text-muted-foreground">{t('bento.iot.lamp')}</span>
                            </div>
                            <div
                                className="w-6 h-3 rounded-full bg-foreground/10 relative cursor-pointer scale-125 md:scale-100 origin-right"
                                onClick={() => setLightOn(!lightOn)}
                                role="button"
                                tabIndex={0}
                                aria-label={t('bento.iot.lamp')}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setLightOn(!lightOn)}
                            >
                                <motion.div
                                    className="absolute top-0.5 bottom-0.5 w-2 h-2 rounded-full bg-background shadow-sm"
                                    animate={{ left: lightOn ? "14px" : "2px" }}
                                />
                            </div>
                        </div>
                        {lightOn && (
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={brightness}
                                onChange={(e) => setBrightness(parseInt(e.target.value))}
                                aria-label="Light Brightness"
                                className="w-full h-2 md:h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:md:w-2 [&::-webkit-slider-thumb]:md:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                        )}
                    </div>

                    {/* TV Control */}
                    <div className="hidden md:flex bg-foreground/5 rounded-lg p-1 justify-between items-center transition-colors duration-300"
                        style={{ backgroundColor: tvOn ? 'rgba(59, 130, 246, 0.1)' : 'rgba(128,128,128,0.05)' }}>
                        <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-full bg-foreground/5">
                                <Tv size={10} className={tvOn ? "text-blue-500" : "text-muted-foreground"} />
                            </div>
                            <span className="text-[9px] text-muted-foreground">{t('bento.iot.tv')}</span>
                        </div>
                        <div
                            className="w-6 h-3 rounded-full bg-foreground/10 relative cursor-pointer flex-shrink-0"
                            onClick={() => setTvOn(!tvOn)}
                            role="button"
                            tabIndex={0}
                            aria-label={t('bento.iot.tv')}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setTvOn(!tvOn)}
                        >
                            <motion.div
                                className="absolute top-0.5 bottom-0.5 w-2 h-2 rounded-full bg-background shadow-sm"
                                animate={{ left: tvOn ? "14px" : "2px" }}
                            />
                        </div>
                    </div>

                    {/* Oven Control */}
                    <div className="hidden md:flex bg-foreground/5 rounded-lg p-1 justify-between items-center transition-colors duration-300"
                        style={{ backgroundColor: ovenOn ? 'rgba(239, 68, 68, 0.1)' : 'rgba(128,128,128,0.05)' }}>
                        <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-full bg-foreground/5">
                                <Zap size={10} className={ovenOn ? "text-red-500" : "text-muted-foreground"} />
                            </div>
                            <span className="text-[9px] text-muted-foreground">{t('bento.iot.oven')}</span>
                        </div>
                        <div
                            className="w-6 h-3 rounded-full bg-foreground/10 relative cursor-pointer flex-shrink-0"
                            onClick={() => setOvenOn(!ovenOn)}
                            role="button"
                            tabIndex={0}
                            aria-label={t('bento.iot.oven')}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOvenOn(!ovenOn)}
                        >
                            <motion.div
                                className="absolute top-0.5 bottom-0.5 w-2 h-2 rounded-full bg-background shadow-sm"
                                animate={{ left: ovenOn ? "14px" : "2px" }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Connected Lines */}
            <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Line to Light */}
                {/* Line to Light */}
                <motion.path
                    className="hidden md:block"
                    d="M 55 35 L 75 25"
                    stroke={lightOn ? "#fbbf24" : "rgba(255,255,255,0.1)"}
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    fill="none"
                />
                {/* Line to Light (Mobile) */}
                <motion.path
                    className="md:hidden"
                    d="M 55 50 L 75 50"
                    stroke={lightOn ? "#fbbf24" : "rgba(255,255,255,0.1)"}
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    fill="none"
                />
                {/* Line to TV */}
                <motion.path
                    className="hidden md:block"
                    d="M 55 50 L 75 50"
                    stroke={tvOn ? "#60a5fa" : "rgba(255,255,255,0.1)"}
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    fill="none"
                />
                {/* Line to Oven */}
                <motion.path
                    className="hidden md:block"
                    d="M 55 65 L 75 75"
                    stroke={ovenOn ? "#f87171" : "rgba(255,255,255,0.1)"}
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    fill="none"
                />
            </svg>

            {/* Devices Column */}
            <div className="absolute right-6 top-0 bottom-0 flex flex-col justify-center gap-4 z-10 w-16 md:scale-100 scale-[1.3] origin-right">
                {/* Light Bulb - Detailed */}
                <div className="w-16 h-16 rounded-2xl bg-card border border-border flex flex-col items-center justify-center relative transition-all duration-500 overflow-hidden"
                    style={{
                        borderColor: lightOn ? 'rgba(251, 191, 36, 0.5)' : '',
                        boxShadow: lightOn ? `0 0 ${brightness / 2}px rgba(251, 191, 36, ${brightness / 100})` : 'none'
                    }}>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-yellow-500/5" style={{ opacity: lightOn ? brightness / 100 : 0 }} />

                    {/* Bulb SVG */}
                    <div className="relative z-10">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{
                                color: lightOn ? '#fbbf24' : 'var(--muted-foreground)',
                                filter: lightOn ? `drop-shadow(0 0 ${brightness / 10}px #fbbf24)` : 'none',
                                transition: 'all 0.5s ease'
                            }}>
                            <path d="M9 18h6" />
                            <path d="M10 22h4" />
                            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 16.5 8 4.5 4.5 0 0 0 12 3.5 4.5 4.5 0 0 0 7.5 8c0 1.42.7 2.61 1.91 3.5A2.51 2.51 0 0 1 10.9 14" />
                        </svg>
                    </div>
                    <div className="mt-1 text-[8px] font-mono text-muted-foreground">{lightOn ? `${brightness}%` : 'OFF'}</div>
                </div>

                {/* Smart TV - Detailed */}
                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-card border border-border flex-col items-center justify-center relative overflow-hidden transition-all duration-500"
                    style={{
                        borderColor: tvOn ? 'rgba(96, 165, 250, 0.5)' : '',
                        boxShadow: tvOn ? '0 0 30px rgba(96, 165, 250, 0.15)' : 'none'
                    }}>
                    {/* Screen Content */}
                    <div className="w-10 h-7 bg-muted rounded border border-border relative overflow-hidden flex items-center justify-center">
                        {tvOn ? (
                            <>
                                <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                                <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                                {/* Abstract Movie Scene */}
                                <div className="absolute inset-2 flex gap-0.5 items-end">
                                    <div className="w-1 h-2 bg-blue-400/50 rounded-sm animate-[bounce_1s_infinite]" />
                                    <div className="w-1 h-3 bg-purple-400/50 rounded-sm animate-[bounce_1.2s_infinite]" />
                                    <div className="w-1 h-1.5 bg-indigo-400/50 rounded-sm animate-[bounce_0.8s_infinite]" />
                                </div>
                            </>
                        ) : (
                            <div className="text-[6px] text-muted-foreground/30 font-mono">SONY</div>
                        )}
                    </div>
                    <div className="mt-1.5 w-4 h-0.5 bg-border rounded-full" />
                </div>

                {/* Kitchen Oven - Detailed */}
                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-card border border-border flex-col items-center justify-center relative overflow-hidden transition-all duration-500"
                    style={{
                        borderColor: ovenOn ? 'rgba(248, 113, 113, 0.5)' : '',
                        boxShadow: ovenOn ? '0 0 30px rgba(248, 113, 113, 0.15)' : 'none'
                    }}>
                    <div className="w-10 h-8 rounded-md border border-border relative overflow-hidden bg-muted">
                        {/* Oven Window */}
                        <div className="absolute inset-1 rounded bg-background/50 border border-border overflow-hidden flex items-center justify-center">
                            {ovenOn && (
                                <>
                                    <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
                                    <div className="w-full h-[1px] bg-orange-500/50 blur-[1px] absolute top-1/2 shadow-[0_0_5px_#f97316]" />
                                    <div className="w-full h-[1px] bg-red-500/50 blur-[1px] absolute top-2/3 shadow-[0_0_5px_#ef4444]" />
                                </>
                            )}
                        </div>
                        {/* Controls */}
                        <div className="absolute top-0.5 right-1 flex gap-0.5">
                            <div className="w-0.5 h-0.5 rounded-full bg-foreground/30" />
                            <div className="w-0.5 h-0.5 rounded-full bg-foreground/30" />
                        </div>
                    </div>
                    <div className="mt-1 text-[8px] font-mono" style={{ color: ovenOn ? '#f87171' : 'var(--muted-foreground)' }}>
                        {ovenOn ? '200°C' : 'OFF'}
                    </div>
                </div>
            </div>
        </div>
    );
}



function GenevaStudentBlock() {
    const { t } = useTranslation();
    const [year, setYear] = useState(2026);

    const stages = {
        2024: {
            title: t('bento.student.school_entry'),
            subtitle: t('bento.student.start'),
            icon: <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border">
                <span className="font-mono text-xs font-bold text-foreground">01</span>
            </div>
        },
        2025: {
            title: t('bento.student.development'),
            subtitle: t('bento.student.desc'),
            icon: <Code2 className="text-foreground" size={20} />
        },
        2026: {
            title: t('bento.student.specialization'),
            subtitle: t('bento.student.desc'),
            icon: <Database className="text-foreground" size={20} />
        },
        2027: {
            title: t('bento.student.internship'),
            subtitle: "Professional Exp.",
            icon: <Briefcase className="text-foreground" size={20} />
        },
        2028: {
            title: t('bento.student.graduation'),
            subtitle: t('bento.student.diploma'),
            icon: <GraduationCap className="text-foreground" size={20} />
        }
    };

    // Calculate progress for the progress bar
    const progress = ((year - 2024) / 4) * 100;

    return (
        <div className="flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden group/student">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />

            <div className="w-[85%] flex flex-col gap-6 relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center transition-all duration-300">
                            {stages[year as keyof typeof stages].icon}
                        </div>
                        <div className="flex flex-col">
                            <motion.span
                                key={year}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-bold text-foreground tracking-wide"
                            >
                                {stages[year as keyof typeof stages].title}
                            </motion.span>
                            <motion.span
                                key={`sub-${year}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] text-muted-foreground font-mono"
                            >
                                {stages[year as keyof typeof stages].subtitle}
                            </motion.span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-foreground font-mono">{year}</span>
                        <span className="text-[9px] text-muted-foreground font-mono tracking-widest">TIMELINE</span>
                    </div>
                </div>

                {/* Interactive Slider Section */}
                <div className="flex flex-col gap-2">
                    <div className="relative w-full h-6 flex items-center">
                        {/* Track Background */}
                        <div className="absolute left-0 right-0 h-1 bg-foreground/10 rounded-full overflow-hidden">
                            {/* Progress Fill */}
                            <motion.div
                                className="h-full bg-foreground"
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            />
                        </div>

                        {/* Slider Input */}
                        <input
                            type="range"
                            min="2024"
                            max="2028"
                            value={year}
                            step="1"
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                            aria-label="Student Timeline Year"
                        />

                        {/* Custom Thumb (Visual only, follows visible state) */}
                        <motion.div
                            className="absolute h-4 w-4 bg-background border-2 border-foreground rounded-full shadow-[0_0_10px_rgba(128,128,128,0.5)] z-10 pointer-events-none"
                            animate={{ left: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            style={{ x: "-50%" }}
                        >
                            <div className="absolute inset-1 bg-foreground rounded-full" />
                        </motion.div>

                        {/* Ticks */}
                        <div className="absolute left-0 right-0 flex justify-between px-[2px] pointer-events-none">
                            {[2024, 2025, 2026, 2027, 2028].map((y) => (
                                <div key={y} className={`w-1 h-1 rounded-full transition-colors duration-300 ${y <= year ? 'bg-foreground' : 'bg-foreground/20'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                        <span>START</span>
                        <span>DIPLOMA</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CertificationsBlock() {
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();

    return (
        <div
            className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card flex items-center justify-between relative overflow-hidden group/cert p-8 transition-all hover:bg-muted/30 border border-border hover:border-primary/20"
        >
            <div className="absolute inset-0 bg-grid-white/[0.05]" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-0" />

            <div className="flex flex-col gap-4 relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-foreground/90 text-xs font-medium w-fit backdrop-blur-sm shadow-lg">
                    <ShieldCheck size={12} className="text-foreground" />
                    {t('bento.certifications.verified')}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover/cert:text-foreground/80 transition-colors">{t('bento.certifications.title')}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {t('bento.certifications.desc')}
                    </p>
                </div>
                <a
                    href="https://www.credly.com/users/thomas-prudhomme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-foreground group-hover/cert:translate-x-2 transition-transform cursor-pointer w-fit"
                >
                    {t('bento.certifications.view_profile')} <ExternalLink size={14} />
                </a>
            </div>

            {/* Animated Badge Container */}
            <div className="hidden md:flex relative w-40 h-40 items-center justify-center shrink-0">
                {/* Glow behind */}
                <motion.div
                    className="absolute inset-0 bg-primary/5 blur-[50px] rounded-full"
                    animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Rotating Card */}
                <motion.div
                    className="relative z-10 w-24 h-24 bg-card/40 backdrop-blur-md rounded-3xl rotate-45 flex items-center justify-center shadow-2xl border border-border"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center border border-border -rotate-45 p-4 shadow-inner">
                        {/* Embedded Credly SVG Logo */}
                        <ShieldCheck className="w-full h-full text-foreground" strokeWidth={1} />
                    </div>
                </motion.div>

                {/* Floating monochrome particles */}
                {!shouldReduceMotion && [...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-foreground/30 rounded-full"
                        animate={{
                            y: [-25, -45, -25],
                            x: Math.sin(i) * 25,
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Main Component
export function AboutBento() {
    const { t } = useTranslation();
    const items = [
        {
            title: t('bento.web_dev.title'),
            description: t('bento.web_dev.desc'),
            header: <WebDevBlock />,
            icon: <Code2 className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-2",
        },
        {
            title: t('bento.backend.title'),
            description: t('bento.backend.desc'),
            header: <TerminalBlock />,
            icon: <Database className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-1",
        },
        {
            title: t('bento.iot.title'),
            description: t('bento.iot.desc'),
            header: <IoTBlock />,
            icon: <Brain className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-1",
        },
        {
            title: t('bento.student.title'),
            description: t('bento.student.desc'),
            header: <GenevaStudentBlock />,
            icon: <Coffee className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-2",
        },
        {
            title: "",
            description: "",
            header: <CertificationsBlock />,
            padding: "p-0", // Special prop to remove padding for this block if needed, but standard item has p-4. I'll let standard styling apply but this block is the header itself.
            className: "md:col-span-3 border-transparent bg-transparent shadow-none hover:shadow-none", // Overriding styles to let the Link block handle everything
            noDefaultStyles: true // Custom flag I might need, or just use CSS overrides
        },
    ];

    return (
        <section id="about" className="py-20 container mx-auto px-4">
            <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('bento.header_about')}</h2>
                <p className="text-muted-foreground max-w-2xl text-lg">
                    {t('bento.header_desc')}
                </p>
            </div>
            <BentoGrid className="max-w-4xl mx-auto">
                {items.map((item, i) => (
                    item.noDefaultStyles ? (
                        // Direct render for the custom Certification block to avoid double borders/padding
                        <div key={i} className={item.className}>
                            {item.header}
                        </div>
                    ) : (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={item.className}
                        />
                    )
                ))}
            </BentoGrid>
        </section>
    );
}
