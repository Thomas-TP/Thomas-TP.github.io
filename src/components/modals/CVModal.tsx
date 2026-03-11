'use client';

import { m, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
// TextLayer & AnnotationLayer CSS intentionally omitted — layers are disabled for performance

interface CVModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
    const { t } = useTranslation();
    const cvPath = '/documents/ThomasPrudhommeCV.pdf';

    const [mounted, setMounted] = useState(false);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageWidth, setPageWidth] = useState(760);
    // Single-page navigator: renders only one page at a time for maximum perf
    const [currentPage, setCurrentPage] = useState(1);
    const contentRef = useRef<HTMLDivElement>(null);

    // Mount guard — portal requires document
    // Also set the PDF.js worker URL here (string — avoids webpack bundling pdfjs into initial chunk)
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        setMounted(true);
    }, []);

    // Reset to first page when modal opens
    useEffect(() => {
        if (isOpen) setCurrentPage(1);
    }, [isOpen]);

    // Measure content area width responsively
    useEffect(() => {
        if (!isOpen) return;
        const el = contentRef.current;
        if (!el) return;
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setPageWidth(Math.max(300, entry.contentRect.width - 32));
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [isOpen]);

    // Scroll lock + scrollbar width compensation
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    // ESC to close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    }, []);

    const prevPage = useCallback(() => setCurrentPage(p => Math.max(1, p - 1)), []);
    const nextPage = useCallback(() => setCurrentPage(p => Math.min(numPages, p + 1)), [numPages]);

    // Don't render server-side — portal requires document.body
    if (!mounted) return null;

    const modal = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop — portaled to body, above everything */}
                    {/* No backdrop-blur — too expensive on GPU, replaced with solid overlay */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/85 z-[900]"
                    />

                    {/* Panel */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 24 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed left-1/2 top-1/2 z-[901] w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2"
                        style={{ height: '90vh' }}
                    >
                        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="text-xs font-bold text-foreground">CV</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Thomas Prudhomme</p>
                                        <p className="text-xs text-muted-foreground">{t('cv.subtitle', 'Curriculum Vitæ')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <m.button
                                        onClick={() => window.open(cvPath)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={t('cv.print', 'Imprimer le CV')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <Printer size={15} />
                                        <span className="hidden sm:inline">{t('cv.print', 'Imprimer')}</span>
                                    </m.button>

                                    <m.a
                                        href={cvPath}
                                        download="ThomasPrudhommeCV.pdf"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={t('cv.download', 'Télécharger le CV')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                                    >
                                        <Download size={15} />
                                        <span className="hidden sm:inline">{t('cv.download', 'Télécharger')}</span>
                                    </m.a>

                                    <m.button
                                        onClick={onClose}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-1 cursor-pointer"
                                        aria-label="Fermer"
                                    >
                                        <X size={16} />
                                    </m.button>
                                </div>
                            </div>

                            {/* PDF viewer — single page at a time for performance */}
                            {/* data-lenis-prevent: stops Lenis from hijacking wheel events */}
                            <div
                                ref={contentRef}
                                data-lenis-prevent
                                className="flex-1 overflow-y-auto min-h-0 custom-scrollbar bg-muted/30"
                            >
                                <div className="flex flex-col items-center py-6 px-4">
                                    <Document
                                        file={cvPath}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={
                                            <div className="flex items-center justify-center h-96 text-muted-foreground">
                                                <span className="text-sm">Chargement du CV…</span>
                                            </div>
                                        }
                                        error={
                                            <div className="flex items-center justify-center h-96 text-muted-foreground">
                                                <span className="text-sm text-destructive">Impossible de charger le CV.</span>
                                            </div>
                                        }
                                    >
                                        {/* Render ONLY the current page — avoids rendering 500+ DOM nodes per page */}
                                        <div className="shadow-xl rounded overflow-hidden">
                                            <Page
                                                pageNumber={currentPage}
                                                width={pageWidth}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                            />
                                        </div>
                                    </Document>
                                </div>
                            </div>

                            {/* Page navigator */}
                            {numPages > 1 && (
                                <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-border shrink-0">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage <= 1}
                                        aria-label="Page précédente"
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {currentPage} / {numPages}
                                    </span>
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage >= numPages}
                                        aria-label="Page suivante"
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modal, document.body);
}
