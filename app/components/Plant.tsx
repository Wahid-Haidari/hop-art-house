"use client";

import { useGLTF } from "@react-three/drei";

interface PlantProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

export default function Plant({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: PlantProps) {
  const { scene } = useGLTF("/Plant.glb");

  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      rotation={rotation}
      scale={scale}
    />
  );
}
