"use client";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GalleryArtworkProps {
  art: string;
  artistCard: string;
  infoCard: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  onOpenOverlay: (img: string) => void;
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


    const artTex = useTexture(art);
    const artistTex = useTexture(artistCard);
    const infoTex = useTexture(infoCard);

    // Card offsets based on YOUR layout
    const artSideOffset = (ART_WIDTH / 2) + (CARD_WIDTH / 2) + GAP;  // Space between the center of the art and the center of the cards that are to the right.
    const verticalDown = -((ART_HEIGHT / 2) - (CARD_HEIGHT / 2));; // This is the distance the art info card sits below the artwork.
    const verticalUp = verticalDown + CARD_HEIGHT + GAP // This is the distance the artist card sits above the artwork’s center.

    // If rotation.y = 0 → artwork faces user (back wall)
    // If rotation.y > 0 → artwork is on left wall
    // If rotation.y < 0 → artwork is on right wall
    const isLeftWall = rotation[1] > 0;
    const isRightWall = rotation[1] < 0;
    const isSideWall = isLeftWall || isRightWall;


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
      {/* ARTWORK */}
      <mesh ref={artMeshRef} position={position} rotation={rotation}>
        <planeGeometry args={[ART_WIDTH, ART_HEIGHT]} />
        <meshBasicMaterial map={artTex} />
      </mesh>

      {/* ARTIST CARD */}
      <mesh ref={artistCardMeshRef} position={artistCardPos} rotation={rotation}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshBasicMaterial map={artistTex} transparent />
      </mesh>

      {/* ART INFO CARD */}
      <mesh ref={infoCardMeshRef} position={infoCardPos} rotation={rotation}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshBasicMaterial map={infoTex} transparent />
      </mesh>
    </>
  );
}
