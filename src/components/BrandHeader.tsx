'use client';

export default function BrandHeader() {
  return (
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
  );
} 