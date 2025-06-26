import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, Clock, Package, Truck, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface OrderStatusTrackerProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDelivery?: string;
  estimatedProcessingTime?: string;
}

export default function OrderStatusTracker({ 
  status, 
  estimatedDelivery, 
  estimatedProcessingTime 
}: OrderStatusTrackerProps) {
  const getStatusIndex = () => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const statusIndex = getStatusIndex();
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <View style={styles.cancelledContainer}>
        <AlertCircle size={24} color={Colors.dark.error} />
        <Text style={styles.cancelledText}>Order Cancelled</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>
        {/* Pending */}
        <View style={[styles.statusItem, statusIndex >= 0 && styles.activeStatusItem]}>
          <View style={[styles.statusIcon, statusIndex >= 0 && styles.activeStatusIcon]}>
            {statusIndex > 0 ? (
              <Check size={16} color={Colors.dark.text} />
            ) : (
              <Clock size={16} color={statusIndex >= 0 ? Colors.dark.text : Colors.dark.subtext} />
            )}
          </View>
          <Text style={[styles.statusText, statusIndex >= 0 && styles.activeStatusText]}>
            Order Placed
          </Text>
          {statusIndex === 0 && estimatedProcessingTime && (
            <Text style={styles.estimatedTime}>Est. processing: {estimatedProcessingTime}</Text>
          )}
        </View>

        <View style={[styles.connector, statusIndex > 0 && styles.activeConnector]} />

        {/* Confirmed */}
        <View style={[styles.statusItem, statusIndex >= 1 && styles.activeStatusItem]}>
          <View style={[styles.statusIcon, statusIndex >= 1 && styles.activeStatusIcon]}>
            {statusIndex > 1 ? (
              <Check size={16} color={Colors.dark.text} />
            ) : (
              <Package size={16} color={statusIndex >= 1 ? Colors.dark.text : Colors.dark.subtext} />
            )}
          </View>
          <Text style={[styles.statusText, statusIndex >= 1 && styles.activeStatusText]}>
            Confirmed
          </Text>
        </View>

        <View style={[styles.connector, statusIndex > 1 && styles.activeConnector]} />

        {/* Preparing */}
        <View style={[styles.statusItem, statusIndex >= 2 && styles.activeStatusItem]}>
          <View style={[styles.statusIcon, statusIndex >= 2 && styles.activeStatusIcon]}>
            {statusIndex > 2 ? (
              <Check size={16} color={Colors.dark.text} />
            ) : (
              <Package size={16} color={statusIndex >= 2 ? Colors.dark.text : Colors.dark.subtext} />
            )}
          </View>
          <Text style={[styles.statusText, statusIndex >= 2 && styles.activeStatusText]}>
            Preparing
          </Text>
        </View>

        <View style={[styles.connector, statusIndex > 2 && styles.activeConnector]} />

        {/* Out for Delivery */}
        <View style={[styles.statusItem, statusIndex >= 3 && styles.activeStatusItem]}>
          <View style={[styles.statusIcon, statusIndex >= 3 && styles.activeStatusIcon]}>
            {statusIndex > 3 ? (
              <Check size={16} color={Colors.dark.text} />
            ) : (
              <Truck size={16} color={statusIndex >= 3 ? Colors.dark.text : Colors.dark.subtext} />
            )}
          </View>
          <Text style={[styles.statusText, statusIndex >= 3 && styles.activeStatusText]}>
            Out for Delivery
          </Text>
          {statusIndex === 3 && estimatedDelivery && (
            <Text style={styles.estimatedTime}>Est. arrival: {estimatedDelivery}</Text>
          )}
        </View>

        <View style={[styles.connector, statusIndex > 3 && styles.activeConnector]} />

        {/* Delivered */}
        <View style={[styles.statusItem, statusIndex >= 4 && styles.activeStatusItem]}>
          <View style={[styles.statusIcon, statusIndex >= 4 && styles.activeStatusIcon]}>
            <Check size={16} color={statusIndex >= 4 ? Colors.dark.text : Colors.dark.subtext} />
          </View>
          <Text style={[styles.statusText, statusIndex >= 4 && styles.activeStatusText]}>
            Delivered
          </Text>
          {statusIndex === 4 && (
            <Text style={styles.estimatedTime}>Your order has been delivered!</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
    width: 80,
  },
  activeStatusItem: {
    opacity: 1,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  activeStatusIcon: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  statusText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  activeStatusText: {
    color: Colors.dark.text,
    fontWeight: '500',
  },
  estimatedTime: {
    color: Colors.dark.primary,
    fontSize: 10,
    textAlign: 'center',
  },
  connector: {
    height: 2,
    backgroundColor: Colors.dark.border,
    flex: 1,
  },
  activeConnector: {
    backgroundColor: Colors.dark.primary,
  },
  cancelledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  cancelledText: {
    color: Colors.dark.error,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});