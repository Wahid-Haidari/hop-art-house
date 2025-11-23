"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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

    
    {/*Quantity state for number of purchase */}
    const [quantity, setQuantity] = useState(1);

    
    {/* Size state for dropdown */}
    const sizes = ["8x10", "12x16", "16x20", "18x24", "24x36"]; 
    const [sizeIndex, setSizeIndex] = useState(0);
    const [sizeOpen, setSizeOpen] = useState(false);
    const [slide, setSlide] = useState(0); // 0 = hidden, 1 = fully visible


    {/* some measurements for drop down */}
    const OPEN_Y_TOP = 0.3;
    const CLOSED_Y_TOP = 0.05;
    const ITEM_SPACING = 0.12;






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
            {/* Minus Button Click Area */}
            <mesh
                position={[minusX, 0, 0.01]}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
                {/* INVISIBLE HITBOX */}
                <planeGeometry args={[0.15, 0.15]} />  
                <meshBasicMaterial transparent opacity={0} />

                {/* Visible Icon */}
                <mesh position={[0, 0, 0.005]}>
                    <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
                    <meshBasicMaterial map={minusTex} transparent />
                </mesh>
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
                {quantity}
            </Text>


            {/* Plus Button */}
            {/* Plus Button Click Area */}
            <mesh
                position={[plusX, 0, 0.01]}
                onClick={() => setQuantity(q => q + 1)}
            >
                {/* INVISIBLE HITBOX */}
                <planeGeometry args={[0.15, 0.15]} />
                <meshBasicMaterial transparent opacity={0} />

                {/* Visible Icon */}
                <mesh position={[0, 0, 0.005]}>
                    <planeGeometry args={[ICON_SIZE, ICON_SIZE]} />
                    <meshBasicMaterial map={plusTex} transparent />
                </mesh>
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


        const currentSize = sizes[sizeIndex];

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
                    {sizes[sizeIndex]}
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

    useFrame(() => {
        // target position based on open/closed
        const target = sizeOpen ? 1 : 0;

        // smooth interpolation (0.1 = smoothness)
        setSlide(s => s + (target - s) * 0.15);
    });





    return (
        <>
            {/* Quantity Box */}
            <mesh position={[quantityX, baseY, baseZ]}>
                <planeGeometry args={[QUANTITY_WIDTH, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {renderQuantityGroup()} 
            </mesh>


            {/* Size Dropdown Box */}
            <mesh
                position={[sizeX, baseY, baseZ]}
                onClick={() => setSizeOpen(o => !o)}   // ← toggle open/closed
            >

                <planeGeometry args={[SIZE_WIDTH, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />

                {renderSizeGroup()}
            </mesh>


            {/* Add to Cart Box */}
            <mesh position={[addToCartX, baseY, baseZ]}
            >
                <planeGeometry args={[ADD_TO_CART_WIDTH, BUTTON_HEIGHT]} />
                <meshBasicMaterial color="#FFC72C" />
                {/* Add to Cart Label */}
                {renderAddToCartGroup()}
            </mesh>
            {/* Dropdown Panel */}
            <mesh
                position={[
                    sizeX,
                    baseY - BUTTON_HEIGHT - (0.7 * slide) / 2,
                    baseZ
                ]}
                visible={slide > 0.01}   // stay hidden when fully closed
            >
                <planeGeometry args={[SIZE_WIDTH, 0.7 * slide]} />

                <meshBasicMaterial color="#FFE999" opacity={0.95} transparent />

                

                {sizes.map((s, i) => (
                    <Text
                        key={i}
                        position={[
                             0,
                            CLOSED_Y_TOP +
                                (OPEN_Y_TOP - CLOSED_Y_TOP) * slide +
                                (-i * ITEM_SPACING) * slide,
                            0.01
                        ]}
                        fontSize={0.07}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                        onClick={() => {
                            setSizeIndex(i);
                            setSizeOpen(false);
                        }}
                    >
                        {s}
                    </Text>
                ))}


        





            </mesh>



        </>
    );
}
