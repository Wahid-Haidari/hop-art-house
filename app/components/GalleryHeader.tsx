"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import CartPage from "./CartPage";

export default function GalleryHeader() {
  const { getTotalItems } = useCart();
  const [showCartPage, setShowCartPage] = useState(false);

  return (
    <>
      {showCartPage && (
        <CartPage
          onClose={() => setShowCartPage(false)}
          onCheckout={() => {
            setShowCartPage(false);
            // TODO: Navigate to checkout page
            console.log("Proceed to checkout");
          }}
        />
      )}

      {/* Logo - Bottom Left */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-auto">
        <img
          src="/Frog Logo.svg"
          className="w-12 h-12"
          alt="Hop Art House"
        />
      </div>

      {/* Header - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
        <div className="flex gap-6 items-center px-6 py-4 rounded-full">
          <a href="#about" className="text-black no-underline hover:opacity-70 cursor-pointer text-sm font-medium">About</a>
          <a href="#hi" className="text-black no-underline hover:opacity-70 cursor-pointer text-sm font-medium">Hi@HopArt.House</a>
          <a href="#featured" className="text-black no-underline hover:opacity-70 cursor-pointer text-sm font-medium">Get Featured</a>
          
          <div 
            onClick={() => setShowCartPage(true)}
            className="flex items-center gap-2 text-black cursor-pointer hover:opacity-70 pl-4 border-l border-black/20"
          >
            <img
              src="/Cart.svg"
              className="w-6 h-6"
              alt="cart"
            />
            <span className="font-semibold">{getTotalItems()}</span>
          </div>
        </div>
      </div>
    </>
  );
}