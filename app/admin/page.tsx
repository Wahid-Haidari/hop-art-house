"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";

type WallName = "first" | "second" | "third" | "fourth";

interface ArtworkUpload {
  artwork: string | null;
  artworkPreview: string | null;
  artistLabel: string | null;
  artistLabelPreview: string | null;
  artistLabelPdf: string | null;
  artistLabelPdfPreview: string | null;
  artistBio: string | null;
  artistBioPreview: string | null;
  artistBioPdf: string | null;
  artistBioPdfPreview: string | null;
  aspectRatio: number;  // height/width ratio
}

interface WallData {
  artworks: ArtworkUpload[];
}

const initialArtwork: ArtworkUpload = {
  artwork: null,
  artworkPreview: null,
  artistLabel: null,
  artistLabelPreview: null,
  artistLabelPdf: null,
  artistLabelPdfPreview: null,
  artistBio: null,
  artistBioPreview: null,
  artistBioPdf: null,
  artistBioPdfPreview: null,
  aspectRatio: 1.33,  // Default 4:3 portrait
};

const wallNames: { key: WallName; label: string; description: string }[] = [
  { key: "first", label: "First Wall", description: "Back Wall" },
  { key: "second", label: "Second Wall", description: "Right Wall" },
  { key: "third", label: "Third Wall", description: "Front Wall" },
  { key: "fourth", label: "Fourth Wall", description: "Left Wall" },
];

