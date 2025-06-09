import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductById } from '@/mocks/products';

export interface CartItem {
  id: string;
  quantity: number;
  addedAt?: string;
}

interface CartState {
  items: CartItem[];
  lastUpdated: string | null;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  refreshCart: () => Promise<void>;
  resetCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: null,
      
      addItem: (id: string) => {
        if (!id.trim()) return;
        
        const { items } = get();
        const existingItem = items.find(item => item.id === id);
        const now = new Date().toISOString();
        
        // Verify product exists before adding
        const product = getProductById(id);
        if (!product) {
          console.warn(`Product with id ${id} not found`);
          return;
        }
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ),
            lastUpdated: now
          });
        } else {
          set({ 
            items: [...items, { id, quantity: 1, addedAt: now }],
            lastUpdated: now
          });
        }
      },
      
      removeItem: (id: string) => {
        if (!id.trim()) return;
        
        const { items } = get();
        set({ 
          items: items.filter(item => item.id !== id),
          lastUpdated: new Date().toISOString()
        });
      },
      
      updateQuantity: (id: string, quantity: number) => {
        if (!id.trim()) return;
        
        const { items } = get();
        const now = new Date().toISOString();
        
        if (quantity <= 0) {
          set({ 
            items: items.filter(item => item.id !== id),
            lastUpdated: now
          });
        } else {
          // Verify product exists before updating
          const product = getProductById(id);
          if (!product) {
            console.warn(`Product with id ${id} not found`);
            return;
          }
          
          set({
            items: items.map(item => 
              item.id === id ? { ...item, quantity } : item
            ),
            lastUpdated: now
          });
        }
      },
      
      clearCart: () => {
        set({ 
          items: [],
          lastUpdated: new Date().toISOString()
        });
      },
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const product = getProductById(item.id);
          if (!product) {
            console.warn(`Product with id ${item.id} not found in cart total calculation`);
            return total;
          }
          return total + (product.price * item.quantity);
        }, 0);
      },
      
      getCartItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
      
      refreshCart: async () => {
        // In a real app, you might sync with server here
        const now = new Date().toISOString();
        
        // Validate that all products in cart still exist
        const { items } = get();
        const validItems = items.filter(item => {
          const product = getProductById(item.id);
          if (!product) {
            console.warn(`Removing invalid product ${item.id} from cart`);
            return false;
          }
          return true;
        });
        
        set({ 
          items: validItems,
          lastUpdated: now 
        });
      },
      
      resetCart: () => {
        set({
          items: [],
          lastUpdated: null
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        items: state.items,
        lastUpdated: state.lastUpdated
      }),
    }
  )
);