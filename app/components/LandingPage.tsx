"use client";

import { useState, useEffect } from "react";
import { useMobile } from "../hooks/useMobile";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMobile();

  // Animation sequence with fade out to yellow, then fade in next slide
  useEffect(() => {
    // Initial fade in after mount
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(fadeInTimer);
  }, []);

  // Timing for each slide's display duration (before fade out starts)
  // Slide 0: 1s display, then Buffalo fades out / AI fades in (no yellow gap)
  // Slide 1: 0.75s display, then fade out to yellow
  // Slide 2: 1s display, then fade out to yellow, then enter gallery
  useEffect(() => {
    if (!isVisible && currentSlide === 0) return; // Wait for initial fade in
    
    const displayTimes = [1000, 750, 1000]; // How long each slide displays
    
    const timer = setTimeout(() => {
      if (currentSlide === 0) {
        // Transition from Buffalo to AI - just change slide, no isVisible toggle
        setCurrentSlide(1);
      } else if (currentSlide === 1) {
        // Transition to Logo - fade out to yellow first
        setIsVisible(false);
        setTimeout(() => {
          setCurrentSlide(2);
          setIsVisible(true);
        }, 500);
      } else {
        // After Logo - fade out to yellow, then enter gallery
        setIsVisible(false);
        setTimeout(() => {
          onEnter();
        }, 500);
      }
    }, displayTimes[currentSlide]);

    return () => clearTimeout(timer);
  }, [currentSlide, isVisible, onEnter]);

  // Handle click to advance or enter gallery
  const handleAdvance = () => {
    if (currentSlide === 0) {
      // Direct transition, no fade
      setCurrentSlide(1);
    } else if (currentSlide === 1) {
      // Fade out then show logo
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSlide(2);
        setIsVisible(true);
      }, 500);
    } else {
      // Fade out to yellow, then enter gallery
      setIsVisible(false);
      setTimeout(() => {
        onEnter();
      }, 500);
    }
  };

  return (
    <div
      className="bg-[#F7C41A] flex flex-col items-center justify-center z-[1000] cursor-pointer overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      onClick={handleAdvance}
    >
      {/* Slides 0 & 1: Buffalo/AI + ART IS HUMAN */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: isVisible && currentSlide <= 1 ? 1 : 0,
          pointerEvents: currentSlide <= 1 ? "auto" : "none",
          transition: "opacity 500ms",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? "20px" : "40px",
          }}
        >
          {/* Buffalo/AI container */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "200px" : "605px",
              height: isMobile ? "86px" : "260px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Buffalo - visible on slide 0 */}
            <img
              src="/Landing Page/Buffalo.svg"
              alt="Buffalo"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                opacity: currentSlide === 0 ? 1 : 0,
                transition: "opacity 500ms",
              }}
            />
            {/* AI - visible on slide 1 */}
            <img
              src="/Landing Page/AI.svg"
              alt="AI"
              style={{
                width: isMobile ? "80px" : "244px",
                height: isMobile ? "80px" : "244px",
                position: "absolute",
                opacity: currentSlide === 1 ? 1 : 0,
                transition: "opacity 500ms",
              }}
            />
          </div>
          {/* ART IS HUMAN - stays in place, never fades during slides 0-1 */}
          <img
            src="/Landing Page/ART IS HUMAN.svg"
            alt="Art is Human"
            style={{
              width: isMobile ? "180px" : "360px",
              height: "auto",
            }}
          />
        </div>
      </div>

      {/* Slide 2: Logo */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: isVisible && currentSlide === 2 ? 1 : 0,
          pointerEvents: currentSlide === 2 ? "auto" : "none",
          transition: "opacity 500ms",
        }}
      >
        <img
          src="/Landing Page/Logo.svg"
          alt="Hop Art House Logo"
          style={{
            width: isMobile ? "220px" : "535px",
            height: isMobile ? "96px" : "233px",
          }}
        />
      </div>
    </div>
  );
}
