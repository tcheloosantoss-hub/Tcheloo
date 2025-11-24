import { Topping, Product, Size } from './types';

export const TOPPINGS: Topping[] = [
  { id: '1', name: 'Leite Ninho', price: 3.00, icon: '🥛' },
  { id: '2', name: 'Morango', price: 4.50, icon: '🍓' },
  { id: '3', name: 'Banana', price: 2.00, icon: '🍌' },
  { id: '4', name: 'Granola', price: 2.00, icon: '🌾' },
  { id: '5', name: 'Paçoca', price: 2.50, icon: '🥜' },
  { id: '6', name: 'Kiwi', price: 4.00, icon: '🥝' },
  { id: '7', name: 'Nutella', price: 5.00, icon: '🍫' },
  { id: '8', name: 'Leite Condensado', price: 3.00, icon: '🍯' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'traditional',
    name: 'Açaí Tradicional',
    description: 'Açaí puro batido com guaraná.',
    basePrice: 15.00,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    isCombo: false,
  },
  {
    id: 'combo-verao',
    name: 'Combo Verão',
    description: 'Açaí 500ml + Morango + Kiwi + Granola.',
    basePrice: 22.00,
    image: 'https://images.unsplash.com/photo-1490474504059-bf6ae2c42780?auto=format&fit=crop&w=800&q=80',
    isCombo: true,
  },
  {
    id: 'combo-fit',
    name: 'Combo Fitness',
    description: 'Açaí Zero + Whey Protein + Banana.',
    basePrice: 28.00,
    image: 'https://images.unsplash.com/photo-1623687214603-338663dc46a7?auto=format&fit=crop&w=800&q=80',
    isCombo: true,
  },
];

export const SIZES_PRICE_MODIFIER = {
  [Size.P]: 0,
  [Size.M]: 5,
  [Size.G]: 9,
  [Size.GG]: 14
};