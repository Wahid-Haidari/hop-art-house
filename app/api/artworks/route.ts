import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

export interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;
  artistBio: string | null;
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

const CONFIG_FILENAME = "config/artworks-config.json";

const defaultConfig: ArtworksConfig = {
  first: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistBio: null })) },
  second: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistBio: null })) },
  third: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistBio: null })) },
  fourth: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistBio: null })) },
};

async function readConfig(): Promise<ArtworksConfig> {
  try {
    // List blobs to find our config file
    const { blobs } = await list({ prefix: "config/" });
    const configBlob = blobs.find(b => b.pathname === CONFIG_FILENAME);
    
    if (configBlob) {
      const response = await fetch(configBlob.url);
      if (response.ok) {
        return await response.json();
      }
    }
    return defaultConfig;
  } catch (error) {
    console.error("Error reading config:", error);
    return defaultConfig;
  }
}

async function writeConfig(config: ArtworksConfig) {
  try {
    // Delete existing config if it exists
    const { blobs } = await list({ prefix: "config/" });
    const existingConfig = blobs.find(b => b.pathname === CONFIG_FILENAME);
    if (existingConfig) {
      await del(existingConfig.url);
    }
    
    // Write new config
    const configJson = JSON.stringify(config, null, 2);
    await put(CONFIG_FILENAME, configJson, {
      access: "public",
      contentType: "application/json",
    });
  } catch (error) {
    console.error("Error writing config:", error);
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wall, artworkIndex, field, url } = body;

    if (!wall || artworkIndex === undefined || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
        artistBio: null,
      }));
    }

    // Ensure the artwork object exists
    if (!config[wall as keyof ArtworksConfig].artworks[artworkIndex]) {
      config[wall as keyof ArtworksConfig].artworks[artworkIndex] = {
        artwork: null,
        artistLabel: null,
        artistBio: null,
      };
    }

    // Update the specific field
    config[wall as keyof ArtworksConfig].artworks[artworkIndex][field as keyof WallArtwork] = url;

    await writeConfig(config);

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
