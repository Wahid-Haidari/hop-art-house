"use client";

import { useState, useEffect } from "react";
import { useMobile } from "../hooks/useMobile";

interface AssistancePanelProps {
  visible: boolean;
}

export default function AssistancePanel({ visible }: AssistancePanelProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [hoverShowInstructions, setHoverShowInstructions] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    if (visible) {
      setShowInstructions(true);
      setHoverShowInstructions(false);
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Don't show on mobile
  if (!visible || isMobile) return null;

  const displayInstructions = showInstructions || hoverShowInstructions;

  return (
    <div 
      className="fixed z-50 pointer-events-auto"
      style={{ bottom: "23px", left: "100px" }}
      onMouseEnter={() => setHoverShowInstructions(true)}
      onMouseLeave={() => setHoverShowInstructions(false)}
    >
      {displayInstructions ? (
        // Instructions Panel - positioned above the trigger
        <div className="absolute bottom-full left-0 mb-2 animate-in fade-in duration-300">
          <div 
            className="bg-[#F7C41A] border-2 border-black rounded-lg p-6 shadow-lg"
            style={{ width: "240px" }}
          >
            <div className="text-black text-sm leading-loose space-y-2" style={{ fontFamily: "var(--font-avant-garde-book)" }}>
              <div>
                <span style={{ fontFamily: "var(--font-avant-garde-medium)" }}>W:</span> Move forward
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-avant-garde-medium)" }}>S:</span> Move backward
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-avant-garde-medium)" }}>D:</span> Move right
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-avant-garde-medium)" }}>A:</span> Move left
              </div>
              <div className="my-3 border-t-2 border-black"></div>
              <div>
                <span style={{ fontFamily: "var(--font-avant-garde-medium)" }}>Space:</span> Up
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-avant-garde-medium)" }}>Shift:</span> Down
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Assistance Text - always present as hover trigger */}
      <span 
        className="text-black no-underline hover:opacity-70 cursor-pointer"
        style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
      >
        Assistance
      </span>
    </div>
  );
}
