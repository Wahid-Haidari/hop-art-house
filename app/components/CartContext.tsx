"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { SIZES } from "../sizes";

export interface CartItem {
  artworkId: string;
  artworkTitle: string;
  artworkImage: string;
  sizeIndex: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (artworkId: string, sizeIndex: number) => void;
  updateQuantity: (artworkId: string, sizeIndex: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const pendingAddRef = useRef<{ item: CartItem; id: string } | null>(null);
  const processedIdsRef = useRef<Set<string>>(new Set());

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("hopArtCart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hopArtCart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((newItem: CartItem) => {
    console.log("addItem called with:", newItem);
    
    // Create a unique ID for this add operation
    const operationId = `${newItem.artworkId}-${newItem.sizeIndex}-${Date.now()}-${Math.random()}`;
    
    setItems((current) => {
      console.log("setItems callback - current items:", current.length);
      
      // Skip if we've already processed this operation
      if (processedIdsRef.current.has(operationId)) {
        console.log("Duplicate operation detected, skipping");
        return current;
      }
      
      // Mark this operation as processed
      processedIdsRef.current.add(operationId);
      
      // Clean up old operations from the set to prevent memory leak
      if (processedIdsRef.current.size > 100) {
        const idsArray = Array.from(processedIdsRef.current);
        processedIdsRef.current = new Set(idsArray.slice(-50));
      }
      
      // Check if item already exists (same artwork + size)
      const existingIndex = current.findIndex(
        (item) => item.artworkId === newItem.artworkId && item.sizeIndex === newItem.sizeIndex
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...current];
        updated[existingIndex].quantity += newItem.quantity;
        console.log("Updated existing item, new quantity:", updated[existingIndex].quantity);
        return updated;
      } else {
        // Add new item
        console.log("Adding new item to cart");
        return [...current, newItem];
      }
    });
  }, []);

  const removeItem = (artworkId: string, sizeIndex: number) => {
    setItems((current) =>
      current.filter((item) => !(item.artworkId === artworkId && item.sizeIndex === sizeIndex))
    );
  };

  const updateQuantity = (artworkId: string, sizeIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(artworkId, sizeIndex);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.artworkId === artworkId && item.sizeIndex === sizeIndex
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const size = SIZES[item.sizeIndex];
      return total + size.price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}