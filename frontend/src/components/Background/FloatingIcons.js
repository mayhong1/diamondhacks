"use client";
import { useEffect, useState } from "react";

const NoShirtIcon = () => (
  <div className="relative">
    <svg
      width="24"
      height="24"
      viewBox="0 0 122.88 99.43"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10"
    >
      <g>
        <path
          d="M78.36,4.61H44.51c0.17,1.87,0.64,3.65,1.37,5.3c0.85,1.94,2.06,3.69,3.54,5.17c1.57,1.57,3.44,2.83,5.51,3.69 c2,0.83,4.19,1.28,6.5,1.28c2.31,0,4.5-0.46,6.5-1.28c2.07-0.86,3.94-2.12,5.51-3.69c1.48-1.48,2.69-3.23,3.54-5.17 C77.72,8.26,78.2,6.48,78.36,4.61L78.36,4.61z M9.28,37.06l16.57,0.72l0.02,0c0.61,0.03,1.15,0.3,1.54,0.7 c0.37,0.38,0.6,0.9,0.64,1.46c0.01,0.04,0.01,0.09,0.01,0.13v54.75h67.35V39.68c0-0.63,0.26-1.21,0.68-1.63l0,0l0,0l0,0 c0.42-0.42,0.99-0.67,1.62-0.67c0.01,0,0.02,0,0.09,0l0.01,0l0.07,0l16.26-0.18l3.78-17.59l-35-14.29 c-0.24,2.31-0.85,4.52-1.76,6.56c-1.09,2.43-2.6,4.62-4.45,6.46c-1.99,1.99-4.37,3.59-7.02,4.69c-2.55,1.06-5.34,1.64-8.26,1.64 s-5.71-0.58-8.26-1.64c-2.65-1.1-5.03-2.7-7.02-4.69c-1.82-1.82-3.32-3.97-4.4-6.35c-0.91-2-1.52-4.16-1.78-6.43L5.01,19.97 L9.28,37.06L9.28,37.06z M23.45,42.28l-15.98-0.7c-0.52,0-1.01-0.17-1.4-0.47c-0.02-0.02-0.04-0.03-0.06-0.05 c-0.37-0.3-0.65-0.72-0.78-1.22L0.07,19.16c-0.01-0.03-0.01-0.05-0.02-0.08c-0.11-0.52-0.03-1.06,0.2-1.51 c0.24-0.48,0.65-0.87,1.18-1.09l39.4-16.24c0.15-0.08,0.31-0.13,0.49-0.18v0C41.5,0.02,41.68,0,41.86,0h0.3h38.56h0.9 c0.03,0,0.07,0,0.1,0.01c0.12,0,0.23,0.02,0.34,0.04l0,0v0c0.14,0.03,0.28,0.07,0.42,0.13l0,0l0,0l38.96,15.9 c0.02,0.01,0.04,0.02,0.06,0.03c0.48,0.21,0.87,0.58,1.11,1.03c0.24,0.46,0.33,1.01,0.22,1.56l-4.57,21.27 c-0.01,0.03-0.01,0.06-0.02,0.09c-0.12,0.48-0.4,0.91-0.78,1.21c-0.39,0.32-0.89,0.51-1.43,0.52l-16,0.17v55.18 c0,0.63-0.26,1.21-0.68,1.63l0,0c-0.42,0.42-0.99,0.68-1.63,0.68H25.76c-0.63,0-1.21-0.26-1.63-0.68l0,0 c-0.42-0.42-0.68-0.99-0.68-1.63V42.28L23.45,42.28z"
          fill="currentColor"
        />
      </g>
    </svg>
    {/* Red slash overlay */}
    <div className="absolute inset-0 z-20">
      <div className="w-full h-0.5 bg-red-500/30 absolute top-1/2 left-0 transform -translate-y-1/2 rotate-45"></div>
    </div>
  </div>
);

const FloatingIcon = ({ style }) => {
  return (
    <div
      className="absolute pointer-events-none text-purple-500/10"
      style={style}
    >
      <NoShirtIcon />
    </div>
  );
};

export default function FloatingIcons() {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    // Generate random positions and animation properties for each icon
    const generateIcons = () => {
      const newIcons = [];
      const numIcons = 8;
      const fixedSize = 3; // Fixed scale factor for all icons

      for (let i = 0; i < numIcons; i++) {
        const startX = Math.random() * 100; // Random X position (0-100%)
        const startY = Math.random() * 100; // Random Y position (0-100%)
        const duration = Math.random() * (20 - 10) + 10; // Random duration between 10-20s
        const delay = Math.random() * -20; // Random start time

        newIcons.push({
          id: i,
          style: {
            transform: `scale(${fixedSize})`,
            left: `${startX}%`,
            top: `${startY}%`,
            animation: `float ${duration}s infinite ${delay}s`,
          },
        });
      }

      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(${3});
          }
          33% {
            transform: translate(2rem, -2rem) rotate(120deg) scale(${3});
          }
          66% {
            transform: translate(-2rem, 2rem) rotate(240deg) scale(${3});
          }
          100% {
            transform: translate(0, 0) rotate(360deg) scale(${3});
          }
        }
      `}</style>
      {icons.map((icon) => (
        <FloatingIcon key={icon.id} style={icon.style} />
      ))}
    </div>
  );
}
