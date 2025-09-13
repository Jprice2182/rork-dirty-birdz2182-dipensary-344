import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductById, getProductPrice, getProductDisplayName, getProductVariant } from '@/mocks/products';
import appInfo from '@/constants/appInfo';

export interface CartItem {
  id: string;
  quantity: number;
  addedAt?: string;
  name?: string;
  price?: number;
  variant?: string;
  variantId?: string;
  variantName?: string;
}

export interface WeightValidation {
  isValid: boolean;
  currentWeight: number;
  maxWeight: number;
  exceedsBy?: number;
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
  weightLimitError: string | null;
  addItem: (id: string, variantId?: string) => boolean;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => boolean;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getEighthsPromotion: () => EighthsPromotion;
  refreshCart: () => Promise<void>;
  resetCart: () => void;
  validateCart: () => void;
  getTotalWeight: () => number;
  validateWeightLimit: (additionalItems?: { id: string; variantId?: string; quantity: number }[]) => WeightValidation;
  clearWeightLimitError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: null,
      total: 0,
      weightLimitError: null,
      
      addItem: (id: string, variantId?: string): boolean => {
        if (!id || typeof id !== 'string' || !id.trim()) {
          console.warn('Invalid product ID provided to addItem:', id);
          return false;
        }
        
        const { items } = get();
        const itemKey = variantId ? `${id}-${variantId}` : id;
        const existingItem = items.find(item => 
          item.id === id && (item.variantId || '') === (variantId || '')
        );
        const now = new Date().toISOString();
        
        // Verify product exists before adding
        const product = getProductById(id);
        if (!product) {
          console.warn(`Product with id ${id} not found`);
          return false;
        }

        // Verify variant exists if specified
        if (variantId && product.variants) {
          const variant = getProductVariant(id, variantId);
          if (!variant) {
            console.warn(`Variant ${variantId} not found for product ${id}`);
            return false;
          }
        }
        
        // Check weight limit before adding
        const weightValidation = get().validateWeightLimit([{ id, variantId, quantity: 1 }]);
        if (!weightValidation.isValid) {
          const errorMsg = `Cannot add item: would exceed 1 ounce daily limit by ${weightValidation.exceedsBy?.toFixed(2)} oz`;
          console.warn(errorMsg);
          set({ weightLimitError: errorMsg });
          return false;
        }
        
        const price = getProductPrice(id, variantId);
        const displayName = getProductDisplayName(id, variantId);
        const variant = variantId ? getProductVariant(id, variantId) : null;
        
        let newItems;
        if (existingItem) {
          newItems = items.map(item => 
            (item.id === id && (item.variantId || '') === (variantId || '')) 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
          console.log(`Updated quantity for product ${id}${variantId ? ` variant ${variantId}` : ''}`);
        } else {
          newItems = [...items, { 
            id, 
            quantity: 1, 
            addedAt: now,
            name: displayName,
            price: price,
            variantId: variantId,
            variantName: variant?.name
          }];
          console.log(`Added new product ${id}${variantId ? ` variant ${variantId}` : ''} to cart`);
        }
        
        const newTotal = calculateTotal(newItems);
        set({
          items: newItems,
          lastUpdated: now,
          total: newTotal,
          weightLimitError: null
        });
        return true;
      },
      
      removeItem: (id: string, variantId?: string) => {
        if (!id || typeof id !== 'string' || !id.trim()) {
          console.warn('Invalid product ID provided to removeItem:', id);
          return;
        }
        
        const { items } = get();
        const newItems = items.filter(item => 
          !(item.id === id && (item.variantId || '') === (variantId || ''))
        );
        const newTotal = calculateTotal(newItems);
        set({ 
          items: newItems,
          lastUpdated: new Date().toISOString(),
          total: newTotal,
          weightLimitError: null
        });
        console.log(`Removed product ${id}${variantId ? ` variant ${variantId}` : ''} from cart`);
      },
      
      updateQuantity: (id: string, quantity: number, variantId?: string): boolean => {
        if (!id || typeof id !== 'string' || !id.trim()) {
          console.warn('Invalid product ID provided to updateQuantity:', id);
          return false;
        }
        
        if (typeof quantity !== 'number' || quantity < 0) {
          console.warn('Invalid quantity provided to updateQuantity:', quantity);
          return false;
        }
        
        const { items } = get();
        const now = new Date().toISOString();
        
        let newItems;
        if (quantity <= 0) {
          newItems = items.filter(item => 
            !(item.id === id && (item.variantId || '') === (variantId || ''))
          );
          console.log(`Removed product ${id}${variantId ? ` variant ${variantId}` : ''} from cart (quantity 0)`);
        } else {
          // Verify product exists before updating
          const product = getProductById(id);
          if (!product) {
            console.warn(`Product with id ${id} not found during quantity update`);
            return false;
          }

          // Verify variant exists if specified
          if (variantId && product.variants) {
            const variant = getProductVariant(id, variantId);
            if (!variant) {
              console.warn(`Variant ${variantId} not found for product ${id} during quantity update`);
              return false;
            }
          }
          
          // Check weight limit for the new quantity
          const currentItem = items.find(item => 
            item.id === id && (item.variantId || '') === (variantId || '')
          );
          const quantityDifference = quantity - (currentItem?.quantity || 0);
          
          if (quantityDifference > 0) {
            const weightValidation = get().validateWeightLimit([{ id, variantId, quantity: quantityDifference }]);
            if (!weightValidation.isValid) {
              const errorMsg = `Cannot update quantity: would exceed 1 ounce daily limit by ${weightValidation.exceedsBy?.toFixed(2)} oz`;
              console.warn(errorMsg);
              set({ weightLimitError: errorMsg });
              return false;
            }
          }
          
          const price = getProductPrice(id, variantId);
          const displayName = getProductDisplayName(id, variantId);
          const variant = variantId ? getProductVariant(id, variantId) : null;
          
          newItems = items.map(item => 
            (item.id === id && (item.variantId || '') === (variantId || ''))
              ? { 
                  ...item, 
                  quantity,
                  price: price,
                  name: displayName,
                  variantName: variant?.name
                } 
              : item
          );
          console.log(`Updated quantity for product ${id}${variantId ? ` variant ${variantId}` : ''} to ${quantity}`);
        }
        
        const newTotal = calculateTotal(newItems);
        set({
          items: newItems,
          lastUpdated: now,
          total: newTotal,
          weightLimitError: null
        });
        return true;
      },
      
      clearCart: () => {
        set({ 
          items: [],
          lastUpdated: new Date().toISOString(),
          total: 0,
          weightLimitError: null
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

            // Validate variant if specified
            if (item.variantId && product.variants) {
              const variant = getProductVariant(item.id, item.variantId);
              if (!variant) {
                console.warn(`Removing invalid variant ${item.variantId} for product ${item.id} from cart`);
                return false;
              }
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
            total: newTotal,
            weightLimitError: null
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
          if (!product) return true;
          
          // Check variant validity
          if (item.variantId && product.variants) {
            const variant = getProductVariant(item.id, item.variantId);
            return !variant;
          }
          
          return false;
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
          total: 0,
          weightLimitError: null
        });
        console.log('Cart reset to initial state');
      },
      
      getTotalWeight: () => {
        const { items } = get();
        return calculateTotalWeight(items);
      },
      
      validateWeightLimit: (additionalItems: { id: string; variantId?: string; quantity: number }[] = []) => {
        const { items } = get();
        const currentWeight = calculateTotalWeight(items);
        const additionalWeight = calculateTotalWeight(additionalItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          variantId: item.variantId
        })));
        
