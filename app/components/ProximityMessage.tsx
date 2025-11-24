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

  console.log("Distance to art:", distance, "Is near:", isNear); // Debug log

  if (!isNear) return null;

  // Position message above the artwork
  const messageY = artY + 2.5;

  return (
    <Text
      position={[artX, messageY, artZ]}
      rotation={artRotation}
      fontSize={0.2}
      color="red"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="white"
    >
      Click on displays to view full screen.
    </Text>
  );
}