"use client";

import { Text } from "@react-three/drei";
import { usePlayerPosition } from "./PlayerContext";

interface ProximityMessageProps {
  artPosition: [number, number, number];
  artRotation: [number, number, number];
  triggerDistance?: number;
  aspectRatio?: number;
  displayWidth?: number;
  displayHeight?: number;
}

export default function ProximityMessage({
  artPosition,
  artRotation,
  triggerDistance = 3,
  aspectRatio = 1.33,
  displayWidth = 1.5,
  displayHeight,
}: ProximityMessageProps) {
  const { position: playerPosition } = usePlayerPosition();

  // Calculate distance between player and artwork
  const [artX, artY, artZ] = artPosition;
  const [playerX, playerY, playerZ] = playerPosition;

  const distance = Math.sqrt(
    Math.pow(playerX - artX, 2) +
    Math.pow(playerZ - artZ, 2)
  );

  // Only show message if player is close enough
  const isNear = distance < triggerDistance;

  // console.log("Distance to art:", distance, "Is near:", isNear); // Debug log

  if (!isNear) return null;

  // Card layout constants (same as GalleryArtwork)
  const ART_WIDTH = displayWidth;
  const ART_HEIGHT = displayHeight ?? (ART_WIDTH * aspectRatio);  // Use displayHeight if provided, else calculate
  const CARD_WIDTH = 0.5;
  const CARD_HEIGHT = 0.7;
  const GAP = 0.1;

  const artSideOffset = (ART_WIDTH / 2) + (CARD_WIDTH / 2) + GAP;
  
  // Position cards relative to the bottom of the artwork (same as GalleryArtwork)
  const artBottom = -(ART_HEIGHT / 2);
  const infoCardY = artBottom + (CARD_HEIGHT / 2);  // Bottom card
  const artistCardY = infoCardY + CARD_HEIGHT + GAP;  // Top card
  
  // Message position: above the artist card with the same gap
  const messageY = artY + artistCardY + (CARD_HEIGHT / 2) + GAP;

  // Check wall type
  const isLeftWall = Math.abs(artRotation[1] - Math.PI / 2) < 0.1;
  const isRightWall = Math.abs(artRotation[1] + Math.PI / 2) < 0.1;
  const isFrontWall = Math.abs(artRotation[1] - Math.PI) < 0.1 || Math.abs(artRotation[1] + Math.PI) < 0.1;

  // Position message above the artist card (same side as cards)
  let messageX: number;
  let messageZ: number;
  
  if (isLeftWall) {
    messageX = artX;
    messageZ = artZ - artSideOffset;
  } else if (isRightWall) {
    messageX = artX;
    messageZ = artZ + artSideOffset;
  } else if (isFrontWall) {
    messageX = artX - artSideOffset;
    messageZ = artZ;
  } else {
    // Back wall
    messageX = artX + artSideOffset;
    messageZ = artZ;
  }

  return (
    <Text
      position={[messageX, messageY, messageZ]}
      rotation={artRotation}
      fontSize={0.06}
      font="/font/ITC Avant Garde Gothic Std Book.otf"
      color="black"
      anchorX="center"
      anchorY="middle"
      textAlign="center"
    >
      {"Click on displays\nto view full screen."}
    </Text>
  );
}