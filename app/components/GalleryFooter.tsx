"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import CartPage from "./CartPage";

export default function GalleryFooter() {
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

      {/* Footer - Bottom Left: Frog Logo */}
      <div 
        className="fixed z-50 pointer-events-auto"
        style={{
          width: "57px",
          height: "54.85px",
          bottom: "23px",
          left: "31px",
        }}
      >
        <img
          src="/Frog Logo.svg"
          className="w-full h-full"
          alt="Hop Art House"
        />
      </div>

      {/* Footer - Bottom Right: Navigation */}
      <div 
        className="fixed z-50 pointer-events-auto flex items-center"
        style={{
          bottom: "28px",
          right: "33px",
          gap: "44px",
        }}
      >
        <a 
          href="#about" 
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "18px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          About
        </a>
        <a 
          href="mailto:Hi@HopArt.House" 
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "18px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Hi@HopArt.House
        </a>
        <a 
          href="#featured" 
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "18px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Get Featured
        </a>
        <div 
          onClick={() => setShowCartPage(true)}
          className="flex items-center cursor-pointer hover:opacity-70"
          style={{ width: "40px", height: "34px" }}
        >
          <img
            src="/Cart.svg"
            className="w-full h-full"
            alt="cart"
          />
        </div>
      </div>
    </>
  );
}