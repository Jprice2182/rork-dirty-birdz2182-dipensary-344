import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DeliveryStatusUpdatesProps {
  status: 'pending' | 'processing' | 'out-for-delivery' | 'delivered' | 'cancelled';
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
        return "Your order has been received and is awaiting processing.";
      case 'processing':
        return "Your order is being prepared and packaged.";
      case 'out-for-delivery':
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
      case 'processing':
        return <Clock size={24} color={Colors.dark.primary} />;
      case 'out-for-delivery':
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

  return (
    <View style={styles.container}>
      <View style={styles.statusHeader}>
        {getStatusIcon()}
        <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
          {status === 'out-for-delivery' ? 'Out for Delivery' : 
           status === 'pending' ? 'Order Received' :
           status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
      
      <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
      
      {status === 'out-for-delivery' && (
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