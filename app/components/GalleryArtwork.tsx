"use client";

import { useTexture, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, Suspense, useState, Component, ReactNode, useMemo } from "react";
import * as THREE from "three";

// PDF.js will be loaded dynamically on the client
let pdfjsLib: typeof import("pdfjs-dist") | null = null;

interface GalleryArtworkProps {
  art: string;
  artistCard: string;
  infoCard: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  onOpenOverlay: (img: string) => void;
}

// Simple error boundary for 3D components
class TextureErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Texture loading error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Helper to check if URL is a PDF
function isPdf(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith(".pdf") || lowerUrl.includes(".pdf?") || lowerUrl.includes("application/pdf");
}

// Component to render PDF first page as a texture in 3D
function PdfCard({ 
  url,
  position, 
  rotation, 
  width, 
  height,
  meshRef,
}: { 
  url: string;
  position: [number, number, number]; 
  rotation: [number, number, number];
  width: number;
  height: number;
  meshRef: React.RefObject<THREE.Mesh | null>;
}) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderPdf() {
      try {
        setIsLoading(true);
        setError(false);

        // Dynamically import PDF.js only on client
        if (!pdfjsLib) {
          const pdfjs = await import("pdfjs-dist");
          pdfjsLib = pdfjs;
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        }

        // First fetch the PDF as array buffer to avoid CORS issues
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        // Load the PDF document from array buffer
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Set up canvas with good resolution
        const scale = 2; // Higher scale = better quality
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) {
          throw new Error("Could not get canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        } as Parameters<typeof page.render>[0]).promise;

        if (cancelled) return;

        // Create Three.js texture from canvas
        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.needsUpdate = true;
        
        setTexture(canvasTexture);
        setIsLoading(false);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        if (!cancelled) {
          setError(true);
          setIsLoading(false);
        }
      }
    }

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (isLoading) {
    return (
      <group position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#f0f0f0" />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={Math.min(width, height) * 0.12}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          Loading...
        </Text>
      </group>
    );
  }

  if (error || !texture) {
    return (
      <group position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#fee2e2" />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={Math.min(width, height) * 0.1}
          color="#dc2626"
          anchorX="center"
          anchorY="middle"
        >
          PDF Error
        </Text>
      </group>
    );
  }

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Component for image texture in 3D
function ImageCardInner({
  url,
  position,
  rotation,
  width,
  height,
  meshRef,
  transparent = false
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  meshRef: React.RefObject<THREE.Mesh | null>;
  transparent?: boolean;
}) {
  const texture = useTexture(url);
  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent={transparent} />
    </mesh>
  );
}

// Placeholder shown when image fails to load or is loading
function ImagePlaceholder({
  position,
  rotation,
  width,
  height,
  meshRef,
  label = "Loading..."
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  meshRef: React.RefObject<THREE.Mesh | null>;
  label?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#e5e5e5" />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={Math.min(width, height) * 0.15}
        color="#999999"
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.9}
      >
        {label}
      </Text>
    </group>
  );
}

// Wrapped ImageCard with error boundary and suspense
function ImageCard(props: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  meshRef: React.RefObject<THREE.Mesh | null>;
  transparent?: boolean;
}) {
  return (
    <TextureErrorBoundary
      fallback={
        <ImagePlaceholder
          position={props.position}
          rotation={props.rotation}
          width={props.width}
          height={props.height}
          meshRef={props.meshRef}
          label="Image not found"
        />
      }
    >
      <Suspense
        fallback={
          <ImagePlaceholder
            position={props.position}
            rotation={props.rotation}
            width={props.width}
            height={props.height}
            meshRef={props.meshRef}
            label="Loading..."
          />
        }
      >
        <ImageCardInner {...props} />
      </Suspense>
    </TextureErrorBoundary>
  );
}

