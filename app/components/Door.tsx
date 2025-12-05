"use client";

import { COLORS } from "../colors";

interface DoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export default function Door({ 
  position, 
  rotation = [0, 0, 0]
}: DoorProps) {
  const DOOR_WIDTH = 2;
  const DOOR_HEIGHT = 4;
  const FRAME_THICKNESS = 0.1;

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame - top */}
      <mesh position={[0, DOOR_HEIGHT / 2 + FRAME_THICKNESS / 2, 0]}>
        <boxGeometry args={[DOOR_WIDTH + FRAME_THICKNESS * 2, FRAME_THICKNESS, 0.15]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>

      {/* Door frame - left */}
      <mesh position={[-DOOR_WIDTH / 2 - FRAME_THICKNESS / 2, 0, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, 0.15]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>

      {/* Door frame - right */}
      <mesh position={[DOOR_WIDTH / 2 + FRAME_THICKNESS / 2, 0, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, 0.15]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>

      {/* Door panel */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[DOOR_WIDTH, DOOR_HEIGHT]} />
        <meshBasicMaterial color={COLORS.primary} toneMapped={false} />
      </mesh>

      {/* Door handle */}
      <mesh position={[DOOR_WIDTH / 2 - 0.25, 0, 0.08]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshBasicMaterial color="#1a1a1a" toneMapped={false} />
      </mesh>
    </group>
  );
}
