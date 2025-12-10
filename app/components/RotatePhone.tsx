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
      {/* Phone Icon */}
      <div className="relative" style={{ width: "120px", height: "200px" }}>
        {/* Phone outline */}
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            border: "3px solid #1a1a2e",
            backgroundColor: "#F7C41A",
          }}
        >
          {/* Notch/Dynamic Island */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "12px",
              width: "40px",
              height: "8px",
              backgroundColor: "#1a1a2e",
              borderRadius: "4px",
            }}
          />
          
          {/* Side button (right) */}
          <div
            className="absolute"
            style={{
              right: "-6px",
              top: "60px",
              width: "3px",
              height: "30px",
              backgroundColor: "#1a1a2e",
              borderRadius: "0 2px 2px 0",
            }}
          />
          
          {/* Volume buttons (left) */}
          <div
            className="absolute"
            style={{
              left: "-6px",
              top: "50px",
              width: "3px",
              height: "20px",
              backgroundColor: "#1a1a2e",
              borderRadius: "2px 0 0 2px",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "-6px",
              top: "80px",
              width: "3px",
              height: "20px",
              backgroundColor: "#1a1a2e",
              borderRadius: "2px 0 0 2px",
            }}
          />

          {/* Text inside phone */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center text-center"
            style={{ 
              color: "#1a1a2e",
              fontSize: "18px",
              lineHeight: "1.3",
              paddingTop: "20px",
            }}
          >
            <span>Rotate</span>
            <span>Your</span>
            <span>Phone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
