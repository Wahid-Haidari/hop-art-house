"use client";

import { useState, useEffect } from "react";
import { ArtworkData } from "../artworks";

interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;
  artistLabelPdf: string | null;
  artistBio: string | null;
  artistBioPdf: string | null;
  aspectRatio?: number;  // height/width ratio
  displayWidth?: number;  // Width in 3D units
  displayHeight?: number; // Height in 3D units
}

interface WallData {
  artworks: WallArtwork[];
}

interface ArtworksConfig {
  first: WallData;
  second: WallData;
  third: WallData;
  fourth: WallData;
}

type WallName = "first" | "second" | "third" | "fourth";

// Default aspect ratio (4:3 portrait)
const DEFAULT_ASPECT_RATIO = 1.33;

// Wall configuration for dynamic positioning
const ARTWORK_BOTTOM_HEIGHT = 2.2;
const WALL_LENGTH = 20; // Total wall length (-10 to 10)

// Wall definitions with their fixed axis and rotation
const wallDefinitions: Record<WallName, {
  fixedAxis: 'x' | 'z';
  fixedValue: number;
  varyingAxis: 'x' | 'z';
  varyingRange: [number, number]; // [start, end] along the varying axis
  rotation: [number, number, number];
}> = {
  // Back wall: z is fixed at -9.95, x varies from -10 to 10
  first: {
    fixedAxis: 'z',
    fixedValue: -9.95,
    varyingAxis: 'x',
    varyingRange: [-10, 10],
    rotation: [0, 0, 0],
  },
  // Right wall: x is fixed at 9.95, z varies from -10 to 10
  second: {
    fixedAxis: 'x',
    fixedValue: 9.95,
    varyingAxis: 'z',
    varyingRange: [-10, 10],
    rotation: [0, -Math.PI / 2, 0],
  },
  // Front wall: z is fixed at 9.95, x varies from 10 to -10 (reversed for proper viewing order)
  third: {
    fixedAxis: 'z',
    fixedValue: 9.95,
    varyingAxis: 'x',
    varyingRange: [10, -10],
    rotation: [0, Math.PI, 0],
  },
  // Left wall: x is fixed at -9.95, z varies from 10 to -10 (reversed for proper viewing order)
  fourth: {
    fixedAxis: 'x',
    fixedValue: -9.95,
    varyingAxis: 'z',
    varyingRange: [10, -10],
    rotation: [0, Math.PI / 2, 0],
  },
};

// Calculate evenly distributed positions for artworks on a wall
// Now takes artwork widths into account for edge-to-edge equal spacing
function calculateWallPositions(
  wallName: WallName, 
  artworkWidths: number[]
): [number, number, number][] {
  if (artworkWidths.length === 0) return [];
  
  const wall = wallDefinitions[wallName];
  const [rangeStart, rangeEnd] = wall.varyingRange;
  const rangeLength = Math.abs(rangeEnd - rangeStart);
  const direction = rangeEnd > rangeStart ? 1 : -1;
  
  // Calculate total width occupied by all artworks
  const totalArtworkWidth = artworkWidths.reduce((sum, w) => sum + w, 0);
  
  // Calculate remaining space for gaps (wall length minus all artwork widths)
  const remainingSpace = rangeLength - totalArtworkWidth;
  
  // Number of gaps = artworks + 1 (gap before first, between each, and after last)
  const numGaps = artworkWidths.length + 1;
  const gapSize = remainingSpace / numGaps;
  
  const positions: [number, number, number][] = [];
  
  // Start from the wall edge
  let currentPos = rangeStart;
  
  for (let i = 0; i < artworkWidths.length; i++) {
    const artWidth = artworkWidths[i];
    
    // Move by gap + half the artwork width to get to center
    currentPos += direction * (gapSize + artWidth / 2);
    
    let position: [number, number, number];
    if (wall.varyingAxis === 'x') {
      position = [currentPos, ARTWORK_BOTTOM_HEIGHT, wall.fixedValue];
    } else {
      position = [wall.fixedValue, ARTWORK_BOTTOM_HEIGHT, currentPos];
    }
    positions.push(position);
    
    // Move past the second half of this artwork for the next iteration
    currentPos += direction * (artWidth / 2);
  }
  
  return positions;
}

