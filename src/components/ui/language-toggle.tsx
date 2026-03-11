'use client';

import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';

export function LanguageToggle() {
    const { i18n } = useTranslation();
    const isEn = i18n.language.startsWith('en');

    const toggleLanguage = () => {
        i18n.changeLanguage(isEn ? 'fr' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="relative flex items-center justify-center p-2 md:p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-300 cursor-pointer"
            aria-label="Toggle language"
        >
            <AnimatePresence mode="wait" initial={false}>
                <m.span
                    key={isEn ? 'EN' : 'FR'}
                    initial={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute font-mono text-sm font-light select-none"
                >
                    {isEn ? 'EN' : 'FR'}
                </m.span>
            </AnimatePresence>
            {/* Invisible spacer to maintain button size */}
            <span className="font-mono text-sm font-light opacity-0 select-none">EN</span>
        </button>
    );
}
