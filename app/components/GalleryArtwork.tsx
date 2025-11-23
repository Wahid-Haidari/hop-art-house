"use client";

import { useTexture } from "@react-three/drei";

interface GalleryArtworkProps {
  art: string;
  artistCard: string;
  infoCard: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export default function GalleryArtwork({
  art,
  artistCard,
  infoCard,
  position,
  rotation = [0, 0, 0],
}: GalleryArtworkProps) {

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

  return (
    <>
      {/* ARTWORK */}
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[ART_WIDTH, ART_HEIGHT]} />
        <meshBasicMaterial map={artTex} />
      </mesh>

      {/* ARTIST CARD */}
      <mesh position={artistCardPos} rotation={rotation}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshBasicMaterial map={artistTex} transparent />
      </mesh>

      {/* ART INFO CARD */}
      <mesh position={infoCardPos} rotation={rotation}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshBasicMaterial map={infoTex} transparent />
      </mesh>
    </>
  );
}
