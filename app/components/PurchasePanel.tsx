"use client";

import { Text, useTexture } from "@react-three/drei";


interface PurchasePanelProps {
    artPosition: [number, number, number];
    artRotation: [number, number, number];
}


export default function PurchasePanel({artPosition, artRotation}: PurchasePanelProps) {

    const [artX, artY, artZ] = artPosition;
    const ART_HEIGHT = 2.5;
    const artBottom = artY - ART_HEIGHT / 2; {/* Y position of the bottom of the artwork */}

    const GAP = 0.1;; // horizontal gap between buttons, and between buttons and artwork
    
    const BUTTON_HEIGHT = 0.15;


    // Base position where the middle box will be
    const baseY = artBottom - BUTTON_HEIGHT / 2 - GAP;

    let baseX = artX;
    let baseZ = artZ;

    // Determine which wall the artwork is on
    const rotY = artRotation[1];
    const horizontalOffset = 1.6; // how far to the right

    if (rotY === 0) {
    // Back wall
    baseX = artX + horizontalOffset;
    baseZ = artZ;
    } 

    const dropdownTex = useTexture("/dropdown.svg");
    const plusTex = useTexture("/Plus.svg");
    const minusTex = useTexture("/Negative.svg");

    return (
        <>
            {/* Quantity Box */}
            <mesh position={[baseX - (1.1 + GAP), baseY, baseZ]}>
            <planeGeometry args={[1.0, BUTTON_HEIGHT]} />
            <meshBasicMaterial color="#FFC72C" />

            {/* Minus Button */}
            <mesh position={[-0.35, 0, 0.01]}>
                <planeGeometry args={[0.1, 0.025]} />
                <meshBasicMaterial map={minusTex} transparent />
            </mesh>

            {/* Quantity Number */}
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.14}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                1
            </Text>

            {/* Plus Button */}
            <mesh position={[0.35, 0, 0.01]}>
                <planeGeometry args={[0.1, 0.1]} />
                <meshBasicMaterial map={plusTex} transparent />
            </mesh>

            </mesh>

            {/* Size Dropdown Box */}
            <mesh position={[baseX, baseY, baseZ]}>
                <planeGeometry args={[1.2, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {/* Text Label */}
                <Text
                    position={[0, 0, 0.01]} // slight lift so text isn't clipping
                    fontSize={0.15}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    Size
                </Text>
                {/* Dropdown SVG */}
                <mesh position={[0.45, 0, 0.01]}>
                    <planeGeometry args={[0.1, 0.1]} />
                    <meshBasicMaterial map={dropdownTex} transparent />
                </mesh>
            </mesh>

            {/* Add to Cart Box */}
            <mesh position={[baseX + (1.3 + GAP), baseY, baseZ]}>
                <planeGeometry args={[1.4, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {/* Add to Cart Label */}
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.13}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    Add to Cart
                </Text>
            </mesh>
        </>
    );
}
