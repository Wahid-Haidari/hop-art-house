import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

export interface WallArtwork {
  artwork: string | null;
  artistLabel: string | null;        // Image for display on wall
  artistLabelPdf: string | null;     // PDF to open on click (optional)
  artistBio: string | null;          // Image for display on wall
  artistBioPdf: string | null;       // PDF to open on click (optional)
  width: number;
  height: number;
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
  first: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, width: 12, height: 15 })) },
  second: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, width: 12, height: 15 })) },
  third: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, width: 12, height: 15 })) },
  fourth: { artworks: Array(4).fill(null).map(() => ({ artwork: null, artistLabel: null, artistLabelPdf: null, artistBio: null, artistBioPdf: null, width: 12, height: 15 })) },
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
        artistLabelPdf: null,
        artistBio: null,
        artistBioPdf: null,
        width: 12,
        height: 15,
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
        width: 12,
        height: 15,
      };
    }

    // Update the specific field based on type
    const artwork = config[wall as keyof ArtworksConfig].artworks[artworkIndex];
    
    // Helper to delete old blob if it exists and is different from new URL
    const deleteOldBlob = async (oldUrl: string | null, newUrl: string | null) => {
      if (oldUrl && oldUrl !== newUrl && oldUrl.includes("blob.vercel-storage.com")) {
        try {
          await del(oldUrl);
          console.log(`Deleted old blob: ${oldUrl}`);
        } catch (error) {
          console.error(`Failed to delete old blob: ${oldUrl}`, error);
          // Don't throw - we still want to update the config even if delete fails
        }
      }
    };

    if (field === "width") {
      artwork.width = typeof url === "number" ? url : parseInt(url) || 12;
    } else if (field === "height") {
      artwork.height = typeof url === "number" ? url : parseInt(url) || 15;
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

// DELETE - Remove a specific artwork field and its blob
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { wall, artworkIndex, field } = body;

    if (!wall || artworkIndex === undefined || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validFields = ["artwork", "artistLabel", "artistLabelPdf", "artistBio", "artistBioPdf"];
    if (!validFields.includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    const config = await readConfig();

    if (!config[wall as keyof ArtworksConfig]) {
      return NextResponse.json({ error: "Invalid wall" }, { status: 400 });
    }

    const artwork = config[wall as keyof ArtworksConfig].artworks[artworkIndex];
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const oldUrl = artwork[field as keyof WallArtwork] as string | null;
    
    // Delete the blob if it exists
    if (oldUrl && oldUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(oldUrl);
        console.log(`Deleted blob: ${oldUrl}`);
      } catch (error) {
        console.error(`Failed to delete blob: ${oldUrl}`, error);
      }
    }

    // Clear the field in config
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting artwork field:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
