import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    return (
        <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex items-center justify-center p-3 rounded-full text-muted-foreground hover:text-foreground overflow-hidden"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(128, 128, 128, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 0 : 1,
                    rotate: isDark ? 90 : 0,
                    opacity: isDark ? 0 : 1
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute"
            >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 1 : 0,
                    rotate: isDark ? 0 : -90,
                    opacity: isDark ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute"
            >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>

            {/* Invisible spacer to maintain size */}
            <div className="w-[1.2rem] h-[1.2rem] opacity-0" />

            <span className="sr-only">Toggle theme</span>
        </motion.button>
    )
}
