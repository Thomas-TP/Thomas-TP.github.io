import { m, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/hooks/useScrollLock';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
    const { t } = useTranslation();
    useScrollLock(isOpen);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[500]"
                    />

                    {/* Modal — centered via flexbox (avoids transform conflict with Framer Motion) */}
                    <div className="fixed inset-0 z-[501] flex items-center justify-center p-4 sm:p-0 pointer-events-none">
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-lg pointer-events-auto"
                    >
                        <div data-scroll-lock-ignore className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                            {/* Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        {t('privacy_modal.title')}
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">{t('privacy_modal.last_updated')}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Fermer la politique de confidentialité"
                                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-sm text-foreground/80 leading-relaxed" style={{ overscrollBehavior: 'contain' }}>
                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Eye size={16} />
                                        {t('privacy_modal.section1_title')}
                                    </h3>
                                    <p>
                                        {t('privacy_modal.section1_text')}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Lock size={16} />
                                        {t('privacy_modal.section2_title')}
                                    </h3>
                                    <p>
                                        {t('privacy_modal.section2_text')}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2">
                                        {t('privacy_modal.section3_title')}
                                    </h3>
                                    <p>
                                        {t('privacy_modal.section3_text')}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-base font-semibold text-foreground mb-2">
                                        {t('privacy_modal.section4_title')}
                                    </h3>
                                    <p>
                                        {t('privacy_modal.section4_text')}
                                        {' '}
                                        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Cloudflare Privacy Policy</a>.
                                    </p>
                                </section>

                                <div className="p-4 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground">
                                    {t('privacy_modal.github_note')}
                                    {' '}
                                    <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GitHub Privacy Statement</a>.
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    {t('privacy_modal.close')}
                                </button>
                            </div>
                        </div>
                    </m.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