// Helper to detect aspect ratio from image URL
async function getImageAspectRatio(url: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalHeight / img.naturalWidth;
      resolve(ratio);
    };
    img.onerror = () => {
      resolve(DEFAULT_ASPECT_RATIO);
    };
    img.src = url;
  });
}

export function useArtworks() {
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await fetch("/api/artworks");
        if (!response.ok) {
          throw new Error("Failed to fetch artworks");
        }
        
        const config: ArtworksConfig = await response.json();
        const allArtworks: ArtworkData[] = [];
        
        const walls: WallName[] = ["first", "second", "third", "fourth"];
        
        for (const wallName of walls) {
          const wallIndex = walls.indexOf(wallName);
          const wallConfig = config[wallName];
          
          // First, collect all uploaded artworks for this wall (with their original indices)
          const uploadedArtworks: { artworkConfig: WallArtwork; originalIndex: number }[] = [];
          
          wallConfig?.artworks?.forEach((artworkConfig, artIndex) => {
            if (artworkConfig?.artwork) {
              uploadedArtworks.push({ artworkConfig, originalIndex: artIndex });
            }
          });
          
          if (uploadedArtworks.length === 0) continue;
          
          // First pass: calculate dimensions for all artworks on this wall
          const artworkData: {
            artworkConfig: WallArtwork;
            originalIndex: number;
            aspectRatio: number;
            displayWidth: number;
            displayHeight: number;
          }[] = [];
          
          for (const item of uploadedArtworks) {
            const { artworkConfig, originalIndex } = item;
            
            // Use saved aspectRatio if available, otherwise detect from image
            let artAspectRatio = artworkConfig.aspectRatio;
            if (artAspectRatio == null) {
              artAspectRatio = await getImageAspectRatio(artworkConfig.artwork!);
            }
            
            // Use custom dimensions if provided, otherwise calculate from aspect ratio
            const displayWidth = artworkConfig.displayWidth ?? 1.5;
            const displayHeight = artworkConfig.displayHeight ?? (displayWidth * artAspectRatio);
            
            artworkData.push({
              artworkConfig,
              originalIndex,
              aspectRatio: artAspectRatio,
              displayWidth,
              displayHeight,
            });
          }
          
          // Get all widths for position calculation
          const artworkWidths = artworkData.map(a => a.displayWidth);
          
          // Calculate positions based on actual widths (edge-to-edge equal spacing)
          const positions = calculateWallPositions(wallName, artworkWidths);
          const wallRotation = wallDefinitions[wallName].rotation;
          
          // Create final artwork data with positions
          artworkData.forEach((item, posIndex) => {
            allArtworks.push({
              id: `${wallName}-${item.originalIndex + 1}`,
              title: `Artwork ${wallIndex * 4 + item.originalIndex + 1}`,
              art: item.artworkConfig.artwork!,
              artistCard: item.artworkConfig.artistBio || "/Artist Bio.jpg",
              artistCardPdf: item.artworkConfig.artistBioPdf || null,
              infoCard: item.artworkConfig.artistLabel || "/Art Label.jpg",
              infoCardPdf: item.artworkConfig.artistLabelPdf || null,
              position: positions[posIndex],
              rotation: wallRotation,
              aspectRatio: item.aspectRatio,
              displayWidth: item.displayWidth,
              displayHeight: item.displayHeight,
            });
          });
        }
        
        setArtworks(allArtworks);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fall back to empty array on error (no default artworks)
        setArtworks([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  return { artworks, isLoading, error };
}
