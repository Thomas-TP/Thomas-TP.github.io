import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageToggle() {
    const { i18n } = useTranslation();
    const isEn = i18n.language.startsWith('en');

    const toggleLanguage = () => {
        i18n.changeLanguage(isEn ? 'fr' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="relative flex items-center justify-center w-14 h-14 rounded-full hover:bg-foreground/5 transition-colors cursor-pointer group"
            aria-label="Toggle language"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isEn ? 'EN' : 'FR'}
                    initial={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute font-mono text-lg font-light text-muted-foreground group-hover:text-foreground transition-colors select-none"
                >
                    {isEn ? 'EN' : 'FR'}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
