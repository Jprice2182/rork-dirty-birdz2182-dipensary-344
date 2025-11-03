import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appInfo from '@/constants/appInfo';
import { PaymentMethod, PaymentInfo, RefundInfo, OrderStatus } from '@/types/product';
import { useUserStore } from './userStore';

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
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
  date: string;
  deliveryAddress: string;
  driverName?: string;
  driverPhone?: string;
  driverId?: string;
  estimatedProcessingTime?: string;
  estimatedArrival?: 'early' | 'on-time' | 'late';
  isRated?: boolean;
  tipAmount?: number;
  discountApplied?: number;
  promoCodeApplied?: string;
  paymentMethod: PaymentMethod;
  paymentInfo?: PaymentInfo;
  refundInfo?: RefundInfo;
  refundEligibleUntil?: string;
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
    paymentMethod: PaymentMethod;
    paymentInfo?: PaymentInfo;
  }) => string;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getRecentOrders: () => Order[];
  requestRefund: (id: string, reason?: string) => boolean;
  processRefund: (id: string) => void;
  completeRefund: (id: string) => void;
  isRefundEligible: (id: string) => boolean;
  getRefundTimeRemaining: (id: string) => number;
  markOrderAsRated: (id: string) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      createOrder: (orderData) => {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();
        const currentDate = new Date().toLocaleDateString();
        
        // Calculate refund eligibility deadline (24 hours after delivery)
        const refundDeadline = new Date();
        refundDeadline.setHours(refundDeadline.getHours() + appInfo.refundPolicy.timeLimit);
        
        // Validate delivery fee calculation
        const calculatedDeliveryFee = orderData.subtotal >= appInfo.freeDeliveryMinimum ? 0 : appInfo.deliveryFee;
        const finalDeliveryFee = Math.abs(orderData.deliveryFee - calculatedDeliveryFee) < 0.01 
          ? orderData.deliveryFee 
          : calculatedDeliveryFee;
        
        const newOrder: Order = {
          id: orderId,
          items: orderData.items,
          subtotal: orderData.subtotal,
          deliveryFee: finalDeliveryFee,
          tax: orderData.tax,
          tip: orderData.tip,
          total: orderData.total,
          status: 'pending',
          createdAt: now,
          date: currentDate,
          deliveryAddress: "123 Main St, Atlanta, GA 30309", // Default address
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
          estimatedProcessingTime: "30-60 minutes",
          estimatedArrival: 'on-time',
          isRated: false,
          tipAmount: orderData.tip,
          paymentMethod: orderData.paymentMethod,
          paymentInfo: orderData.paymentInfo,
          refundEligibleUntil: refundDeadline.toISOString(),
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
        
        console.log(`Created order ${orderId} with payment method: ${orderData.paymentMethod}, delivery fee: ${finalDeliveryFee === 0 ? 'FREE' : `$${finalDeliveryFee.toFixed(2)}`}`);
        return orderId;
      },
      
      getOrderById: (id: string) => {
        const { orders } = get();
        return orders.find(order => order.id === id);
      },
      
      updateOrderStatus: (id: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map(order => {
            if (order.id === id) {
              const updatedOrder = { ...order, status };
              
              // Set refund eligibility when order is delivered
              if (status === 'delivered' && !order.refundEligibleUntil) {
                const refundDeadline = new Date();
                refundDeadline.setHours(refundDeadline.getHours() + appInfo.refundPolicy.timeLimit);
                updatedOrder.refundEligibleUntil = refundDeadline.toISOString();
                
                // Award points when order is delivered (1 point per $1 spent)
                const pointsToAward = Math.floor(order.total);
                if (pointsToAward > 0) {
                  const userStore = useUserStore.getState();
                  userStore.addPoints(
                    pointsToAward,
                    `Order #${order.id.slice(-8)} delivered`,
                    order.id
                  );
                }
              }
              
              return updatedOrder;
            }
            return order;
          })
        }));
        console.log(`Updated order ${id} status to ${status}`);
      },
      
      getRecentOrders: () => {
        const { orders } = get();
        return orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
      },

      isRefundEligible: (id: string) => {
        const order = get().getOrderById(id);
        if (!order) return false;
        
        // Check if order status is eligible for refund
        const eligibleStatuses = [...appInfo.refundPolicy.eligibleStatuses] as OrderStatus[];
        if (!eligibleStatuses.includes(order.status)) {
          return false;
        }
        
        // Check if refund has already been requested or processed
        if (['refund_requested', 'refund_processing', 'refunded'].includes(order.status)) {
          return false;
        }
        
        // Check if within time limit
        if (!order.refundEligibleUntil) return false;
        
        const now = new Date();
        const deadline = new Date(order.refundEligibleUntil);
        return now <= deadline;
      },

      getRefundTimeRemaining: (id: string) => {
        const order = get().getOrderById(id);
        if (!order || !order.refundEligibleUntil) return 0;
        
        const now = new Date();
        const deadline = new Date(order.refundEligibleUntil);
        const timeRemaining = deadline.getTime() - now.getTime();
        
        return Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60))); // Return hours remaining
      },

      requestRefund: (id: string, reason?: string) => {
        const { isRefundEligible } = get();
        
        if (!isRefundEligible(id)) {
          return false;
        }
        
        const now = new Date();
        const estimatedCompletion = new Date();
        estimatedCompletion.setDate(estimatedCompletion.getDate() + 1); // 1 day processing
        
        const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        set((state) => ({
          orders: state.orders.map(order => {
            if (order.id === id) {
              return {
                ...order,
                status: 'refund_requested' as OrderStatus,
                refundInfo: {
                  requestedAt: now.toISOString(),
                  amount: order.total + (order.tipAmount || 0),
                  reason: reason || 'Customer requested refund',
                  refundMethod: order.paymentMethod === 'card' ? 'original_payment' : 'store_credit',
                  refundId,
                  estimatedCompletionDate: estimatedCompletion.toISOString(),
                }
              };
            }
            return order;
          })
        }));
        
        console.log(`Refund requested for order ${id}, refund ID: ${refundId}`);
        
        // Simulate automatic processing after a short delay
        setTimeout(() => {
          get().processRefund(id);
        }, 2000);
        
        return true;
      },

      processRefund: (id: string) => {
        const now = new Date();
        
        set((state) => ({
          orders: state.orders.map(order => {
            if (order.id === id && order.status === 'refund_requested') {
              return {
                ...order,
                status: 'refund_processing' as OrderStatus,
                refundInfo: order.refundInfo ? {
                  ...order.refundInfo,
                  processedAt: now.toISOString(),
                } : undefined
              };
            }
            return order;
          })
        }));
        
        console.log(`Processing refund for order ${id}`);
        
        // Simulate completion after processing time
        setTimeout(() => {
          get().completeRefund(id);
        }, 5000);
      },

      completeRefund: (id: string) => {
        const now = new Date();
        
        set((state) => ({
          orders: state.orders.map(order => {
            if (order.id === id && order.status === 'refund_processing') {
              return {
                ...order,
                status: 'refunded' as OrderStatus,
                refundInfo: order.refundInfo ? {
                  ...order.refundInfo,
                  completedAt: now.toISOString(),
                } : undefined
              };
            }
            return order;
          })
        }));
        
        console.log(`Refund completed for order ${id}`);
      },

      markOrderAsRated: (id: string) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id ? { ...order, isRated: true } : order
          )
        }));
        console.log(`Order ${id} marked as rated`);
      },
      
      clearOrders: () => {
        set({ orders: [] });
        console.log('All orders cleared');
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