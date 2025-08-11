'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WikipediaPage } from '@/app/types';

export interface BookmarkedArticle extends WikipediaPage {
  bookmarkedAt: number;
}

interface BookmarksContextType {
  bookmarks: BookmarkedArticle[];
  addBookmark: (article: WikipediaPage) => void;
  removeBookmark: (pageid: number) => void;
  isBookmarked: (pageid: number) => boolean;
  toggleBookmark: (article: WikipediaPage) => void;
  clearAllBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

const BOOKMARKS_KEY = 'wisdomscroll_bookmarks';

interface BookmarksProviderProps {
  children: ReactNode;
}

export function BookmarksProvider({ children }: BookmarksProviderProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (bookmarks) {
        const parsed = JSON.parse(bookmarks);
        setBookmarks(parsed);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [bookmarks, isInitialized]);

  const addBookmark = (article: WikipediaPage) => {
    const bookmarkedArticle: BookmarkedArticle = {
      ...article,
      bookmarkedAt: Date.now()
    };
    
    setBookmarks(prev => {
      // Check if already bookmarked
      const exists = prev.find(b => b.pageid === article.pageid);
      if (exists) {
        return prev; // Already bookmarked
      }
      return [bookmarkedArticle, ...prev]; // Add to beginning
    });
  };

  const removeBookmark = (pageid: number) => {
    setBookmarks(prev => prev.filter(b => b.pageid !== pageid));
  };

  const isBookmarked = (pageid: number) => {
    return bookmarks.some(b => b.pageid === pageid);
  };

  const toggleBookmark = (article: WikipediaPage) => {
    if (isBookmarked(article.pageid)) {
      removeBookmark(article.pageid);
    } else {
      addBookmark(article);
    }
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  const value: BookmarksContextType = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    clearAllBookmarks
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
