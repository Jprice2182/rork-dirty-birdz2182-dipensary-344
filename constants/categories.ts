import { Category } from '@/types/product';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Flower',
    icon: '🌿',
  },
  {
    id: '1-sativa',
    name: 'Sativa',
    icon: '🌱',
    parentCategory: '1',
  },
  {
    id: '1-indica',
    name: 'Indica',
    icon: '🍃',
    parentCategory: '1',
  },
  {
    id: '1-hybrid',
    name: 'Hybrid',
    icon: '🌿',
    parentCategory: '1',
  },
  {
    id: '2', 
    name: 'Edibles',
    icon: '🍪',
  },
  {
    id: '5',
    name: 'Pre-Rolls',
    icon: '🚬',
  },
];

export const getFlowerStrainCategories = () => {
  return categories.filter(cat => cat.parentCategory === '1');
};

export const getMainCategories = () => {
  return categories.filter(cat => !cat.parentCategory);
};