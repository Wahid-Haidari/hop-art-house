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
      className="bg-[#F7C41A] flex flex-col items-center px-10 md:px-[10%] z-[1000]"
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        opacity, 
        pointerEvents,
        justifyContent: isMobile ? "flex-start" : "center",
        paddingTop: isMobile ? "15vh" : "0",
      }}
    >
      {/* Center Logo */}
      <div 
        className="pointer-events-auto"
        style={{
          width: isMobile ? "206px" : "416px",
          height: isMobile ? "108px" : "218px",
          marginBottom: isMobile ? "33px" : "58px",
        }}
      >
        <img
          src="/Landing Page Logo.svg"
          alt="Hop Art House Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* "Without Van Gogh" */}
      <h2 
        className="m-0 text-black text-center"
        style={{ 
          width: isMobile ? "282px" : "auto",
          maxWidth: "902px",
          fontSize: isMobile ? "18px" : "25px", 
          lineHeight: isMobile ? "130%" : "100%", 
          letterSpacing: "0%",
          fontFamily: "var(--font-avant-garde-medium)",
          marginBottom: isMobile ? "18px" : "29px",
        }}
      >
        {isMobile ? (
          <>
            Without Van Gogh, no AI could
            <br />
            make an image in his style.
            <br />
            Only a human can create
            <br />
            a truly unique work of art.
          </>
        ) : (
          <>
            Without Van Gogh, no AI could make an image in his style.
            <br />
            Only a human can create a truly unique work of art.
          </>
        )}
      </h2>

      {/* "True Art" */}
      <p 
        className="text-black text-center"
        style={{ 
          width: isMobile ? "298px" : "auto",
          maxWidth: "700px",
          fontSize: isMobile ? "16px" : "22px", 
          lineHeight: "140%", 
          letterSpacing: "0%", 
          fontFamily: "var(--font-avant-garde-book)",
          marginBottom: isMobile ? "17px" : "29px",
        }}
      >
        {isMobile ? (
          <>
            True art emerges from the dialogue
            <br />
            between artist and work, expressing
            <br />
            what words cannot, and carrying the
            <br />
            unmistakable imprint of its creator.
          </>
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

      {/* "Let's democratize art" */}
      <p 
        className="text-black text-center"
        style={{ 
          width: isMobile ? "298px" : "auto",
          fontSize: isMobile ? "16px" : "22px", 
          lineHeight: "140%", 
          letterSpacing: "0%",
          fontFamily: "var(--font-avant-garde-book)",
          marginBottom: isMobile ? "33px" : "58px",
        }}
      >
        Let&apos;s democratize art!
      </p>

      {/* Arrow */}
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={onEnter}
      >
        {/* Line */}
        <div 
          style={{ 
            width: isMobile ? "1.5px" : "2px",
            height: isMobile ? "25px" : "34px",
            backgroundColor: "black",
            borderRadius: "1px",
          }}
        />
        {/* V Arrow Head */}
        <div 
          style={{ 
            width: isMobile ? "10px" : "12px",
            height: isMobile ? "10px" : "12px",
            borderRight: isMobile ? "1.5px solid black" : "2px solid black",
            borderBottom: isMobile ? "1.5px solid black" : "2px solid black",
            borderRadius: "0 0 2px 0",
            transform: "rotate(45deg)",
            marginTop: isMobile ? "-10px" : "-12px",
          }}
        />
      </div>

      {/* Footer - shared component */}
      <GalleryFooter />
    </div>
  );
}