import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal';
import { TermsModal } from '@/components/TermsModal';

export function Footer() {
    const { t } = useTranslation();
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    return (
        <footer className="py-8 border-t border-border">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Thomas P. {t('footer.rights')}</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <button
                        onClick={() => setIsPrivacyOpen(true)}
                        className="hover:text-foreground transition-colors cursor-pointer"
                    >
                        {t('footer.privacy')}
                    </button>
                    <button
                        onClick={() => setIsTermsOpen(true)}
                        className="hover:text-foreground transition-colors cursor-pointer"
                    >
                        {t('footer.terms')}
                    </button>
                </div>
            </div>

            <PrivacyPolicyModal
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
            />
            <TermsModal
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
            />
        </footer>
    );
}
