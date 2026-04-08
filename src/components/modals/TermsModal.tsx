import gsap from 'gsap';
import { X, FileText, Scale, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useEffect, useState, useRef } from 'react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    const { t } = useTranslation();
    useScrollLock(isOpen);

    const [shouldRender, setShouldRender] = useState(false);
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else if (shouldRender) {
            const tl = gsap.timeline({ onComplete: () => setShouldRender(false) });
            if (backdropRef.current) tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, 0);
            if (panelRef.current) tl.to(panelRef.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.2 }, 0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!shouldRender || !isOpen) return;
        const raf = requestAnimationFrame(() => {
            if (backdropRef.current) gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
            if (panelRef.current) gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        });
        return () => cancelAnimationFrame(raf);
    }, [shouldRender, isOpen]);

    return createPortal(
        shouldRender ? (
            <>
                {/* Backdrop */}
                <div
                    ref={backdropRef}
                    onClick={onClose}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[500]"
                    style={{ opacity: 0 }}
                />

                {/* Modal */}
                <div className="fixed inset-0 z-[501] flex items-center justify-center p-4 sm:p-0 pointer-events-none">
                <div
                    ref={panelRef}
                    className="w-full max-w-lg pointer-events-auto"
                    style={{ opacity: 0 }}
                >
                        <div data-scroll-lock-ignore className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                            {/* Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        {t('terms_modal.title')}
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">{t('terms_modal.last_updated')}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Fermer les conditions d'utilisation"
                                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-sm text-foreground/80 leading-relaxed" style={{ overscrollBehavior: 'contain' }}>
                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Scale size={16} />
                                        {t('terms_modal.section1_title')}
                                    </h3>
                                    <p>
                                        {t('terms_modal.section1_text')}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2">
                                        {t('terms_modal.section2_title')}
                                    </h3>
                                    <p>
                                        {t('terms_modal.section2_text')}
                                    </p>
                                    <p className="mt-2 text-muted-foreground text-xs italic">
                                        {t('terms_modal.section2_sub')}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {t('terms_modal.section3_title')}
                                    </h3>
                                    <p>
                                        {t('terms_modal.section3_text')}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2">
                                        {t('terms_modal.section4_title')}
                                    </h3>
                                    <p>
                                        {t('terms_modal.section4_text')}
                                    </p>
                                </section>

                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    {t('terms_modal.close')}
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </>
        ) : null,
        document.body
    );
}

