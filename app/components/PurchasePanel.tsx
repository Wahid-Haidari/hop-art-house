"use client";

import { Text, useTexture } from "@react-three/drei";
import { useRef, useState } from "react";


interface PurchasePanelProps {
    artPosition: [number, number, number];
    artRotation: [number, number, number];
}




export default function PurchasePanel({artPosition, artRotation}: PurchasePanelProps) {

    const [artX, artY, artZ] = artPosition;
    const ART_HEIGHT = 2.5;
    const artBottom = artY - ART_HEIGHT / 2; {/* Y position of the bottom of the artwork */}
    const ART_WIDTH = 1.5;
    const artRightEdge = artX + ART_WIDTH / 2;
    const CARD_WIDTH = 0.5;

    


    const GAP = 0.1;; // horizontal gap between buttons, and between buttons and artwork
    
    const BUTTON_HEIGHT = 0.15;



    let baseX = artX;
    // Base position where the middle box will be
    const baseY = artBottom - BUTTON_HEIGHT / 2 - GAP;
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
    const cartTex = useTexture("/Cart.svg");

    
    const QUANTITY_WIDTH = 0.3;
    const SIZE_WIDTH = 0.5;
    const ADD_TO_CART_WIDTH = CARD_WIDTH;
    const sizeX = artRightEdge - (SIZE_WIDTH / 2);
    const quantityX = sizeX - (SIZE_WIDTH / 2) - GAP - (QUANTITY_WIDTH / 2);

    const ICON_SIZE = 0.06;   // adjust to your preferred visual size
    const FONT_SIZE = 0.07;



    const infoCardCenterX = artRightEdge + CARD_WIDTH / 2 + GAP;
    const addToCartX = infoCardCenterX;




  




    {/* This is to make the icons locations dynamic based on text width*/}
    const sizeTextRef = useRef<any>(null);
    const [sizeTextWidth, setSizeTextWidth] = useState(0);

    const quantityTextRef = useRef<any>(null);
    const [quantityTextWidth, setQuantityTextWidth] = useState(0);


    const addTextRef = useRef<any>(null);
    const [addTextWidth, setAddTextWidth] = useState(0);



    function renderQuantityGroup() {
        const iconW = ICON_SIZE;
        const textW = quantityTextWidth;
        const gap = 0.03;

        // total width of: [ minus ][ gap ][ text ][ gap ][ plus ]
        const groupWidth = iconW + gap + textW + gap + iconW;

        const minusX = -groupWidth / 2 + iconW / 2;
        const textX = 0; // centered
        const plusX = groupWidth / 2 - iconW / 2;

        return (
            <>
            {/* Minus Button */}
            <mesh position={[minusX, 0, 0.01]}>
                <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
                <meshBasicMaterial map={minusTex} transparent />
            </mesh>

            {/* Quantity Number */}
            <Text
                ref={quantityTextRef}
                onSync={(text) => {
                const bbox = text.geometry.boundingBox;
                const width = bbox.max.x - bbox.min.x;
                setQuantityTextWidth(width);
                }}
                position={[textX, 0, 0.01]}
                fontSize={FONT_SIZE}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                1
            </Text>

            {/* Plus Button */}
            <mesh position={[plusX, 0, 0.01]}>
                <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
                <meshBasicMaterial map={plusTex} transparent />
            </mesh>
            </>
        );
    }


    function renderSizeGroup() {
        const iconW = ICON_SIZE;
        const textW = sizeTextWidth;
        const gap = 0.03;

        const groupWidth = textW + iconW + gap;

        const textX = -groupWidth / 2 + textW / 2;
        const iconX = groupWidth / 2 - iconW / 2;

        return (
            <>
                {/* Size text */}
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
                    Size
                </Text>

                {/* Dropdown Icon */}
                <mesh position={[iconX, 0, 0.01]}>
                    <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
                    <meshBasicMaterial map={dropdownTex} transparent />
                </mesh>
            </>
        );
    }

    function renderAddToCartGroup() {
        const iconW = ICON_SIZE;
        const textW = addTextWidth;
        const gap = 0.04;

        const groupWidth = iconW + gap + textW;

        const iconX = -groupWidth / 2 + iconW / 2;
        const textX = groupWidth / 2 - textW / 2;

        return (
            <>
                {/* Cart Icon */}
                <mesh position={[iconX, 0, 0.01]}>
                    <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
                    <meshBasicMaterial map={cartTex} transparent />
                </mesh>

                {/* Add to Cart text */}
                <Text
                    ref={addTextRef}
                    onSync={(text) => {
                        const bbox = text.geometry.boundingBox;
                        const width = bbox.max.x - bbox.min.x;
                        setAddTextWidth(width);
                    }}
                    position={[textX, 0, 0.01]}
                    fontSize={FONT_SIZE}
                    color="black"
                    anchorY="middle"
                >
                    Add to Cart
                </Text>
            </>
        );
    }




    return (
        <>
            {/* Quantity Box */}
            <mesh position={[quantityX, baseY, baseZ]}>
                <planeGeometry args={[QUANTITY_WIDTH, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {renderQuantityGroup()} 
            </mesh>


            {/* Size Dropdown Box */}
            <mesh position={[sizeX, baseY, baseZ]}>
                <planeGeometry args={[SIZE_WIDTH, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {renderSizeGroup()}     
            </mesh>

            {/* Add to Cart Box */}
            <mesh position={[addToCartX, baseY, baseZ]}>
                <planeGeometry args={[ADD_TO_CART_WIDTH, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {/* Add to Cart Label */}
                {renderAddToCartGroup()}
            </mesh>
        </>
    );
}
