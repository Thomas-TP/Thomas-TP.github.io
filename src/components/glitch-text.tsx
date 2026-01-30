import { motion, useAnimationControls } from "framer-motion";

interface GlitchTextProps {
    text: string;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
    const controls = useAnimationControls();

    const handleHover = async () => {
        // Quickly animate through random skews/offsets
        await controls.start({
            x: [0, -2, 2, -1, 1, 0],
            y: [0, 1, -1, 0],
            filter: [
                "blur(0px)",
                "blur(1px)",
                "blur(0px)"
            ],
            transition: {
                duration: 0.2,
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            }
        });
    };

    return (
        <motion.span
            className={`relative inline-block ${className}`}
            onHoverStart={handleHover}
            animate={controls}
        >
            <span className="relative z-10">{text}</span>

            {/* Glitch Layers/Shadows */}
            <motion.span
                className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 mix-blend-multiply"
                animate={controls}
                variants={{
                    hover: { opacity: 0.7, x: -2, y: 1 }
                }}
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500 opacity-0 mix-blend-multiply"
                animate={controls}
                variants={{
                    hover: { opacity: 0.7, x: 2, y: -1 }
                }}
            >
                {text}
            </motion.span>
        </motion.span>
    );
}
