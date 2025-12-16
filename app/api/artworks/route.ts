import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

// Force dynamic rendering - prevent any caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;        // Image for display on wall
  artistLabelPdf: string | null;     // PDF to open on click (optional)
  artistBio: string | null;          // Image for display on wall
  artistBioPdf: string | null;       // PDF to open on click (optional)
  aspectRatio: number;               // height/width ratio of the artwork image
  displayWidth: number;              // Width in 3D units
  displayHeight: number;             // Height in 3D units
}

export interface WallData {
  artworks: WallArtwork[];
}

export interface ArtworksConfig {
  first: WallData;
  second: WallData;
  third: WallData;
  fourth: WallData;
}

// Default aspect ratio (4:3 portrait)
const DEFAULT_ASPECT_RATIO = 1.33;
const DEFAULT_WIDTH = 1.5;
const DEFAULT_HEIGHT = DEFAULT_WIDTH * DEFAULT_ASPECT_RATIO;
const CONFIG_PREFIX = "config/artworks-config";

// Simple in-memory lock to prevent concurrent writes
let writeLock: Promise<void> | null = null;

// Cache the latest config in memory to avoid eventual consistency issues
let latestConfig: ArtworksConfig | null = null;
let lastWriteTime: number = 0;

const defaultConfig: ArtworksConfig = {
  first: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
  second: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
  third: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
  fourth: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
};

async function readConfig(): Promise<ArtworksConfig> {
  try {
    // If we have a fresh cached config (written in the last 5 seconds), use it
    if (latestConfig && (Date.now() - lastWriteTime) < 5000) {
      console.log("Using cached config from memory (fresh)");
      return JSON.parse(JSON.stringify(latestConfig)); // Deep clone
    }

    // List blobs and sort by filename (which includes timestamp)
    const { blobs } = await list({ prefix: "config/" });
    
    const configBlobs = blobs
      .filter(b => b.pathname.startsWith(CONFIG_PREFIX))
      // Sort by the timestamp in the filename (descending - newest first)
      .sort((a, b) => {
        const timestampA = parseInt(a.pathname.match(/\d+/g)?.pop() || "0");
        const timestampB = parseInt(b.pathname.match(/\d+/g)?.pop() || "0");
        return timestampB - timestampA;
      });
    
    console.log("Found config blobs:", configBlobs.length, "newest:", configBlobs[0]?.pathname);
    
    if (configBlobs.length > 0) {
      // Try to fetch the newest config
      for (let i = 0; i < Math.min(3, configBlobs.length); i++) {
        try {
          console.log("Trying to read config from:", configBlobs[i].pathname);
          const response = await fetch(configBlobs[i].url, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
          });
          if (response.ok) {
            const config = await response.json();
            console.log("Loaded config successfully from:", configBlobs[i].pathname);
            latestConfig = config;
            return config;
          }
        } catch (e) {
          console.error("Failed to fetch config:", configBlobs[i].pathname, e);
        }
      }
    }
    
    console.log("No valid config found, returning default config");
    return latestConfig || defaultConfig;
  } catch (error) {
    console.error("Error reading config:", error);
    return latestConfig || defaultConfig;
  }
}

async function writeConfig(config: ArtworksConfig) {
  try {
    // Write new config with unique name
    const configJson = JSON.stringify(config, null, 2);
    const timestamp = Date.now();
    const newConfigName = `${CONFIG_PREFIX}-${timestamp}.json`;
    
    console.log("Writing new config:", newConfigName);
    
    const result = await put(newConfigName, configJson, {
      access: "public",
      contentType: "application/json",
    });
    
    console.log("Config written successfully:", result.url);
    
    // Update our cached config immediately
    latestConfig = JSON.parse(JSON.stringify(config)); // Deep clone
    lastWriteTime = timestamp;
    
    // Only clean up if we have more than 10 config files (to avoid issues)
    // This cleanup is less aggressive and runs less frequently
    try {
      const { blobs } = await list({ prefix: "config/" });
      const configBlobs = blobs
        .filter(b => b.pathname.startsWith(CONFIG_PREFIX))
        .sort((a, b) => {
          const timestampA = parseInt(a.pathname.match(/\d+/g)?.pop() || "0");
          const timestampB = parseInt(b.pathname.match(/\d+/g)?.pop() || "0");
          return timestampB - timestampA;
        });
      
      // Keep the 5 newest configs, delete the rest
      if (configBlobs.length > 5) {
        const toDelete = configBlobs.slice(5);
        console.log("Cleaning up old configs:", toDelete.length);
        for (const oldConfig of toDelete) {
          del(oldConfig.url).catch(() => {});
        }
      }
    } catch (cleanupError) {
      console.error("Cleanup error (non-fatal):", cleanupError);
    }
  } catch (error) {
    console.error("Error writing config:", error);
    throw error;
  }
}

// Wrapper to ensure sequential config updates
async function updateConfigWithLock(updateFn: (config: ArtworksConfig) => Promise<void>): Promise<void> {
  // Wait for any pending write to complete
  if (writeLock) {
    await writeLock;
  }
  
  // Create a new lock for this operation
  let resolve: () => void;
  writeLock = new Promise<void>((r) => { resolve = r; });
  
  try {
    // Read fresh config
    const config = await readConfig();
    // Apply the update
    await updateFn(config);
    // Write the updated config
    await writeConfig(config);
  } finally {
    // Release the lock
    resolve!();
    writeLock = null;
  }
}

