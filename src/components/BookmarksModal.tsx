'use client';

import { useBookmarks, BookmarkedArticle } from '@/hooks/useBookmarks';
import { useState } from 'react';
import Image from 'next/image';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleSelect: (article: BookmarkedArticle) => void;
}

export default function BookmarksModal({ isOpen, onClose, onArticleSelect }: BookmarksModalProps) {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmarks();

  if (!isOpen) return null;

  const handleArticleClick = (article: BookmarkedArticle) => {
    onArticleSelect(article);
    onClose();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[80vh] bg-gray-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Bookmarked Articles</h2>
              <p className="text-gray-400 text-xs sm:text-sm">{bookmarks.length} articles bookmarked</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {bookmarks.length > 0 && (
              <button
                onClick={clearAllBookmarks}
                className="px-2 cursor-pointer py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-8 h-8 cursor-pointer sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(80vh-120px)]">
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">No bookmarked articles yet</h3>
              <p className="text-gray-400 text-sm sm:text-base px-4">Start bookmarking articles you find interesting!</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {bookmarks.map((article) => (
                <div
                  key={article.pageid}
                  className="group bg-gray-800/50 hover:bg-gray-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail.source}
                          alt={article.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                            {article.extract}
                          </p>
                          <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                            <span className="hidden sm:inline">Bookmarked on </span>
                            {formatDate(article.bookmarkedAt)}
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBookmark(article.pageid);
                          }}
                          className="ml-2 sm:ml-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
