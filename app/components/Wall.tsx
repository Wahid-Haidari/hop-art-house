"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

interface WallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  texturePath?: string;
}

export default function Wall({ 
  position, 
  rotation = [0, 0, 0],
  width = 20,
  height = 7.5,
  texturePath = "/Brick_Wall.jpg",
}: WallProps) {
  const texture = useTexture(texturePath);
  
  // Set texture to cover the wall without stretching (like CSS object-fit: cover)
  useEffect(() => {
    if (texture && texture.image) {
      texture.colorSpace = THREE.SRGBColorSpace;
      
      // Get image aspect ratio
      const img = texture.image as HTMLImageElement;
      const imageAspect = img.width / img.height;
      const wallAspect = width / height;
      
      // Calculate how to crop the texture to fit the wall
      if (wallAspect > imageAspect) {
        // Wall is wider than image - crop top/bottom of image
        const scale = wallAspect / imageAspect;
        texture.repeat.set(1, 1 / scale);
        texture.offset.set(0, (1 - 1 / scale) / 2); // Center vertically
      } else {
        // Wall is taller than image - crop left/right of image
        const scale = imageAspect / wallAspect;
        texture.repeat.set(1 / scale, 1);
        texture.offset.set((1 - 1 / scale) / 2, 0); // Center horizontally
      }
      
      texture.needsUpdate = true;
    }
  }, [texture, width, height]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}