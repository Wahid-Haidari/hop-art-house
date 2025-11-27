"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { SIZES } from "../sizes";

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
  const [sizeIndex, setSizeIndex] = useState(0);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const sizeTextRef = useRef<any>(null);
  const [sizeTextWidth, setSizeTextWidth] = useState(0);

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

  return (
    <group position={position} rotation={rotation}>
      {/* Main Size Button */}
      <mesh onClick={() => setSizeOpen((o) => !o)}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#FFC72C" />

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
            onClick={() => handleSizeSelect(i)}
          >
            {`${size.label}: ${size.dimensions}`}
          </Text>
        ))}
      </mesh>
    </group>
  );
}