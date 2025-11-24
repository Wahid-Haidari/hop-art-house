"use client";

import { useGLTF } from "@react-three/drei";

interface TreeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

export default function Tree({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: TreeProps) {
  const { scene } = useGLTF("/Birch_1.glb");

  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      rotation={rotation}
      scale={scale}
    />
  );
}