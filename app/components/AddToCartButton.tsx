"use client";

import { Text, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { COLORS } from "../colors";

interface AddToCartButtonProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  onAddToCart?: () => void;
}

export default function AddToCartButton({
  position,
  rotation = [0, 0, 0],
  width = 0.5,
  height = 0.15,
  onAddToCart,
}: AddToCartButtonProps) {
  const { camera, gl } = useThree();
  const addTextRef = useRef<any>(null);
  const [addTextWidth, setAddTextWidth] = useState(0);
  const buttonRef = useRef<THREE.Mesh>(null);

  const cartTex = useTexture("/Cart.svg");

  const ICON_SIZE = 0.05;
  const FONT_SIZE = 0.06;

  const iconW = ICON_SIZE;
  const textW = addTextWidth;
  const gap = 0.04;
  const groupWidth = iconW + gap + textW;

  const iconX = -groupWidth / 2 + iconW / 2;
  const textX = groupWidth / 2 - textW / 2;

  // Setup raycasting for add to cart button
  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      if (!buttonRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(buttonRef.current);

      if (intersects.length > 0) {
        console.log("AddToCartButton clicked via raycasting");
        if (onAddToCart) {
          onAddToCart();
        }
      }
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
  }, [camera, gl, onAddToCart]);

  return (
    <group position={position} rotation={rotation}>
      {/* Background Box */}
      <mesh ref={buttonRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={COLORS.primary} />
      </mesh>

      {/* Cart Icon */}
      <mesh position={[iconX, 0, 0.01]}>
        <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
        <meshBasicMaterial map={cartTex} transparent />
      </mesh>

      {/* Add to Cart Text */}
      <Text
        ref={addTextRef}
        onSync={(text) => {
          const bbox = text.geometry.boundingBox;
          const width = bbox.max.x - bbox.min.x;
          setAddTextWidth(width);
        }}
        position={[textX, 0, 0.01]}
        fontSize={FONT_SIZE}
        color="black"
        anchorY="middle"
      >
        Add to Cart
      </Text>
    </group>
  );
}