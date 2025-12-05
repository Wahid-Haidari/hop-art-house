"use client";

interface WindowProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}

export default function Window({ 
  position, 
  rotation = [0, 0, 0],
  width = 3,
  height = 1.5
}: WindowProps) {
  const FRAME_THICKNESS = 0.08;
  const DIVIDER_THICKNESS = 0.05;

  return (
    <group position={position} rotation={rotation}>
      {/* Window glass - light blue/sky color */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#87CEEB" toneMapped={false} opacity={0.7} transparent />
      </mesh>

      {/* Window frame - outer */}
      {/* Top frame */}
      <mesh position={[0, height / 2 + FRAME_THICKNESS / 2, 0.02]}>
        <boxGeometry args={[width + FRAME_THICKNESS * 2, FRAME_THICKNESS, 0.1]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, -height / 2 - FRAME_THICKNESS / 2, 0.02]}>
        <boxGeometry args={[width + FRAME_THICKNESS * 2, FRAME_THICKNESS, 0.1]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>
      {/* Left frame */}
      <mesh position={[-width / 2 - FRAME_THICKNESS / 2, 0, 0.02]}>
        <boxGeometry args={[FRAME_THICKNESS, height, 0.1]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>
      {/* Right frame */}
      <mesh position={[width / 2 + FRAME_THICKNESS / 2, 0, 0.02]}>
        <boxGeometry args={[FRAME_THICKNESS, height, 0.1]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>

      {/* Window dividers - cross pattern */}
      {/* Vertical divider */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[DIVIDER_THICKNESS, height, 0.05]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>
      {/* Horizontal divider */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width, DIVIDER_THICKNESS, 0.05]} />
        <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
      </mesh>
    </group>
  );
}
