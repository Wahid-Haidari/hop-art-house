"use client";

import { useEffect, useState, useRef } from "react";

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lookTouchRef = useRef<{ x: number; y: number } | null>(null);
  const [upPressed, setUpPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        className="fixed bottom-24 left-8 z-50 w-32 h-32 rounded-full flex items-center justify-center"
        style={{ touchAction: "none", backgroundColor: "rgba(0, 0, 0, 0.4)", border: "4px solid rgba(0, 0, 0, 0.4)" }}
      >
        <div
          className="w-12 h-12 rounded-full transition-transform"
          style={{
            transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
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
      >
        <div 
          className="absolute top-4 right-4 text-white text-sm px-3 py-2 rounded pointer-events-none"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          Drag to look
        </div>
      </div>

      {/* Up/Down Buttons - Bottom Right */}
      <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-2">
        <button
          onTouchStart={handleUpStart}
          onTouchEnd={handleUpEnd}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ 
            touchAction: "none",
            backgroundColor: upPressed ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.4)",
            border: "4px solid rgba(0, 0, 0, 0.4)"
          }}
        >
          ↑
        </button>
        <button
          onTouchStart={handleDownStart}
          onTouchEnd={handleDownEnd}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ 
            touchAction: "none",
            backgroundColor: downPressed ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.4)",
            border: "4px solid rgba(0, 0, 0, 0.4)"
          }}
        >
          ↓
        </button>
      </div>

      {/* Instructions */}
      <div 
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 text-white px-4 py-2 rounded text-sm text-center pointer-events-none"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        Left: Move • Right: Look • Tap artwork to view
      </div>
    </>
  );
}