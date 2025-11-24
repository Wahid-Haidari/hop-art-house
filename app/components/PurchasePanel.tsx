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
    const SIZE_WIDTH = 0.5;
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

    // Determine if this is a side wall (left/right)
    const isSideWall = Math.abs(rotY) > 0.1 && Math.abs(rotY) < Math.PI - 0.1;

    let quantityX, quantityZ, sizeX, sizeZ, addToCartX, addToCartZ;

    if (rotY === 0) {
        // Back wall - buttons to the right
        baseX = artX + horizontalOffset;
        baseZ = artZ;
        
        const sizeXPos = artRightEdge - (SIZE_WIDTH / 2);
        quantityX = sizeXPos - (SIZE_WIDTH / 2) - GAP - (QUANTITY_WIDTH / 2);
        quantityZ = baseZ;
        sizeX = sizeXPos;
        sizeZ = baseZ;
        const infoCardCenterX = artRightEdge + CARD_WIDTH / 2 + GAP;
        addToCartX = infoCardCenterX;
        addToCartZ = baseZ;
    } else if (Math.abs(rotY - Math.PI / 2) < 0.1) {
        // Left wall - buttons forward (toward room center)
        baseX = artX;
        baseZ = artZ + horizontalOffset;
        
        const sizeZPos = artZ - ART_WIDTH / 2 - (SIZE_WIDTH / 2);
        quantityX = baseX;
        quantityZ = sizeZPos - (SIZE_WIDTH / 2) - GAP - (QUANTITY_WIDTH / 2);
        sizeX = baseX;
        sizeZ = sizeZPos;
        addToCartX = baseX;
        addToCartZ = artZ - ART_WIDTH / 2 - CARD_WIDTH / 2 - GAP;
    } else {
        // Default fallback
        quantityX = baseX;
        quantityZ = baseZ;
        sizeX = baseX;
        sizeZ = baseZ;
        addToCartX = baseX;
        addToCartZ = baseZ;
    }

    const handleAddToCart = () => {
        console.log("Added to cart!");
        // Add your cart logic here
    };

    return (
        <>
            {/* Quantity Button */}
            <QuantityButton 
                position={[quantityX, baseY, quantityZ]}
                rotation={artRotation}
                width={QUANTITY_WIDTH}
                height={BUTTON_HEIGHT}
            />

            {/* Size Dropdown */}
            <SizeDropdown 
                position={[sizeX, baseY, sizeZ]}
                rotation={artRotation}
                width={SIZE_WIDTH}
                height={BUTTON_HEIGHT}
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