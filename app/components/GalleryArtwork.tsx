"use client";

import { useTexture, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, Suspense, useState, Component, ReactNode } from "react";
import * as THREE from "three";

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
  return url.toLowerCase().endsWith(".pdf") || url.includes("application/pdf");
}

// Component for PDF placeholder in 3D
function PdfPlaceholder({ 
  position, 
  rotation, 
  width, 
  height,
  meshRef,
  label 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  width: number;
  height: number;
  meshRef: React.RefObject<THREE.Mesh | null>;
  label: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#f5f5f5" />
      </mesh>
      {/* PDF Icon */}
      <Text
        position={[0, 0.05, 0.01]}
        fontSize={0.12}
        color="#dc2626"
        anchorX="center"
        anchorY="middle"
      >
        PDF
      </Text>
      {/* Label */}
      <Text
        position={[0, -0.1, 0.01]}
        fontSize={0.06}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.9}
      >
        {label}
      </Text>
    </group>
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
        <PdfPlaceholder
          position={artistCardPos}
          rotation={rotation}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          meshRef={artistCardMeshRef}
          label="Click to view"
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
        <PdfPlaceholder
          position={infoCardPos}
          rotation={rotation}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          meshRef={infoCardMeshRef}
          label="Click to view"
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
