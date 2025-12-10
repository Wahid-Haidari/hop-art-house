"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import CartPage from "./CartPage";
import GetFeaturedPage from "./GetFeaturedPage";
import AboutPage from "./AboutPage";

export default function GalleryFooter() {
  const { getTotalItems } = useCart();
  const [showCartPage, setShowCartPage] = useState(false);
  const [showGetFeatured, setShowGetFeatured] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

      {/* Footer - Bottom Left (Desktop) / Top Left (Mobile): Frog Logo */}
      <div 
        className="fixed z-50 pointer-events-auto"
        style={{
          width: "45px",
          height: "43px",
          bottom: isMobile ? "auto" : "20px",
          top: isMobile ? "20px" : "auto",
          left: "28px",
        }}
      >
        <img
          src="/Frog Logo.svg"
          className="w-full h-full"
          alt="Hop Art House"
        />
      </div>

      {/* Footer - Bottom Right (Desktop) / Top Right (Mobile): Navigation */}
      <div 
        className="fixed z-50 pointer-events-auto flex items-center"
        style={{
          bottom: isMobile ? "auto" : "20px",
          top: isMobile ? "20px" : "auto",
          right: "30px",
          gap: "36px",
        }}
      >
        <span 
          className="text-black no-underline cursor-default"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
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
          className="flex flex-col items-center cursor-pointer hover:opacity-70"
          style={{ gap: "0px", position: "relative", top: "-4px" }}
        >
          {getTotalItems() > 0 && (
            <span
              className="text-black"
              style={{ fontSize: "12px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
            >
              {getTotalItems()}
            </span>
          )}
          <img
            src="/Cart.svg"
            style={{ width: "32px", height: "27px" }}
            alt="cart"
          />
        </div>
      </div>
    </>
  );
}