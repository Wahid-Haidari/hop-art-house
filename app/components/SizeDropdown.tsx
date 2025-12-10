"use client";

import { Text, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { SIZES } from "../sizes";

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
  width = 0.75,
  height = 0.15,
  onSizeChange,
}: SizeDropdownProps) {
  const { camera, gl } = useThree();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const mainButtonRef = useRef<THREE.Mesh>(null);
  const itemRefs = useRef<(THREE.Mesh | null)[]>([]);
  const isOpenRef = useRef(isOpen);
  
  // Keep ref in sync with state
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const dropdownTex = useTexture("/dropdown.svg");

  const FONT_SIZE = 0.055;
  const ITEM_HEIGHT = height;
  const ICON_SIZE = 0.05;

  // Calculate expanded height (all items)
  const expandedHeight = ITEM_HEIGHT * SIZES.length;
  
  // Current height based on animation
  const currentHeight = height + (expandedHeight - height) * animProgress;

  // Animate open (smooth), close instantly
  useFrame(() => {
    if (isOpen) {
      // Smooth open
      setAnimProgress((p) => p + (1 - p) * 0.15);
    } else if (animProgress > 0) {
      // Instant close
      setAnimProgress(0);
    }
  });

  // Setup raycasting for clicks
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

      // When open, check item buttons FIRST
      if (isOpenRef.current) {
        for (let i = 0; i < itemRefs.current.length; i++) {
          const item = itemRefs.current[i];
          if (item) {
            // Force update world matrix
            item.updateMatrixWorld(true);
            const intersects = raycaster.intersectObject(item, false);
            if (intersects.length > 0) {
              // Select this size and close
              setSizeIndex(i);
              setIsOpen(false);
              if (onSizeChange) {
                onSizeChange(i);
              }
              return;
            }
          }
        }
      }

      // Check main button (only opens when closed)
      if (!isOpenRef.current && mainButtonRef.current) {
        mainButtonRef.current.updateMatrixWorld(true);
        const intersects = raycaster.intersectObject(mainButtonRef.current, false);
        if (intersects.length > 0) {
          setIsOpen(true);
          return;
        }
      }
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => gl.domElement.removeEventListener("click", handleCanvasClick);
  }, [camera, gl, onSizeChange]);

  // Setup hover detection
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isOpenRef.current) {
        setHoveredIndex(null);
        return;
      }

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check which item is being hovered
      for (let i = 0; i < itemRefs.current.length; i++) {
        const item = itemRefs.current[i];
        if (item) {
          item.updateMatrixWorld(true);
          const intersects = raycaster.intersectObject(item, false);
          if (intersects.length > 0) {
            setHoveredIndex(i);
            gl.domElement.style.cursor = 'pointer';
            return;
          }
        }
      }
      
      setHoveredIndex(null);
      gl.domElement.style.cursor = 'auto';
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove);
    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.style.cursor = 'auto';
    };
  }, [camera, gl]);

  // Create geometries for rounded rectangles
  const borderGeometry = useMemo(() => {
    const shape = createRoundedRectShape(width, currentHeight, BORDER_RADIUS);
    return new THREE.ShapeGeometry(shape);
  }, [width, currentHeight]);

  const fillGeometry = useMemo(() => {
    const shape = createRoundedRectShape(
      width - BORDER_WIDTH * 2,
      currentHeight - BORDER_WIDTH * 2,
      BORDER_RADIUS - BORDER_WIDTH
    );
    return new THREE.ShapeGeometry(shape);
  }, [width, currentHeight]);

  // Item highlight geometry (for selected item)
  const itemHighlightGeometry = useMemo(() => {
    const shape = createRoundedRectShape(
      width - BORDER_WIDTH * 2,
      ITEM_HEIGHT - BORDER_WIDTH * 2,
      BORDER_RADIUS - BORDER_WIDTH
    );
    return new THREE.ShapeGeometry(shape);
  }, [width]);

  // Calculate Y offset to keep top aligned
  const yOffset = -(currentHeight - height) / 2;

  // Separator X position (between price and dimensions)
  const separatorX = -0.15;
  const priceX = -0.2625;
  const dimensionsX = 0.085;

  return (
    <group position={position} rotation={rotation}>
      <group position={[0, yOffset, 0]}>
        {/* Black border */}
        <mesh position={[0, 0, 0.01]} geometry={borderGeometry}>
          <meshBasicMaterial color="black" toneMapped={false} />
        </mesh>

        {/* White fill */}
        <mesh ref={mainButtonRef} position={[0, 0, 0.011]} geometry={fillGeometry}>
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* When collapsed, show only selected item at top */}
        {animProgress < 0.01 && (
          <group position={[0, 0, 0]}>
            {/* Clickable area */}
            <mesh
              ref={(el) => { itemRefs.current[sizeIndex] = el; }}
              position={[0, 0, 0.02]}
            >
              <planeGeometry args={[width, ITEM_HEIGHT]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* Price */}
            <Text
              position={[priceX, 0, 0.014]}
              fontSize={FONT_SIZE}
              font="/font/ITC Avant Garde Gothic Std Book.otf"
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {`$${SIZES[sizeIndex].price}`}
            </Text>

            {/* Separator line */}
            <mesh position={[separatorX, 0, 0.014]}>
              <planeGeometry args={[0.003, ITEM_HEIGHT]} />
              <meshBasicMaterial color="black" />
            </mesh>

            {/* Dimensions */}
            <Text
              position={[dimensionsX, 0, 0.014]}
              fontSize={FONT_SIZE}
              font="/font/ITC Avant Garde Gothic Std Book.otf"
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {SIZES[sizeIndex].dimensions}
            </Text>

            {/* Dropdown icon */}
            <mesh position={[0.32, 0, 0.014]}>
              <planeGeometry args={[ICON_SIZE, 0.03]} />
              <meshBasicMaterial map={dropdownTex} transparent />
            </mesh>
          </group>
        )}

        {/* When open/animating, show all items */}
        {animProgress >= 0.01 && SIZES.map((size, i) => {
          const isSelected = i === sizeIndex;
          const isHovered = i === hoveredIndex;
          const itemY = (currentHeight / 2) - (ITEM_HEIGHT / 2) - (i * ITEM_HEIGHT);

          return (
            <group key={i} position={[0, itemY, 0]}>
              {/* Yellow highlight for selected or hovered item */}
              {(isSelected || isHovered) && (
                <mesh position={[0, 0, 0.012]} geometry={itemHighlightGeometry}>
                  <meshBasicMaterial color="#F7C41A" toneMapped={false} />
                </mesh>
              )}

              {/* Clickable area for this item */}
              <mesh
                ref={(el) => { itemRefs.current[i] = el; }}
                position={[0, 0, 0.02]}
              >
                <planeGeometry args={[width, ITEM_HEIGHT]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>

              {/* Price */}
              <Text
                position={[priceX, 0, 0.014]}
                fontSize={FONT_SIZE}
                font="/font/ITC Avant Garde Gothic Std Book.otf"
                color="black"
                anchorX="center"
                anchorY="middle"
              >
                {`$${size.price}`}
              </Text>

              {/* Separator line */}
              <mesh position={[separatorX, 0, 0.014]}>
                <planeGeometry args={[0.003, ITEM_HEIGHT]} />
                <meshBasicMaterial color="black" />
              </mesh>

              {/* Dimensions */}
              <Text
                position={[dimensionsX, 0, 0.014]}
                fontSize={FONT_SIZE}
                font="/font/ITC Avant Garde Gothic Std Book.otf"
                color="black"
                anchorX="center"
                anchorY="middle"
              >
                {size.dimensions}
              </Text>

              {/* Dropdown icon - only on first row */}
              {i === 0 && (
                <mesh position={[0.32, 0, 0.014]}>
                  <planeGeometry args={[ICON_SIZE, 0.03]} />
                  <meshBasicMaterial map={dropdownTex} transparent />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}