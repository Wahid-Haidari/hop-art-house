"use client";

import { useState, useEffect } from "react";
import GalleryFooter from "./GalleryFooter";
import { useMobile } from "../hooks/useMobile";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useMobile();

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
      className="fixed top-0 left-0 w-screen h-screen bg-[#F7C41A] flex flex-col justify-center items-center px-10 md:px-[10%] z-[1000]"
      style={{ opacity, pointerEvents }}
    >
      {/* Center Logo - gap to next: 2x */}
      <div 
        className="pointer-events-auto"
        style={{
          width: isMobile ? "280px" : "416px",
          height: isMobile ? "auto" : "218px",
          marginBottom: "58px", // 2x
        }}
      >
        <img
          src="/Landing Page Logo.svg"
          alt="Hop Art House Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* "Without Van Gogh" - gap to next: 1x */}
      <h2 
        className="m-0 text-black text-center w-full max-w-[902px]"
        style={{ 
          fontSize: isMobile ? "18px" : "25px", 
          lineHeight: isMobile ? "130%" : "100%", 
          letterSpacing: "0%",
          fontFamily: "var(--font-avant-garde-medium)",
          marginBottom: "29px", // 1x
        }}
      >
        {isMobile ? (
          "Without Van Gogh, no AI could make an image in his style. Only a human can create a truly unique work of art."
        ) : (
          <>
            Without Van Gogh, no AI could make an image in his style.
            <br />
            Only a human can create a truly unique work of art.
          </>
        )}
      </h2>

      {/* "We stand" - gap to next: 1x */}
      <p 
        className="text-black text-center w-full max-w-[700px]"
        style={{ 
          fontSize: isMobile ? "16px" : "22px", 
          lineHeight: "140%", 
          letterSpacing: "0%", 
          fontFamily: "var(--font-avant-garde-book)",
          marginBottom: "29px", // 1x
        }}
      >
        {isMobile ? (
          "True art emerges from the dialogue between artist and work, expressing what words cannot, and carrying the unmistakable imprint of its creator."
        ) : (
          <>
            True art emerges from the dialogue between artist
            <br />
            and work, expressing what words cannot, and
            <br />
            carrying the unmistakable imprint of its creator.
          </>
        )}
      </p>

      {/* "Let's democratize art" - gap to next: 2x */}
      <p 
        className="text-black text-center"
        style={{ 
          fontSize: isMobile ? "16px" : "22px", 
          lineHeight: "140%", 
          letterSpacing: "0%",
          fontFamily: "var(--font-avant-garde-book)",
          marginBottom: "58px", // 2x
        }}
      >
        Let&apos;s democratize art{isMobile ? "!" : ""}
      </p>

      {/* Arrow */}
      <div className="flex flex-col items-center">
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

      {/* Footer - shared component */}
      <GalleryFooter />
    </div>
  );
}