// GET - Retrieve current artwork configuration
export async function GET() {
  try {
    const config = await readConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error reading config:", error);
    return NextResponse.json({ error: "Failed to read configuration" }, { status: 500 });
  }
}

// POST - Save artwork configuration
// Supports single field update: { wall, artworkIndex, field, url }
// Or batch updates: { wall, artworkIndex, updates: { field1: value1, field2: value2, ... } }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wall, artworkIndex, field, url, updates } = body;

    if (!wall || artworkIndex === undefined || (!field && !updates)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let resultConfig: ArtworksConfig | null = null;

    await updateConfigWithLock(async (config) => {
      // Ensure the wall exists and has proper structure
      if (!config[wall as keyof ArtworksConfig]) {
        throw new Error("Invalid wall");
      }

      // Ensure artworks array exists and has proper structure
      if (!Array.isArray(config[wall as keyof ArtworksConfig].artworks)) {
        config[wall as keyof ArtworksConfig].artworks = Array(4).fill(null).map(() => ({
          artwork: null,
          artistLabel: null,
          artistLabelPdf: null,
          artistBio: null,
          artistBioPdf: null,
          aspectRatio: DEFAULT_ASPECT_RATIO,
          displayWidth: DEFAULT_WIDTH,
          displayHeight: DEFAULT_HEIGHT,
        }));
      }

      // Ensure the artwork object exists
      if (!config[wall as keyof ArtworksConfig].artworks[artworkIndex]) {
        config[wall as keyof ArtworksConfig].artworks[artworkIndex] = {
          artwork: null,
          artistLabel: null,
          artistLabelPdf: null,
          artistBio: null,
          artistBioPdf: null,
          aspectRatio: DEFAULT_ASPECT_RATIO,
          displayWidth: DEFAULT_WIDTH,
          displayHeight: DEFAULT_HEIGHT,
        };
      }

      const artwork = config[wall as keyof ArtworksConfig].artworks[artworkIndex];
      
      // Helper to delete old blob if replacing
      const deleteOldBlob = async (oldUrl: string | null, newUrl: string | null) => {
        if (oldUrl && oldUrl !== newUrl && oldUrl.includes("blob.vercel-storage.com")) {
          try {
            await del(oldUrl);
          } catch (error) {
            console.error(`Failed to delete old blob: ${oldUrl}`, error);
          }
        }
      };

      // Helper to update a single field
      const updateField = async (fieldName: string, value: string | number) => {
        if (fieldName === "aspectRatio") {
          artwork.aspectRatio = typeof value === "number" ? value : parseFloat(value as string) || DEFAULT_ASPECT_RATIO;
        } else if (fieldName === "displayWidth") {
          artwork.displayWidth = typeof value === "number" ? value : parseFloat(value as string) || DEFAULT_WIDTH;
        } else if (fieldName === "displayHeight") {
          artwork.displayHeight = typeof value === "number" ? value : parseFloat(value as string) || DEFAULT_HEIGHT;
        } else if (fieldName === "artwork") {
          await deleteOldBlob(artwork.artwork, value as string);
          artwork.artwork = value as string;
        } else if (fieldName === "artistLabel") {
          await deleteOldBlob(artwork.artistLabel, value as string);
          artwork.artistLabel = value as string;
        } else if (fieldName === "artistLabelPdf") {
          await deleteOldBlob(artwork.artistLabelPdf, value as string);
          artwork.artistLabelPdf = value as string;
        } else if (fieldName === "artistBio") {
          await deleteOldBlob(artwork.artistBio, value as string);
          artwork.artistBio = value as string;
        } else if (fieldName === "artistBioPdf") {
          await deleteOldBlob(artwork.artistBioPdf, value as string);
          artwork.artistBioPdf = value as string;
        }
      };

      // Handle batch updates
      if (updates && typeof updates === 'object') {
        for (const [fieldName, value] of Object.entries(updates)) {
          await updateField(fieldName, value as string | number);
        }
      } else if (field) {
        // Handle single field update (backwards compatible)
        await updateField(field, url);
      }

      resultConfig = config;
    });

    return NextResponse.json({ success: true, config: resultConfig });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}

// DELETE - Remove an artwork or specific field
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { wall, artworkIndex, field, blobUrl } = body;

    // Delete the blob if provided
    if (blobUrl && blobUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(blobUrl);
        console.log(`Deleted blob: ${blobUrl}`);
      } catch (error) {
        console.error(`Failed to delete blob: ${blobUrl}`, error);
      }
    }

    // Update the config to remove the field
    if (wall && artworkIndex !== undefined && field) {
      await updateConfigWithLock(async (config) => {
        const artwork = config[wall as keyof ArtworksConfig]?.artworks?.[artworkIndex];
        
        if (artwork) {
          if (field === "artwork") {
            artwork.artwork = null;
          } else if (field === "artistLabel") {
            artwork.artistLabel = null;
          } else if (field === "artistLabelPdf") {
            artwork.artistLabelPdf = null;
          } else if (field === "artistBio") {
            artwork.artistBio = null;
          } else if (field === "artistBioPdf") {
            artwork.artistBioPdf = null;
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
