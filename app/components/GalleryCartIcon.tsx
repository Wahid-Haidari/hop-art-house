"use client";

import { useCart } from "./CartContext";

export default function GalleryCartIcon() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
      <button className="bg-[#FFC72C] hover:bg-[#FFD04D] text-black font-semibold px-6 py-4 rounded-full shadow-lg flex items-center gap-3 transition-all cursor-pointer">
        <img
          src="/Cart.svg"
          className="w-6 h-6"
          alt="cart"
        />
        <span className="text-lg">{totalItems}</span>
      </button>
    </div>
  );
}