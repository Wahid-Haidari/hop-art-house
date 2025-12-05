"use client";

import { Text } from "@react-three/drei";
import { usePlayerPosition } from "./PlayerContext";

interface ProximityMessageProps {
  artPosition: [number, number, number];
  artRotation: [number, number, number];
  triggerDistance?: number;
}

export default function ProximityMessage({
  artPosition,
  artRotation,
  triggerDistance = 3,
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
  const ART_WIDTH = 1.5;
  const ART_HEIGHT = 2.5;
  const CARD_WIDTH = 0.5;
  const CARD_HEIGHT = 0.7;
  const GAP = 0.1;

  const artSideOffset = (ART_WIDTH / 2) + (CARD_WIDTH / 2) + GAP;
  const verticalUp = -((ART_HEIGHT / 2) - (CARD_HEIGHT / 2)) + CARD_HEIGHT + GAP;

  // Check wall type
  const isLeftWall = artRotation[1] > 0;
  const isRightWall = artRotation[1] < 0;

  // Position message above the artist card
  let messageX: number;
  let messageZ: number;
  
  if (isLeftWall) {
    messageX = artX;
    messageZ = artZ - artSideOffset;
  } else if (isRightWall) {
    messageX = artX;
    messageZ = artZ + artSideOffset;
  } else {
    // Back wall
    messageX = artX + artSideOffset;
    messageZ = artZ;
  }
  
  const messageY = artY + verticalUp + (CARD_HEIGHT / 2) + 0.1; // Above artist card

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