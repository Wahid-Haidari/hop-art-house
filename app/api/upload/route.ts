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

    // Validate file type based on field
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    
    if (field === "artwork" || field === "artistLabel" || field === "artistBio") {
      // These fields must be images (displayed on wall)
      if (!isImage) {
        return NextResponse.json({ error: "This field requires an image file" }, { status: 400 });
      }
    } else if (field === "artistLabelPdf" || field === "artistBioPdf") {
      // These fields must be PDFs (opened on click)
      if (!isPDF) {
        return NextResponse.json({ error: "This field requires a PDF file" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid field type" }, { status: 400 });
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
