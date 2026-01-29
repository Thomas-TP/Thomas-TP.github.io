import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Contact() {
    const { t } = useTranslation();

    return (
        <section id="contact" className="py-32 container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-border to-transparent p-1 rounded-3xl"
                >
                    <div className="bg-card/80 backdrop-blur-xl rounded-[22px] p-12 md:p-20 border border-border">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">{t('contact.title')}</h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                            {t('contact.desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <a
                                href="mailto:thomas@prudhomme.li"
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity text-lg"
                            >
                                <Mail size={20} />
                                {t('contact.say_hello')}
                            </a>
                            <a
                                href="https://www.linkedin.com/in/thomas-tp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-8 py-4 rounded-full border border-border hover:bg-muted/50 transition-colors text-foreground font-medium text-lg"
                            >
                                <Linkedin size={20} />
                                LinkedIn
                            </a>
                        </div>

                        <div className="flex justify-center gap-8 text-muted-foreground items-center">
                            <a href="https://www.linkedin.com/in/thomas-tp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn Profile">
                                <Linkedin size={24} />
                            </a>
                            <a href="https://github.com/Thomas-TP" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="GitHub Profile">
                                <Github size={24} />
                            </a>
                            <a href="https://wa.me/41763764551" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="WhatsApp Contact">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a href="https://linktr.ee/Thomas_IT" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-muted-foreground" aria-label="Linktree Profile">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
                                    <title>Linktree</title>
                                    <path d="M13.7366 5.86015L17.3824 2.22254C17.6977 1.90806 17.6977 1.40033 17.3824 1.08585C17.0671 0.771373 16.5579 0.771373 16.2426 1.08585L12.0003 5.31885L7.75801 1.08585C7.4427 0.771373 6.93348 0.771373 6.61816 1.08585C6.30283 1.40033 6.30283 1.90806 6.61816 2.22254L10.264 5.86015H2.42461C1.97935 5.86015 1.61816 6.22055 1.61816 6.66481C1.61816 7.10906 1.97935 7.46946 2.42461 7.46946H10.264L6.61816 11.1071C6.30283 11.4215 6.30283 11.9293 6.61816 12.2438C6.77551 12.4007 6.98204 12.4797 7.18809 12.4797C7.39414 12.4797 7.60067 12.4007 7.75801 12.2438L12.0003 8.01077L16.2426 12.2438C16.3999 12.4007 16.6065 12.4797 16.8125 12.4797C17.0186 12.4797 17.2251 12.4007 17.3824 12.2438C17.6977 11.9293 17.6977 11.4215 17.3824 11.1071L13.7366 7.46946H21.576C22.0212 7.46946 22.3824 7.10906 22.3824 6.66481C22.3824 6.22055 22.0212 5.86015 21.576 5.86015H13.7366ZM12.0003 13.903C11.555 13.903 11.1939 14.2634 11.1939 14.7077V22.9158C11.1939 23.3601 11.555 23.7205 12.0003 23.7205C12.4455 23.7205 12.8066 23.3601 12.8066 22.9158V14.7077C12.8066 14.2634 12.4455 13.903 12.0003 13.903Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
