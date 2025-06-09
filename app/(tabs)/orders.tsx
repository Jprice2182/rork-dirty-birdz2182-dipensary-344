import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const [refreshing, setRefreshing] = useState(false);

  const navigateToCart = () => {
    router.push('/cart');
  };

  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate refreshing order data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would fetch fresh order data here
      // await refreshOrders();
      
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color={Colors.dark.warning} />;
      case 'processing':
        return <Package size={20} color={Colors.dark.primary} />;
      case 'out-for-delivery':
        return <Truck size={20} color={Colors.dark.secondary} />;
      case 'delivered':
        return <CheckCircle size={20} color={Colors.dark.success} />;
      case 'cancelled':
        return <AlertCircle size={20} color={Colors.dark.error} />;
      default:
        return <Clock size={20} color={Colors.dark.warning} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'out-for-delivery':
        return 'Out for delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.dark.warning;
      case 'processing':
        return Colors.dark.primary;
      case 'out-for-delivery':
        return Colors.dark.secondary;
      case 'delivered':
        return Colors.dark.success;
      case 'cancelled':
        return Colors.dark.error;
      default:
        return Colors.dark.warning;
    }
  };

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Package size={60} color={Colors.dark.subtext} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptyText}>Your order history will appear here once you place your first order</Text>
      <Pressable style={styles.shopButton} onPress={navigateToCart}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </Pressable>
    </View>
  );

  const renderOrderItem = ({ item }: { item: any }) => (
    <Pressable 
      style={styles.orderCard}
      onPress={() => navigateToOrderDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
          <Text style={styles.orderItems}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      {item.estimatedDelivery && (
        <View style={styles.deliveryInfo}>
          <Clock size={14} color={Colors.dark.subtext} />
          <Text style={styles.deliveryText}>
            Estimated delivery: {item.estimatedDelivery}
          </Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.subtitle}>
          {orders.length > 0 ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}` : 'No orders'}
        </Text>
      </View>
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyOrders}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
            colors={[Colors.dark.primary]}
            progressBackgroundColor={Colors.dark.card}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderTotal: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderItems: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  deliveryText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  shopButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});