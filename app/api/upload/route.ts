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

    // Create a unique filename with timestamp and random suffix
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `artworks/${wall}-${artworkIndex}-${field}-${timestamp}-${randomSuffix}-${originalName}`;

    // Upload to Vercel Blob
    try {
      const blob = await put(filename, file, {
        access: "public",
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: blob.pathname,
        fileType: isPDF ? "pdf" : "image",
      });
    } catch (uploadError: unknown) {
      console.error("Vercel Blob upload error:", uploadError);
      console.error("File details - name:", file.name, "size:", file.size, "type:", file.type);
      
      // Check for specific error types
      const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
      const errorName = uploadError instanceof Error ? uploadError.name : "Unknown";
      
      console.error("Error name:", errorName, "Error message:", errorMessage);
      
      if (errorMessage.includes("Forbidden") || errorMessage.includes("403") || errorMessage.includes("blocked")) {
        return NextResponse.json({ 
          error: "Upload blocked. The image may be too large or flagged by content moderation. Try compressing the image or using a smaller file." 
        }, { status: 403 });
      }
      
      if (errorMessage.includes("too large") || errorMessage.includes("size")) {
        return NextResponse.json({ 
          error: `File too large. Vercel Blob has a 4.5MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` 
        }, { status: 413 });
      }
      
      return NextResponse.json({ 
        error: `Upload failed: ${errorMessage}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Upload failed: ${errorMessage}` }, { status: 500 });
  }
}
