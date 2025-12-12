"use client";

import { useEffect, useState, useRef } from "react";
import { useMobile } from "../hooks/useMobile";

export default function MobileControls() {
  const isMobile = useMobile();
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lookTouchRef = useRef<{ x: number; y: number } | null>(null);
  const [upPressed, setUpPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);

  // Joystick movement
  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (rect) {
      touchStartRef.current = {
        x: touch.clientX - rect.left - rect.width / 2,
        y: touch.clientY - rect.top - rect.height / 2,
      };
      setJoystickActive(true);
    }
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickActive || !touchStartRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      let deltaX = touch.clientX - centerX;
      let deltaY = touch.clientY - centerY;

      // Limit joystick range
      const maxDistance = 40;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }

      setJoystickPosition({ x: deltaX, y: deltaY });

      // Normalize to -1 to 1 and dispatch event
      const normalizedX = deltaX / maxDistance;
      const normalizedY = -deltaY / maxDistance; // Invert Y

      window.dispatchEvent(
        new CustomEvent("joystick-move", {
          detail: { forward: normalizedY, right: normalizedX },
        })
      );
    }
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPosition({ x: 0, y: 0 });
    touchStartRef.current = null;
    window.dispatchEvent(
      new CustomEvent("joystick-move", {
        detail: { forward: 0, right: 0 },
      })
    );
  };

  // Look around with touch drag on right side
  const handleLookStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    lookTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookMove = (e: React.TouchEvent) => {
    if (!lookTouchRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lookTouchRef.current.x;
    const deltaY = touch.clientY - lookTouchRef.current.y;

    window.dispatchEvent(
      new CustomEvent("look-move", {
        detail: { x: deltaX * 0.003, y: deltaY * 0.003 },
      })
    );

    lookTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookEnd = () => {
    lookTouchRef.current = null;
  };

  // Up/Down button handlers
  const handleUpStart = () => {
    setUpPressed(true);
    window.dispatchEvent(new CustomEvent("up-button"));
  };

  const handleUpEnd = () => {
    setUpPressed(false);
    window.dispatchEvent(new CustomEvent("button-release"));
  };

  const handleDownStart = () => {
    setDownPressed(true);
    window.dispatchEvent(new CustomEvent("down-button"));
  };

  const handleDownEnd = () => {
    setDownPressed(false);
    window.dispatchEvent(new CustomEvent("button-release"));
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Movement Joystick - Bottom Left */}
      <div
        ref={joystickRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        className="fixed z-50 rounded-full flex items-center justify-center"
        style={{ 
          touchAction: "none", 
          backgroundColor: "rgba(200, 200, 200, 0.8)", 
          width: "100px",
          height: "100px",
          bottom: "26px",
          left: "26px",
        }}
      >
        {/* Arrows - using SVG with line body + arrowhead */}
        {/* Up arrow */}
        <div style={{ position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)" }}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="16" x2="7" y2="4" />
            <polyline points="2 8 7 3 12 8" />
          </svg>
        </div>
        {/* Down arrow */}
        <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)" }}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="2" x2="7" y2="14" />
            <polyline points="2 10 7 15 12 10" />
          </svg>
        </div>
        {/* Left arrow */}
        <div style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)" }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="16" y1="7" x2="4" y2="7" />
            <polyline points="8 2 3 7 8 12" />
          </svg>
        </div>
        {/* Right arrow */}
        <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)" }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="7" x2="14" y2="7" />
            <polyline points="10 2 15 7 10 12" />
          </svg>
        </div>
        
        {/* Center knob */}
        <div
          className="rounded-full transition-transform"
          style={{
            width: "40px",
            height: "40px",
            transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
            backgroundColor: "#F7C41A",
            border: "2px solid #1a1a2e",
          }}
        />
      </div>

      {/* Look Control Area - Bottom center between joystick and up/down buttons */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        className="fixed z-40"
        style={{ 
          touchAction: "none", 
          bottom: "0",
          left: "140px",
          right: "90px",
          height: "160px",
        }}
      />

      {/* Look Control Area - Top portion of screen */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        className="fixed left-0 top-0 w-full z-40"
        style={{ touchAction: "none", height: "40%" }}
      />

      {/* Up/Down Buttons - Bottom Right */}
      <div 
        className="fixed z-50 flex flex-col"
        style={{ bottom: "26px", right: "26px", gap: "8px" }}
      >
        <button
          onTouchStart={handleUpStart}
          onTouchEnd={handleUpEnd}
          className="rounded-full flex items-center justify-center"
          style={{ 
            touchAction: "none",
            backgroundColor: upPressed ? "rgba(180, 180, 180, 0.9)" : "rgba(200, 200, 200, 0.8)",
            width: "48px",
            height: "48px",
          }}
        >
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="16" x2="7" y2="4" />
            <polyline points="2 8 7 3 12 8" />
          </svg>
        </button>
        <button
          onTouchStart={handleDownStart}
          onTouchEnd={handleDownEnd}
          className="rounded-full flex items-center justify-center"
          style={{ 
            touchAction: "none",
            backgroundColor: downPressed ? "rgba(180, 180, 180, 0.9)" : "rgba(200, 200, 200, 0.8)",
            width: "48px",
            height: "48px",
          }}
        >
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="2" x2="7" y2="14" />
            <polyline points="2 10 7 15 12 10" />
          </svg>
        </button>
      </div>
    </>
  );
}