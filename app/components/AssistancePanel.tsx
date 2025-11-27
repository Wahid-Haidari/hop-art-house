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
            className="bg-[#FFC72C] border-4 border-black rounded-lg p-6 shadow-lg"
            style={{ width: "240px" }}
          >
            <div className="text-black text-sm font-medium leading-loose space-y-2">
              <div>
                <span className="font-bold">W:</span> Move forward
              </div>
              <div>
                <span className="font-bold">S:</span> Move backward
              </div>
              <div>
                <span className="font-bold">D:</span> Move right
              </div>
              <div>
                <span className="font-bold">A:</span> Move left
              </div>
              <div className="my-3 border-t-2 border-black"></div>
              <div>
                <span className="font-bold">Space:</span> Up
              </div>
              <div>
                <span className="font-bold">Shift:</span> Down
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Assistance Text
        <div 
          className="fixed bottom-8 left-28 z-50 pointer-events-auto animate-in fade-in duration-300"
          onMouseEnter={() => setHoverShowInstructions(true)}
        >
          <div className="text-black font-bold text-lg hover:opacity-70 cursor-pointer transition-opacity">
            Assistance
          </div>
        </div>
      )}
    </>
  );
}
