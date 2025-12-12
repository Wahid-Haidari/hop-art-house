"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

/**
 * Custom hook to detect if the user is on a mobile device.
 * Uses useSyncExternalStore for proper SSR hydration.
 * @returns {boolean} Whether the device is mobile
 */
export function useMobile(): boolean {
  const subscribe = (callback: () => void) => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  };

  const getSnapshot = () => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768
    );
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
