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
          border: "3px solid #1a1a2e",
          width: "100px",
          height: "100px",
          bottom: "26px",
          left: "26px",
        }}
      >
        {/* Arrows - centered between outer edge and yellow center */}
        {/* Up arrow */}
        <div style={{ position: "absolute", top: "2px", left: "50%", transform: "translateX(-50%)", fontSize: "14px", color: "#1a1a2e" }}>↑</div>
        {/* Down arrow */}
        <div style={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", fontSize: "14px", color: "#1a1a2e" }}>↓</div>
        {/* Left arrow */}
        <div style={{ position: "absolute", left: "5px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#1a1a2e" }}>←</div>
        {/* Right arrow */}
        <div style={{ position: "absolute", right: "5px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#1a1a2e" }}>→</div>
        
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

      {/* Look Control Area - Right Side */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        className="fixed right-0 top-0 w-1/2 h-full z-40"
        style={{ touchAction: "none" }}
      />

      {/* Up/Down Buttons - Bottom Right */}
      <div 
        className="fixed z-50 flex flex-col"
        style={{ bottom: "26px", right: "26px", gap: "8px" }}
      >
        <button
          onTouchStart={handleUpStart}
          onTouchEnd={handleUpEnd}
          className="rounded-full flex items-center justify-center font-bold"
          style={{ 
            touchAction: "none",
            backgroundColor: upPressed ? "rgba(180, 180, 180, 0.9)" : "rgba(200, 200, 200, 0.8)",
            border: "3px solid #1a1a2e",
            width: "48px",
            height: "48px",
            fontSize: "18px",
            color: "#1a1a2e",
          }}
        >
          ↑
        </button>
        <button
          onTouchStart={handleDownStart}
          onTouchEnd={handleDownEnd}
          className="rounded-full flex items-center justify-center font-bold"
          style={{ 
            touchAction: "none",
            backgroundColor: downPressed ? "rgba(180, 180, 180, 0.9)" : "rgba(200, 200, 200, 0.8)",
            border: "3px solid #1a1a2e",
            width: "48px",
            height: "48px",
            fontSize: "18px",
            color: "#1a1a2e",
          }}
        >
          ↓
        </button>
      </div>
    </>
  );
}