import { Hero } from '@/components/Hero';
import { AboutBento } from '@/components/BentoGrid';
import { TechStack } from '@/components/TechStack';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';

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
