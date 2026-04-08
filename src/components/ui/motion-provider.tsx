import { useEffect } from 'react';
import { loadGsap } from '@/lib/gsap-init';

export function GsapProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Kick off async GSAP load; refresh ScrollTrigger once ready
        loadGsap().then(({ ScrollTrigger }) => {
            setTimeout(() => ScrollTrigger.refresh(), 100);
        });
    }, []);

    return <>{children}</>;
}
