import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrderStore();

  const navigateToCart = () => {
    router.push('/cart');
  };

  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

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

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Package size={60} color={Colors.dark.subtext} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptyText}>Your order history will appear here</Text>
      <Pressable style={styles.shopButton} onPress={navigateToCart}>
        <Text style={styles.shopButtonText}>Go to Cart</Text>
      </Pressable>
    </View>
  );

  const renderOrderItem = ({ item }: { item: any }) => (
    <Pressable 
      style={styles.orderCard}
      onPress={() => navigateToOrderDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
          <Text style={styles.orderItems}>{item.items.length} items</Text>
        </View>
        
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status)}
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyOrders}
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
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.dark.text,
    fontSize: 14,
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