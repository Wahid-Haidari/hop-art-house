import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

export interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;        // Image for display on wall
  artistLabelPdf: string | null;     // PDF to open on click (optional)
  artistBio: string | null;          // Image for display on wall
  artistBioPdf: string | null;       // PDF to open on click (optional)
  aspectRatio: number;               // height/width ratio of the artwork image
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
const CONFIG_PREFIX = "config/artworks-config";

const defaultConfig: ArtworksConfig = {
  first: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO })) },
  second: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO })) },
  third: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO })) },
  fourth: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, aspectRatio: DEFAULT_ASPECT_RATIO })) },
};

async function readConfig(): Promise<ArtworksConfig> {
  try {
    // List blobs to find our config file (get the most recent one)
    const { blobs } = await list({ prefix: "config/" });
    const configBlobs = blobs
      .filter(b => b.pathname.startsWith(CONFIG_PREFIX))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    
    if (configBlobs.length > 0) {
      const response = await fetch(configBlobs[0].url);
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
    // Write new config with unique name
    const configJson = JSON.stringify(config, null, 2);
    const newConfigName = `${CONFIG_PREFIX}-${Date.now()}.json`;
    
    await put(newConfigName, configJson, {
      access: "public",
      contentType: "application/json",
    });
    
    // Clean up old config files (keep only the newest)
    const { blobs } = await list({ prefix: "config/" });
    const oldConfigs = blobs
      .filter(b => b.pathname.startsWith(CONFIG_PREFIX) && b.pathname !== newConfigName);
    
    // Delete old configs (fire and forget)
    for (const oldConfig of oldConfigs) {
      del(oldConfig.url).catch(() => {});
    }
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
        artistLabelPdf: null,
        artistBio: null,
        artistBioPdf: null,
        aspectRatio: DEFAULT_ASPECT_RATIO,
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
      };
    }

    // Update the specific field based on type
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

    if (field === "aspectRatio") {
      artwork.aspectRatio = typeof url === "number" ? url : parseFloat(url) || DEFAULT_ASPECT_RATIO;
    } else if (field === "artwork") {
      await deleteOldBlob(artwork.artwork, url as string);
      artwork.artwork = url as string;
    } else if (field === "artistLabel") {
      await deleteOldBlob(artwork.artistLabel, url as string);
      artwork.artistLabel = url as string;
    } else if (field === "artistLabelPdf") {
      await deleteOldBlob(artwork.artistLabelPdf, url as string);
      artwork.artistLabelPdf = url as string;
    } else if (field === "artistBio") {
      await deleteOldBlob(artwork.artistBio, url as string);
      artwork.artistBio = url as string;
    } else if (field === "artistBioPdf") {
      await deleteOldBlob(artwork.artistBioPdf, url as string);
      artwork.artistBioPdf = url as string;
    }

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
