import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const wall = formData.get("wall") as string;
    const artworkIndex = formData.get("artworkIndex") as string;
    const field = formData.get("field") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    // Validate file type - images for artwork, images or PDFs for labels/bios
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    
    if (field === "artwork") {
      // Artwork must be an image
      if (!isImage) {
        return NextResponse.json({ error: "Artwork must be an image file" }, { status: 400 });
      }
    } else {
      // Artist label and bio can be image or PDF
      if (!isImage && !isPDF) {
        return NextResponse.json({ error: "Only image or PDF files are allowed" }, { status: 400 });
      }
    }

    // Create a unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `artworks/${wall}-${artworkIndex}-${field}-${timestamp}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
      fileType: isPDF ? "pdf" : "image",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
