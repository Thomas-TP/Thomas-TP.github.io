'use client';

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"
import { m } from "framer-motion"
import { useCallback, useState, useEffect } from "react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Resolve the actual applied theme (system → infer from DOM class)
    const resolvedDark = mounted
        ? theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark"))
        : false

    const handleToggle = useCallback(() => {
        const newTheme = resolvedDark ? "light" : "dark";
        
        // Use native View Transitions API if supported
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            (document as any).startViewTransition(() => {
                setTheme(newTheme);
            });
        } else {
            setTheme(newTheme);
        }
    }, [resolvedDark, setTheme])

    return (
        <button
            onClick={handleToggle}
            className="relative flex items-center justify-center p-2 md:p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-300 overflow-hidden cursor-pointer"
            aria-label="Toggle theme"
            suppressHydrationWarning
        >
            <m.div
                initial={false}
                animate={{
                    scale: mounted && !resolvedDark ? 1 : 0,
                    rotate: mounted && !resolvedDark ? 0 : 90,
                    opacity: mounted && !resolvedDark ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute"
            >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </m.div>

            <m.div
                initial={false}
                animate={{
                    scale: mounted && resolvedDark ? 1 : 0,
                    rotate: mounted && resolvedDark ? 0 : -90,
                    opacity: mounted && resolvedDark ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute"
            >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </m.div>

            {/* Invisible spacer to maintain size */}
            <div className="w-[1.2rem] h-[1.2rem] opacity-0" />

            <span className="sr-only">Toggle theme</span>
        </button>
    )
}

