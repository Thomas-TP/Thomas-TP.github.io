'use client';

import { type ElementType } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    siReact, siTypescript, siTailwindcss, siNodedotjs, siNextdotjs,
    siDocker, siGit, siFigma, siPython,
    siLinux, siCisco, siKubernetes, siMongodb, siCplusplus,
    siGo, siRust, siDotnet, siJavascript, siKalilinux, siRaspberrypi, siAndroid,
} from 'simple-icons';
import { TbBrandAws, TbBrandAzure, TbBrandCSharp, TbBrandVscode, TbBrandOffice, TbBrain } from 'react-icons/tb';

interface Tech {
    label: string;
    /** SVG path data from simple-icons (fill-based) */
    iconPath?: string;
    /** React component from react-icons */
    IconComponent?: ElementType;
}

// Row 1 — scrolls left →
const row1: Tech[] = [
    { label: "React",          iconPath: siReact.path },
    { label: "TypeScript",     iconPath: siTypescript.path },
    { label: "Next.js",        iconPath: siNextdotjs.path },
    { label: "Tailwind CSS",   iconPath: siTailwindcss.path },
    { label: "Node.js",        iconPath: siNodedotjs.path },
    { label: "JavaScript",     iconPath: siJavascript.path },
    { label: "Python",         iconPath: siPython.path },
    { label: "Go",             iconPath: siGo.path },
    { label: "Rust",           iconPath: siRust.path },
    { label: "C++",            iconPath: siCplusplus.path },
    { label: ".NET",           iconPath: siDotnet.path },
    { label: "C#",             IconComponent: TbBrandCSharp },
    { label: "VS Code",        IconComponent: TbBrandVscode },
    { label: "LM Studio",      IconComponent: TbBrain },
];

// Row 2 — scrolls right ←
const row2: Tech[] = [
    { label: "Docker",         iconPath: siDocker.path },
    { label: "Kubernetes",     iconPath: siKubernetes.path },
    { label: "Git",            iconPath: siGit.path },
    { label: "Linux",          iconPath: siLinux.path },
    { label: "MongoDB",        iconPath: siMongodb.path },
    { label: "Figma",          iconPath: siFigma.path },
    { label: "Cisco",          iconPath: siCisco.path },
    { label: "Android",        iconPath: siAndroid.path },
    { label: "AWS",            IconComponent: TbBrandAws },
    { label: "Azure",          IconComponent: TbBrandAzure },
    { label: "Microsoft 365",  IconComponent: TbBrandOffice },
    { label: "Cybersecurity",  iconPath: siKalilinux.path },
    { label: "IoT",            iconPath: siRaspberrypi.path },
];

function TechItem({ label, iconPath, IconComponent }: Tech) {
    return (
        <div className="flex items-center gap-3 shrink-0">
            {iconPath && (
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    aria-label={label}
                    className="w-8 h-8 md:w-10 md:h-10 fill-foreground/70 shrink-0"
                >
                    <path d={iconPath} />
                </svg>
            )}
            {IconComponent && (
                <IconComponent
                    aria-label={label}
                    className="w-8 h-8 md:w-10 md:h-10 text-foreground/70 shrink-0"
                />
            )}
            <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                {label}
            </span>
        </div>
    );
}

function MarqueeRow({ items, reverse = false }: { items: Tech[]; reverse?: boolean }) {
    const doubled = [...items, ...items];
    return (
        <div className="flex relative w-full overflow-hidden">
            <motion.div
                className="flex gap-14 whitespace-nowrap pr-14"
                animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 60,
                    ease: "linear",
                }}
            >
                {doubled.map((tech, index) => (
                    <TechItem key={index} {...tech} />
                ))}
            </motion.div>
        </div>
    );
}

export function TechStack() {
    const { t } = useTranslation();

    return (
        <section className="py-20 overflow-hidden relative cv-auto">
            {/* fade edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />

            <motion.div
                className="mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-sm text-muted-foreground uppercase tracking-widest">{t('tech_stack.title')}</span>
            </motion.div>

            <div className="flex flex-col gap-10">
                <MarqueeRow items={row1} reverse={false} />
                <MarqueeRow items={row2} reverse={true} />
            </div>
        </section>
    );
}
