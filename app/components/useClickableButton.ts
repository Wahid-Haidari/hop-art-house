"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useClickableButton(meshRef: React.MutableRefObject<THREE.Mesh | null>, onClickInside: () => void) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      if (!meshRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Get canvas position
      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Normalize mouse coordinates to [-1, 1]
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      // Update raycaster with camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Check intersection with this mesh
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        onClickInside();
      }
    };

    // Attach click listener to canvas element
    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
  }, [camera, gl, onClickInside]);
}
