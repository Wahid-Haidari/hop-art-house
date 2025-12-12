"use client";

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { COLORS } from "../colors";

function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  
  return shape;
}

const BORDER_RADIUS = 0.025;
const BORDER_WIDTH = 0.005;
const FONT_SIZE = 0.06;
const ARROW_WIDTH = 0.018;
const ARROW_HEIGHT = 0.02;
const ARROW_GROUP_WIDTH = 0.06;

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
  const plusButtonRef = useRef<THREE.Mesh>(null);
  const minusButtonRef = useRef<THREE.Mesh>(null);
  const quantityRef = useRef(quantity);

  // Keep ref in sync with state for use in event handlers
  useEffect(() => {
    quantityRef.current = quantity;
  }, [quantity]);

  const numberX = -width / 2 + 0.08;
  const arrowGroupX = width / 2 - 0.08;
  const upArrowY = 0.02;
  const downArrowY = -0.02;

  // Setup raycasting for button clicks/touches
  useEffect(() => {
    let lastTouchTime = 0;

    const handleInteraction = (clientX: number, clientY: number) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const rect = gl.domElement.getBoundingClientRect();

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // Check plus button
      if (plusButtonRef.current) {
        plusButtonRef.current.updateMatrixWorld(true);
        if (raycaster.intersectObject(plusButtonRef.current, true).length > 0) {
          const newQuantity = quantityRef.current + 1;
          setQuantity(newQuantity);
          onQuantityChange?.(newQuantity);
          return;
        }
      }

      // Check minus button
      if (minusButtonRef.current) {
        minusButtonRef.current.updateMatrixWorld(true);
        if (raycaster.intersectObject(minusButtonRef.current, true).length > 0) {
          const newQuantity = Math.max(1, quantityRef.current - 1);
          setQuantity(newQuantity);
          onQuantityChange?.(newQuantity);
          return;
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (Date.now() - lastTouchTime < 500) return;
      handleInteraction(event.clientX, event.clientY);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      lastTouchTime = Date.now();
      if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    gl.domElement.addEventListener("touchend", handleTouchEnd);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
      gl.domElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, gl, onQuantityChange]);

  // Memoized geometries
  const borderGeometry = useMemo(() => 
    new THREE.ShapeGeometry(createRoundedRectShape(width, height, BORDER_RADIUS)), 
    [width, height]
  );

  const fillGeometry = useMemo(() => 
    new THREE.ShapeGeometry(createRoundedRectShape(
      width - BORDER_WIDTH * 2,
      height - BORDER_WIDTH * 2,
      BORDER_RADIUS - BORDER_WIDTH
    )), 
    [width, height]
  );

  const upArrowShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, ARROW_HEIGHT / 2);
    shape.lineTo(-ARROW_WIDTH, -ARROW_HEIGHT / 2);
    shape.lineTo(ARROW_WIDTH, -ARROW_HEIGHT / 2);
    shape.closePath();
    return shape;
  }, []);

  const downArrowShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -ARROW_HEIGHT / 2);
    shape.lineTo(-ARROW_WIDTH, ARROW_HEIGHT / 2);
    shape.lineTo(ARROW_WIDTH, ARROW_HEIGHT / 2);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Border */}
      <mesh position={[0, 0, 0.01]} geometry={borderGeometry}>
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>

      {/* Background */}
      <mesh position={[0, 0, 0.011]} geometry={fillGeometry}>
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>

      {/* Quantity Number */}
      <Text
        position={[numberX, 0, 0.012]}
        fontSize={FONT_SIZE}
        font="/font/ITC Avant Garde Gothic Std Book.otf"
        color="black"
        anchorY="middle"
      >
        {quantity}
      </Text>

      {/* Up Arrow - clickable area */}
      <mesh ref={plusButtonRef} position={[arrowGroupX, upArrowY, 0.012]}>
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.45]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>
      
      {/* Up Arrow - triangle */}
      <mesh position={[arrowGroupX, upArrowY, 0.013]}>
        <shapeGeometry args={[upArrowShape]} />
        <meshBasicMaterial color={COLORS.black} toneMapped={false} />
      </mesh>

      {/* Down Arrow - clickable area */}
      <mesh ref={minusButtonRef} position={[arrowGroupX, downArrowY, 0.012]}>
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.45]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>
      
      {/* Down Arrow - triangle */}
      <mesh position={[arrowGroupX, downArrowY, 0.013]}>
        <shapeGeometry args={[downArrowShape]} />
        <meshBasicMaterial color={COLORS.black} toneMapped={false} />
      </mesh>
    </group>
  );
}