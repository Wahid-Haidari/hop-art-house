"use client";

import { Text, useTexture } from "@react-three/drei";
import { useRef, useState } from "react";

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
  const addTextRef = useRef<any>(null);
  const [addTextWidth, setAddTextWidth] = useState(0);

  const cartTex = useTexture("/Cart.svg");

  const ICON_SIZE = 0.05;
  const FONT_SIZE = 0.06;

  const iconW = ICON_SIZE;
  const textW = addTextWidth;
  const gap = 0.04;
  const groupWidth = iconW + gap + textW;

  const iconX = -groupWidth / 2 + iconW / 2;
  const textX = groupWidth / 2 - textW / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Background Box */}
      <mesh onClick={onAddToCart}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#FFC72C" />

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
      </mesh>
    </group>
  );
}