'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import ePub, { Book, Rendition } from 'epubjs';
import { useAuth } from './AuthProvider';
import Image from 'next/image';

interface EpubReaderProps {
    bookUrl: string;
    bookTitle: string;
    bookId?: string;
    onClose?: () => void;
}

const EPUB_THEME_COLORS = {
    sepia: { bg: '#F5E6D3', text: '#5C4033' },
    dark: { bg: '#0D0D12', text: '#F8F6FF' },
    white: { bg: '#FFFFFF', text: '#2C2C2C' }
} as const;

export default function EpubReader({ bookUrl, bookTitle, bookId, onClose }: EpubReaderProps) {
    const { user } = useAuth();
    const viewerRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [rendition, setRendition] = useState<Rendition | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [location, setLocation] = useState<string | number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [progress, setProgress] = useState(0);
    const [theme, setTheme] = useState<'sepia' | 'dark' | 'white'>('sepia');
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('Georgia');
    const [showFontSettings, setShowFontSettings] = useState(false);
    const [showTOC, setShowTOC] = useState(false);
    const [toc, setToc] = useState<any[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollMode, setScrollMode] = useState(true);
    const [isPullingRefresh, setIsPullingRefresh] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [annotations, setAnnotations] = useState<any[]>([]);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [selectedText, setSelectedText] = useState<string>('');
    const [selectionCoords, setSelectionCoords] = useState<{ x: number, y: number } | null>(null);
    const [showAnnotationsList, setShowAnnotationsList] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const toolbarTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [lastReadLocation, setLastReadLocation] = useState<string | null>(null);
    const [lastReadProgress, setLastReadProgress] = useState(0);
    const justSelectedRef = useRef(false);

    // Save progress to database
    const saveProgressToDatabase = useCallback(async (locationCfi: string, percentage: number) => {
        if (!user || !bookId) return;

        try {
            // Save to localStorage
            const storageKey = `reading-progress-${user.uid}-${bookId}`;
            localStorage.setItem(storageKey, JSON.stringify({
                location: locationCfi,
                progress: percentage,
                timestamp: Date.now()
            }));

            // Sync to Prisma Database
            const token = await user.getIdToken();
            await fetch('/api/reading-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ebookId: bookId,
                    currentLocation: locationCfi,
                    progress: percentage,
                }),
            });

            console.log('Progress synced to DB:', percentage + '%');
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }, [user, bookId]);

    // Load progress from database (and localStorage)
    const loadProgressFromDatabase = useCallback(async () => {
        if (!user || !bookId) return null;

        try {
            // Check localStorage first (fastest and most up to date for this session)
            const storageKey = `reading-progress-${user.uid}-${bookId}`;
            const localData = localStorage.getItem(storageKey);

            if (localData) {
                const parsed = JSON.parse(localData);
                return {
                    currentLocation: parsed.location,
                    progress: parsed.progress
                };
            }

            // Then try API if needed (fallback)
            const token = await user.getIdToken();

            const response = await fetch(`/api/reading-progress?ebookId=${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }

        return null;
    }, [user, bookId]);

    const handleAnnotate = useCallback(async (type: 'highlight' | 'bold') => {
        if (!user || !bookId || !selectedRange || !selectedText) return;

        try {
            const token = await user.getIdToken();
            const response = await fetch(`/api/ebooks/${bookId}/annotations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    cfiRange: selectedRange,
                    text: selectedText,
                    type: type,
                    color: type === 'highlight' ? '#FFD700' : undefined
                }),
            });

            if (response.ok) {
                const newAnnotation = await response.json();
                setAnnotations(prev => [newAnnotation, ...prev]);

                // Add to rendition
                if (rendition) {
                    if (type === 'highlight') {
                        rendition.annotations.add('highlight', selectedRange, {}, undefined, 'highlight-marker', { fill: '#FFD700', 'fill-opacity': '0.3' });
                    } else {
                        rendition.annotations.add('mark', selectedRange, {}, undefined, 'bold-marker');
                    }
                }

                // Clear selection
                setSelectedRange(null);
                setSelectionCoords(null);
                if (window.getSelection) {
                    window.getSelection()?.removeAllRanges();
                }
                // Clear selection inside epub iframe contents
                // @ts-ignore
                if (rendition?.getContents) {
                    // @ts-ignore
                    rendition.getContents().forEach((content: any) => {
                        content.window?.getSelection?.()?.removeAllRanges();
                    });
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Create annotation failed:', errorData);
            }
        } catch (error) {
            console.error('Error creating annotation:', error);
        }
    }, [user, bookId, selectedRange, selectedText, rendition]);

    const fetchAnnotations = useCallback(async () => {
        if (!user || !bookId || !rendition) return;

        try {
            const token = await user.getIdToken();
            const response = await fetch(`/api/ebooks/${bookId}/annotations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);

                // Apply all annotations to rendition
                data.forEach((ann: any) => {
                    if (ann.type === 'highlight') {
                        rendition.annotations.add('highlight', ann.cfiRange, {}, undefined, 'highlight-marker', { fill: '#FFD700', 'fill-opacity': '0.3' });
                    } else {
                        rendition.annotations.add('mark', ann.cfiRange, {}, undefined, 'bold-marker');
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching annotations:', error);
        }
    }, [user, bookId, rendition]);

    const deleteAnnotation = useCallback(async (id: string, cfiRange: string, type: string) => {
        if (!user || !bookId) return;

        try {
            const token = await user.getIdToken();
            const response = await fetch(`/api/ebooks/${bookId}/annotations?annotationId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setAnnotations(prev => prev.filter(ann => ann.id !== id));
                if (rendition) {
                    rendition.annotations.remove(cfiRange, type === 'highlight' ? 'highlight' : 'mark');
                }
            }
        } catch (error) {
            console.error('Error deleting annotation:', error);
        }
    }, [user, bookId, rendition]);

    useEffect(() => {
        if (!bookId) return;
        try {
            const stored = localStorage.getItem(`bookmarks-${bookId}`);
            if (stored) setBookmarks(JSON.parse(stored));
        } catch (e) { }
    }, [bookId]);

    useEffect(() => {
        if (!showBookmarks || !bookId) return;
        try {
            const stored = localStorage.getItem(`bookmarks-${bookId}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setBookmarks(parsed);
                }
            }
        } catch (error) {
            console.error('Error reloading bookmarks:', error);
        }
    }, [showBookmarks, bookId]);

    const toggleBookmark = useCallback(() => {
        if (!location || !bookId) return;
        const locStr = location.toString();

        let newBookmarks;
        if (bookmarks.some(b => b.cfi === locStr)) {
            newBookmarks = bookmarks.filter(b => b.cfi !== locStr);
        } else {
            newBookmarks = [...bookmarks, { cfi: locStr, progress, timestamp: Date.now(), title: `Page ${currentPage}` }];
        }

        setBookmarks(newBookmarks);
        localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(newBookmarks));
    }, [location, bookId, bookmarks, progress, currentPage]);

    const isBookmarked = location ? bookmarks.some(b => b.cfi === location.toString()) : false;

    const anyPanelOpen = showFontSettings || showTOC || showBookmarks || showAnnotationsList;

    const resetToolbarTimer = useCallback(() => {
        if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
        setShowToolbar(true);
        if (!(showFontSettings || showTOC || showBookmarks || showAnnotationsList)) {
            toolbarTimerRef.current = setTimeout(() => setShowToolbar(false), 4000);
        }
    }, [showFontSettings, showTOC, showBookmarks, showAnnotationsList]);

    const applyReaderStyles = useCallback((targetRendition: Rendition) => {
        const colors = EPUB_THEME_COLORS[theme];

        targetRendition.themes.select(theme);
        targetRendition.themes.fontSize(`${fontSize}px`);
        targetRendition.themes.font(fontFamily);

        targetRendition.themes.override('color', colors.text);
        targetRendition.themes.override('background', colors.bg);
        targetRendition.themes.override('background-color', colors.bg);
        targetRendition.themes.override('font-size', `${fontSize}px`);
        targetRendition.themes.override('font-family', `"${fontFamily}", serif`);

        const applyToContents = (contents: any) => {
            const doc = contents?.document;
            if (!doc) return;

            doc.documentElement?.style.setProperty('background-color', colors.bg, 'important');
            doc.documentElement?.style.setProperty('color', colors.text, 'important');

            doc.body?.style.setProperty('background-color', colors.bg, 'important');
            doc.body?.style.setProperty('color', colors.text, 'important');
            doc.body?.style.setProperty('font-size', `${fontSize}px`, 'important');
            doc.body?.style.setProperty('font-family', `"${fontFamily}", serif`, 'important');
            doc.body?.style.setProperty('line-height', '1.75', 'important');

            const existingStyle = doc.getElementById('dynamic-book-styles') as HTMLStyleElement | null;
            const styleElement = existingStyle ?? doc.createElement('style');
            if (!existingStyle) {
                styleElement.id = 'dynamic-book-styles';
                doc.head.appendChild(styleElement);
            }

            styleElement.textContent = `
                html, body {
                    background: ${colors.bg} !important;
                    background-color: ${colors.bg} !important;
                    color: ${colors.text} !important;
                    -webkit-text-fill-color: ${colors.text} !important;
                    font-family: "${fontFamily}", serif !important;
                    font-size: ${fontSize}px !important;
                    line-height: 1.75 !important;
                    opacity: 1 !important;
                }
                body * {
                    color: ${colors.text} !important;
                    -webkit-text-fill-color: ${colors.text} !important;
                    font-family: inherit !important;
                    opacity: 1 !important;
                }
                a {
                    color: ${colors.text} !important;
                    -webkit-text-fill-color: ${colors.text} !important;
                }
                .bold-marker,
                .bold-marker * {
                    font-weight: 700 !important;
                    font-style: normal !important;
                    text-decoration: none !important;
                    color: ${colors.text} !important;
                    -webkit-text-fill-color: ${colors.text} !important;
                }
            `;
        };

        // @ts-ignore
        if (targetRendition.getContents) {
            // @ts-ignore
            targetRendition.getContents().forEach(applyToContents);
        }
    }, [theme, fontSize, fontFamily]);

    // Toolbar auto-hide timer
    useEffect(() => {
        if (anyPanelOpen) {
            if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
            setShowToolbar(true);
            return;
        }
        // Start timer when all panels closed
        resetToolbarTimer();

        return () => {
            if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
        };
    }, [anyPanelOpen, resetToolbarTimer]);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768 || ('ontouchstart' in window);
            setIsMobile(mobile);
            setScrollMode(true); // Always scroll mode
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize book
    useEffect(() => {
        if (!bookUrl || !viewerRef.current) return;

        try {
            const newBook = ePub(bookUrl);
            setBook(newBook);

            // Use scrolled flow for mobile/scroll mode which supports continuous scrolling better
            const flow = scrollMode ? 'scrolled' : 'paginated';

            const newRendition = newBook.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none',
                flow: flow,
                manager: scrollMode ? 'continuous' : 'default',
                allowScriptedContent: true
            });

            // Register themes with !important to override epub styles
            Object.entries(EPUB_THEME_COLORS).forEach(([t, colors]) => {
                newRendition.themes.register(t, {
                    body: { background: `${colors.bg} !important`, color: `${colors.text} !important` },
                    'p, span, div, h1, h2, h3, h4, h5, h6, li, a': { color: `${colors.text} !important`, background: 'transparent !important' }
                });
            });

            setRendition(newRendition);
            applyReaderStyles(newRendition);

            // Load saved position from database
            loadProgressFromDatabase().then((savedProgress) => {
                if (savedProgress?.currentLocation) {
                    setLastReadLocation(savedProgress.currentLocation);
                    setLastReadProgress(savedProgress.progress || 0);
                    newRendition.display(savedProgress.currentLocation).then(() => {
                        applyReaderStyles(newRendition);
                    });
                } else {
                    newRendition.display().then(() => {
                        applyReaderStyles(newRendition);
                    });
                }
            });

            // Load table of contents
            newBook.loaded.navigation.then((nav: any) => {
                setToc(nav.toc || []);
            });

            // Track location changes
            newRendition.on('relocated', (loc: any) => {
                setLocation(loc.start.cfi);
                // @ts-ignore
                const current = newBook.locations?.locationFromCfi(loc.start.cfi) as number;
                // @ts-ignore  
                const total = newBook.locations?.total as number;
                if (current && total) {
                    setCurrentPage(current);
                    setTotalPages(total);
                    const currentProgress = Math.round((current / total) * 100);
                    setProgress(currentProgress);

                    setLastReadProgress((prev) => {
                        if (currentProgress >= prev) {
                            setLastReadLocation(loc.start.cfi);
                            return currentProgress;
                        }
                        return prev;
                    });
                }
            });

            newRendition.on('rendered', () => {
                setIsReady(true);
                applyReaderStyles(newRendition);
            });

            // Handle selection for annotations
            newRendition.on('selected', (cfiRange: string, contents: any) => {
                const range = contents.range(cfiRange);
                const rect = range.getBoundingClientRect();
                const text = range.toString();

                if (text && text.length > 0) {
                    const iframeRect = viewerRef.current?.querySelector('iframe')?.getBoundingClientRect();

                    setSelectedRange(cfiRange);
                    setSelectedText(text);
                    setSelectionCoords({
                        x: (iframeRect?.left || 0) + rect.left + rect.width / 2,
                        y: (iframeRect?.top || 0) + rect.top
                    });
                    justSelectedRef.current = true;
                    setTimeout(() => {
                        justSelectedRef.current = false;
                    }, 250);
                }
            });

            // Close selection popup when clicking elsewhere
            newRendition.on('click', () => {
                if (justSelectedRef.current) return;
                setSelectedRange(null);
                setSelectionCoords(null);
            });

            // Generate locations for pagination
            newBook.ready.then(() => {
                // @ts-ignore
                return newBook.locations.generate(1600);
            });

            setIsReady(true);

        } catch (error) {
            console.error('Error initializing EPUB reader:', error);
        }

        return () => {
            if (saveTimerRef.current) {
                clearInterval(saveTimerRef.current);
            }
            if (rendition) {
                rendition.destroy();
            }
            if (book) {
                book.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookUrl, scrollMode]);

    // Fetch annotations when rendition is ready
    useEffect(() => {
        if (rendition && isReady) {
            fetchAnnotations();
        }
    }, [rendition, isReady, fetchAnnotations]);

    // Sync theme, font size, and font family to rendition when they change
    useEffect(() => {
        if (!rendition) return;

        const handleRendered = () => {
            applyReaderStyles(rendition);
        };

        applyReaderStyles(rendition);
        rendition.on('rendered', handleRendered);

        return () => {
            rendition.off('rendered', handleRendered);
        };
    }, [rendition, applyReaderStyles]);

    // Auto-save last read (furthest progress) every 3 seconds
    useEffect(() => {
        if (!lastReadLocation || !bookUrl) return;

        if (saveTimerRef.current) {
            clearInterval(saveTimerRef.current);
        }

        saveTimerRef.current = setInterval(() => {
            if (lastReadLocation && bookId) {
                // Save to database
                saveProgressToDatabase(lastReadLocation, lastReadProgress);
            }
        }, 3000);

        return () => {
            if (saveTimerRef.current) {
                clearInterval(saveTimerRef.current);
            }
        };
    }, [lastReadLocation, bookUrl, bookId, lastReadProgress, saveProgressToDatabase]);



    const prevPage = useCallback(() => {
        if (rendition && !scrollMode) {
            rendition.prev();
        }
    }, [rendition, scrollMode]);

    const nextPage = useCallback(() => {
        if (rendition && !scrollMode) {
            rendition.next();
        }
    }, [rendition, scrollMode]);

    const navigateToLocation = useCallback(async (target: string, closePanel?: () => void) => {
        if (!rendition) return;

        try {
            closePanel?.();
            await rendition.display(target);

            if (scrollMode) {
                // @ts-ignore
                const range = rendition.getRange?.(target);
                const container = range?.startContainer;
                const element = container instanceof Element ? container : container?.parentElement;

                if (element && typeof element.scrollIntoView === 'function') {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } catch (error) {
            console.error('Error navigating to location:', error);
        }
    }, [rendition, scrollMode]);

    const handleTOCItemClick = (href: string) => {
        void navigateToLocation(href, () => setShowTOC(false));
    };

    // Handle click on reading area - toggle toolbar + page navigation (desktop paginated)
    const handleViewerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // Always reset toolbar timer on click/tap
        resetToolbarTimer();

        if (scrollMode || !viewerRef.current || !rendition) return;

        const rect = viewerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const viewerWidth = rect.width;

        // Click on left third - go to previous page
        if (clickX < viewerWidth * 0.33) {
            prevPage();
        }
        // Click on right third - go to next page
        else if (clickX > viewerWidth * 0.67) {
            nextPage();
        }
    }, [rendition, prevPage, nextPage, scrollMode, resetToolbarTimer]);

    // Scroll navigation for wheel
    const handleWheel = useCallback((e: WheelEvent) => {
        if (scrollMode || !rendition) return;

        e.preventDefault();

        if (e.deltaY > 50) {
            nextPage();
        } else if (e.deltaY < -50) {
            prevPage();
        }
    }, [rendition, prevPage, nextPage, scrollMode]);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || scrollMode) return;

        viewer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            viewer.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel, scrollMode]);

    // Touch/Swipe handling for mobile
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (!isMobile) return;
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }, [isMobile]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isMobile || !touchStartRef.current) return;

        const touch = e.touches[0];
        const deltaY = touch.clientY - touchStartRef.current.y;

        // Pull to refresh
        if (deltaY > 0 && window.scrollY === 0) {
            setPullDistance(Math.min(deltaY, 100));
            if (deltaY > 80) {
                setIsPullingRefresh(true);
            }
        }
    }, [isMobile]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!isMobile || !touchStartRef.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        // Horizontal swipe for chapter navigation
        if (Math.abs(deltaX) > 100 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                prevPage(); // Swipe right = previous
            } else {
                nextPage(); // Swipe left = next
            }
        }

        // Handle pull to refresh
        if (isPullingRefresh) {
            window.location.reload();
        }

        touchStartRef.current = null;
        setPullDistance(0);
        setIsPullingRefresh(false);
    }, [isMobile, prevPage, nextPage, isPullingRefresh]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (scrollMode) return;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage();
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevPage, nextPage, scrollMode]);

    const toggleScrollMode = () => {
        if (!isMobile) {
            setScrollMode(!scrollMode);
        }
    };

    const fontSizes = [12, 15, 16, 18];
    const fontFamilies = ['Georgia', 'Arial', 'Times New Roman', 'Verdana'];
    const pagesRemaining = Math.max(0, totalPages - currentPage);
    const showLastReadButton = !!lastReadLocation && (lastReadProgress - progress >= 2);

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${theme === 'sepia' ? 'bg-[#F5E6D3]' : theme === 'dark' ? 'bg-[#0D0D12]' : 'bg-white'
            }`}>

            {/* Bottom Progress Bar removed here - will add to Footer */}

            {/* Desktop hover zone for toolbar — active only when toolbar is hidden */}
            <div
                className="fixed top-0 left-0 right-0 h-20 z-[55] hidden md:block"
                onMouseEnter={resetToolbarTimer}
            />

            <header
                onMouseEnter={resetToolbarTimer}
                className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-3 md:px-6 py-3 md:py-4 transition-all duration-500 ease-in-out ${showToolbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} ${theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8] text-[#5C4033]' :
                theme === 'dark' ? 'bg-[rgba(19,19,26,0.95)] border-[var(--border)] text-[var(--text-primary)] backdrop-blur-md' :
                    'bg-[rgba(255,255,255,0.98)] border-[#E5E7EB] text-[#1F2937] backdrop-blur-md'
                } border-b shadow-sm`}>
                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                    <button
                        onClick={onClose}
                        className="p-1.5 md:p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h1 className="font-semibold text-sm md:text-lg truncate max-w-[36vw] md:max-w-md">{bookTitle}</h1>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    {/* Toggle Scroll/Page Mode Removed */}

                    {/* Table of Contents Button */}
                    <button
                        onClick={() => { setShowTOC(!showTOC); setShowBookmarks(false); setShowFontSettings(false); setShowAnnotationsList(false); }}
                        className={`p-1.5 md:p-2 rounded-xl transition-colors ${showTOC ? 'text-[var(--accent)] bg-[var(--accent-glow)]' : 'hover:bg-black hover:bg-opacity-10'}`}
                        title="Chapter Navigation"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Bookmarks Toggle (Add/Remove) */}
                    <button
                        onClick={toggleBookmark}
                        className={`p-1.5 md:p-2 rounded-xl transition-all ${isBookmarked ? 'text-[var(--accent)] bg-[var(--accent-glow)]' : 'hover:bg-black hover:bg-opacity-10'}`}
                        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>

                    {/* Bookmarks List Panel Toggle */}
                    <button
                        onClick={() => { setShowBookmarks(!showBookmarks); setShowTOC(false); setShowFontSettings(false); setShowAnnotationsList(false); }}
                        className={`p-1.5 md:p-2 rounded-xl transition-colors ${showBookmarks ? 'text-[var(--accent)] bg-[var(--accent-glow)]' : 'hover:bg-black hover:bg-opacity-10'}`}
                        title="Bookmarks List"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </button>

                    {/* Font Settings Button */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowFontSettings(!showFontSettings); setShowTOC(false); setShowBookmarks(false); setShowAnnotationsList(false); }}
                            className={`p-1.5 md:p-2 rounded-xl transition-all ${showFontSettings ? 'text-[var(--accent)] bg-[rgba(0,0,0,0.05)] scale-105' : 'hover:bg-[rgba(0,0,0,0.05)]'}`}
                            title="Font Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {/* Font Settings Dropdown */}
                        {showFontSettings && (
                            <div className={`absolute top-full mt-3 md:mt-4 right-0 left-auto translate-x-0 w-[min(20rem,calc(100vw-1rem))] md:max-w-72 rounded-2xl shadow-xl border z-[100] animate-fade-in-down ${theme === 'sepia'
                                ? 'bg-[#F5E6D3] border-[#D4C4A8] text-[#5C4033] shadow-[#D4C4A8]/20'
                                : theme === 'dark'
                                    ? 'bg-[#13131A] border-[rgba(255,255,255,0.07)] text-[#F0EEF6]'
                                    : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#1F2937]'
                                }`}>
                                <div className="p-5 space-y-6">
                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-wider font-bold mb-3 opacity-70">Font Size</label>
                                        <div className={`flex gap-2 p-1 rounded-xl ${theme === 'sepia'
                                            ? 'bg-[#EDD9C0]'
                                            : theme === 'dark'
                                                ? 'bg-[rgba(255,255,255,0.05)]'
                                                : 'bg-[rgba(0,0,0,0.05)]'
                                            }`}>
                                            {fontSizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setFontSize(size)}
                                                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${fontSize === size
                                                        ? 'bg-[var(--accent)] text-white shadow-md scale-100'
                                                        : `opacity-70 hover:opacity-100 scale-95 transition-colors ${theme === 'sepia' ? 'hover:bg-[#E4CEAF]' : theme === 'dark' ? 'hover:bg-[rgba(255,255,255,0.05)]' : 'hover:bg-[rgba(0,0,0,0.05)]'}`
                                                        }`}
                                                >
                                                    {size === 18 ? 'M' : size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font Family */}
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-wider font-bold mb-3 opacity-70">Font Family</label>
                                        <select
                                            value={fontFamily}
                                            onChange={(e) => setFontFamily(e.target.value)}
                                            className={`w-full p-2.5 rounded-xl border appearance-none font-medium cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-[var(--accent)] ${theme === 'sepia'
                                                ? 'bg-[#EDD9C0] border-[#D4C4A8] text-[#5C4033]'
                                                : theme === 'dark'
                                                    ? 'bg-[#1E1E28] border-[rgba(255,255,255,0.07)] text-[#F0EEF6]'
                                                    : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#1F2937]'
                                                }`}
                                        >
                                            {fontFamilies.map((font) => (
                                                <option key={font} value={font} className="font-medium">{font}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Theme */}
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-wider font-bold mb-3 opacity-70">Theme</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => setTheme('sepia')}
                                                className={`min-w-0 py-2 rounded-xl font-bold text-xs md:text-sm transition-all border ${theme === 'sepia'
                                                    ? 'bg-[#F5E6D3] border-[var(--accent)] text-[#5C4033] shadow-inner ring-1 ring-[var(--accent)]'
                                                    : 'bg-[#F5E6D3] border-[#D4C4A8] text-[#5C4033] opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                Sepia
                                            </button>
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={`min-w-0 py-2 rounded-xl font-bold text-xs md:text-sm transition-all border ${theme === 'dark'
                                                    ? 'bg-[#13131A] border-[var(--accent)] text-[var(--accent)] shadow-inner ring-1 ring-[var(--accent)]'
                                                    : 'bg-[#13131A] border-[rgba(255,255,255,0.07)] text-[#F0EEF6] opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                onClick={() => setTheme('white')}
                                                className={`min-w-0 py-2 rounded-xl font-bold text-xs md:text-sm transition-all border ${theme === 'white'
                                                    ? 'bg-[#FFFFFF] border-[var(--accent)] text-[var(--accent)] shadow-inner ring-1 ring-[var(--accent)]'
                                                    : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#1F2937] opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                White
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Annotations List Toggle */}
                    <button
                        onClick={() => { setShowAnnotationsList(!showAnnotationsList); setShowTOC(false); setShowFontSettings(false); setShowBookmarks(false); }}
                        className={`p-1.5 md:p-2 rounded-xl transition-colors ${showAnnotationsList ? 'text-[var(--accent)] bg-[var(--accent-glow)]' : 'hover:bg-black hover:bg-opacity-10'}`}
                        title="Highlights & Marks"
                    >
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter">MARK</span>
                    </button>
                </div>
            </header>

            {/* Reader Area */}
            <div className="flex-1 relative overflow-hidden">
                {/* Right Edge Bookmark Indicator */}
                <div className={`absolute right-0 top-20 w-1.5 h-12 rounded-l-full z-30 transition-all duration-300 pointer-events-none ${isBookmarked ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`} style={{ backgroundColor: 'var(--accent)' }} />

                {/* Pull to Refresh Indicator */}
                {isMobile && pullDistance > 0 && (
                    <div
                        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center transition-all"
                        style={{ height: `${pullDistance}px` }}
                    >
                        <div className={`text-sm font-medium ${isPullingRefresh ? 'animate-pulse' : ''}`}>
                            {isPullingRefresh ? '🔄 Release to refresh...' : '↓ Pull to refresh'}
                        </div>
                    </div>
                )}

                {/* Loading Indicator */}
                {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className={`animate-spin h-10 w-10 border-4 rounded-full ${theme === 'sepia' ? 'border-[#D4C4A8] border-t-[#8B6F47]' :
                            theme === 'dark' ? 'border-[#1A1A24] border-t-[#F43F5E]' :
                                'border-gray-200 border-t-[#F43F5E]'
                            }`} />
                    </div>
                )}

                {/* Chapter Navigation Panel (Slide-in) */}
                <div className={`absolute left-0 top-0 bottom-0 w-[88vw] max-w-80 shadow-2xl border-r z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${showTOC ? 'translate-x-0' : '-translate-x-full'} ${theme === 'sepia' ? 'bg-[#F5E6D3] border-[#D4C4A8] text-[#5C4033]' : theme === 'dark' ? 'bg-[rgba(19,19,26,0.95)] border-[var(--border)] text-[var(--text-primary)] backdrop-blur-md' : 'bg-[rgba(255,255,255,0.98)] border-[#E5E7EB] text-[#1F2937] backdrop-blur-md'}`}>
                    <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: theme === 'white' ? '#E5E7EB' : 'var(--border)' }}>
                        <h2 className="font-bold text-lg font-display">Chapters</h2>
                        <button onClick={() => setShowTOC(false)} className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {toc.map((item, index) => {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleTOCItemClick(item.href)}
                                    className="w-full text-left p-3 rounded-xl transition-all font-medium text-sm hover:bg-black hover:bg-opacity-5"
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bookmarks List Sidebar (Slide-in) */}
                <div className={`absolute left-0 top-0 bottom-0 w-[88vw] max-w-80 shadow-2xl border-r z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${showBookmarks ? 'translate-x-0' : '-translate-x-full'} ${theme === 'sepia' ? 'bg-[#F5E6D3] border-[#D4C4A8] text-[#5C4033]' : theme === 'dark' ? 'bg-[rgba(19,19,26,0.95)] border-[rgba(255,255,255,0.08)] text-[#F0EEF6] backdrop-blur-md' : 'bg-[rgba(255,255,255,0.98)] border-[#E5E7EB] text-[#1F2937] backdrop-blur-md'}`}>
                    <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: theme === 'white' ? '#E5E7EB' : 'var(--border)' }}>
                        <h2 className="font-bold text-lg font-display">Bookmarks</h2>
                        <button onClick={() => setShowBookmarks(false)} className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {bookmarks.length === 0 ? (
                            <p className={`text-sm text-center py-8 ${theme === 'dark' ? 'text-[#D3CFE0] opacity-80' : 'opacity-60'}`}>No bookmarks yet.</p>
                        ) : (
                            [...bookmarks].sort((a, b) => a.progress - b.progress).map((b, i) => (
                                <div key={i} className={`p-3 rounded-xl border group relative transition-all cursor-pointer hover:shadow-md ${theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8]' : theme === 'dark' ? 'bg-[#1A1A24] border-[rgba(255,255,255,0.12)] text-[#F0EEF6]' : 'bg-gray-50 border-gray-200 text-[#1F2937]'}`} onClick={() => { void navigateToLocation(b.cfi, isMobile ? () => setShowBookmarks(false) : undefined); }}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: 'var(--accent)' }}>{b.title}</p>
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#D3CFE0]' : 'opacity-70'}`}>{b.progress}% completed</p>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setBookmarks(bookmarks.filter(x => x.cfi !== b.cfi)); localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(bookmarks.filter(x => x.cfi !== b.cfi))); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <p className={`text-[10px] mt-2 ${theme === 'dark' ? 'text-[#B8B3C8]' : 'opacity-40'}`}>{new Date(b.timestamp).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div
                    ref={viewerRef}
                    onClick={handleViewerClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`h-full w-full ${theme === 'sepia' ? 'bg-[#F5E6D3]' : theme === 'dark' ? 'bg-[#0D0D12]' : 'bg-white'}`}
                    style={{
                        userSelect: 'auto',
                        WebkitUserSelect: 'auto',
                        scrollBehavior: 'smooth'
                    }}
                />

                {/* Navigation Buttons Removed as per request */}

                {showLastReadButton && (
                    <button
                        onClick={() => { if (lastReadLocation) void navigateToLocation(lastReadLocation); }}
                        className={`fixed right-3 md:right-5 z-[75] flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full shadow-lg transition-all hover:scale-105 ${theme === 'sepia'
                            ? 'bg-[#EDD9C0] border border-[#D4C4A8] text-[#5C4033]'
                            : theme === 'dark'
                                ? 'bg-[#1A1A24] border border-[rgba(255,255,255,0.12)] text-[#F0EEF6]'
                                : 'bg-white border border-[#E5E7EB] text-[#1F2937]'
                            }`}
                        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 2.75rem)' }}
                        title="Go to Last Read"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-6-6m6 6l6-6" />
                        </svg>
                        <span className="text-[10px] md:text-xs font-semibold">Last Read {lastReadProgress}%</span>
                    </button>
                )}
            </div>

            {/* Reading Stats Bar (Bottom 32px minimal) */}
            <footer className={`fixed bottom-0 left-0 right-0 h-8 md:h-8 z-[60] flex items-center justify-between px-3 md:px-6 text-[11px] md:text-xs font-medium transition-all duration-500 ease-in-out ${showToolbar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} ${theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8] text-[#5C4033]' : theme === 'dark' ? 'bg-[rgba(19,19,26,0.95)] border-[var(--border)] text-[var(--text-secondary)] backdrop-blur-md' : 'bg-[rgba(255,255,255,0.98)] border-[#E5E7EB] text-[#374151] backdrop-blur-md'} border-t`}
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', height: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
                <div className="flex items-center gap-2 md:gap-4">
                    <span className={`${theme === 'sepia' ? 'text-[#5C4033]' : theme === 'white' ? 'text-[#1F2937]' : 'text-[#F0EEF6]'}`}>{progress}%</span>
                    <span>{pagesRemaining} mins left</span>
                </div>

                <div className="tracking-wide text-[10px] md:text-xs">
                    {scrollMode ? 'Continuous' : `Page ${currentPage} of ${totalPages}`}
                </div>

                {/* Micro progress bar over the top border */}
                <div className="absolute top-0 left-0 h-[1.5px] transition-all duration-300 ease-out z-[61]" style={{ width: `${progress}%`, backgroundColor: 'var(--accent)', boxShadow: '0 0 4px var(--accent-glow)' }} />
            </footer>

            {/* Selection Popup */}
            {selectionCoords && selectedRange && (
                <div
                    className="fixed z-[100] flex gap-2 rounded-xl shadow-xl p-1 transform -translate-x-1/2 -translate-y-[120%]"
                    style={{ left: selectionCoords.x, top: selectionCoords.y, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                    <button
                        onClick={() => handleAnnotate('highlight')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-muted)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                        <span className="text-sm font-medium">Mark</span>
                    </button>
                    <div className="w-px" style={{ backgroundColor: 'var(--border)' }} />
                    <button
                        onClick={() => handleAnnotate('bold')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-overlay)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <span className="text-sm font-bold">Bold</span>
                    </button>
                </div>
            )}

            {/* Annotations List Sidebar */}
            {showAnnotationsList && (
                <div className={`fixed inset-y-0 right-0 w-[88vw] max-w-80 shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${theme === 'sepia' ? 'bg-[#F5E6D3] border-l border-[#D4C4A8] text-[#5C4033]' :
                    theme === 'dark' ? 'bg-[#13131A] border-l border-[rgba(255,255,255,0.07)]' :
                        'bg-white border-l border-[#E5E7EB] text-[#1F2937]'
                    }`}>
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme === 'white' ? '#E5E7EB' : undefined }}>
                        <h2 className="font-bold text-lg">Highlights & Marks</h2>
                        <button
                            onClick={() => setShowAnnotationsList(false)}
                            className="p-1 hover:bg-black hover:bg-opacity-10 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {annotations.length === 0 ? (
                            <p className="text-sm opacity-60 text-center py-8">No marks yet. Select text to highlight or bold it.</p>
                        ) : (
                            annotations.map((ann) => (
                                <div
                                    key={ann.id}
                                    className={`p-3 rounded-xl border group relative transition-all cursor-pointer hover:shadow-md ${theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8]' :
                                        theme === 'dark' ? 'bg-[#1A1A24] border-[rgba(255,255,255,0.07)]' :
                                            'bg-gray-50 border-gray-200'
                                        }`}
                                    onClick={() => {
                                        void navigateToLocation(ann.cfiRange, isMobile ? () => setShowAnnotationsList(false) : undefined);
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${ann.type === 'highlight'
                                            ? 'bg-yellow-400 text-yellow-900'
                                            : 'bg-gray-800 text-white'
                                            }`}>
                                            {ann.type}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteAnnotation(ann.id, ann.cfiRange, ann.type);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-sm line-clamp-3 leading-relaxed">
                                        {ann.type === 'bold' ? <strong>{ann.text}</strong> : ann.text}
                                    </p>
                                    <p className="text-[10px] opacity-40 mt-2">
                                        {new Date(ann.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
