"use client";

import { Text, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { COLORS } from "../colors";

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
  const { camera, gl } = useThree();
  const [quantity, setQuantity] = useState(1);
  const quantityTextRef = useRef<any>(null);
  const [quantityTextWidth, setQuantityTextWidth] = useState(0);
  const minusButtonRef = useRef<THREE.Mesh>(null);
  const plusButtonRef = useRef<THREE.Mesh>(null);

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

  // Setup raycasting for minus button
  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      if (!minusButtonRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(minusButtonRef.current);

      if (intersects.length > 0) {
        handleQuantityChange(Math.max(1, quantity - 1));
      }
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
  }, [camera, gl, quantity]);

  // Setup raycasting for plus button
  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      if (!plusButtonRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(plusButtonRef.current);

      if (intersects.length > 0) {
        handleQuantityChange(quantity + 1);
      }
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
  }, [camera, gl, quantity]);

  return (
    <group position={position} rotation={rotation}>
      {/* Background Box */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={COLORS.primary} />
      </mesh>

      {/* Minus Button */}
      <mesh
        ref={minusButtonRef}
        position={[minusX, 0, 0.01]}
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
        ref={plusButtonRef}
        position={[plusX, 0, 0.01]}
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