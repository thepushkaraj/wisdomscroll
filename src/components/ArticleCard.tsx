'use client';

import { ArticleCardProps } from '@/app/types';
import { useState } from 'react';
import Image from 'next/image';

export default function ArticleCard({ article, isActive, onChatClick }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const truncateText = (text: string, maxLength: number = 280) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const displayText = showFullText ? article.extract : truncateText(article.extract);

  return (
    <div className={`relative w-full h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-900/95 to-black ${isActive ? 'fade-in' : ''}`}>
      {/* Background Image */}
      {article.thumbnail && !imageError && (
        <div className="absolute inset-0 z-0">
          <Image
            src={article.thumbnail.source}
            alt={article.title}
            fill
            className="object-cover opacity-25 blur-sm"
            onError={handleImageError}
            sizes="100vw"
            priority={isActive}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col px-6 py-8 pb-24 max-w-4xl mx-auto w-full">
        {/* Top section with centered image */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-8">
          {article.thumbnail && !imageError && (
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={article.thumbnail.source}
                alt={article.title}
                fill
                className="object-cover"
                onError={handleImageError}
                sizes="(max-width: 640px) 288px, 320px"
                priority={isActive}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </div>

        {/* Bottom content section */}
        <div className="space-y-6 mt-auto">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
              {article.title}
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="text-gray-100 leading-relaxed text-base sm:text-lg max-h-56 sm:max-h-64 md:max-h-72 overflow-y-auto pr-1">
              <div className="relative">
                <p className="whitespace-pre-line">{displayText}</p>
                {article.extract.length > 280 && (
                  <div className={`sticky bottom-0 pt-3 ${showFullText ? "bg-gradient-to-t" : "bg-none"} from-gray-900 via-gray-900/80 to-transparent`}>
                    <button
                      onClick={() => setShowFullText(!showFullText)}
                      className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm"
                    >
                      <span className='cursor-pointer'>{showFullText ? 'Show less' : 'Read more'}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${showFullText ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={onChatClick}
                className="flex cursor-pointer items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Ask AI</span>
              </button>
              
              <a
                href={article.fullurl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm transition-all duration-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Wikipedia</span>
              </a>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span>Swipe up for more</span>
            </div>

            {/* Mobile navigation hint */}
            <div className="sm:hidden flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span>Swipe up for more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Improved Scroll indicator */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-3 text-white/60">
          <div className="w-1 h-12 bg-white/20 rounded-full overflow-hidden">
            <div className="w-full h-3 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-1 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
} 