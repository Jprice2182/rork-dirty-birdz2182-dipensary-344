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
}

export interface CartItem {
  id: string;
  quantity: number;
  addedAt?: string;
  name?: string;
  price?: number;
  variant?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}