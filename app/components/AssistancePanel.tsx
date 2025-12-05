"use client";

import { useState, useEffect } from "react";

interface AssistancePanelProps {
  visible: boolean;
}

export default function AssistancePanel({ visible }: AssistancePanelProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [hoverShowInstructions, setHoverShowInstructions] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowInstructions(true);
      setHoverShowInstructions(false);
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const displayInstructions = showInstructions || hoverShowInstructions;

  return (
    <>
      {displayInstructions ? (
        // Instructions Panel
        <div 
          className="fixed bottom-8 left-28 z-50 pointer-events-auto animate-in fade-in duration-300"
          onMouseLeave={() => setHoverShowInstructions(false)}
        >
          <div 
            className="bg-[#F7C41A] border-4 border-black rounded-lg p-6 shadow-lg"
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
      ) : (
        // Assistance Text
        <div 
          className="fixed z-50 pointer-events-auto"
          style={{ bottom: "23px", left: "100px" }}
          onMouseEnter={() => setHoverShowInstructions(true)}
        >
          <span 
            className="text-black no-underline hover:opacity-70 cursor-pointer"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
          >
            Assistance
          </span>
        </div>
      )}
    </>
  );
}
