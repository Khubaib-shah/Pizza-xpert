import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../../../types';

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addToCart: (item) => set((state) => {
        // Generate unique identification signature based on full ingredient customizations
        const customHash = `${item.pizza.id}-${item.customization.size}-${item.customization.crust}-${item.customization.sauce}-${item.customization.extraCheese ? "ex-ch" : "no-ch"}-${item.customization.extraToppings.sort().join(",")}`;
        
        const existingIdx = state.items.findIndex((c) => c.id === customHash);
        if (existingIdx > -1) {
          const nextItems = [...state.items];
          nextItems[existingIdx].quantity += item.quantity;
          return { items: nextItems };
        } else {
          return { items: [...state.items, { ...item, id: customHash }] };
        }
      }),

      updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        }).filter(Boolean) as CartItem[]
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'pizzaxpert_cart_store',
    }
  )
);

// Selectors
export const useCartTotalItems = () => useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
export const useCartTotalPrice = () => useCartStore((state) => state.items.reduce((sum, item) => sum + (item.pricePerItem * item.quantity), 0));
