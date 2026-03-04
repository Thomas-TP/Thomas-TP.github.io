'use client';

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"
import { motion } from "framer-motion"
import { useEffect, useState, useCallback } from "react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    // Resolve the actual applied theme (system → infer from DOM class)
    const resolvedDark = mounted
        ? theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark"))
        : false

    const handleToggle = useCallback(() => {
        // Single overlay fade — masks the instant theme swap with zero perf cost
        const overlay = document.createElement("div")
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:99999;pointer-events:none;
            background:${resolvedDark ? "#fff" : "#000"};
            opacity:0.35;transition:opacity 0.3s ease;
        `
        document.body.appendChild(overlay)

        // Force reflow then fade out
        overlay.offsetHeight // eslint-disable-line @typescript-eslint/no-unused-expressions
        requestAnimationFrame(() => {
            overlay.style.opacity = "0"
        })
        overlay.addEventListener("transitionend", () => overlay.remove())
        // Safety: remove after 400ms even if transitionend doesn't fire
        setTimeout(() => overlay.remove(), 400)

        setTheme(resolvedDark ? "light" : "dark")
    }, [resolvedDark, setTheme])

    return (
        <button
            onClick={handleToggle}
            className="relative flex items-center justify-center p-2 md:p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-300 overflow-hidden cursor-pointer"
            aria-label="Toggle theme"
        >
            <motion.div
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
            </motion.div>

            <motion.div
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
            </motion.div>

            {/* Invisible spacer to maintain size */}
            <div className="w-[1.2rem] h-[1.2rem] opacity-0" />

            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
