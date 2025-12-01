"use client";

import { useCart } from "./CartContext";
import { SIZES } from "../sizes";
import { COLORS } from "../colors";

interface CartPageProps {
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartPage({ onClose, onCheckout }: CartPageProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop - click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div 
        className="relative bg-white h-full flex flex-col shadow-2xl"
        style={{ 
          width: "400px",
          fontFamily: "var(--font-avant-garde-medium)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-300">
          <h1 
            className="text-black m-0"
            style={{ 
              fontSize: "28px",
              fontWeight: "500",
              fontFamily: "var(--font-avant-garde-medium)",
            }}
          >
            Your Order
          </h1>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-black cursor-pointer bg-transparent border-none"
            style={{ fontSize: "24px" }}
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
                  <div 
                    className="flex-shrink-0 bg-[#8BA4BC] flex items-center justify-center overflow-hidden"
                    style={{ width: "80px", height: "100px", borderRadius: "8px" }}
                  >
                    <img
                      src={item.artworkImage}
                      alt={item.artworkTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Show placeholder X pattern if image fails
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-black m-0 mb-1"
                      style={{ 
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "var(--font-avant-garde-medium)",
                      }}
                    >
                      {item.artworkTitle}
                    </h3>
                    <p 
                      className="text-gray-500 m-0 mb-1"
                      style={{ 
                        fontSize: "14px",
                        fontFamily: "var(--font-avant-garde-book)",
                      }}
                    >
                      Sizes: {SIZES[item.sizeIndex].dimensions}
                    </p>
                    <p 
                      className="text-black m-0"
                      style={{ 
                        fontSize: "14px",
                        fontFamily: "var(--font-avant-garde-book)",
                      }}
                    >
                      ${SIZES[item.sizeIndex].price}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div 
                    className="flex items-center bg-white rounded-lg"
                    style={{ 
                      height: "48px",
                      border: "2px solid black",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <span 
                      className="px-4 text-black flex items-center justify-center"
                      style={{ 
                        fontSize: "16px",
                        fontFamily: "var(--font-avant-garde-book)",
                        minWidth: "40px",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <div 
                      className="flex flex-col justify-center bg-gray-100 rounded"
                      style={{ 
                        padding: "4px 8px",
                        marginRight: "4px",
                        height: "24px",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.artworkId, item.sizeIndex, item.quantity + 1)}
                        className="flex items-center justify-center hover:opacity-60 cursor-pointer border-none bg-transparent"
                        style={{ fontSize: "10px", color: "#555", lineHeight: "1" }}
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
                        className="flex items-center justify-center hover:opacity-60 cursor-pointer border-none bg-transparent"
                        style={{ fontSize: "10px", color: "#555", lineHeight: "1" }}
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
        <div className="px-6 py-5">
          <div className="flex justify-between items-center mb-4">
            <span 
              className="text-black"
              style={{ 
                fontSize: "18px",
                fontFamily: "var(--font-avant-garde-book)",
              }}
            >
              Subtotal
            </span>
            <span 
              className="text-black"
              style={{ 
                fontSize: "18px",
                fontFamily: "var(--font-avant-garde-medium)",
              }}
            >
              $ {totalPrice.toFixed(2)} USD
            </span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full py-4 cursor-pointer border-none"
            style={{ 
              backgroundColor: COLORS.primary,
              fontSize: "18px",
              fontFamily: "var(--font-avant-garde-medium)",
              color: "black",
            }}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}