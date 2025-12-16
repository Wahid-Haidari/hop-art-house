"use client";

import { useTexture, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, Suspense, Component, ReactNode } from "react";
import * as THREE from "three";

interface GalleryArtworkProps {
  art: string;
  artistCard: string;
  artistCardPdf?: string | null;
  infoCard: string;
  infoCardPdf?: string | null;
  position: [number, number, number];
  rotation?: [number, number, number];
  aspectRatio?: number;  // height/width ratio of the artwork image
  displayWidth?: number;  // display width in 3D units (default 1.5)
  displayHeight?: number;  // display height in 3D units (calculated from aspectRatio)
  onOpenOverlay: (img: string) => void;
}

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
  artistCardPdf,
  infoCard,
  infoCardPdf,
  position,
  rotation = [0, 0, 0],
  aspectRatio = 1.33,
  displayWidth = 1.5,
  displayHeight,
  onOpenOverlay
}: GalleryArtworkProps) {
  const { camera, gl } = useThree();
  const artMeshRef = useRef<THREE.Mesh>(null);
  const artistCardMeshRef = useRef<THREE.Mesh>(null);
  const infoCardMeshRef = useRef<THREE.Mesh>(null);

  const ART_WIDTH = displayWidth;
  const ART_HEIGHT = displayHeight ?? (ART_WIDTH * aspectRatio);  // Use displayHeight if provided, else calculate
  const CARD_WIDTH = 0.5;
  const CARD_HEIGHT = 0.7;
  const GAP = 0.1;

  const artSideOffset = (ART_WIDTH / 2) + (CARD_WIDTH / 2) + GAP;
  // Position cards relative to the bottom of the artwork
  const artBottom = -(ART_HEIGHT / 2);
  const infoCardY = artBottom + (CARD_HEIGHT / 2);  // Bottom card aligned with art bottom
  const artistCardY = infoCardY + CARD_HEIGHT + GAP;  // Top card above bottom card

  const isLeftWall = Math.abs(rotation[1] - Math.PI / 2) < 0.1;
  const isRightWall = Math.abs(rotation[1] + Math.PI / 2) < 0.1;
  const isFrontWall = Math.abs(rotation[1] - Math.PI) < 0.1 || Math.abs(rotation[1] + Math.PI) < 0.1;

  let artistCardPos: [number, number, number];
  let infoCardPos: [number, number, number];

  if (isLeftWall) {
    artistCardPos = [position[0], position[1] + artistCardY, position[2] - artSideOffset];
    infoCardPos = [position[0], position[1] + infoCardY, position[2] - artSideOffset];
  } else if (isRightWall) {
    artistCardPos = [position[0], position[1] + artistCardY, position[2] + artSideOffset];
    infoCardPos = [position[0], position[1] + infoCardY, position[2] + artSideOffset];
  } else if (isFrontWall) {
    artistCardPos = [position[0] - artSideOffset, position[1] + artistCardY, position[2]];
    infoCardPos = [position[0] - artSideOffset, position[1] + infoCardY, position[2]];
  } else {
    artistCardPos = [position[0] + artSideOffset, position[1] + artistCardY, position[2]];
    infoCardPos = [position[0] + artSideOffset, position[1] + infoCardY, position[2]];
  }

  useEffect(() => {
    let mouseDownPos = { x: 0, y: 0 };
    const DRAG_THRESHOLD = 5;

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownPos = { x: event.clientX, y: event.clientY };
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      mouseDownPos = { x: touch.clientX, y: touch.clientY };
    };

    const performRaycast = (clientX: number, clientY: number) => {
      const dx = clientX - mouseDownPos.x;
      const dy = clientY - mouseDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > DRAG_THRESHOLD) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const meshes = [
        { ref: artMeshRef, openUrl: art },
        { ref: artistCardMeshRef, openUrl: artistCardPdf || artistCard },
        { ref: infoCardMeshRef, openUrl: infoCardPdf || infoCard }
      ];

      const objectsToCheck = meshes
        .filter(m => m.ref.current !== null)
        .map(m => m.ref.current as THREE.Mesh);

      const intersects = raycaster.intersectObjects(objectsToCheck);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const clickedItem = meshes.find(m => m.ref.current === clickedObject);
        if (clickedItem) {
          onOpenOverlay(clickedItem.openUrl);
        }
      }
    };

    const handleCanvasClick = (event: MouseEvent) => {
      performRaycast(event.clientX, event.clientY);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (touch) performRaycast(touch.clientX, touch.clientY);
    };

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
  }, [camera, gl, art, artistCard, artistCardPdf, infoCard, infoCardPdf, onOpenOverlay]);

  return (
    <>
      <ImageCard
        url={art}
        position={position}
        rotation={rotation}
        width={ART_WIDTH}
        height={ART_HEIGHT}
        meshRef={artMeshRef}
      />
      <ImageCard
        url={artistCard}
        position={artistCardPos}
        rotation={rotation}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        meshRef={artistCardMeshRef}
        transparent
      />
      <ImageCard
        url={infoCard}
        position={infoCardPos}
        rotation={rotation}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        meshRef={infoCardMeshRef}
        transparent
      />
    </>
  );
}
