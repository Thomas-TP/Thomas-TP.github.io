'use client';

import { Hero } from '@/components/sections/Hero';
import dynamic from 'next/dynamic';

// Sections below the fold are lazy-loaded to reduce initial JS bundle size
// and avoid parsing/executing heavy components (BentoGrid ~847 lines, Projects ~444 lines)
// before they are needed.
const AboutBento = dynamic(() =>
    import('@/components/sections/BentoGrid').then(m => m.AboutBento), { ssr: false }
);
const TechStack = dynamic(() =>
    import('@/components/sections/TechStack').then(m => m.TechStack), { ssr: false }
);
const Projects = dynamic(() =>
    import('@/components/sections/Projects').then(m => m.Projects), { ssr: false }
);
const Contact = dynamic(() =>
    import('@/components/sections/Contact').then(m => m.Contact), { ssr: false }
);

export function Home() {
    return (
        <main id="main-content" className="relative z-10 flex flex-col gap-20">
            <Hero />
            <AboutBento />
            <TechStack />
            <Projects />
            <Contact />
        </main>
    );
}
