"use client";

import { useState, useEffect } from "react";

interface RotatePhoneProps {
  onLandscape: () => void;
}

export default function RotatePhone({ onLandscape }: RotatePhoneProps) {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
      
      if (landscape) {
        onLandscape();
      }
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation/resize changes
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, [onLandscape]);

  // Don't render if already in landscape
  if (isLandscape) return null;

  return (
    <div
      className="fixed inset-0 bg-[#F7C41A] flex flex-col justify-center items-center z-[1001]"
      style={{ fontFamily: "var(--font-avant-garde-book)" }}
    >
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes rotatePhone {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-90deg);
          }
          75% {
            transform: rotate(-90deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .phone-rotate {
          animation: rotatePhone 4s ease-in-out infinite;
        }
      `}</style>

      {/* Container for phone and text */}
      <div className="relative flex flex-col justify-center items-center">
        {/* Rotating phone frame */}
        <div 
          className="phone-rotate"
          style={{ 
            width: "120px", 
            height: "200px",
          }}
        >
          <img
            src="/Rotate_02.svg"
            alt="Phone"
            className="w-full h-full"
          />
        </div>

        {/* Static text overlay - centered on the phone */}
        <div
          className="absolute flex flex-col justify-center items-center text-center pointer-events-none"
          style={{ 
            color: "#1a1a2e",
            fontSize: "18px",
            lineHeight: "1.3",
          }}
        >
          <span>Rotate</span>
          <span>Your</span>
          <span>Phone</span>
        </div>
      </div>
    </div>
  );
}
