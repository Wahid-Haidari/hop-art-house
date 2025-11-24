"use client";

import { useEffect, useState } from "react";

interface ClickToLookProps {
  onLock: () => void;
}

export default function ClickToLook({ onLock }: ClickToLookProps) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsLocked(!!document.pointerLockElement);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    return () => document.removeEventListener("pointerlockchange", handlePointerLockChange);
  }, []);

  const handleClick = () => {
    onLock();
    setIsLocked(true);
  };

  if (isLocked) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white/90 px-8 py-6 rounded-lg text-center">
        <p className="text-2xl font-semibold text-black mb-2">Click to Look Around</p>
        <p className="text-sm text-black/70">Use Mouse to Look, WASD keys to move around, Shift and Space to go up and down. </p>
      </div>
    </div>
  );
}