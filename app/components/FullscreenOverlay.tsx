"use client";

import { useEffect } from "react";

interface FullscreenOverlayProps {
  image: string | null;
  onClose: () => void;
}

export default function FullscreenOverlay({ image, onClose }: FullscreenOverlayProps) {
  useEffect(() => {
    if (image) {
      // Force exit pointer lock (only if supported)
      if (document.exitPointerLock) {
        document.exitPointerLock();
        
        // Retry after a small delay to ensure it takes effect
        setTimeout(() => {
          if (document.exitPointerLock) {
            document.exitPointerLock();
          }
        }, 50);
      }
      
      document.body.style.cursor = "auto";
    }
  }, [image]);

  if (!image) return null;

  const isPdf = image.toLowerCase().endsWith(".pdf") || image.includes("application/pdf");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(8px)",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "auto",
        pointerEvents: "auto",     
        zIndex: 9999,
      }}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          fontSize: "24px",
          width: "40px",
          height: "40px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* CONTENT - PDF or IMAGE */}
      {isPdf ? (
        <iframe
          src={image}
          style={{
            width: "90vw",
            height: "90vh",
            borderRadius: "10px",
            border: "none",
            background: "white",
          }}
          title="PDF Viewer"
        />
      ) : (
        <img
          src={image}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            borderRadius: "10px",
          }}
        />
      )}
    </div>
  );
}