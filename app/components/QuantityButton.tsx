"use client";

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../colors";

// Create a rounded rectangle shape
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
  const ARROW_WIDTH = 0.018;
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

  



  // Create geometries for rounded rectangles
  const borderGeometry = useMemo(() => {
    const shape = createRoundedRectShape(width, height, BORDER_RADIUS);
    return new THREE.ShapeGeometry(shape);
  }, [width, height]);

  const fillGeometry = useMemo(() => {
    const shape = createRoundedRectShape(
      width - BORDER_WIDTH * 2,
      height - BORDER_WIDTH * 2,
      BORDER_RADIUS - BORDER_WIDTH
    );
    return new THREE.ShapeGeometry(shape);
  }, [width, height]);

  return (
    <group position={position} rotation={rotation}>
      {/* Black border (flat) */}
      <mesh position={[0, 0, 0.01]} geometry={borderGeometry}>
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>

      {/* White fill (flat, slightly in front) */}
      <mesh position={[0, 0, 0.011]} geometry={fillGeometry}>
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>

      {/* Quantity Number */}
      <Text
        ref={quantityTextRef}
        onSync={(text) => {
          const bbox = text.geometry.boundingBox;
          const width = bbox.max.x - bbox.min.x;
          setQuantityTextWidth(width);
        }}
        position={[numberX, 0, 0.012]}
        fontSize={FONT_SIZE}
        font="/font/ITC Avant Garde Gothic Std Book.otf"
        color="black"
        anchorY="middle"
      >
        {quantity}
      </Text>

      {/* Up Arrow (clickable area) */}
      <mesh
        ref={plusButtonRef}
        position={[arrowGroupX, upArrowY, 0.012]}
      >
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.45]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Up Arrow Triangle (flat) */}
      <mesh position={[arrowGroupX, upArrowY, 0.013]}>
        <shapeGeometry args={[(() => {
          const shape = new THREE.Shape();
          shape.moveTo(0, ARROW_HEIGHT / 2);
          shape.lineTo(-ARROW_WIDTH, -ARROW_HEIGHT / 2);
          shape.lineTo(ARROW_WIDTH, -ARROW_HEIGHT / 2);
          shape.closePath();
          return shape;
        })()]} />
        <meshBasicMaterial color={COLORS.black} toneMapped={false} />
      </mesh>

      {/* Down Arrow (clickable area) */}
      <mesh
        ref={minusButtonRef}
        position={[arrowGroupX, downArrowY, 0.012]}
      >
        <planeGeometry args={[ARROW_GROUP_WIDTH, height * 0.45]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Down Arrow Triangle (flat) */}
      <mesh position={[arrowGroupX, downArrowY, 0.013]}>
        <shapeGeometry args={[(() => {
          const shape = new THREE.Shape();
          shape.moveTo(0, -ARROW_HEIGHT / 2);
          shape.lineTo(-ARROW_WIDTH, ARROW_HEIGHT / 2);
          shape.lineTo(ARROW_WIDTH, ARROW_HEIGHT / 2);
          shape.closePath();
          return shape;
        })()]} />
        <meshBasicMaterial color={COLORS.black} toneMapped={false} />
      </mesh>
    </group>
  );
}