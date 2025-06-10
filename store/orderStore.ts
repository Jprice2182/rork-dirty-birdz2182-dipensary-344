import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

interface OrderState {
  orders: Order[];
  createOrder: (orderData: {
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    tip: number;
    total: number;
  }) => string;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getRecentOrders: () => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      createOrder: (orderData) => {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();
        
        const newOrder: Order = {
          id: orderId,
          items: orderData.items,
          subtotal: orderData.subtotal,
          deliveryFee: orderData.deliveryFee,
          tax: orderData.tax,
          tip: orderData.tip,
          total: orderData.total,
          status: 'pending',
          createdAt: now,
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
        
        console.log(`Created order ${orderId}`);
        return orderId;
      },
      
      getOrderById: (id: string) => {
        const { orders } = get();
        return orders.find(order => order.id === id);
      },
      
      updateOrderStatus: (id: string, status: Order['status']) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === id ? { ...order, status } : order
          )
        }));
        console.log(`Updated order ${id} status to ${status}`);
      },
      
      getRecentOrders: () => {
        const { orders } = get();
        return orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        orders: state.orders
      }),
    }
  )
);