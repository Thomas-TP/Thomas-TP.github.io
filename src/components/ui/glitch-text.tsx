interface GlitchTextProps {
    text: string;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
    return (
        <span
            className={`relative inline-block glitch-text ${className}`}
        >
            <span className="relative z-10">{text}</span>
            <span className="glitch-layer glitch-r" aria-hidden="true">{text}</span>
            <span className="glitch-layer glitch-c" aria-hidden="true">{text}</span>
        </span>
    );
}
