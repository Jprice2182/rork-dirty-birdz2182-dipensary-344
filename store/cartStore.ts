import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductById } from '@/mocks/products';

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (id: string) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === id);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
        } else {
          set({ items: [...items, { id, quantity: 1 }] });
        }
      },
      
      removeItem: (id: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== id) });
      },
      
      updateQuantity: (id: string, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter(item => item.id !== id) });
        } else {
          set({
            items: items.map(item => 
              item.id === id ? { ...item, quantity } : item
            )
          });
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const product = getProductById(item.id);
          return total + (product ? product.price * item.quantity : 0);
        }, 0);
      },
      
      getCartItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);