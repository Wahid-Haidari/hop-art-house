"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartContext";

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
      className="fixed top-0 left-0 w-screen h-screen bg-[#FFC72C] flex flex-col justify-center items-center px-[10%] z-[1000]"
      style={{ opacity, pointerEvents }}
    >
      {/* Logo - Bottom Left */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-auto">
        <img
          src="/Frog Logo.svg"
          className="w-12 h-12"
          alt="Hop Art House"
        />
      </div>

      {/* Header - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
        <div className="flex gap-6 items-center px-6 py-4 rounded-full">
          <a href="#about" className="text-black no-underline hover:opacity-70 cursor-pointer text-sm font-medium">About</a>
          <a href="#hi" className="text-black no-underline hover:opacity-70 cursor-pointer text-sm font-medium">Hi@HopArt.House</a>
          <a href="#featured" className="text-black no-underline hover:opacity-70 cursor-pointer text-sm font-medium">Get Featured</a>
          
          <div className="flex items-center gap-2 text-black cursor-pointer hover:opacity-70 pl-4 border-l border-black/20">
            <img
              src="/Cart.svg"
              className="w-6 h-6"
              alt="cart"
            />
            <span className="font-semibold">{getTotalItems()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1000px] text-left">
        <h1 className="text-[80px] font-bold m-0 mb-8 leading-tight text-black">
          HOP ART HOUSE
        </h1>

        <h2 className="text-[28px] font-semibold m-0 mb-5 text-black">
          Without Van Gogh, no AI could make an image in his style.
          <br />
          Only a human can create a truly unique work of art.
        </h2>

        <p className="text-lg leading-relaxed mb-8 text-black">
          Replacing art with AI-generated images for the sake of efficiency is like turning a
          breathtaking waterfall into a water park slide: profitable and practical, perhaps,
          but stripped of its natural beauty.
        </p>

        <p className="text-lg leading-relaxed text-black">
          Hop Art House celebrates human-made digital art in the age of AI. We showcase
          authentic, soulful creations and turn them into physical editions that honour the
          artist's touch and intention.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-[60px] text-base flex items-center gap-3 text-black">
          <span>Scroll down to enter gallery</span>
          <span className="text-2xl">↓</span>
        </div>
      </div>
    </div>
  );
}