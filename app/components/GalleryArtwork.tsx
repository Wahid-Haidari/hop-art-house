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
    // If rotation.y != 0 → artwork is on left/right walls
    const isSideWall = rotation[1] !== 0;


  // Calculate card positions
  const artistCardPos: [number, number, number] = isSideWall
    ? [
        position[0],                        // X same
        position[1] + verticalUp,           // Y up
        position[2] - artSideOffset           // Z right relative to rotation
      ]
    : [
        position[0] + artSideOffset,           // X right
        position[1] + verticalUp,           // Y up
        position[2]         // Z forward
      ];

  const infoCardPos: [number, number, number] = isSideWall
    ? [
        position[0],
        position[1] + verticalDown,
        position[2] - artSideOffset
      ]
    : [
        position[0] + artSideOffset,
        position[1] + verticalDown,
        position[2]
      ];

  // Setup raycasting for proper cursor-based click detection
  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Get canvas position
      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

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

    // Attach click listener to canvas element
    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
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
