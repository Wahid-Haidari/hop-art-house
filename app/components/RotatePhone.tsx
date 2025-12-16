"use client";

import { useState, useEffect } from "react";
import { COLORS } from "../colors";

interface RotatePhoneProps {
  onLandscape: () => void;
}

export default function RotatePhone({ onLandscape }: RotatePhoneProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
      
      if (landscape) {
        onLandscape();
      }
    };

    // Delayed check for orientationchange (dimensions update after event fires)
    const checkOrientationDelayed = () => {
      // Check immediately
      checkOrientation();
      // Also check after a short delay to catch delayed dimension updates
      setTimeout(checkOrientation, 100);
      setTimeout(checkOrientation, 300);
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation/resize changes
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientationDelayed);

    // Also use screen.orientation API if available
    if (screen.orientation) {
      screen.orientation.addEventListener("change", checkOrientationDelayed);
    }

    // Show continue button after 3 seconds
    const buttonTimer = setTimeout(() => {
      setShowContinueButton(true);
    }, 3000);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientationDelayed);
      if (screen.orientation) {
        screen.orientation.removeEventListener("change", checkOrientationDelayed);
      }
      clearTimeout(buttonTimer);
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
        @keyframes showTick {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          80% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes hideText {
          0% {
            opacity: 1;
          }
          20% {
            opacity: 1;
          }
          25% {
            opacity: 0;
          }
          75% {
            opacity: 0;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
        .phone-rotate {
          animation: rotatePhone 4s ease-in-out infinite;
        }
        .tick-fade {
          animation: showTick 4s ease-in-out infinite;
        }
        .text-fade {
          animation: hideText 4s ease-in-out infinite;
        }
        .tick-container {
          animation: showTick 4s ease-in-out infinite;
          overflow: hidden;
        }
        .tick-draw {
          animation: drawTick 4s ease-in-out infinite;
        }
        @keyframes drawTick {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          25% {
            clip-path: inset(0 100% 0 0);
          }
          45% {
            clip-path: inset(0 0% 0 0);
          }
          75% {
            clip-path: inset(0 0% 0 0);
          }
          80% {
            clip-path: inset(0 100% 0 0);
          }
          100% {
            clip-path: inset(0 100% 0 0);
          }
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

        {/* Tick mark - appears when phone is rotated, replaces text with drawing animation */}
        <div
          className="tick-container absolute pointer-events-none"
          style={{
            width: "50px",
            height: "50px",
            opacity: 0,
          }}
        >
          <img
            src="/check mark.svg"
            alt="Tick"
            className="tick-draw w-full h-full"
          />
        </div>

        {/* Static text overlay - centered on the phone, fades out when rotated */}
        <div
          className="text-fade absolute flex flex-col justify-center items-center text-center pointer-events-none"
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

      {/* Continue button - appears after 3 seconds for in-app browsers */}
      {showContinueButton && (
        <button
          onClick={onLandscape}
          className="cursor-pointer hover:opacity-80"
          style={{
            position: "absolute",
            bottom: "15%",
            backgroundColor: COLORS.primary,
            color: "black",
            border: "2px solid black",
            padding: "12px 48px",
            paddingTop: "14px",
            fontSize: "18px",
            fontFamily: "var(--font-avant-garde-medium)",
            borderRadius: "8px",
          }}
        >
          Continue Anyway
        </button>
      )}
    </div>
  );
}
