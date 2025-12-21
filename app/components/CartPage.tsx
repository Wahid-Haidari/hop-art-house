"use client";

import { useEffect } from "react";
import { useCart } from "./CartContext";
import { SIZES } from "../sizes";
import { COLORS } from "../colors";
import { useMobile } from "../hooks/useMobile";

interface CartPageProps {
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartPage({ onClose, onCheckout }: CartPageProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const isMobile = useMobile();
  const totalPrice = getTotalPrice();

  // Fix body styles for this page (override gallery styles)
  useEffect(() => {
    // Save original styles
    const originalStyles = {
      bodyHeight: document.body.style.height,
      bodyBg: document.body.style.background,
      bodyPosition: document.body.style.position,
      bodyOverflow: document.body.style.overflow,
      htmlBg: document.documentElement.style.background,
      htmlOverflow: document.documentElement.style.overflow,
    };
    
    // Set correct styles for this page - allow natural document flow
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    document.body.style.overflow = 'auto';
    document.body.style.background = '#ffffff';
    document.documentElement.style.setProperty('background', '#ffffff', 'important');
    document.documentElement.style.overflow = 'auto';
    
    // Also set theme-color meta tag for the safe area
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = metaThemeColor?.getAttribute('content') || '';
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#ffffff');
    }
    
    return () => {
      // Restore original styles when unmounting
      document.body.style.height = originalStyles.bodyHeight;
      document.body.style.position = originalStyles.bodyPosition;
      document.body.style.overflow = originalStyles.bodyOverflow;
      document.body.style.background = originalStyles.bodyBg;
      document.documentElement.style.setProperty('background', originalStyles.htmlBg || '#000', 'important');
      document.documentElement.style.overflow = originalStyles.htmlOverflow;
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', originalThemeColor);
      }
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'justify-center' : 'justify-end'}`}
    >
      {/* Backdrop - click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div 
        className={`relative bg-white h-full flex flex-col shadow-2xl ${isMobile ? 'w-screen rounded-none' : 'w-[400px] max-w-full'}`}
        style={{ fontFamily: "var(--font-avant-garde-medium)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-300">
          <h1 
            className="text-black m-0 text-[28px] font-medium"
            style={{ fontFamily: "var(--font-avant-garde-medium)" }}
          >
            Your Order
          </h1>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-black cursor-pointer bg-transparent border-none"
          >
            ✕
          </button>
        </div>

        {/* Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto border-b border-gray-300">
          {items.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.artworkId}-${item.sizeIndex}`} 
                  className="flex items-start gap-4"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0 bg-[#8BA4BC] flex items-center justify-center overflow-hidden w-20 h-[100px] rounded-lg">
                    <img
                      src={item.artworkImage}
                      alt={item.artworkTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-black m-0 mb-1 text-base font-medium"
                      style={{ fontFamily: "var(--font-avant-garde-medium)" }}
                    >
                      {item.artworkTitle}
                    </h3>
                    <p 
                      className="text-gray-500 m-0 mb-1 text-sm"
                      style={{ fontFamily: "var(--font-avant-garde-book)" }}
                    >
                      Sizes: {SIZES[item.sizeIndex].dimensions}
                    </p>
                    <p 
                      className="text-black m-0 text-sm"
                      style={{ fontFamily: "var(--font-avant-garde-book)" }}
                    >
                      ${SIZES[item.sizeIndex].price}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center bg-white rounded-lg h-12 border-2 border-black overflow-hidden">
                    <span 
                      className="px-4 text-black flex items-center justify-center text-base min-w-[40px]"
                      style={{ fontFamily: "var(--font-avant-garde-book)" }}
                    >
                      {item.quantity}
                    </span>
                    <div className="flex flex-col justify-center bg-gray-100 rounded px-2 py-1 mr-1 h-6">
                      <button
                        onClick={() => updateQuantity(item.artworkId, item.sizeIndex, item.quantity + 1)}
                        className="flex items-center justify-center hover:opacity-60 cursor-pointer border-none bg-transparent text-[10px] text-gray-600 leading-none"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item.artworkId, item.sizeIndex);
                          } else {
                            updateQuantity(item.artworkId, item.sizeIndex, item.quantity - 1);
                          }
                        }}
                        className="flex items-center justify-center hover:opacity-60 cursor-pointer border-none bg-transparent text-[10px] text-gray-600 leading-none"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal and Checkout */}
        <div 
          className={`px-6 py-5 ${isMobile ? 'pb-[env(safe-area-inset-bottom,24px)]' : 'pb-5'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <span 
              className="text-black text-lg"
              style={{ fontFamily: "var(--font-avant-garde-book)" }}
            >
              Subtotal
            </span>
            <span 
              className="text-black text-lg"
              style={{ fontFamily: "var(--font-avant-garde-medium)" }}
            >
              $ {totalPrice.toFixed(2)} USD
            </span>
          </div>

          <button
            onClick={onCheckout}
            className={`w-full py-4 pt-[18px] cursor-pointer text-lg text-black border-2 border-black rounded-lg ${isMobile ? 'mb-4' : 'mb-0'}`}
            style={{ 
              backgroundColor: COLORS.primary,
              fontFamily: "var(--font-avant-garde-medium)",
            }}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}