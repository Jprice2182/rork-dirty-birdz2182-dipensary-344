import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductById } from '@/mocks/products';
import appInfo from '@/constants/appInfo';

export interface CartItem {
  id: string;
  quantity: number;
  addedAt?: string;
  name?: string;
  price?: number;
  variant?: string;
}

export interface EighthsPromotion {
  eligible: boolean;
  totalEighths: number;
  discountedEighths: number;
  savings: number;
}

interface CartState {
  items: CartItem[];
  lastUpdated: string | null;
  total: number;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getEighthsPromotion: () => EighthsPromotion;
  refreshCart: () => Promise<void>;
  resetCart: () => void;
  validateCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: null,
      total: 0,
      
      addItem: (id: string) => {
        if (!id || typeof id !== 'string' || !id.trim()) {
          console.warn('Invalid product ID provided to addItem:', id);
          return;
        }
        
        const { items } = get();
        const existingItem = items.find(item => item.id === id);
        const now = new Date().toISOString();
        
        // Verify product exists before adding
        const product = getProductById(id);
        if (!product) {
          console.warn(`Product with id ${id} not found`);
          return;
        }
        
        let newItems;
        if (existingItem) {
          newItems = items.map(item => 
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
          console.log(`Updated quantity for product ${id}`);
        } else {
          newItems = [...items, { 
            id, 
            quantity: 1, 
            addedAt: now,
            name: product.name,
            price: product.price
          }];
          console.log(`Added new product ${id} to cart`);
        }
        
        const newTotal = calculateTotal(newItems);
        set({
          items: newItems,
          lastUpdated: now,
          total: newTotal
        });
      },
      
      removeItem: (id: string) => {
        if (!id || typeof id !== 'string' || !id.trim()) {
          console.warn('Invalid product ID provided to removeItem:', id);
          return;
        }
        
        const { items } = get();
        const newItems = items.filter(item => item.id !== id);
        const newTotal = calculateTotal(newItems);
        set({ 
          items: newItems,
          lastUpdated: new Date().toISOString(),
          total: newTotal
        });
        console.log(`Removed product ${id} from cart`);
      },
      
      updateQuantity: (id: string, quantity: number) => {
        if (!id || typeof id !== 'string' || !id.trim()) {
          console.warn('Invalid product ID provided to updateQuantity:', id);
          return;
        }
        
        if (typeof quantity !== 'number' || quantity < 0) {
          console.warn('Invalid quantity provided to updateQuantity:', quantity);
          return;
        }
        
        const { items } = get();
        const now = new Date().toISOString();
        
        let newItems;
        if (quantity <= 0) {
          newItems = items.filter(item => item.id !== id);
          console.log(`Removed product ${id} from cart (quantity 0)`);
        } else {
          // Verify product exists before updating
          const product = getProductById(id);
          if (!product) {
            console.warn(`Product with id ${id} not found during quantity update`);
            return;
          }
          
          newItems = items.map(item => 
            item.id === id ? { ...item, quantity } : item
          );
          console.log(`Updated quantity for product ${id} to ${quantity}`);
        }
        
        const newTotal = calculateTotal(newItems);
        set({
          items: newItems,
          lastUpdated: now,
          total: newTotal
        });
      },
      
      clearCart: () => {
        set({ 
          items: [],
          lastUpdated: new Date().toISOString(),
          total: 0
        });
        console.log('Cart cleared');
      },
      
      getCartTotal: () => {
        const { items } = get();
        return calculateTotal(items);
      },
      
      getCartItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => {
          if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
            console.warn(`Invalid quantity for item ${item.id}:`, item.quantity);
            return count;
          }
          return count + item.quantity;
        }, 0);
      },

      getEighthsPromotion: () => {
        const { items } = get();
        return calculateEighthsPromotion(items);
      },
      
      refreshCart: async () => {
        try {
          console.log('Refreshing cart...');
          const now = new Date().toISOString();
          
          // Validate that all products in cart still exist
          const { items } = get();
          const validItems = items.filter(item => {
            if (!item.id || typeof item.id !== 'string') {
              console.warn('Invalid item ID in cart:', item);
              return false;
            }
            
            const product = getProductById(item.id);
            if (!product) {
              console.warn(`Removing invalid product ${item.id} from cart`);
              return false;
            }
            
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
              console.warn(`Removing item with invalid quantity ${item.id}:`, item.quantity);
              return false;
            }
            
            return true;
          });
          
          const newTotal = calculateTotal(validItems);
          set({ 
            items: validItems,
            lastUpdated: now,
            total: newTotal
          });
          
          console.log(`Cart refreshed. ${validItems.length} valid items remaining.`);
        } catch (error) {
          console.error('Error refreshing cart:', error);
        }
      },
      
      validateCart: () => {
        const { items } = get();
        const invalidItems = items.filter(item => {
          if (!item.id || typeof item.id !== 'string') return true;
          if (typeof item.quantity !== 'number' || item.quantity <= 0) return true;
          const product = getProductById(item.id);
          return !product;
        });
        
        if (invalidItems.length > 0) {
          console.warn('Found invalid items in cart:', invalidItems);
          get().refreshCart();
        }
      },
      
      resetCart: () => {
        set({
          items: [],
          lastUpdated: null,
          total: 0
        });
        console.log('Cart reset to initial state');
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        items: state.items,
        lastUpdated: state.lastUpdated,
        total: state.total
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Validate cart after rehydration
          state.validateCart();
        }
      },
    }
  )
);

// Helper function to check if a product is an eighth (3.5g flower)
function isEighth(productId: string): boolean {
  const product = getProductById(productId);
  return product?.category === '1' && product?.weight === '3.5g';
}

// Helper function to calculate eighths promotion
function calculateEighthsPromotion(items: CartItem[]): EighthsPromotion {
  const eighthItems = items.filter(item => isEighth(item.id));
  const totalEighths = eighthItems.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalEighths < appInfo.eighthsPromotion.minimumQuantity) {
    return {
      eligible: false,
      totalEighths,
      discountedEighths: 0,
      savings: 0
    };
  }
  
  // Calculate how many eighths get the $1 discount
  // Every 3rd eighth (starting from the 3rd) gets discounted
  const discountedEighths = Math.floor(totalEighths / 3);
  
  if (discountedEighths === 0) {
    return {
      eligible: false,
      totalEighths,
      discountedEighths: 0,
      savings: 0
    };
  }
  
  // Calculate savings: regular price - $1 for each discounted eighth
  const regularPrice = 30; // All eighths are $30
  const savings = discountedEighths * (regularPrice - appInfo.eighthsPromotion.discountPrice);
  
  return {
    eligible: true,
    totalEighths,
    discountedEighths,
    savings
  };
}

// Helper function to calculate total with eighths promotion
function calculateTotal(items: CartItem[]): number {
  const eighthsPromo = calculateEighthsPromotion(items);
  
  const total = items.reduce((sum, item) => {
    const product = getProductById(item.id);
    if (!product) {
      console.warn(`Product with id ${item.id} not found in cart total calculation`);
      return sum;
    }
    
    if (typeof product.price !== 'number' || isNaN(product.price)) {
      console.warn(`Invalid price for product ${item.id}:`, product.price);
      return sum;
    }
    
    return sum + (product.price * item.quantity);
  }, 0);
  
  // Apply eighths promotion discount
  const finalTotal = total - eighthsPromo.savings;
  
  return Math.round(finalTotal * 100) / 100; // Round to 2 decimal places
}