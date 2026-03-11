'use client';

import { useState, ReactNode } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTheme } from '@/components/ui/theme-provider';

const RECAPTCHA_SITE_KEY = '6LcK2YYsAAAAAPrOEWr5VVTLzsdsLV73pIQO0YkP';

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export function WhatsAppLink({ href, children, className, onClick, ...rest }: WhatsAppLinkProps) {
    const [showCaptcha, setShowCaptcha] = useState(false);
    const { theme } = useTheme();

    const resolvedTheme = (): 'dark' | 'light' => {
        if (theme === 'system') {
            if (typeof window === 'undefined') return 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme === 'light' ? 'light' : 'dark';
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick(e);
        e.preventDefault();
        setShowCaptcha(true);
    };

    const handleCaptchaChange = (token: string | null) => {
        if (token) {
            setShowCaptcha(false);
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <a href={href} onClick={handleClick} className={className} {...rest}>
                {children}
            </a>
            
            {showCaptcha && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="relative bg-card p-6 md:p-8 rounded-2xl border border-border shadow-lg flex flex-col items-center gap-6 max-w-[90vw]">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowCaptcha(false);
                            }}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <div className="text-center mt-2">
                            <h3 className="text-xl font-bold mb-2">Security Check</h3>
                            <p className="text-sm text-muted-foreground">Please verify you are human to contact me on WhatsApp.</p>
                        </div>
                        <div className="overflow-hidden rounded-xl bg-background border border-border">
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                                theme={resolvedTheme()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
