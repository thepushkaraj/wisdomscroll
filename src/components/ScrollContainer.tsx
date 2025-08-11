'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WikipediaPage } from '@/app/types';
import { WikipediaService } from '../services/wikipedia';
import ArticleCard from './ArticleCard';
import ChatModal from './ChatModal';
import BrandHeader from './BrandHeader';
import LoadingSpinner from './LoadingSpinner';
import BookmarksModal from './BookmarksModal';
import { BookmarkedArticle, BookmarksProvider } from '@/contexts/BookmarksContext';

interface ScrollContainerProps {
  initialArticles?: WikipediaPage[];
}

export default function ScrollContainer({ initialArticles = [] }: ScrollContainerProps) {
  const [articles, setArticles] = useState<WikipediaPage[]>(initialArticles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<WikipediaPage | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);

  // Load initial articles
  useEffect(() => {
    if (articles.length === 0) {
      loadMoreArticles();
    }
  }, []);

  const loadMoreArticles = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newArticles = await WikipediaService.fetchMultipleRandomPages(5);
      setArticles(prev => [...prev, ...newArticles]);
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prefetch articles when nearing the end
  useEffect(() => {
    if (articles.length - currentIndex <= 2 && !isLoading) {
      loadMoreArticles();
    }
  }, [currentIndex, articles.length, isLoading]);

  const handleScroll = useCallback((direction: 'up' | 'down') => {
    if (isScrolling.current) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < 500) return; // Throttle scrolling
    
    lastScrollTime.current = now;
    isScrolling.current = true;
    
    if (direction === 'down' && currentIndex < articles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    
    setTimeout(() => {
      isScrolling.current = false;
    }, 600);
  }, [currentIndex, articles.length]);

  // Handle wheel scroll
  useEffect(() => {
    if (isChatOpen || isBookmarksOpen) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 50) {
        handleScroll(e.deltaY > 0 ? 'down' : 'up');
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleScroll, isChatOpen, isBookmarksOpen]);

  // Handle touch scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const deltaTime = Date.now() - startTime;
      
      // Require minimum distance and reasonable speed
      if (Math.abs(deltaY) > 50 && deltaTime < 500) {
        handleScroll(deltaY > 0 ? 'down' : 'up');
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleScroll]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChatOpen || isBookmarksOpen) return; // Don't handle keys when chat is open
      
      switch (e.key) {
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          handleScroll('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleScroll('up');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleScroll, isChatOpen, isBookmarksOpen]);

  const handleChatClick = (article: WikipediaPage) => {
    setSelectedArticle(article);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setSelectedArticle(null);
  };

  const handleBookmarksOpen = () => {
    setIsBookmarksOpen(true);
  };

  const handleBookmarksClose = () => {
    setIsBookmarksOpen(false);
  };

  const handleBookmarkedArticleSelect = (article: BookmarkedArticle) => {
    const existingIndex = articles.findIndex(a => a.pageid === article.pageid);
    
    if (existingIndex !== -1) {
      setCurrentIndex(existingIndex);
    } else {
      setArticles(prev => [article, ...prev]);
      setCurrentIndex(0);
    }
    
    setIsBookmarksOpen(false);
  };

  if (isInitialLoad && articles.length === 0) {
    return <LoadingSpinner message="Loading wisdom..." />;
  }

  return (
    <BookmarksProvider>
      <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Articles */}
      <div
        className="transition-transform duration-500 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
        }}
      >
        {articles.map((article, index) => (
          <ArticleCard
            key={`${article.pageid}-${index}`}
            article={article}
            isActive={index === currentIndex}
            onChatClick={() => handleChatClick(article)}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10 shadow-xl">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-blue-500" />
            <span className="text-white text-sm font-medium">Loading more wisdom...</span>
          </div>
        </div>
      )}

      {/* Brand Header */}
      <BrandHeader onBookmarksClick={handleBookmarksOpen} />

      {/* Article counter */}
      <div className="absolute bottom-8 right-4 md:right-6 z-30">
        <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
          <div className="flex items-center space-x-2 text-white/70 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-mono font-bold">{currentIndex + 1} / {articles.length}</span>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedArticle && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleChatClose}
          article={selectedArticle}
        />
      )}

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={handleBookmarksClose}
        onArticleSelect={handleBookmarkedArticleSelect}
      />
      </div>
    </BookmarksProvider>
  );
} 