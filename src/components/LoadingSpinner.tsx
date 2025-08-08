'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Loading wisdom..." }: LoadingSpinnerProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer spinning ring */}
          <div className="inline-block w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        <p className="text-white text-lg font-medium">{message}</p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
} 