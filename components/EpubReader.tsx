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
    const [scrollMode, setScrollMode] = useState(false);
    const [isPullingRefresh, setIsPullingRefresh] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [annotations, setAnnotations] = useState<any[]>([]);
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [selectedText, setSelectedText] = useState<string>('');
    const [selectionCoords, setSelectionCoords] = useState<{ x: number, y: number } | null>(null);
    const [showAnnotationsList, setShowAnnotationsList] = useState(false);

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
                        rendition.annotations.add('underline', selectedRange, {}, undefined, 'bold-marker', { 'font-weight': 'bold', 'text-decoration': 'none', 'border-bottom': '2px solid #5C4033' });
                    }
                }
                
                // Clear selection
                setSelectedRange(null);
                setSelectionCoords(null);
                if (window.getSelection) {
                    window.getSelection()?.removeAllRanges();
                }
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
                        rendition.annotations.add('underline', ann.cfiRange, {}, undefined, 'bold-marker', { 'font-weight': 'bold', 'text-decoration': 'none', 'border-bottom': '2px solid #5C4033' });
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
                    rendition.annotations.remove(cfiRange, type === 'highlight' ? 'highlight' : 'underline');
                }
            }
        } catch (error) {
            console.error('Error deleting annotation:', error);
        }
    }, [user, bookId, rendition]);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768 || ('ontouchstart' in window);
            setIsMobile(mobile);
            setScrollMode(mobile); // Mobile always scroll
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

            // Register sepia theme
            newRendition.themes.register('sepia', {
                body: {
                    background: '#F5E6D3',
                    color: '#5C4033',
                    'font-family': 'Georgia, serif',
                    'font-size': '16px',
                    'line-height': '1.75'
                }
            });

            // Register dark theme
            newRendition.themes.register('dark', {
                body: {
                    background: '#1A1A1A',
                    color: '#E8E8E8',
                    'font-family': 'Georgia, serif',
                    'font-size': '16px',
                    'line-height': '1.75'
                }
            });

            // Register white theme
            newRendition.themes.register('white', {
                body: {
                    background: '#FFFFFF',
                    color: '#2C2C2C',
                    'font-family': 'Georgia, serif',
                    'font-size': '16px',
                    'line-height': '1.75'
                }
            });

            newRendition.themes.select(theme);
            newRendition.themes.fontSize(`${fontSize}px`);
            newRendition.themes.font(fontFamily);
            
            setRendition(newRendition);

            // Load saved position from database
            loadProgressFromDatabase().then((savedProgress) => {
                if (savedProgress?.currentLocation) {
                    newRendition.display(savedProgress.currentLocation);
                } else {
                    newRendition.display();
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
                    setProgress(Math.round((current / total) * 100));
                }
            });

            newRendition.on('rendered', () => {
                setIsReady(true);
            });

            // Handle selection for annotations
            newRendition.on('selected', (cfiRange: string, contents: any) => {
                const range = contents.range(cfiRange);
                const rect = range.getBoundingClientRect();
                const text = range.toString();

                if (text && text.length > 0) {
                    setSelectedRange(cfiRange);
                    setSelectedText(text);
                    setSelectionCoords({
                        x: rect.left + rect.width / 2,
                        y: rect.top
                    });
                }
            });

            // Close selection popup when clicking elsewhere
            newRendition.on('click', () => {
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
        if (rendition) {
            rendition.themes.select(theme);
            rendition.themes.fontSize(`${fontSize}px`);
            rendition.themes.font(fontFamily);
        }
    }, [rendition, theme, fontSize, fontFamily]);

    // Auto-save position every 3 seconds
    useEffect(() => {
        if (!location || !bookUrl) return;

        if (saveTimerRef.current) {
            clearInterval(saveTimerRef.current);
        }

        saveTimerRef.current = setInterval(() => {
            if (location && bookId) {
                // Save to database
                saveProgressToDatabase(location.toString(), progress);
            }
        }, 3000);

        return () => {
            if (saveTimerRef.current) {
                clearInterval(saveTimerRef.current);
            }
        };
    }, [location, bookUrl, bookId, progress, saveProgressToDatabase]);

    // Update theme when changed
    useEffect(() => {
        if (rendition) {
            rendition.themes.select(theme);
            rendition.themes.fontSize(`${fontSize}px`);
            rendition.themes.font(fontFamily);
        }
    }, [theme, fontSize, fontFamily, rendition]);

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

    const handleTOCItemClick = (href: string) => {
        if (rendition) {
            rendition.display(href);
            setShowTOC(false);
        }
    };

    // Handle click on reading area for page navigation (desktop only)
    const handleViewerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
    }, [rendition, prevPage, nextPage, scrollMode]);

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

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${
            theme === 'sepia' ? 'bg-[#F5E6D3]' : theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white'
        }`}>

            {/* Header */}
            <div 
                className={`fixed top-0 left-0 h-1 bg-blue-600 z-[60] transition-all duration-300 ease-out`}
                style={{ width: `${progress}%` }} 
            />
            <header className={`flex items-center justify-between px-6 py-4 border-b ${
                theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8] text-[#5C4033]' : 
                theme === 'dark' ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E8E8]' : 
                'bg-gray-50 border-gray-200 text-gray-800'
            } shadow-sm z-10`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h1 className="font-semibold text-lg truncate max-w-md">{bookTitle}</h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Desktop: Toggle Scroll/Page Mode */}
                    {!isMobile && (
                        <button
                            onClick={toggleScrollMode}
                            className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                            title={scrollMode ? 'Switch to Page Mode' : 'Switch to Scroll Mode'}
                        >
                            {scrollMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Table of Contents Button */}
                    <button
                        onClick={() => setShowTOC(!showTOC)}
                        className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                        title="Table of Contents"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Font Settings Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFontSettings(!showFontSettings)}
                            className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                            title="Font Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {/* Font Settings Dropdown */}
                        {showFontSettings && (
                            <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-xl border z-50 ${
                                theme === 'sepia' ? 'bg-[#F5E6D3] border-[#D4C4A8]' :
                                theme === 'dark' ? 'bg-[#2A2A2A] border-[#3A3A3A]' :
                                'bg-white border-gray-200'
                            }`}>
                                <div className="p-4 space-y-4">
                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Font Size</label>
                                        <div className="flex gap-2">
                                            {fontSizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setFontSize(size)}
                                                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                                        fontSize === size
                                                            ? theme === 'sepia' ? 'bg-[#D4C4A8] text-[#5C4033]' :
                                                              theme === 'dark' ? 'bg-[#3A3A3A] text-white' :
                                                              'bg-gray-200 text-gray-900'
                                                            : 'hover:bg-black hover:bg-opacity-10'
                                                    }`}
                                                >
                                                    {size === 18 ? 'M' : size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font Family */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Font Family</label>
                                        <select
                                            value={fontFamily}
                                            onChange={(e) => setFontFamily(e.target.value)}
                                            className={`w-full p-2 rounded-lg border ${
                                                theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8] text-[#5C4033]' :
                                                theme === 'dark' ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E8E8]' :
                                                'bg-white border-gray-300'
                                            }`}
                                        >
                                            {fontFamilies.map((font) => (
                                                <option key={font} value={font}>{font}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Theme */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Theme</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setTheme('sepia')}
                                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                                    theme === 'sepia' ? 'bg-[#D4C4A8] text-[#5C4033]' : 'hover:bg-black hover:bg-opacity-10'
                                                }`}
                                            >
                                                Sepia
                                            </button>
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                                    theme === 'dark' ? 'bg-[#3A3A3A] text-white' : 'hover:bg-black hover:bg-opacity-10'
                                                }`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                onClick={() => setTheme('white')}
                                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                                    theme === 'white' ? 'bg-gray-200 text-gray-900' : 'hover:bg-black hover:bg-opacity-10'
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
                        onClick={() => setShowAnnotationsList(!showAnnotationsList)}
                        className={`p-2 rounded-lg transition-colors ${
                            showAnnotationsList ? 'bg-black bg-opacity-10' : 'hover:bg-black hover:bg-opacity-10'
                        }`}
                        title="Highlights & Marks"
                    >
                        <span className="text-xs font-bold uppercase tracking-tighter">MARK</span>
                    </button>
                </div>
            </header>

            {/* Reader Area */}
            <div className="flex-1 relative overflow-hidden">
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
                        <div className={`animate-spin h-10 w-10 border-4 rounded-full ${
                            theme === 'sepia' ? 'border-[#D4C4A8] border-t-[#8B6F47]' :
                            theme === 'dark' ? 'border-[#3A3A3A] border-t-[#60A5FA]' :
                            'border-gray-200 border-t-blue-600'
                        }`} />
                    </div>
                )}

                {/* Table of Contents Sidebar */}
                {showTOC && (
                    <div className={`absolute left-0 top-0 bottom-0 w-80 shadow-xl border-r z-40 overflow-y-auto ${
                        theme === 'sepia' ? 'bg-[#F5E6D3] border-[#D4C4A8] text-[#5C4033]' :
                        theme === 'dark' ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E8E8]' :
                        'bg-white border-gray-200 text-gray-800'
                    }`}>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-lg">Table of Contents</h2>
                                <button
                                    onClick={() => setShowTOC(false)}
                                    className="p-1 rounded hover:bg-black hover:bg-opacity-10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {toc.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTOCItemClick(item.href)}
                                        className="w-full text-left p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div 
                    ref={viewerRef} 
                    onClick={handleViewerClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`h-full w-full ${scrollMode ? 'overflow-y-auto overflow-x-hidden' : 'cursor-pointer'}`}
                    style={{ 
                        userSelect: 'none',
                        scrollBehavior: 'smooth'
                    }}
                />

                {/* Navigation Buttons - Only show in pagination mode */}
                {!scrollMode && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevPage();
                            }}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none z-40 ${
                                theme === 'sepia' ? 'bg-[#EDD9C0] text-[#5C4033] hover:bg-[#D4C4A8]' :
                                theme === 'dark' ? 'bg-[#2A2A2A] text-[#E8E8E8] hover:bg-[#3A3A3A]' :
                                'bg-white text-gray-800 hover:bg-gray-100'
                            }`}
                            title="Previous Page (Left Arrow)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextPage();
                            }}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none z-40 ${
                                theme === 'sepia' ? 'bg-[#EDD9C0] text-[#5C4033] hover:bg-[#D4C4A8]' :
                                theme === 'dark' ? 'bg-[#2A2A2A] text-[#E8E8E8] hover:bg-[#3A3A3A]' :
                                'bg-white text-gray-800 hover:bg-gray-100'
                            }`}
                            title="Next Page (Right Arrow)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Footer */}
            <footer className={`flex items-center justify-between px-6 py-3 border-t ${
                theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8] text-[#5C4033]' :
                theme === 'dark' ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E8E8]' :
                'bg-gray-50 border-gray-200 text-gray-800'
            }`}>
                <div className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Logo" width={24} height={24} className={`h-6 w-6 ${theme === 'dark' ? '' : 'invert'}`} />
                    <span className="font-semibold text-lg">Ebookin</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    {scrollMode ? (
                        <span>{progress}% selesai dibaca</span>
                    ) : (
                        <>
                            <span>{progress}% completed</span>
                            <span>Hal {currentPage} dari {totalPages}</span>
                        </>
                    )}
                </div>
            </footer>

            {/* Selection Popup */}
            {selectionCoords && selectedRange && (
                <div 
                    className="fixed z-[100] flex gap-2 bg-white rounded-lg shadow-xl border border-gray-200 p-1 transform -translate-x-1/2 -translate-y-[120%]"
                    style={{ left: selectionCoords.x, top: selectionCoords.y }}
                >
                    <button
                        onClick={() => handleAnnotate('highlight')}
                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-yellow-50 text-gray-700 rounded-md transition-colors"
                    >
                        <div className="w-4 h-4 rounded-full bg-yellow-400" />
                        <span className="text-sm font-medium">Mark</span>
                    </button>
                    <div className="w-px bg-gray-200" />
                    <button
                        onClick={() => handleAnnotate('bold')}
                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                    >
                        <span className="text-sm font-bold">Bold</span>
                    </button>
                </div>
            )}

            {/* Annotations List Sidebar */}
            {showAnnotationsList && (
                <div className={`fixed inset-y-0 right-0 w-80 shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${
                    theme === 'sepia' ? 'bg-[#F5E6D3] border-l border-[#D4C4A8]' : 
                    theme === 'dark' ? 'bg-[#1A1A1A] border-l border-[#3A3A3A]' : 
                    'bg-white border-l border-gray-200'
                }`}>
                    <div className="p-4 border-b flex items-center justify-between">
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
                                    className={`p-3 rounded-xl border group relative transition-all cursor-pointer hover:shadow-md ${
                                        theme === 'sepia' ? 'bg-[#EDD9C0] border-[#D4C4A8]' : 
                                        theme === 'dark' ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 
                                        'bg-gray-50 border-gray-200'
                                    }`}
                                    onClick={() => {
                                        rendition?.display(ann.cfiRange);
                                        if (isMobile) setShowAnnotationsList(false);
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                            ann.type === 'highlight' 
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
