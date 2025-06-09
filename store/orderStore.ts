import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cartStore';

export type OrderStatus = 'pending' | 'processing' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  deliveryAddress: string;
  estimatedDelivery?: string;
  estimatedProcessingTime?: string;
  estimatedArrival?: 'early' | 'on-time' | 'late';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  isRated?: boolean;
  discountApplied?: number;
  promoCodeApplied?: string;
  tipAmount?: number;
  lastUpdated?: string;
}

interface OrderState {
  orders: Order[];
  lastRefresh: string | null;
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  markOrderAsRated: (id: string) => void;
  updateOrderTip: (id: string, tipAmount: number) => void;
  assignDriver: (id: string, driverId: string, driverName: string, driverPhone: string) => void;
  refreshOrders: () => Promise<void>;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  resetOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastRefresh: null,
      
      addOrder: (order: Order) => {
        if (!order.id.trim()) {
          console.warn('Cannot add order without valid ID');
          return;
        }
        
        const now = new Date().toISOString();
        set((state) => ({
          orders: [{ ...order, lastUpdated: now }, ...state.orders],
          lastRefresh: now
        }));
      },
      
      getOrderById: (id: string) => {
        if (!id.trim()) return undefined;
        
        const { orders } = get();
        return orders.find(order => order.id === id);
      },
      
      updateOrderStatus: (id: string, status: OrderStatus) => {
        if (!id.trim()) return;
        
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, status, lastUpdated: now } : order
          ),
          lastRefresh: now
        }));
      },
      
      markOrderAsRated: (id: string) => {
        if (!id.trim()) return;
        
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, isRated: true, lastUpdated: now } : order
          ),
          lastRefresh: now
        }));
      },
      
      updateOrderTip: (id: string, tipAmount: number) => {
        if (!id.trim() || tipAmount < 0) return;
        
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, tipAmount, lastUpdated: now } : order
          ),
          lastRefresh: now
        }));
      },
      
      assignDriver: (id: string, driverId: string, driverName: string, driverPhone: string) => {
        if (!id.trim() || !driverId.trim() || !driverName.trim()) return;
        
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id 
              ? { 
                  ...order, 
                  driverId: driverId.trim(), 
                  driverName: driverName.trim(), 
                  driverPhone: driverPhone.trim(), 
                  status: 'out-for-delivery' as OrderStatus,
                  estimatedArrival: 'on-time' as 'early' | 'on-time' | 'late',
                  lastUpdated: now
                } 
              : order
          ),
          lastRefresh: now
        }));
      },
      
      refreshOrders: async () => {
        // In a real app, you would fetch fresh order data from server
        const now = new Date().toISOString();
        
        try {
          // Simulate updating order statuses
          const { orders } = get();
          const updatedOrders = orders.map(order => {
            // Simulate some orders progressing in status
            if (order.status === 'pending' && Math.random() > 0.7) {
              return { ...order, status: 'processing' as OrderStatus, lastUpdated: now };
            }
            if (order.status === 'processing' && Math.random() > 0.8) {
              return { ...order, status: 'out-for-delivery' as OrderStatus, lastUpdated: now };
            }
            return order;
          });
          
          set({ 
            orders: updatedOrders,
            lastRefresh: now 
          });
        } catch (error) {
          console.error('Error refreshing orders:', error);
          set({ lastRefresh: now });
        }
      },
      
      getOrdersByStatus: (status: OrderStatus) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      },
      
      resetOrders: () => {
        set({
          orders: [],
          lastRefresh: null
        });
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        orders: state.orders,
        lastRefresh: state.lastRefresh
      }),
    }
  )
);