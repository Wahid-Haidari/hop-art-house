"use client";

import { useState, useEffect } from "react";
import { ArtworkData } from "../artworks";

interface EditModeOverlayProps {
  artworks: ArtworkData[];
  onDimensionChange: (artworkId: string, width: number, height: number) => void;
  onExit: () => void;
}

export default function EditModeOverlay({
  artworks,
  onDimensionChange,
  onExit,
}: EditModeOverlayProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize dimensions from artworks
    const dims: Record<string, { width: number; height: number }> = {};
    artworks.forEach((art) => {
      dims[art.id] = { width: art.width ?? 12, height: art.height ?? 15 };
    });
    setDimensions(dims);
  }, [artworks]);

  const handleSave = async (artworkId: string) => {
    const dim = dimensions[artworkId];
    if (!dim) return;

    setSaving(true);
    
    // Parse the artwork ID to get wall and index
    const [wall, indexStr] = artworkId.split("-");
    const artworkIndex = parseInt(indexStr) - 1;

    try {
      // Save width
      await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wall, artworkIndex, field: "width", url: dim.width }),
      });

      // Save height
      await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wall, artworkIndex, field: "height", url: dim.height }),
      });

      onDimensionChange(artworkId, dim.width, dim.height);
      setSelectedArtwork(null);
    } catch (error) {
      console.error("Failed to save dimensions:", error);
      alert("Failed to save dimensions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(76, 175, 80, 0.95)",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
            EDIT MODE
          </span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
            Click on an artwork to resize it
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href="/admin"
            style={{
              padding: "8px 16px",
              backgroundColor: "white",
              color: "#4CAF50",
              borderRadius: "20px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Back to Admin
          </a>
          <button
            onClick={onExit}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid white",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Exit Edit Mode
          </button>
        </div>
      </div>

      {/* Artwork Labels */}
      {artworks.map((artwork) => {
        const dim = dimensions[artwork.id] || { width: artwork.width, height: artwork.height };
        const isSelected = selectedArtwork === artwork.id;

        return (
          <ArtworkLabel
            key={artwork.id}
            artwork={artwork}
            isSelected={isSelected}
            dimensions={dim}
            saving={saving && isSelected}
            onSelect={() => setSelectedArtwork(artwork.id)}
            onDimensionChange={(w, h) => {
              setDimensions((prev) => ({
                ...prev,
                [artwork.id]: { width: w, height: h },
              }));
            }}
            onSave={() => handleSave(artwork.id)}
            onCancel={() => setSelectedArtwork(null)}
          />
        );
      })}
    </div>
  );
}

interface ArtworkLabelProps {
  artwork: ArtworkData;
  isSelected: boolean;
  dimensions: { width: number; height: number };
  saving: boolean;
  onSelect: () => void;
  onDimensionChange: (width: number, height: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

function ArtworkLabel({
  artwork,
  isSelected,
  dimensions,
  saving,
  onSelect,
  onDimensionChange,
  onSave,
  onCancel,
}: ArtworkLabelProps) {
  // Calculate screen position based on 3D position
  // This is approximate - for a real solution, we'd need to project from 3D to 2D
  const getScreenPosition = () => {
    const [x, y, z] = artwork.position;
    
    // Simple mapping for the 4 walls
    // Back wall (z = -10)
    if (z < -5) {
      const screenX = 50 + (x * 3); // Center around 50%
      return { left: `${screenX}%`, top: "40%" };
    }
    // Front wall (z = 10)
    if (z > 5) {
      const screenX = 50 - (x * 3);
      return { left: `${screenX}%`, top: "40%" };
    }
    // Left wall (x = -10)
    if (x < -5) {
      const screenX = 20 + (z * 2);
      return { left: `${screenX}%`, top: "40%" };
    }
    // Right wall (x = 10)
    if (x > 5) {
      const screenX = 80 - (z * 2);
      return { left: `${screenX}%`, top: "40%" };
    }
    
    return { left: "50%", top: "50%" };
  };

  const pos = getScreenPosition();

  if (!isSelected) {
    return (
      <button
        onClick={onSelect}
        style={{
          position: "absolute",
          ...pos,
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "2px solid #F5C542",
          cursor: "pointer",
          pointerEvents: "auto",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {artwork.title} ({dimensions.width}" × {dimensions.height}")
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        pointerEvents: "auto",
        minWidth: "200px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "12px", color: "black" }}>
        {artwork.title}
      </div>
      
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
        <div>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
            Width (inches)
          </label>
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => onDimensionChange(parseInt(e.target.value) || 1, dimensions.height)}
            min={1}
            max={100}
            style={{
              width: "60px",
              padding: "8px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "14px",
            }}
          />
        </div>
        <span style={{ fontSize: "18px", color: "#666", marginTop: "20px" }}>×</span>
        <div>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
            Height (inches)
          </label>
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => onDimensionChange(dimensions.width, parseInt(e.target.value) || 1)}
            min={1}
            max={100}
            style={{
              width: "60px",
              padding: "8px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            flex: 1,
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f5f5f5",
            color: "#666",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
