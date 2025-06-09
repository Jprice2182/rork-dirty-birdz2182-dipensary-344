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
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  markOrderAsRated: (id: string) => void;
  updateOrderTip: (id: string, tipAmount: number) => void;
  assignDriver: (id: string, driverId: string, driverName: string, driverPhone: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order: Order) => 
        set((state) => ({
          orders: [order, ...state.orders]
        })),
      
      getOrderById: (id: string) => {
        const { orders } = get();
        return orders.find(order => order.id === id);
      },
      
      updateOrderStatus: (id: string, status: OrderStatus) => 
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, status } : order
          )
        })),
      
      markOrderAsRated: (id: string) => 
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, isRated: true } : order
          )
        })),
      
      updateOrderTip: (id: string, tipAmount: number) => 
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, tipAmount } : order
          )
        })),
      
      assignDriver: (id: string, driverId: string, driverName: string, driverPhone: string) => 
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id 
              ? { 
                  ...order, 
                  driverId, 
                  driverName, 
                  driverPhone, 
                  status: 'out-for-delivery' as OrderStatus,
                  estimatedArrival: 'on-time' as 'early' | 'on-time' | 'late'
                } 
              : order
          )
        })),
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);