export default function AdminPage() {
  const [selectedWall, setSelectedWall] = useState<WallName>("first");
  const [wallData, setWallData] = useState<Record<WallName, WallData>>({
    first: { artworks: Array(4).fill(null).map(() => ({ ...initialArtwork })) },
    second: { artworks: Array(4).fill(null).map(() => ({ ...initialArtwork })) },
    third: { artworks: Array(4).fill(null).map(() => ({ ...initialArtwork })) },
    fourth: { artworks: Array(4).fill(null).map(() => ({ ...initialArtwork })) },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [deletingField, setDeletingField] = useState<string | null>(null);

  // Load existing configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/artworks");
      if (response.ok) {
        const config = await response.json();
        // Convert the saved config to include preview URLs
        const newWallData: Record<WallName, WallData> = {
          first: { artworks: [] },
          second: { artworks: [] },
          third: { artworks: [] },
          fourth: { artworks: [] },
        };

        for (const wallKey of ["first", "second", "third", "fourth"] as WallName[]) {
          newWallData[wallKey].artworks = Array(4).fill(null).map((_, index) => {
            const saved = config[wallKey]?.artworks?.[index];
            return {
              artwork: saved?.artwork || null,
              artworkPreview: saved?.artwork || null,
              artistLabel: saved?.artistLabel || null,
              artistLabelPreview: saved?.artistLabel || null,
              artistLabelPdf: saved?.artistLabelPdf || null,
              artistLabelPdfPreview: saved?.artistLabelPdf || null,
              artistBio: saved?.artistBio || null,
              artistBioPreview: saved?.artistBio || null,
              artistBioPdf: saved?.artistBioPdf || null,
              artistBioPdfPreview: saved?.artistBioPdf || null,
              aspectRatio: saved?.aspectRatio ?? 1.33,
            };
          });
        }

        setWallData(newWallData);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    wallKey: WallName,
    artworkIndex: number,
    field: "artwork" | "artistLabel" | "artistLabelPdf" | "artistBio" | "artistBioPdf"
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("wall", wallKey);
    formData.append("artworkIndex", artworkIndex.toString());
    formData.append("field", field);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const saveToConfig = async (
    wallKey: WallName,
    artworkIndex: number,
    field: "artwork" | "artistLabel" | "artistLabelPdf" | "artistBio" | "artistBioPdf" | "aspectRatio",
    value: string | number
  ) => {
    try {
      const response = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wall: wallKey, artworkIndex, field, url: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Save config error:", error);
      throw error;
    }
  };

  // Helper to get image aspect ratio
  const getImageAspectRatio = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // aspectRatio = height / width (for portrait images > 1, for landscape < 1)
        const ratio = img.height / img.width;
        URL.revokeObjectURL(img.src);
        resolve(ratio);
      };
      img.onerror = () => {
        resolve(1.33); // Default to 4:3 portrait on error
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (
    wallKey: WallName,
    artworkIndex: number,
    field: "artwork" | "artistLabel" | "artistLabelPdf" | "artistBio" | "artistBioPdf",
    file: File
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const fieldKey = `${wallKey}-${artworkIndex}-${field}`;
    setUploadingField(fieldKey);

    try {
      // If uploading artwork image, detect aspect ratio
      let aspectRatio: number | null = null;
      if (field === "artwork" && file.type.startsWith("image/")) {
        aspectRatio = await getImageAspectRatio(file);
      }

      // Create local preview first
      const reader = new FileReader();
      reader.onloadend = () => {
        setWallData((prev) => {
          const newData = { ...prev };
          const newArtworks = [...newData[wallKey].artworks];
          newArtworks[artworkIndex] = {
            ...newArtworks[artworkIndex],
            [`${field}Preview`]: reader.result as string,
            ...(aspectRatio !== null ? { aspectRatio } : {}),
          };
          newData[wallKey] = { artworks: newArtworks };
          return newData;
        });
      };
      reader.readAsDataURL(file);

      // Upload file to server
      const url = await uploadFile(file, wallKey, artworkIndex, field);

      if (url) {
        // Save to config
        await saveToConfig(wallKey, artworkIndex, field, url);
        
        // If we detected aspect ratio, save it too
        if (aspectRatio !== null) {
          await saveToConfig(wallKey, artworkIndex, "aspectRatio", aspectRatio);
        }

        // Update state with the permanent URL
        setWallData((prev) => {
          const newData = { ...prev };
          const newArtworks = [...newData[wallKey].artworks];
          newArtworks[artworkIndex] = {
            ...newArtworks[artworkIndex],
            [field]: url,
            [`${field}Preview`]: url,
            ...(aspectRatio !== null ? { aspectRatio } : {}),
          };
          newData[wallKey] = { artworks: newArtworks };
          return newData;
        });
      }
    } catch (error) {
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    wallKey: WallName,
    artworkIndex: number,
    field: "artwork" | "artistLabel" | "artistLabelPdf" | "artistBio" | "artistBioPdf"
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const isPdfField = field === "artistLabelPdf" || field === "artistBioPdf";
    const isValidFile = isPdfField 
      ? file?.type === "application/pdf"
      : file?.type.startsWith("image/");
    if (file && isValidFile) {
      handleFileSelect(wallKey, artworkIndex, field, file);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    wallKey: WallName,
    artworkIndex: number,
    field: "artwork" | "artistLabel" | "artistLabelPdf" | "artistBio" | "artistBioPdf"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(wallKey, artworkIndex, field, file);
    }
  };

  const handleDelete = async (
    wallKey: WallName,
    artworkIndex: number,
    field: "artwork" | "artistLabel" | "artistLabelPdf" | "artistBio" | "artistBioPdf"
  ) => {
    const fieldKey = `${wallKey}-${artworkIndex}-${field}`;
    const currentData = wallData[wallKey].artworks[artworkIndex];
    const blobUrl = currentData[field];
    
    if (!blobUrl) return;
    
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    setDeletingField(fieldKey);
    
    try {
      // Delete from Vercel Blob and update config
      const response = await fetch("/api/artworks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          wall: wallKey, 
          artworkIndex, 
          field, 
          blobUrl 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Update local state
      setWallData((prev) => {
        const newData = { ...prev };
        const newArtworks = [...newData[wallKey].artworks];
        newArtworks[artworkIndex] = {
          ...newArtworks[artworkIndex],
          [field]: null,
          [`${field}Preview`]: null,
        };
        newData[wallKey] = { artworks: newArtworks };
        return newData;
      });
    } catch (error) {
      alert(`Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setDeletingField(null);
    }
  };

  if (isLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#E8E4EC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "18px", color: "black" }}>Loading...</div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8E4EC",
        padding: "60px 40px",
        fontFamily: "var(--font-avant-garde-book), Arial, sans-serif",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "60px",
          color: "black",
          fontFamily: "var(--font-avant-garde-demi), Arial, sans-serif",
        }}
      >
        CURATION
      </h1>

      <div style={{ display: "flex", gap: "60px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Wall Selection Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "40px" }}>
          {wallNames.map((wall) => (
            <button
              key={wall.key}
              onClick={() => setSelectedWall(wall.key)}
              style={{
                padding: "12px 24px",
                borderRadius: "20px",
                border: "2px solid black",
                backgroundColor: selectedWall === wall.key ? "#F5C542" : "white",
                color: "black",
                fontSize: "14px",
                fontFamily: "var(--font-avant-garde-book), Arial, sans-serif",
                cursor: "pointer",
                minWidth: "140px",
                transition: "background-color 0.2s ease",
                textAlign: "center",
              }}
            >
              <div>{wall.label}</div>
              <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}>{wall.description}</div>
            </button>
          ))}
        </div>

        {/* Artwork Upload Section */}
        <div style={{ flex: 1 }}>
          {wallData[selectedWall].artworks.map((artworkData, index) => (
            <div key={index} style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "16px",
                  color: "black",
                }}
              >
                Artwork {index + 1}:
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Artwork Upload */}
                <UploadBox
                  label="Artwork"
                  preview={artworkData.artworkPreview}
                  onDrop={(e) => handleDrop(e, selectedWall, index, "artwork")}
                  onInputChange={(e) => handleInputChange(e, selectedWall, index, "artwork")}
                  onDelete={() => handleDelete(selectedWall, index, "artwork")}
                  inputId={`artwork-${selectedWall}-${index}`}
                  isUploading={uploadingField === `${selectedWall}-${index}-artwork`}
                  isDeleting={deletingField === `${selectedWall}-${index}-artwork`}
                />

                {/* Artist Label - Image and PDF side by side */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <UploadBox
                      label="Artist label (wall display)"
                      preview={artworkData.artistLabelPreview}
                      onDrop={(e) => handleDrop(e, selectedWall, index, "artistLabel")}
                      onInputChange={(e) => handleInputChange(e, selectedWall, index, "artistLabel")}
                      onDelete={() => handleDelete(selectedWall, index, "artistLabel")}
                      inputId={`artistLabel-${selectedWall}-${index}`}
                      isUploading={uploadingField === `${selectedWall}-${index}-artistLabel`}
                      isDeleting={deletingField === `${selectedWall}-${index}-artistLabel`}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <UploadBox
                      label="Artist label (click to open)"
                      preview={artworkData.artistLabelPdfPreview}
                      onDrop={(e) => handleDrop(e, selectedWall, index, "artistLabelPdf")}
                      onInputChange={(e) => handleInputChange(e, selectedWall, index, "artistLabelPdf")}
                      onDelete={() => handleDelete(selectedWall, index, "artistLabelPdf")}
                      inputId={`artistLabelPdf-${selectedWall}-${index}`}
                      isUploading={uploadingField === `${selectedWall}-${index}-artistLabelPdf`}
                      isDeleting={deletingField === `${selectedWall}-${index}-artistLabelPdf`}
                      acceptPdf
                    />
                  </div>
                </div>

                {/* Artist Bio - Image and PDF side by side */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <UploadBox
                      label="Artist bio (wall display)"
                      preview={artworkData.artistBioPreview}
                      onDrop={(e) => handleDrop(e, selectedWall, index, "artistBio")}
                      onInputChange={(e) => handleInputChange(e, selectedWall, index, "artistBio")}
                      onDelete={() => handleDelete(selectedWall, index, "artistBio")}
                      inputId={`artistBio-${selectedWall}-${index}`}
                      isUploading={uploadingField === `${selectedWall}-${index}-artistBio`}
                      isDeleting={deletingField === `${selectedWall}-${index}-artistBio`}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <UploadBox
                      label="Artist bio (click to open)"
                      preview={artworkData.artistBioPdfPreview}
                      onDrop={(e) => handleDrop(e, selectedWall, index, "artistBioPdf")}
                      onInputChange={(e) => handleInputChange(e, selectedWall, index, "artistBioPdf")}
                      onDelete={() => handleDelete(selectedWall, index, "artistBioPdf")}
                      inputId={`artistBioPdf-${selectedWall}-${index}`}
                      isUploading={uploadingField === `${selectedWall}-${index}-artistBioPdf`}
                      isDeleting={deletingField === `${selectedWall}-${index}-artistBioPdf`}
                      acceptPdf
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

interface UploadBoxProps {
  label: string;
  preview: string | null;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: () => void;
  inputId: string;
  isUploading?: boolean;
  isDeleting?: boolean;
  acceptPdf?: boolean;
}

function UploadBox({ 
  label, 
  preview, 
  onDrop, 
  onInputChange,
  onDelete,
  inputId, 
  isUploading,
  isDeleting,
  acceptPdf,
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Check if preview is a PDF
  const isPdfPreview = preview?.toLowerCase().endsWith('.pdf') || preview?.includes('application/pdf');

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        setIsDragging(false);
        onDrop(e);
      }}
      style={{
        border: "2px dashed #999",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: isDragging ? "#f0f0f0" : "white",
        transition: "background-color 0.2s ease",
        opacity: isUploading || isDeleting ? 0.7 : 1,
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {(isUploading || isDeleting) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "14px", color: "#666" }}>{isDeleting ? "Deleting..." : "Uploading..."}</div>
        </div>
      )}

      {/* Left side - Upload content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
          {label}
          {acceptPdf && <span style={{ fontSize: "11px", marginLeft: "8px" }}>(Image or PDF)</span>}
        </div>

        {preview ? (
          <div style={{ position: "relative" }}>
            {isPdfPreview ? (
              // PDF preview - show icon and filename
              <div
                style={{
                  width: "200px",
                  height: "150px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <text x="8" y="17" fontSize="6" fill="#e74c3c" stroke="none" fontWeight="bold">PDF</text>
                </svg>
                <span style={{ fontSize: "11px", color: "#666", marginTop: "8px", textAlign: "center", padding: "0 8px", wordBreak: "break-all" }}>
                  PDF uploaded
                </span>
              </div>
            ) : (
              <img
                src={preview}
                alt={label}
                style={{
                  maxWidth: "200px",
                  maxHeight: "150px",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isUploading || isDeleting}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "2px solid black",
                  backgroundColor: "#F5C542",
                  color: "black",
                  fontSize: "12px",
                  cursor: isUploading || isDeleting ? "not-allowed" : "pointer",
                }}
              >
                Change
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  disabled={isUploading || isDeleting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "2px solid #dc3545",
                    backgroundColor: "white",
                    color: "#dc3545",
                    fontSize: "12px",
                    cursor: isUploading || isDeleting ? "not-allowed" : "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", maxWidth: "200px" }}>
            <div style={{ fontSize: "16px", color: "black", marginBottom: "12px" }}>Drag & Drop</div>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                border: "2px solid black",
                backgroundColor: "#F5C542",
                color: "black",
                fontSize: "14px",
                cursor: isUploading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "12px" }}>Size limit: 10mb</div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptPdf ? "image/*,.pdf,application/pdf" : "image/*"}
        onChange={onInputChange}
        disabled={isUploading}
        style={{ display: "none" }}
      />
    </div>
  );
}
