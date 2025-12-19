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
  const CARD_HEIGHT = CARD_WIDTH * (6.8 / 6);  // Same aspect ratio as GalleryArtwork
  const GAP = 0.1;

  const artSideOffset = (ART_WIDTH / 2) + (CARD_WIDTH / 2) + GAP;
  
  // Position cards relative to the bottom of the artwork (same as GalleryArtwork)
  // Cards are bottom-aligned with the artwork
  const infoCardY = CARD_HEIGHT / 2;  // Bottom card starts at artwork bottom
  const artistCardY = infoCardY + CARD_HEIGHT + GAP;  // Top card above bottom card
  
  // Message position: above the artist card with the same gap as between cards
  // Top of artist card = artistCardY + CARD_HEIGHT/2, then add GAP for spacing
  // anchorY="bottom" means this Y is where the bottom of the text will be
  const artistCardTop = artistCardY + CARD_HEIGHT / 2;
  const messageY = artY + artistCardTop + GAP;

  // Check wall type
  const isLeftWall = Math.abs(artRotation[1] - Math.PI / 2) < 0.1;
  const isRightWall = Math.abs(artRotation[1] + Math.PI / 2) < 0.1;
  const isFrontWall = Math.abs(artRotation[1] - Math.PI) < 0.1 || Math.abs(artRotation[1] + Math.PI) < 0.1;

  // Position message above the artist card (same side as cards)
  // For left-aligned text, we position at the left edge of the card
  let messageX: number;
  let messageZ: number;
  
  if (isLeftWall) {
    // Left wall faces +X direction, so "left edge" is -Z offset from card center
    messageX = artX;
    messageZ = artZ - artSideOffset + CARD_WIDTH / 2;
  } else if (isRightWall) {
    // Right wall faces -X direction, so "left edge" is +Z offset from card center
    messageX = artX;
    messageZ = artZ + artSideOffset - CARD_WIDTH / 2;
  } else if (isFrontWall) {
    // Front wall faces -Z direction, so "left edge" is +X offset from card center
    messageX = artX - artSideOffset + CARD_WIDTH / 2;
    messageZ = artZ;
  } else {
    // Back wall faces +Z direction, so "left edge" is -X offset from card center
    messageX = artX + artSideOffset - CARD_WIDTH / 2;
    messageZ = artZ;
  }

  return (
    <Text
      position={[messageX, messageY, messageZ]}
      rotation={artRotation}
      fontSize={0.055}
      font="/font/ITC Avant Garde Gothic Std Medium.otf"
      color="black"
      anchorX="left"
      anchorY="bottom"
      textAlign="left"
      maxWidth={CARD_WIDTH}
    >
      {"Click on displays\nto view full screen."}
    </Text>
  );
}