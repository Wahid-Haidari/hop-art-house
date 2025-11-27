"use client";

import { Text } from "@react-three/drei";
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

  const FONT_SIZE = 0.06;
  const ARROW_WIDTH = 0.03;
  const ARROW_HEIGHT = 0.02;
  const ARROW_GROUP_WIDTH = 0.06;
  
  // Position number on left, arrows on right
  const numberX = -width / 2 + 0.08;
  const arrowGroupX = width / 2 - 0.08;
  const upArrowY = 0.02;
  const downArrowY = -0.02;

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
      {/* Background Box with border */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>
      
      {/* Black border */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial attach="material" color={COLORS.black} linewidth={2} />
      </lineSegments>

      {/* Quantity Number */}
      <Text
        ref={quantityTextRef}
        onSync={(text) => {
          const bbox = text.geometry.boundingBox;
          const width = bbox.max.x - bbox.min.x;
          setQuantityTextWidth(width);
        }}
        position={[numberX, 0, 0.01]}
        fontSize={FONT_SIZE}
        color="black"
        anchorY="middle"
      >
        {quantity}
      </Text>

      {/* Arrow container background */}
      <mesh position={[arrowGroupX, 0, 0.005]}>
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.9]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>

      {/* Up Arrow (clickable area) */}
      <mesh
        ref={plusButtonRef}
        position={[arrowGroupX, upArrowY, 0.01]}
      >
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.45]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Up Arrow Triangle */}
      <mesh position={[arrowGroupX, upArrowY, 0.015]}>
        <coneGeometry args={[ARROW_WIDTH, ARROW_HEIGHT, 3]} />
        <meshBasicMaterial color={COLORS.black} toneMapped={false} />
      </mesh>

      {/* Down Arrow (clickable area) */}
      <mesh
        ref={minusButtonRef}
        position={[arrowGroupX, downArrowY, 0.01]}
      >
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.45]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Down Arrow Triangle */}
      <mesh position={[arrowGroupX, downArrowY, 0.015]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[ARROW_WIDTH, ARROW_HEIGHT, 3]} />
        <meshBasicMaterial color={COLORS.black} toneMapped={false} />
      </mesh>
    </group>
  );
}