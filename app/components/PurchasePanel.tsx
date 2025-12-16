"use client";

import { useState, useCallback } from "react";
import QuantityButton from "./QuantityButton";
import SizeDropdown from "./SizeDropdown";
import AddToCartButton from "./AddToCartButton";
import { useCart } from "./CartContext";

interface PurchasePanelProps {
    artworkId: string;
    artworkTitle: string;
    artworkImage: string;
    artPosition: [number, number, number];
    artRotation: [number, number, number];
}

export default function PurchasePanel({
    artworkId,
    artworkTitle,
    artworkImage,
    artPosition,
    artRotation
}: PurchasePanelProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const [artX, artY, artZ] = artPosition;
    const ART_HEIGHT = 2.5;
    const artBottom = artY - ART_HEIGHT / 2;
    const ART_WIDTH = 1.5;
    const artRightEdge = artX + ART_WIDTH / 2;
    const CARD_WIDTH = 0.5;
    const SIZE_WIDTH = 0.75;
    const QUANTITY_WIDTH = 0.3;
    const ADD_TO_CART_WIDTH = CARD_WIDTH;

    const GAP = 0.1;
    const BUTTON_HEIGHT = 0.15;

    let baseX = artX;
    const baseY = artBottom - BUTTON_HEIGHT / 2 - GAP;
    let baseZ = artZ;

    // Determine which wall the artwork is on
    const rotY = artRotation[1];
    const horizontalOffset = 1.6;

    let quantityX, quantityZ, sizeX, sizeZ, addToCartX, addToCartZ;

    if (rotY === 0) {
        // Back wall - buttons to the right
        baseX = artX + horizontalOffset;
        baseZ = artZ;
        
        // Add to cart button (aligned with info card above art)
        const infoCardCenterX = artRightEdge + CARD_WIDTH / 2 + GAP;
        addToCartX = infoCardCenterX;
        addToCartZ = baseZ;
        // Quantity button to the left of add to cart
        quantityX = addToCartX - ADD_TO_CART_WIDTH / 2 - GAP - QUANTITY_WIDTH / 2;
        quantityZ = baseZ;
        // Size button to the left of quantity
        sizeX = quantityX - QUANTITY_WIDTH / 2 - GAP - SIZE_WIDTH / 2;
        sizeZ = baseZ;
    } else if (Math.abs(rotY - Math.PI / 2) < 0.1) {
        // Left wall - buttons forward (toward room center)
        baseX = artX;
        baseZ = artZ + horizontalOffset;
        
        // Add to cart button (aligned with info card)
        addToCartZ = artZ - ART_WIDTH / 2 - CARD_WIDTH / 2 - GAP;
        addToCartX = baseX;
        // Quantity button next to add to cart
        quantityZ = addToCartZ + ADD_TO_CART_WIDTH / 2 + GAP + QUANTITY_WIDTH / 2;
        quantityX = baseX;
        // Size button next to quantity
        sizeZ = quantityZ + QUANTITY_WIDTH / 2 + GAP + SIZE_WIDTH / 2;
        sizeX = baseX;
    } else if (Math.abs(rotY + Math.PI / 2) < 0.1) {
        // Right wall - buttons backward (toward room center)
        baseX = artX;
        baseZ = artZ - horizontalOffset;
        
        // Add to cart button (aligned with info card)
        addToCartZ = artZ + ART_WIDTH / 2 + CARD_WIDTH / 2 + GAP;
        addToCartX = baseX;
        // Quantity button next to add to cart
        quantityZ = addToCartZ - ADD_TO_CART_WIDTH / 2 - GAP - QUANTITY_WIDTH / 2;
        quantityX = baseX;
        // Size button next to quantity
        sizeZ = quantityZ - QUANTITY_WIDTH / 2 - GAP - SIZE_WIDTH / 2;
        sizeX = baseX;
    } else if (Math.abs(rotY - Math.PI) < 0.1 || Math.abs(rotY + Math.PI) < 0.1) {
        // Front wall - buttons to the left (from viewer's perspective looking at the wall)
        const artLeftEdge = artX - ART_WIDTH / 2;
        
        // Add to cart button (aligned with info card which is on the left)
        const infoCardCenterX = artLeftEdge - CARD_WIDTH / 2 - GAP;
        addToCartX = infoCardCenterX;
        addToCartZ = baseZ;
        // Quantity button to the right of add to cart
        quantityX = addToCartX + ADD_TO_CART_WIDTH / 2 + GAP + QUANTITY_WIDTH / 2;
        quantityZ = baseZ;
        // Size button to the right of quantity
        sizeX = quantityX + QUANTITY_WIDTH / 2 + GAP + SIZE_WIDTH / 2;
        sizeZ = baseZ;
    } else {
        // Default fallback
        quantityX = baseX;
        quantityZ = baseZ;
        sizeX = baseX;
        sizeZ = baseZ;
        addToCartX = baseX;
        addToCartZ = baseZ;
    }

    const handleAddToCart = useCallback(() => {
        addItem({
            artworkId,
            artworkTitle,
            artworkImage,
            sizeIndex: selectedSize,
            quantity: selectedQuantity,
        });
    }, [artworkId, artworkTitle, artworkImage, selectedSize, selectedQuantity, addItem]);

    return (
        <>
            {/* Quantity Button */}
            <QuantityButton 
                position={[quantityX, baseY, quantityZ]}
                rotation={artRotation}
                width={QUANTITY_WIDTH}
                height={BUTTON_HEIGHT}
                onQuantityChange={setSelectedQuantity}
            />

            {/* Size Dropdown */}
            <SizeDropdown 
                position={[sizeX, baseY, sizeZ]}
                rotation={artRotation}
                width={SIZE_WIDTH}
                height={BUTTON_HEIGHT}
                onSizeChange={setSelectedSize}
            />

            {/* Add to Cart Button */}
            <AddToCartButton 
                position={[addToCartX, baseY, addToCartZ]}
                rotation={artRotation}
                width={ADD_TO_CART_WIDTH}
                height={BUTTON_HEIGHT}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}