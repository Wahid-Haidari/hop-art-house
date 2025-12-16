"use client";

import { useState, useEffect } from "react";
import { ArtworkData, wallPositions, defaultArtworks } from "../artworks";

interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;
  artistBio: string | null;
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

// Default placeholder images (keep these as fallback)
const PLACEHOLDER_ART = "/Tigress.jpg";
const PLACEHOLDER_ARTIST_CARD = "/Artist Bio.jpg";
const PLACEHOLDER_INFO_CARD = "/Art Label.jpg";

export function useArtworks() {
  const [artworks, setArtworks] = useState<ArtworkData[]>(defaultArtworks);
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
        const loadedArtworks: ArtworkData[] = [];
        
        const walls: WallName[] = ["first", "second", "third", "fourth"];
        
        walls.forEach((wallName, wallIndex) => {
          const wallConfig = config[wallName];
          const positions = wallPositions[wallName];
          
          // Always create 4 artworks per wall, using defaults if not uploaded
          positions.forEach((pos, artIndex) => {
            const artworkConfig = wallConfig?.artworks?.[artIndex];
            
            loadedArtworks.push({
              id: `${wallName}-${artIndex + 1}`,
              title: `Artwork ${wallIndex * 4 + artIndex + 1}`,
              // Use uploaded image if available, otherwise use default Tigress
              art: artworkConfig?.artwork || PLACEHOLDER_ART,
              // Use uploaded artist bio if available, otherwise use default
              artistCard: artworkConfig?.artistBio || PLACEHOLDER_ARTIST_CARD,
              // Use uploaded artist label if available, otherwise use default
              infoCard: artworkConfig?.artistLabel || PLACEHOLDER_INFO_CARD,
              position: pos.position,
              rotation: pos.rotation,
            });
          });
        });
        
        setArtworks(loadedArtworks);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fall back to default artworks on error
        setArtworks(defaultArtworks);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  return { artworks, isLoading, error };
}
