"use client";

import QuantityButton from "./QuantityButton";
import SizeDropdown from "./SizeDropdown";
import AddToCartButton from "./AddToCartButton";

interface PurchasePanelProps {
    artPosition: [number, number, number];
    artRotation: [number, number, number];
}

export default function PurchasePanel({artPosition, artRotation}: PurchasePanelProps) {

    const [artX, artY, artZ] = artPosition;
    const ART_HEIGHT = 2.5;
    const artBottom = artY - ART_HEIGHT / 2;
    const ART_WIDTH = 1.5;
    const artRightEdge = artX + ART_WIDTH / 2;
    const CARD_WIDTH = 0.5;

    const GAP = 0.1;
    const BUTTON_HEIGHT = 0.15;

    let baseX = artX;
    const baseY = artBottom - BUTTON_HEIGHT / 2 - GAP;
    let baseZ = artZ;

    // Determine which wall the artwork is on
    const rotY = artRotation[1];
    const horizontalOffset = 1.6;

    if (rotY === 0) {
        baseX = artX + horizontalOffset;
        baseZ = artZ;
    }

    const QUANTITY_WIDTH = 0.3;
    const SIZE_WIDTH = 0.5;
    const ADD_TO_CART_WIDTH = CARD_WIDTH;
    
    const sizeX = artRightEdge - (SIZE_WIDTH / 2);
    const quantityX = sizeX - (SIZE_WIDTH / 2) - GAP - (QUANTITY_WIDTH / 2);
    const infoCardCenterX = artRightEdge + CARD_WIDTH / 2 + GAP;
    const addToCartX = infoCardCenterX;

    const handleAddToCart = () => {
        console.log("Added to cart!");
        // Add your cart logic here
    };

    return (
        <>
            {/* Quantity Button */}
            <QuantityButton 
                position={[quantityX, baseY, baseZ]}
                width={QUANTITY_WIDTH}
                height={BUTTON_HEIGHT}
            />

            {/* Size Dropdown */}
            <SizeDropdown 
                position={[sizeX, baseY, baseZ]}
                width={SIZE_WIDTH}
                height={BUTTON_HEIGHT}
            />

            {/* Add to Cart Button */}
            <AddToCartButton 
                position={[addToCartX, baseY, baseZ]}
                width={ADD_TO_CART_WIDTH}
                height={BUTTON_HEIGHT}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}