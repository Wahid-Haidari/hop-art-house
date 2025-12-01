"use client";

import { Text, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { SIZES } from "../sizes";
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

interface SizeDropdownProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  onSizeChange?: (sizeIndex: number) => void;
}

export default function SizeDropdown({
  position,
  rotation = [0, 0, 0],
  width = 0.65,
  height = 0.15,
  onSizeChange,
}: SizeDropdownProps) {
  const { camera, gl } = useThree();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const sizeTextRef = useRef<any>(null);
  const [sizeTextWidth, setSizeTextWidth] = useState(0);
  const mainButtonRef = useRef<THREE.Mesh>(null);
  const sizeItemsRef = useRef<(THREE.Mesh | null)[]>([]);

  const dropdownTex = useTexture("/dropdown.svg");

  const ICON_SIZE = 0.05;
  const FONT_SIZE = 0.055;
  const OPEN_Y_TOP = 0.3;
  const CLOSED_Y_TOP = 0.05;
  const ITEM_SPACING = 0.12;

  // Separate price and dimensions
  const priceText = `$${SIZES[sizeIndex].price}`;
  const dimensionsText = SIZES[sizeIndex].dimensions;

  useFrame(() => {
    const target = sizeOpen ? 1 : 0;
    setSlide((s) => s + (target - s) * 0.15);
  });

  const handleSizeSelect = (index: number) => {
    setSizeIndex(index);
    setSizeOpen(false);
    if (onSizeChange) {
      onSizeChange(index);
    }
  };

  // Setup raycasting for main button
  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      if (!mainButtonRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mainButtonRef.current);

      if (intersects.length > 0) {
        setSizeOpen((o) => !o);
      }
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
  }, [camera, gl]);

  // Setup raycasting for size items
  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check all size items
      sizeItemsRef.current.forEach((item, index) => {
        if (item) {
          const intersects = raycaster.intersectObject(item);
          if (intersects.length > 0) {
            handleSizeSelect(index);
          }
        }
      });
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
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
      <mesh position={[0, 0, 0.01]} geometry={borderGeometry}>
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>

      {/* White fill (flat, slightly in front) */}
      <mesh ref={mainButtonRef} position={[0, 0, 0.011]} geometry={fillGeometry}>
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Price Text */}
      <Text
        position={[-0.18, 0, 0.012]}
        fontSize={FONT_SIZE}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {priceText}
      </Text>

      {/* Vertical Separator Line */}
      <mesh position={[-0.13, 0, 0.012]}>
        <planeGeometry args={[0.003, 0.15]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Dimensions Text */}
      <Text
        ref={sizeTextRef}
        onSync={(text) => {
          const bbox = text.geometry.boundingBox;
          const width = bbox.max.x - bbox.min.x;
          setSizeTextWidth(width);
        }}
        position={[0.08, 0, 0.012]}
        fontSize={FONT_SIZE}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {dimensionsText}
      </Text>

      {/* Dropdown Icon */}
      <mesh position={[0.27, 0, 0.012]}>
        <planeGeometry args={[ICON_SIZE, 0.03]} />
        <meshBasicMaterial map={dropdownTex} transparent />
      </mesh>

      {/* Dropdown Panel */}
      <mesh
        position={[0, -height - (0.7 * slide) / 2, 0.01]}
        visible={slide > 0.01}
      >
        <planeGeometry args={[width, 0.7 * slide]} />
        <meshBasicMaterial color="#FFE999" opacity={0.95} transparent />

        {SIZES.map((size, i) => (
          <Text
            key={i}
            ref={(el) => {
              if (el) sizeItemsRef.current[i] = el as unknown as THREE.Mesh;
            }}
            position={[
              0,
              CLOSED_Y_TOP +
                (OPEN_Y_TOP - CLOSED_Y_TOP) * slide +
                -i * ITEM_SPACING * slide,
              0.01,
            ]}
            fontSize={0.05}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {`${size.label}: ${size.dimensions}`}
          </Text>
        ))}
      </mesh>
    </group>
  );
}