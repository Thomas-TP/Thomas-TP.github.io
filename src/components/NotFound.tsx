import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlitchText } from '@/components/glitch-text';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-20 text-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                {/* 404 Glitch Effect */}
                <div className="relative">
                    <h1 className="text-[10rem] md:text-[15rem] font-bold font-mono tracking-tighter leading-none opacity-5 select-none text-foreground">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <GlitchText
                            text="404"
                            className="text-[6rem] md:text-[10rem] font-bold font-mono tracking-tighter text-foreground"
                        />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-6 mt-8"
                >


                    <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                        {t('notfound.title')}
                    </h2>

                    <p className="text-muted-foreground max-w-md mx-auto text-lg">
                        {t('notfound.desc')}
                    </p>

                    <Link
                        to="/"
                        className="group flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 font-medium mt-4"
                    >
                        <Home size={18} />
                        <span>{t('notfound.home')}</span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        </div>
    );
}
