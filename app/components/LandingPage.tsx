"use client";

import { useState, useEffect } from "react";
import { useMobile } from "../hooks/useMobile";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  // Separate visibility for Buffalo, AI, and ART IS HUMAN
  const [buffaloVisible, setBuffaloVisible] = useState(true);
  const [aiVisible, setAiVisible] = useState(false);
  const [artIsHumanVisible, setArtIsHumanVisible] = useState(true);
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
  // Slide 0: 1s display, then Buffalo fades to yellow, AI fades in (ART IS HUMAN stays)
  // Slide 1: 0.75s display, then fade out to yellow
  // Slide 2: 1s display, then fade out to yellow, then enter gallery
  useEffect(() => {
    if (!isVisible && currentSlide === 0) return; // Wait for initial fade in
    
    const displayTimes = [1000, 750, 1000]; // How long each slide displays
    
    const timer = setTimeout(() => {
      if (currentSlide === 0) {
        // Fade Buffalo to yellow, then fade in AI
        setBuffaloVisible(false);
        setTimeout(() => {
          setAiVisible(true);
          setCurrentSlide(1);
        }, 500);
      } else if (currentSlide === 1) {
        // Transition to Logo - fade out AI and ART IS HUMAN together
        setAiVisible(false);
        setArtIsHumanVisible(false);
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
      // Fade Buffalo to yellow, then fade in AI
      setBuffaloVisible(false);
      setTimeout(() => {
        setAiVisible(true);
        setCurrentSlide(1);
      }, 500);
    } else if (currentSlide === 1) {
      // Fade out AI and ART IS HUMAN together, then show logo
      setAiVisible(false);
      setArtIsHumanVisible(false);
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
            {/* Buffalo - fades to yellow */}
            <img
              src="/Landing Page/Buffalo.svg"
              alt="Buffalo"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                opacity: buffaloVisible ? 1 : 0,
                transition: "opacity 500ms",
              }}
            />
            {/* AI - fades in from yellow */}
            <img
              src="/Landing Page/AI.svg"
              alt="AI"
              style={{
                width: isMobile ? "80px" : "244px",
                height: isMobile ? "80px" : "244px",
                position: "absolute",
                opacity: aiVisible ? 1 : 0,
                transition: "opacity 500ms",
              }}
            />
          </div>
          {/* ART IS HUMAN - fades with AI when transitioning to Logo */}
          <img
            src="/Landing Page/ART IS HUMAN.svg"
            alt="Art is Human"
            style={{
              width: isMobile ? "180px" : "360px",
              height: "auto",
              opacity: artIsHumanVisible ? 1 : 0,
              transition: "opacity 500ms",
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
