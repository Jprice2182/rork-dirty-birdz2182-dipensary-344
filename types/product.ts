export interface ProductVariant {
  id: string;
  name: string;
  weight: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  thc: number;
  cbd: number;
  price: number;
  image: string;
  description: string;
  effects: string[];
  featured: boolean;
  weight?: string;
  count?: string;
  volume?: string;
  strain?: string;
  rating?: number;
  variants?: ProductVariant[]; // For products with multiple quantity options (like flower)
}

export interface CartItem {
  id: string;
  quantity: number;
  addedAt?: string;
  name?: string;
  price?: number;
  variant?: string;
  variantId?: string;
  variantName?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  variantId?: string;
  variantName?: string;
}

export type PaymentMethod = 'cash' | 'card';

export interface PaymentInfo {
  method: PaymentMethod;
  cardLast4?: string;
  cardType?: string;
}