'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  unit: string;
  wholesale_price: number;
  retail_mrp: number;
  image_url: string;
  moq: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('saasha_cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from local storage', e);
        }
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saasha_cart', JSON.stringify(newItems));
    }
  };

  const addToCart = (product: any, quantity?: number) => {
    const qtyToAdd = quantity !== undefined ? quantity : product.moq || 1;
    const existingIndex = items.findIndex((i) => i.product_id === product.id);

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += qtyToAdd;
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        unit: product.unit,
        wholesale_price: product.wholesale_price,
        retail_mrp: product.retail_mrp,
        image_url: product.image_url,
        moq: product.moq || 1,
        quantity: Math.max(qtyToAdd, product.moq || 1),
      };
      saveCart([...items, newItem]);
    }
  };

  const removeFromCart = (productId: number) => {
    saveCart(items.filter((i) => i.product_id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.find((i) => i.product_id === productId);
    if (!item) return;

    if (quantity < item.moq) {
      alert(`Minimum order quantity for ${item.name} is ${item.moq} ${item.unit}`);
      return;
    }

    saveCart(
      items.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.wholesale_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
