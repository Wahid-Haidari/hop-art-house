"use client";

import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

interface FloorProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  texturePath?: string;
}

export default function Floor({ 
  position = [0, 0, 0],
  width = 20,
  height = 20,
  texturePath = "/floor.jpg"
}: FloorProps) {
  const texture = useLoader(THREE.TextureLoader, texturePath);
  
  // Clone texture so we can modify it without affecting other usages
  const clonedTexture = useMemo(() => texture.clone(), [texture]);
  
  useEffect(() => {
    if (!clonedTexture.image) return;
    
    const imgWidth = clonedTexture.image.width;
    const imgHeight = clonedTexture.image.height;
    const imgAspect = imgWidth / imgHeight;
    const floorAspect = width / height;
    
    // Object-fit: cover - crop the image to fill the floor without stretching
    clonedTexture.wrapS = THREE.ClampToEdgeWrapping;
    clonedTexture.wrapT = THREE.ClampToEdgeWrapping;
    
    if (imgAspect > floorAspect) {
      // Image is wider than floor - crop sides
      const scale = floorAspect / imgAspect;
      clonedTexture.offset.set((1 - scale) / 2, 0);
      clonedTexture.repeat.set(scale, 1);
    } else {
      // Image is taller than floor - crop top/bottom
      const scale = imgAspect / floorAspect;
      clonedTexture.offset.set(0, (1 - scale) / 2);
      clonedTexture.repeat.set(1, scale);
    }
    
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.needsUpdate = true;
  }, [clonedTexture, width, height]);
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={clonedTexture} toneMapped={false} />
    </mesh>
  );
}