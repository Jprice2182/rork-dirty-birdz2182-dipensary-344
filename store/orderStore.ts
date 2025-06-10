// Add tipAmount to the Order interface
export interface Order {
  // ... existing fields ...
  tipAmount: number;
  // ... rest of the fields ...
}

// Update the addOrder function to include tip
const addOrder = (order: Order) => {
  set((state) => ({
    orders: [
      {
        ...order,
        tipAmount: order.tipAmount || 0, // Ensure tipAmount has a default
      },
      ...state.orders
    ]
  }));
};