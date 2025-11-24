"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PlayerContextType {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<[number, number, number]>([3, 1.6, 3]);

  return (
    <PlayerContext.Provider value={{ position, setPosition }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerPosition() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerPosition must be used within PlayerProvider");
  }
  return context;
}