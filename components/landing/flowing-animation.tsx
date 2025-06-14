import React from 'react';

export function FlowingAnimation() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 1200 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Gradient Definitions */}
        <defs>
          {/* Outermost layer - Light teal */}
          <radialGradient id="gradient1" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#03A9F4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#03A9F4" stopOpacity="0.05" />
          </radialGradient>
          
          {/* Second layer - Medium teal */}
          <radialGradient id="gradient2" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#00796B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#03A9F4" stopOpacity="0.1" />
          </radialGradient>
          
          {/* Third layer - Teal to green */}
          <radialGradient id="gradient3" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#00796B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.2" />
          </radialGradient>
          
          {/* Fourth layer - Green */}
          <radialGradient id="gradient4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00796B" stopOpacity="0.3" />
          </radialGradient>
          
          {/* Innermost layer - Deep teal */}
          <radialGradient id="gradient5" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor="#00796B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Concentric circles - all centered but with different radii for depth */}
        <circle cx="800" cy="350" r="250" fill="url(#gradient1)" className="animate-flow-1" opacity="0.2" />
        <circle cx="800" cy="350" r="200" fill="url(#gradient2)" className="animate-flow-2" opacity="0.3" />
        <circle cx="800" cy="350" r="160" fill="url(#gradient3)" className="animate-flow-3" opacity="0.4" />
        <circle cx="800" cy="350" r="120" fill="url(#gradient4)" className="animate-flow-4" opacity="0.5" />
        <circle cx="800" cy="350" r="80" fill="url(#gradient5)" className="animate-flow-5" opacity="0.6" />
      </svg>

      <style>
        {`
        @keyframes flow-1 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          25% {
            transform: translateX(3px) translateY(-2px) scale(1.02);
          }
          50% {
            transform: translateX(-1px) translateY(3px) scale(0.98);
          }
          75% {
            transform: translateX(2px) translateY(-1px) scale(1.01);
          }
        }

        @keyframes flow-2 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          30% {
            transform: translateX(-3px) translateY(2px) scale(1.025);
          }
          60% {
            transform: translateX(2px) translateY(-3px) scale(0.975);
          }
          90% {
            transform: translateX(3px) translateY(2px) scale(1.015);
          }
        }

        @keyframes flow-3 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          20% {
            transform: translateX(2px) translateY(4px) scale(1.03);
          }
          40% {
            transform: translateX(-2px) translateY(-2px) scale(0.97);
          }
          80% {
            transform: translateX(4px) translateY(-2px) scale(1.02);
          }
        }

        @keyframes flow-4 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          35% {
            transform: translateX(-2px) translateY(-4px) scale(1.035);
          }
          70% {
            transform: translateX(4px) translateY(2px) scale(0.965);
          }
        }

        @keyframes flow-5 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          40% {
            transform: translateX(3px) translateY(3px) scale(1.04);
          }
          80% {
            transform: translateX(-4px) translateY(-2px) scale(0.96);
          }
        }

        .animate-flow-1 {
          animation: flow-1 12s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-flow-2 {
          animation: flow-2 14s ease-in-out infinite 0.5s;
          transform-origin: center;
        }

        .animate-flow-3 {
          animation: flow-3 16s ease-in-out infinite 1s;
          transform-origin: center;
        }

        .animate-flow-4 {
          animation: flow-4 18s ease-in-out infinite 1.5s;
          transform-origin: center;
        }

        .animate-flow-5 {
          animation: flow-5 20s ease-in-out infinite 2s;
          transform-origin: center;
        }
        `}
      </style>
    </div>
  );
} 