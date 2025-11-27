"use client";

import { Text, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { SIZES } from "../sizes";
import { COLORS } from "../colors";

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
  width = 0.5,
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
  const FONT_SIZE = 0.06;
  const OPEN_Y_TOP = 0.3;
  const CLOSED_Y_TOP = 0.05;
  const ITEM_SPACING = 0.12;

  const iconW = ICON_SIZE;
  const textW = sizeTextWidth;
  const gap = 0.03;
  const groupWidth = textW + iconW + gap;

  const textX = -groupWidth / 2 + textW / 2;
  const iconX = groupWidth / 2 - iconW / 2;

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

  return (
    <group position={position} rotation={rotation}>
      {/* Main Size Button */}
      <mesh ref={mainButtonRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={COLORS.primary} />

        {/* Size Text */}
        <Text
          ref={sizeTextRef}
          onSync={(text) => {
            const bbox = text.geometry.boundingBox;
            const width = bbox.max.x - bbox.min.x;
            setSizeTextWidth(width);
          }}
          position={[textX, 0, 0.01]}
          fontSize={FONT_SIZE}
          color="black"
          anchorY="middle"
        >
          {`${SIZES[sizeIndex].label}: ${SIZES[sizeIndex].dimensions}`}
        </Text>

        {/* Dropdown Icon */}
        <mesh position={[iconX, 0, 0.01]}>
          <planeGeometry args={[ICON_SIZE, 0.03]} />
          <meshBasicMaterial map={dropdownTex} transparent />
        </mesh>
      </mesh>

      {/* Dropdown Panel */}
      <mesh
        position={[0, -height - (0.7 * slide) / 2, 0]}
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