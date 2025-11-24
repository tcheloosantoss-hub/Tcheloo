export enum Size {
  P = 'P (300ml)',
  M = 'M (500ml)',
  G = 'G (700ml)',
  GG = 'GG (1L)'
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  icon: string; // Emoji or icon name
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  isCombo?: boolean;
}

export interface CartItem {
  id: string; // Unique ID for cart entry
  productId: string;
  productName: string;
  size: Size;
  toppings: Topping[];
  totalPrice: number;
  quantity: number;
  aiGeneratedImage?: string; // If they used the AI feature
}

export interface UserPoints {
  current: number;
  history: { date: string, points: number, type: 'earn' | 'redeem' }[];
}