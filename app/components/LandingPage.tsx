"use client";

import { useState, useEffect } from "react";
import GalleryFooter from "./GalleryFooter";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // When user scrolls down enough, enter the gallery
      if (window.scrollY > 300) {
        onEnter();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onEnter]);

  const opacity = Math.max(0, 1 - scrollY / 300);
  const pointerEvents = scrollY > 300 ? "none" : "auto";

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[#F7C41A] flex flex-col justify-center items-center px-[10%] z-[1000]"
      style={{ opacity, pointerEvents }}
    >
      {/* Center Logo */}
      <div 
        className="pointer-events-auto mb-[60px]"
        style={{
          width: "520.63px",
          height: "272px",
        }}
      >
        <img
          src="/Landing Page Logo.svg"
          alt="Hop Art House Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center text-center">
        <h2 
          className="m-0 mb-12 text-black text-center"
          style={{ 
            fontSize: "31px", 
            lineHeight: "100%", 
            letterSpacing: "0%",
            width: "902px",
            fontFamily: "var(--font-avant-garde-medium)",
          }}
        >
          Without Van Gogh, no AI could make an image in his style.
          <br />
          Only a human can create a truly unique work of art.
        </h2>

        <p 
          className="text-black mb-8 text-center"
          style={{ 
            fontSize: "25px", 
            lineHeight: "140%", 
            letterSpacing: "0%", 
            maxWidth: "750px",
            fontFamily: "var(--font-avant-garde-book)",
          }}
        >
          As AI floods the world with hollow imagery, we stand with human-made art. True art emerges from the dialogue between artist and work, expressing what words cannot, and carrying the unmistakable imprint of its creator.
        </p>

        {/* Scroll Indicator - Arrow */}
        <div 
          className="flex flex-col items-center"
          style={{ marginTop: "40px" }}
        >
          {/* Line */}
          <div 
            style={{ 
              width: "2px",
              height: "34px",
              backgroundColor: "black",
              borderRadius: "1px",
            }}
          />
          {/* V Arrow Head */}
          <div 
            style={{ 
              width: "12px",
              height: "12px",
              borderRight: "2px solid black",
              borderBottom: "2px solid black",
              borderRadius: "0 0 2px 0",
              transform: "rotate(45deg)",
              marginTop: "-12px",
            }}
          />
        </div>
      </div>

      {/* Footer - shared component */}
      <GalleryFooter />
    </div>
  );
}