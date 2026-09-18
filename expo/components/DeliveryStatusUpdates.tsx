import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, Truck, CheckCircle, AlertCircle, Package } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DeliveryStatusUpdatesProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDelivery?: string;
  estimatedArrival?: 'early' | 'on-time' | 'late';
}

export default function DeliveryStatusUpdates({ 
  status, 
  estimatedDelivery,
  estimatedArrival = 'on-time'
}: DeliveryStatusUpdatesProps) {
  
  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return "Your order has been received and is awaiting confirmation.";
      case 'confirmed':
        return "Your order has been confirmed and will be prepared soon.";
      case 'preparing':
        return "Your order is being prepared and packaged.";
      case 'out_for_delivery':
        return `Your order is on the way! ${getArrivalMessage()}`;
      case 'delivered':
        return "Your order has been delivered. Enjoy!";
      case 'cancelled':
        return "Your order has been cancelled.";
      default:
        return "Your order status is being updated.";
    }
  };

  const getArrivalMessage = () => {
    switch (estimatedArrival) {
      case 'early':
        return "Driver is ahead of schedule!";
      case 'late':
        return "Driver is running a bit behind schedule.";
      case 'on-time':
      default:
        return "Driver is on schedule.";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock size={24} color={Colors.dark.warning} />;
      case 'confirmed':
      case 'preparing':
        return <Package size={24} color={Colors.dark.primary} />;
      case 'out_for_delivery':
        return <Truck size={24} color={Colors.dark.secondary} />;
      case 'delivered':
        return <CheckCircle size={24} color={Colors.dark.success} />;
      case 'cancelled':
        return <AlertCircle size={24} color={Colors.dark.error} />;
      default:
        return <Clock size={24} color={Colors.dark.warning} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return Colors.dark.warning;
      case 'confirmed':
      case 'preparing':
        return Colors.dark.primary;
      case 'out_for_delivery':
        return Colors.dark.secondary;
      case 'delivered':
        return Colors.dark.success;
      case 'cancelled':
        return Colors.dark.error;
      default:
        return Colors.dark.warning;
    }
  };

  const getArrivalColor = () => {
    switch (estimatedArrival) {
      case 'early':
        return Colors.dark.success;
      case 'late':
        return Colors.dark.warning;
      case 'on-time':
      default:
        return Colors.dark.secondary;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Order';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Order Status';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusHeader}>
        {getStatusIcon()}
        <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
          {getStatusTitle()}
        </Text>
      </View>
      
      <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
      
      {status === 'out_for_delivery' && (
        <View style={[styles.arrivalIndicator, { backgroundColor: `${getArrivalColor()}20` }]}>
          <Text style={[styles.arrivalText, { color: getArrivalColor() }]}>
            {estimatedArrival === 'early' ? 'Arriving earlier than expected!' :
             estimatedArrival === 'late' ? 'Slight delay in delivery' :
             'On track for delivery'}
          </Text>
        </View>
      )}
      
      {estimatedDelivery && status !== 'delivered' && status !== 'cancelled' && (
        <Text style={styles.estimatedDelivery}>
          Estimated delivery: {estimatedDelivery}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  statusMessage: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 12,
  },
  arrivalIndicator: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  arrivalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  estimatedDelivery: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
});