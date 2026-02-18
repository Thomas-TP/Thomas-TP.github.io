import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Code, Mail, Github, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/language-toggle';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    external?: boolean;
}

function NavLink({ item, isActive, forceShowLabel }: { item: NavItem; isActive?: boolean; forceShowLabel?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const showLabel = isHovered || isActive || forceShowLabel;
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (item.external) return;

        e.preventDefault();

        if (location.pathname !== '/') {
            navigate('/' + item.href);
        } else {
            // Already on home, smooth scroll
            const targetId = item.href.replace('#', '');
            if (targetId) {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', item.href);
                } else if (item.href === "#" || targetId === "home") {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.history.pushState(null, '', '#');
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, '', '#');
            }
        }
    };

    return (
        <a
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex items-center justify-center p-2 md:p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/10 text-foreground shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] shadow-black/5' : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'}`}
            aria-label={item.label}
        >
            <AnimatePresence>
                {showLabel && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap font-medium text-sm mr-2 hidden md:block"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {item.label}
                        </motion.span>
                    </motion.span>
                )}
            </AnimatePresence>
            <item.icon size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
        </a>
    );
}

export function Navbar() {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState('home');
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const navItems: NavItem[] = [
        { id: 'home', label: t('navbar.home'), icon: Home, href: '#' },
        { id: 'about', label: t('navbar.about'), icon: User, href: '#about' },
        { id: 'projects', label: t('navbar.projects'), icon: Code, href: '#projects' },
        { id: 'contact', label: t('navbar.contact'), icon: Mail, href: '#contact' },
    ];

    const LinktreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
            <title>Linktree</title>
            <path d="M13.7366 5.86015L17.3824 2.22254C17.6977 1.90806 17.6977 1.40033 17.3824 1.08585C17.0671 0.771373 16.5579 0.771373 16.2426 1.08585L12.0003 5.31885L7.75801 1.08585C7.4427 0.771373 6.93348 0.771373 6.61816 1.08585C6.30283 1.40033 6.30283 1.90806 6.61816 2.22254L10.264 5.86015H2.42461C1.97935 5.86015 1.61816 6.22055 1.61816 6.66481C1.61816 7.10906 1.97935 7.46946 2.42461 7.46946H10.264L6.61816 11.1071C6.30283 11.4215 6.30283 11.9293 6.61816 12.2438C6.77551 12.4007 6.98204 12.4797 7.18809 12.4797C7.39414 12.4797 7.60067 12.4007 7.75801 12.2438L12.0003 8.01077L16.2426 12.2438C16.3999 12.4007 16.6065 12.4797 16.8125 12.4797C17.0186 12.4797 17.2251 12.4007 17.3824 12.2438C17.6977 11.9293 17.6977 11.4215 17.3824 11.1071L13.7366 7.46946H21.576C22.0212 7.46946 22.3824 7.10906 22.3824 6.66481C22.3824 6.22055 22.0212 5.86015 21.576 5.86015H13.7366ZM12.0003 13.903C11.555 13.903 11.1939 14.2634 11.1939 14.7077V22.9158C11.1939 23.3601 11.555 23.7205 12.0003 23.7205C12.4455 23.7205 12.8066 23.3601 12.8066 22.9158V14.7077C12.8066 14.2634 12.4455 13.903 12.0003 13.903Z" />
        </svg>
    );

    const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );

    const socialItems: NavItem[] = [
        { id: 'linkedin', label: t('navbar.linkedin'), icon: Linkedin, href: 'https://www.linkedin.com/in/thomas-tp', external: true },
        { id: 'github', label: t('navbar.github'), icon: Github, href: 'https://github.com/Thomas-TP', external: true },
        { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, href: 'https://wa.me/41763764551', external: true },
        { id: 'linktree', label: 'Linktree', icon: LinktreeIcon, href: 'https://linktr.ee/Thomas_IT', external: true },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Only run observer on home page
        if (location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, { threshold: 0, rootMargin: "-45% 0px -45% 0px" });
        sections.forEach(section => observer.observe(section));
        return () => sections.forEach(section => observer.unobserve(section));
    }, [location.pathname]);

    useEffect(() => {
        const footerInfo = document.querySelector('footer');
        if (!footerInfo) return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsFooterVisible(entry.isIntersecting);
        }, { threshold: 0, rootMargin: "100px" });
        observer.observe(footerInfo);
        return () => observer.disconnect();
    }, []);



    return (
        <>
            {/* TOP NAVBAR - CSS Transition for Performance */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/10 backdrop-blur-md transition-all duration-500 ease-in-out transform will-change-transform ${isScrolled ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'}`}
            >
                <div className="flex gap-1">
                    {navItems.map((item) => (
                        <NavLink key={item.id} item={item} isActive={activeSection === item.id} forceShowLabel={isDesktop} />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-1 hidden md:flex">
                        {socialItems.map((item) => (
                            <NavLink key={item.id} item={item} forceShowLabel={isDesktop} />
                        ))}
                    </div>
                    <div className="hidden md:block w-px h-8 bg-border/50 mx-2" />
                    <LanguageToggle />
                    <ModeToggle />
                </div>
            </header>

            {/* BOTTOM NAVBAR - CSS Transition for Performance */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 px-4 transition-all duration-500 ease-in-out transform will-change-transform ${(!isScrolled || isFooterVisible) ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-none'}`}
            >
                <nav className="glass rounded-full px-2 py-2 md:px-4 md:py-3 flex items-center gap-1 md:gap-2 shadow-2xl shadow-black/5 dark:shadow-black/20 border border-border/50 ring-1 ring-border/50 overflow-hidden pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {navItems.map((item) => (
                                <NavLink key={item.id} item={item} isActive={activeSection === item.id} />
                            ))}
                        </div>
                        <div className="hidden md:block w-px h-8 bg-border/50 mx-2" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex gap-1 hidden md:flex">
                            {socialItems.map((item) => (
                                <NavLink key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="hidden md:block w-px h-8 bg-border/50 mx-2" />
                        <LanguageToggle />
                        <ModeToggle />
                    </div>
                </nav>
            </div>
        </>
    );
}