        const totalWeight = currentWeight + additionalWeight;
        const maxWeight = 1; // 1 ounce limit
        
        return {
          isValid: totalWeight <= maxWeight,
          currentWeight: totalWeight,
          maxWeight,
          exceedsBy: totalWeight > maxWeight ? totalWeight - maxWeight : undefined
        };
      },
      
      clearWeightLimitError: () => {
        set({ weightLimitError: null });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        items: state.items,
        lastUpdated: state.lastUpdated,
        total: state.total,
        weightLimitError: state.weightLimitError
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
function isEighth(productId: string, variantId?: string): boolean {
  const product = getProductById(productId);
  if (!product || product.category !== '1') return false;
  
  // If no variant specified, check if it's the default eighth
  if (!variantId) {
    return product.weight === '3.5g';
  }
  
  // Check if the variant is an eighth
  if (product.variants) {
    const variant = product.variants.find(v => v.id === variantId);
    return variant?.id === 'eighth';
  }
  
  return false;
}

// Helper function to calculate eighths promotion
function calculateEighthsPromotion(items: CartItem[]): EighthsPromotion {
  const eighthItems = items.filter(item => isEighth(item.id, item.variantId));
  const totalEighths = eighthItems.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalEighths < (appInfo.eighthsPromotion?.minimumQuantity || 2)) {
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
  const regularPrice = 20; // Updated to new eighth price
  const savings = discountedEighths * (regularPrice - (appInfo.eighthsPromotion?.discountPrice || 1));
  
  return {
    eligible: true,
    totalEighths,
    discountedEighths,
    savings
  };
}

// Helper function to calculate total weight in ounces
function calculateTotalWeight(items: { id: string; quantity: number; variantId?: string }[]): number {
  return items.reduce((totalWeight, item) => {
    const product = getProductById(item.id);
    if (!product) return totalWeight;
    
    let weightStr = '';
    
    // Get weight from variant if specified, otherwise use product weight
    if (item.variantId && product.variants) {
      const variant = getProductVariant(item.id, item.variantId);
      weightStr = variant?.weight || product.weight || '';
    } else {
      weightStr = product.weight || '';
    }
    
    if (!weightStr) return totalWeight;
    
    // Convert weight to ounces
    let weightInOz = 0;
    if (weightStr.includes('g')) {
      // Convert grams to ounces (1 oz = 28.35g)
      const grams = parseFloat(weightStr.replace('g', ''));
      weightInOz = grams / 28.35;
    } else if (weightStr.includes('oz')) {
      // Already in ounces
      weightInOz = parseFloat(weightStr.replace('oz', ''));
    }
    
    return totalWeight + (weightInOz * item.quantity);
  }, 0);
}

// Helper function to calculate total with eighths promotion
function calculateTotal(items: CartItem[]): number {
  const eighthsPromo = calculateEighthsPromotion(items);
  
  const total = items.reduce((sum, item) => {
    const price = getProductPrice(item.id, item.variantId);
    
    if (typeof price !== 'number' || isNaN(price)) {
      console.warn(`Invalid price for product ${item.id}${item.variantId ? ` variant ${item.variantId}` : ''}:`, price);
      return sum;
    }
    
    return sum + (price * item.quantity);
  }, 0);
  
  // Apply eighths promotion discount
  const finalTotal = total - eighthsPromo.savings;
  
  return Math.round(finalTotal * 100) / 100; // Round to 2 decimal places
}