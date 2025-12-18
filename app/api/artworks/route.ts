import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { kv } from "../../lib/kv";

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

// KV key for artworks config
const CONFIG_KEY = "artworks:config";

// Default values
const DEFAULT_ASPECT_RATIO = 1.33;
const DEFAULT_WIDTH = 1.5;
const DEFAULT_HEIGHT = DEFAULT_WIDTH * DEFAULT_ASPECT_RATIO;

const defaultConfig: ArtworksConfig = {
  first: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
  second: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
  third: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
  fourth: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO, displayWidth: DEFAULT_WIDTH, displayHeight: DEFAULT_HEIGHT })) },
};

async function readConfig(): Promise<ArtworksConfig> {
  try {
    const config = await kv.get<ArtworksConfig>(CONFIG_KEY);
    if (config) {
      console.log("Loaded config from KV");
      return config;
    }
    console.log("No config in KV, returning default");
    return defaultConfig;
  } catch (error) {
    console.error("Error reading config from KV:", error);
    return defaultConfig;
  }
}

async function writeConfig(config: ArtworksConfig): Promise<void> {
  try {
    await kv.set(CONFIG_KEY, config);
    console.log("Config written to KV successfully");
  } catch (error) {
    console.error("Error writing config to KV:", error);
    throw error;
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

    // Read current config
    const config = await readConfig();

    // Ensure the wall exists and has proper structure
    if (!config[wall as keyof ArtworksConfig]) {
      return NextResponse.json({ error: "Invalid wall" }, { status: 400 });
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
          console.log(`Deleted old blob: ${oldUrl}`);
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

    // Write updated config to KV
    await writeConfig(config);

    return NextResponse.json({ success: true, config });
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
      const config = await readConfig();
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
        
        await writeConfig(config);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
