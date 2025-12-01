"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import CartPage from "./CartPage";
import GetFeaturedPage from "./GetFeaturedPage";
import AboutPage from "./AboutPage";

export default function GalleryFooter() {
  const { getTotalItems } = useCart();
  const [showCartPage, setShowCartPage] = useState(false);
  const [showGetFeatured, setShowGetFeatured] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleNavigateToAbout = () => {
    setShowGetFeatured(false);
    setShowCartPage(false);
    setShowAbout(true);
  };

  const handleNavigateToGetFeatured = () => {
    setShowAbout(false);
    setShowCartPage(false);
    setShowGetFeatured(true);
  };

  const handleNavigateToCart = () => {
    setShowAbout(false);
    setShowGetFeatured(false);
    setShowCartPage(true);
  };

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

      {showGetFeatured && (
        <GetFeaturedPage 
          onClose={() => setShowGetFeatured(false)}
          onNavigateToAbout={handleNavigateToAbout}
          onNavigateToCart={handleNavigateToCart}
        />
      )}

      {showAbout && (
        <AboutPage 
          onClose={() => setShowAbout(false)}
          onNavigateToGetFeatured={handleNavigateToGetFeatured}
          onNavigateToCart={handleNavigateToCart}
        />
      )}

      {/* Footer - Bottom Left: Frog Logo */}
      <div 
        className="fixed z-50 pointer-events-auto"
        style={{
          width: "45px",
          height: "43px",
          bottom: "20px",
          left: "28px",
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
          bottom: "24px",
          right: "30px",
          gap: "36px",
        }}
      >
        <span 
          className="text-black no-underline cursor-default"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Art House
        </span>
        <span 
          onClick={() => setShowAbout(true)}
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          About
        </span>
        <span 
          onClick={() => setShowGetFeatured(true)}
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Get Featured
        </span>
        <a 
          href="mailto:Hi@HopArt.House" 
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Contact
        </a>
        <div 
          onClick={() => setShowCartPage(true)}
          className="flex items-center cursor-pointer hover:opacity-70"
          style={{ width: "32px", height: "27px" }}
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