"use client";

import { useState, useEffect } from "react";
import { ArtworkData, wallPositions } from "../artworks";

interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;
  artistLabelPdf: string | null;
  artistBio: string | null;
  artistBioPdf: string | null;
  aspectRatio?: number;  // height/width ratio
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
          const positions = wallPositions[wallName];
          
          // Only show artworks that have been uploaded (have an artwork image)
          positions.forEach((pos, artIndex) => {
            const artworkConfig = wallConfig?.artworks?.[artIndex];
            
            // Only add artwork if it has an uploaded image
            if (artworkConfig?.artwork) {
              const promise = (async (): Promise<ArtworkData> => {
                // Use saved aspectRatio if available, otherwise detect from image
                let artAspectRatio = artworkConfig.aspectRatio;
                if (artAspectRatio == null) {
                  artAspectRatio = await getImageAspectRatio(artworkConfig.artwork!);
                }
                
                return {
                  id: `${wallName}-${artIndex + 1}`,
                  title: `Artwork ${wallIndex * 4 + artIndex + 1}`,
                  art: artworkConfig.artwork!,
                  artistCard: artworkConfig.artistBio || "/Artist Bio.jpg",
                  artistCardPdf: artworkConfig.artistBioPdf || null,
                  infoCard: artworkConfig.artistLabel || "/Art Label.jpg",
                  infoCardPdf: artworkConfig.artistLabelPdf || null,
                  position: pos.position,
                  rotation: pos.rotation,
                  aspectRatio: artAspectRatio,
                };
              })();
              artworkPromises.push(promise);
            }
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
