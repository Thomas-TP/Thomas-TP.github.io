import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const technologies = [
    "React", "TypeScript", "Tailwind CSS", "Node.js", "Next.js",
    "AWS", "Artificial Intelligence", "LLMs", "Docker", "Git", "Figma",
    "Three.js", "Python", "PowerShell", "IoT", "Linux", "Cisco",
    "Kubernetes", "Azure", "Cybersecurity", "Ethical Hacking",
    "SQL", "MongoDB", "C++", "C#", "Java", "Go", "Rust", "Networking"
];

export function TechStack() {
    const { t } = useTranslation();

    return (
        <section className="py-20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />

            <div className="mb-12 text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">{t('tech_stack.title')}</span>
            </div>

            <div className="flex relative w-full overflow-hidden">
                <motion.div
                    className="flex gap-16 whitespace-nowrap pr-16"
                    animate={{
                        x: "-50%",
                    }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 60,
                        ease: "linear",
                    }}
                >
                    {[...technologies, ...technologies].map((tech, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                                {tech}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
