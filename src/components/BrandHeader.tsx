'use client';

import { useBookmarks } from '@/hooks/useBookmarks';

interface BrandHeaderProps {
  onBookmarksClick: () => void;
}

export default function BrandHeader({ onBookmarksClick }: BrandHeaderProps) {
  const { bookmarks } = useBookmarks();
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden sm:block">
        {/* Main Brand Header */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10 shadow-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-xl tracking-tight leading-none">
                Wisdom<span className="text-blue-400">Scroll</span>
              </h1>
              <p className="text-white/60 text-xs font-medium tracking-wide">
                Discover Knowledge
              </p>
            </div>
          </div>
        </div>

        {/* Bookmarks Button */}
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={onBookmarksClick}
            className="relative flex items-center space-x-2 bg-black/30 backdrop-blur-md hover:bg-black/40 transition-all duration-200 px-4 py-3 rounded-2xl border border-white/10 shadow-xl group cursor-pointer"
          >
            <svg 
              className="w-5 h-5 text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-white text-sm font-medium transition-colors">
              Bookmarks
            </span>
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden absolute top-6 left-6 right-6 z-30">
        <div className="flex justify-between items-center">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 shadow-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-lg tracking-tight leading-none">
                Wisdom<span className="text-blue-400">Scroll</span>
              </h1>
              <p className="text-white/60 text-xs font-medium tracking-wide">
                Discover Knowledge
              </p>
            </div>
          </div>

          {/* Bookmarks Button */}
          <button
            onClick={onBookmarksClick}
            className="relative flex items-center bg-black/30 backdrop-blur-md hover:bg-black/40 transition-all duration-200 px-3 py-3 rounded-2xl border border-white/10 shadow-xl group cursor-pointer"
          >
            <svg 
              className="w-5 h-5 text-white group-hover:text-yellow-400 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
