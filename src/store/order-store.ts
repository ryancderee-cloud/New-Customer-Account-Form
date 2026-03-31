'use client';

import { create } from 'zustand';

type CartItem = {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
};

type OrderStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
  items: [],
  addItem: (item, quantity) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
          )
        };
      }
      return { items: [...state.items, { ...item, quantity }] };
    }),
  updateQty: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.productId === productId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    })),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  clear: () => set({ items: [] })
}));
