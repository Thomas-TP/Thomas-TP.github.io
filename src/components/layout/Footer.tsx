'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Star } from 'lucide-react';
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';
import { TermsModal } from '@/components/modals/TermsModal';

interface GitHubStats {
    repos: number;
    stars: number;
}

function useGitHubStats() {
    const [stats, setStats] = useState<GitHubStats | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchStats() {
            try {
                const res = await fetch(
                    'https://api.github.com/users/Thomas-TP/repos?per_page=100&sort=updated',
                    { signal: controller.signal }
                );
                if (!res.ok) return;
                const repos: { stargazers_count: number; fork: boolean }[] = await res.json();
                const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
                setStats({ repos: repos.length, stars });
            } catch { /* network error or aborted */ }
        }
        fetchStats();
        return () => controller.abort();
    }, []);

    return stats;
}

export function Footer() {
    const { t } = useTranslation();
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const stats = useGitHubStats();

    return (
        <footer className="py-8 border-t border-border">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Thomas P. {t('footer.rights')}</p>

                {stats && (
                    <a
                        href="https://github.com/Thomas-TP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 text-xs hover:text-foreground transition-colors"
                    >
                        <span className="flex items-center gap-1.5">
                            <Github size={14} />
                            {stats.repos} repos
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Star size={14} />
                            {stats.stars} stars
                        </span>
                    </a>
                )}

                <div className="flex gap-6">
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
