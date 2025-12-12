"use client";

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import { useMobile } from "../hooks/useMobile";
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
  const buttonRef = useRef<THREE.Mesh>(null);
  const [showAdded, setShowAdded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isMobile = useMobile();

  const FONT_SIZE = 0.06;

  // Setup raycasting for add to cart button (click/touch)
  useEffect(() => {
    let lastTouchTime = 0;
    const handleInteraction = (clientX: number, clientY: number) => {
      if (!buttonRef.current) return;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const rect = gl.domElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(buttonRef.current);
      if (intersects.length > 0) {
        if (onAddToCart) {
          onAddToCart();
          setIsPressed(true);
          setTimeout(() => setIsPressed(false), 150);
          setShowAdded(true);
          setTimeout(() => setShowAdded(false), 2000);
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
  }, [camera, gl, onAddToCart]);

  // Setup hover detection for cursor change
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
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
        gl.domElement.style.cursor = "default";
      }
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove);
    return () => gl.domElement.removeEventListener("mousemove", handleMouseMove);
  }, [camera, gl]);

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
      <mesh position={[0, 0, 0]} geometry={borderGeometry}>
        <meshBasicMaterial color="black" toneMapped={false} depthWrite={false} />
      </mesh>

      {/* Yellow fill - flashes white when pressed */}
      <mesh ref={buttonRef} position={[0, 0, 0.001]} geometry={fillGeometry}>
        <meshBasicMaterial color={isPressed ? "white" : COLORS.primary} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* Add to Cart Text */}
      <Text
        position={[0, 0, 0.002]}
        fontSize={FONT_SIZE}
        font="/font/ITC Avant Garde Gothic Std Book.otf"
        color="black"
        anchorX="center"
        anchorY="middle"
        depthOffset={-1}
      >
        {showAdded ? "Added!" : "Add to Cart"}
      </Text>
    </group>
  );
}