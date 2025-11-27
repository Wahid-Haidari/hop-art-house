"use client";

import { useCart } from "./CartContext";
import { SIZES } from "../sizes";
import { COLORS } from "../colors";
import { useState } from "react";

interface CartPageProps {
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartPage({ onClose, onCheckout }: CartPageProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h1 className="text-3xl font-bold text-black">Your Cart</h1>
            <button
              onClick={onClose}
              className="text-2xl text-gray-600 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Empty Cart Message */}
          <div className="p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={onClose}
              className="bg-[#F7C41A] hover:bg-[#E8B80A] text-black font-semibold px-6 py-2 rounded cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h1 className="text-3xl font-bold text-black">Your Cart</h1>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="p-6 space-y-6">
          {items.map((item, index) => (
            <div key={`${item.artworkId}-${item.sizeIndex}`} className="flex gap-4 pb-6 border-b border-gray-200">
              {/* Item Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                <img
                  src={item.artworkImage}
                  alt={item.artworkTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-black mb-1">{item.artworkTitle}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Size: {SIZES[item.sizeIndex].label} ({SIZES[item.sizeIndex].dimensions})
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Price: ${SIZES[item.sizeIndex].price} each
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.artworkId, item.sizeIndex, Math.max(1, item.quantity - 1))}
                      className="text-lg font-bold text-gray-600 hover:text-black cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.artworkId, item.sizeIndex, item.quantity + 1)}
                      className="text-lg font-bold text-gray-600 hover:text-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-semibold text-black mb-3">
                  Subtotal: ${(SIZES[item.sizeIndex].price * item.quantity).toFixed(2)}
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.artworkId, item.sizeIndex)}
                  className="text-sm text-red-600 hover:text-red-800 cursor-pointer font-medium"
                >
                  Remove from cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Totals and Checkout */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 sticky bottom-0">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Items: {getTotalItems()}</span>
              <span></span>
            </div>
            <div className="flex justify-between text-lg font-bold text-black">
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded cursor-pointer transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 bg-[#F7C41A] hover:bg-[#E8B80A] text-black font-semibold py-3 rounded cursor-pointer transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
