"use client";

import { useGLTF } from "@react-three/drei";

interface ArtNoteProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

export default function ArtNote({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: ArtNoteProps) {
  const { scene } = useGLTF("/Art Note.glb");

  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      rotation={rotation}
      scale={scale}
    />
  );
}
