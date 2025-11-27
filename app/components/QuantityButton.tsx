"use client";

import { Text, useTexture } from "@react-three/drei";
import { useRef, useState } from "react";

interface QuantityButtonProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function QuantityButton({
  position,
  rotation = [0, 0, 0],
  width = 0.3,
  height = 0.15,
  onQuantityChange,
}: QuantityButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const quantityTextRef = useRef<any>(null);
  const [quantityTextWidth, setQuantityTextWidth] = useState(0);

  const plusTex = useTexture("/Plus.svg");
  const minusTex = useTexture("/Negative.svg");

  const ICON_SIZE = 0.05;
  const FONT_SIZE = 0.06;

  const iconW = ICON_SIZE;
  const textW = quantityTextWidth;
  const gap = 0.03;
  const groupWidth = iconW + gap + textW + gap + iconW;

  const minusX = -groupWidth / 2 + iconW / 2;
  const textX = 0;
  const plusX = groupWidth / 2 - iconW / 2;

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Background Box */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#FFC72C" />
      </mesh>

      {/* Minus Button */}
      <mesh
        position={[minusX, 0, 0.01]}
        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
      >
        <planeGeometry args={[0.15, 0.15]} />
        <meshBasicMaterial transparent opacity={0} />

        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[ICON_SIZE, 0.01]} />
          <meshBasicMaterial map={minusTex} transparent />
        </mesh>
      </mesh>

      {/* Quantity Number */}
      <Text
        ref={quantityTextRef}
        onSync={(text) => {
          const bbox = text.geometry.boundingBox;
          const width = bbox.max.x - bbox.min.x;
          setQuantityTextWidth(width);
        }}
        position={[textX, 0, 0.015]}
        fontSize={FONT_SIZE}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {quantity}
      </Text>

      {/* Plus Button */}
      <mesh
        position={[plusX, 0, 0.01]}
        onClick={() => handleQuantityChange(quantity + 1)}
      >
        <planeGeometry args={[0.15, 0.15]} />
        <meshBasicMaterial transparent opacity={0} />

        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
          <meshBasicMaterial map={plusTex} transparent />
        </mesh>
      </mesh>
    </group>
  );
}