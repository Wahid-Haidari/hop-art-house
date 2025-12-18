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
function calculateWallPositions(wallName: WallName, artworkCount: number): [number, number, number][] {
  if (artworkCount === 0) return [];
  
  const wall = wallDefinitions[wallName];
  const [rangeStart, rangeEnd] = wall.varyingRange;
  const rangeLength = Math.abs(rangeEnd - rangeStart);
  
  const positions: [number, number, number][] = [];
  
  // Calculate spacing: divide the usable range into artworkCount + 1 sections
  // This gives equal space before first artwork, between artworks, and after last artwork
  const spacing = rangeLength / (artworkCount + 1);
  const direction = rangeEnd > rangeStart ? 1 : -1;
  
  for (let i = 0; i < artworkCount; i++) {
    const offset = spacing * (i + 1) * direction;
    const varyingValue = rangeStart + offset;
    
    let position: [number, number, number];
    if (wall.varyingAxis === 'x') {
      position = [varyingValue, ARTWORK_BOTTOM_HEIGHT, wall.fixedValue];
    } else {
      position = [wall.fixedValue, ARTWORK_BOTTOM_HEIGHT, varyingValue];
    }
    positions.push(position);
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
        const artworkPromises: Promise<ArtworkData | null>[] = [];
        
        const walls: WallName[] = ["first", "second", "third", "fourth"];
        
        walls.forEach((wallName, wallIndex) => {
          const wallConfig = config[wallName];
          
          // First, collect all uploaded artworks for this wall (with their original indices)
          const uploadedArtworks: { artworkConfig: WallArtwork; originalIndex: number }[] = [];
          
          wallConfig?.artworks?.forEach((artworkConfig, artIndex) => {
            if (artworkConfig?.artwork) {
              uploadedArtworks.push({ artworkConfig, originalIndex: artIndex });
            }
          });
          
          // Calculate positions for all uploaded artworks on this wall
          const positions = calculateWallPositions(wallName, uploadedArtworks.length);
          const wallRotation = wallDefinitions[wallName].rotation;
          
          // Create artwork data with dynamically calculated positions
          uploadedArtworks.forEach((item, posIndex) => {
            const { artworkConfig, originalIndex } = item;
            
            const promise = (async (): Promise<ArtworkData> => {
              // Use saved aspectRatio if available, otherwise detect from image
              let artAspectRatio = artworkConfig.aspectRatio;
              if (artAspectRatio == null) {
                artAspectRatio = await getImageAspectRatio(artworkConfig.artwork!);
              }
              
              // Use custom dimensions if provided, otherwise calculate from aspect ratio
              const displayWidth = artworkConfig.displayWidth ?? 1.5;
              const displayHeight = artworkConfig.displayHeight ?? (displayWidth * artAspectRatio);
              
              return {
                id: `${wallName}-${originalIndex + 1}`,
                title: `Artwork ${wallIndex * 4 + originalIndex + 1}`,
                art: artworkConfig.artwork!,
                artistCard: artworkConfig.artistBio || "/Artist Bio.jpg",
                artistCardPdf: artworkConfig.artistBioPdf || null,
                infoCard: artworkConfig.artistLabel || "/Art Label.jpg",
                infoCardPdf: artworkConfig.artistLabelPdf || null,
                position: positions[posIndex],
                rotation: wallRotation,
                aspectRatio: artAspectRatio,
                displayWidth,
                displayHeight,
              };
            })();
            artworkPromises.push(promise);
          });
        });
        
        const loadedArtworks = await Promise.all(artworkPromises);
        setArtworks(loadedArtworks.filter((a): a is ArtworkData => a !== null));
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
