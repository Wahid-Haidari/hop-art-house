"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { COLORS } from "../colors";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const { getTotalItems } = useCart();

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
      className="fixed top-0 left-0 w-screen h-screen bg-[#F7C41A] flex flex-col justify-start items-center px-[10%] z-[1000] pt-[100px]"
      style={{ opacity, pointerEvents }}
    >
      {/* Center Logo - At the top */}
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
      <div className="text-center max-w-[800px]">

        <h2 className="text-[32px] font-semibold m-0 mb-8 text-black leading-relaxed">
          Without Van Gogh, no AI could make an image in his style.
          <br />
          Only a human can create a truly unique work of art.
        </h2>

        <p className="text-lg leading-relaxed text-black mb-8">
          As AI floods the world with hollow imagery, we stand with human-made art. True art emerges from the dialogue between artist and work, expressing what words cannot, and carrying the unmistakable imprint of its creator.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-[60px] text-base flex items-center justify-center gap-3 text-black">
          <span className="text-2xl">↓</span>
        </div>
      </div>
    </div>
  );
}