export default function GalleryArtwork({
  art,
  artistCard,
  infoCard,
  position,
  rotation = [0, 0, 0],
  onOpenOverlay
}: GalleryArtworkProps) {
  const { camera, gl } = useThree();
  const artMeshRef = useRef<THREE.Mesh>(null);
  const artistCardMeshRef = useRef<THREE.Mesh>(null);
  const infoCardMeshRef = useRef<THREE.Mesh>(null);

    // Artwork size
    const ART_WIDTH = 1.5;
    const ART_HEIGHT = 2.5;

    // Card size
    const CARD_WIDTH = 0.5;
    const CARD_HEIGHT = 0.7;

    const GAP = 0.1 //space between the artist card and art info card

    // Check if artist card or info card are PDFs
    const artistCardIsPdf = isPdf(artistCard);
    const infoCardIsPdf = isPdf(infoCard);

    // Card offsets based on YOUR layout
    const artSideOffset = (ART_WIDTH / 2) + (CARD_WIDTH / 2) + GAP;  // Space between the center of the art and the center of the cards that are to the right.
    const verticalDown = -((ART_HEIGHT / 2) - (CARD_HEIGHT / 2));; // This is the distance the art info card sits below the artwork.
    const verticalUp = verticalDown + CARD_HEIGHT + GAP // This is the distance the artist card sits above the artwork’s center.

    // If rotation.y = 0 → artwork faces user (back wall)
    // If rotation.y > 0 → artwork is on left wall or front wall
    // If rotation.y < 0 → artwork is on right wall
    const isLeftWall = Math.abs(rotation[1] - Math.PI / 2) < 0.1;
    const isRightWall = Math.abs(rotation[1] + Math.PI / 2) < 0.1;
    const isFrontWall = Math.abs(rotation[1] - Math.PI) < 0.1 || Math.abs(rotation[1] + Math.PI) < 0.1;
    const isBackWall = Math.abs(rotation[1]) < 0.1;


  // Calculate card positions
  let artistCardPos: [number, number, number];
  let infoCardPos: [number, number, number];

  if (isLeftWall) {
    // Left wall - cards toward negative Z
    artistCardPos = [
      position[0],
      position[1] + verticalUp,
      position[2] - artSideOffset
    ];
    infoCardPos = [
      position[0],
      position[1] + verticalDown,
      position[2] - artSideOffset
    ];
  } else if (isRightWall) {
    // Right wall - cards toward positive Z
    artistCardPos = [
      position[0],
      position[1] + verticalUp,
      position[2] + artSideOffset
    ];
    infoCardPos = [
      position[0],
      position[1] + verticalDown,
      position[2] + artSideOffset
    ];
  } else if (isFrontWall) {
    // Front wall - cards to the left (negative X from viewer's perspective)
    artistCardPos = [
      position[0] - artSideOffset,
      position[1] + verticalUp,
      position[2]
    ];
    infoCardPos = [
      position[0] - artSideOffset,
      position[1] + verticalDown,
      position[2]
    ];
  } else {
    // Back wall - cards to the right (positive X)
    artistCardPos = [
      position[0] + artSideOffset,
      position[1] + verticalUp,
      position[2]
    ];
    infoCardPos = [
      position[0] + artSideOffset,
      position[1] + verticalDown,
      position[2]
    ];
  }

  // Setup raycasting for proper cursor-based click detection
  useEffect(() => {
    let mouseDownPos = { x: 0, y: 0 };
    const DRAG_THRESHOLD = 5; // pixels - if mouse moves more than this, it's a drag

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownPos = { x: event.clientX, y: event.clientY };
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      mouseDownPos = { x: touch.clientX, y: touch.clientY };
    };

    const performRaycast = (clientX: number, clientY: number) => {
      // Check if this was a drag (moved significantly)
      const dx = clientX - mouseDownPos.x;
      const dy = clientY - mouseDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > DRAG_THRESHOLD) {
        // This was a drag, not a click - don't open overlay
        return;
      }

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Get canvas position
      const rect = gl.domElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Normalize mouse coordinates to [-1, 1]
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      // Update raycaster with camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Check intersections with all three meshes
      const meshes = [
        { ref: artMeshRef, image: art },
        { ref: artistCardMeshRef, image: artistCard },
        { ref: infoCardMeshRef, image: infoCard }
      ];

      const objectsToCheck = meshes
        .filter(m => m.ref.current !== null)
        .map(m => m.ref.current as THREE.Mesh);

      const intersects = raycaster.intersectObjects(objectsToCheck);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const clickedItem = meshes.find(m => m.ref.current === clickedObject);
        if (clickedItem) {
          onOpenOverlay(clickedItem.image);
        }
      }
    };

    const handleCanvasClick = (event: MouseEvent) => {
      performRaycast(event.clientX, event.clientY);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      // Use changedTouches for the touch that ended
      const touch = event.changedTouches[0];
      if (touch) {
        performRaycast(touch.clientX, touch.clientY);
      }
    };

    // Attach listeners to canvas element
    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("click", handleCanvasClick);
    gl.domElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    gl.domElement.addEventListener("touchend", handleTouchEnd);
    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("click", handleCanvasClick);
      gl.domElement.removeEventListener("touchstart", handleTouchStart);
      gl.domElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, gl, art, artistCard, infoCard, onOpenOverlay]);

  return (
    <>
      {/* ARTWORK - always an image */}
      <ImageCard
        url={art}
        position={position}
        rotation={rotation}
        width={ART_WIDTH}
        height={ART_HEIGHT}
        meshRef={artMeshRef}
      />

      {/* ARTIST CARD - can be PDF or image */}
      {artistCardIsPdf ? (
        <PdfCard
          url={artistCard}
          position={artistCardPos}
          rotation={rotation}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          meshRef={artistCardMeshRef}
        />
      ) : (
        <ImageCard
          url={artistCard}
          position={artistCardPos}
          rotation={rotation}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          meshRef={artistCardMeshRef}
          transparent
        />
      )}

      {/* ART INFO CARD - can be PDF or image */}
      {infoCardIsPdf ? (
        <PdfCard
          url={infoCard}
          position={infoCardPos}
          rotation={rotation}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          meshRef={infoCardMeshRef}
        />
      ) : (
        <ImageCard
          url={infoCard}
          position={infoCardPos}
          rotation={rotation}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          meshRef={infoCardMeshRef}
          transparent
        />
      )}
    </>
  );
}
