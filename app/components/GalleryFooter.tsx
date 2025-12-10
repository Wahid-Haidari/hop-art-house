"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import CartPage from "./CartPage";
import GetFeaturedPage from "./GetFeaturedPage";
import AboutPage from "./AboutPage";
import { useMobile } from "../hooks/useMobile";

export default function GalleryFooter() {
  const { getTotalItems } = useCart();
  const [showCartPage, setShowCartPage] = useState(false);
  const [showGetFeatured, setShowGetFeatured] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Footer - Bottom Left (Desktop only): Frog Logo */}
      {!isMobile && (
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
      )}

      {/* Mobile: Cart + Hamburger Menu */}
      {isMobile && (
        <div 
          className="fixed z-50 pointer-events-auto flex items-center"
          style={{
            top: "20px",
            right: "20px",
            gap: "16px",
          }}
        >
          {/* Cart */}
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

          {/* Hamburger Menu Button */}
          <div 
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer flex flex-col justify-center items-center"
            style={{ width: "30px", height: "30px", gap: "5px" }}
          >
            <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
            <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
            <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
          </div>
        </div>
      )}

      {/* Mobile Menu Side Panel */}
      {isMobile && menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 pointer-events-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Side Panel */}
          <div 
            className="fixed z-50 pointer-events-auto bg-white"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              width: "60%",
              maxWidth: "300px",
              padding: "24px",
              borderLeft: "1px solid #e0e0e0",
            }}
          >
            {/* Close Button */}
            <div 
              className="flex justify-end mb-8"
            >
              <div 
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer"
                style={{ fontSize: "28px", lineHeight: "1" }}
              >
                ✕
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex flex-col" style={{ gap: "24px" }}>
              <span 
                onClick={() => setMenuOpen(false)}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
              >
                Art House
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <span 
                onClick={() => { setShowAbout(true); setMenuOpen(false); }}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                About
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <span 
                onClick={() => { setShowGetFeatured(true); setMenuOpen(false); }}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                Get Featured
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <a 
                href="mailto:Hi@HopArt.House" 
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        </>
      )}

      {/* Desktop: Footer Navigation */}
      {!isMobile && (
        <div 
          className="fixed z-50 pointer-events-auto flex items-center"
          style={{
            bottom: "20px",
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
      )}
    </>
  );
}