import { Flower, Cigarette, Cookie, Zap } from 'lucide-react-native';

export interface Category {
  id: string;
  name: string;
  icon: any;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Flower',
    icon: Flower,
  },
  {
    id: '2',
    name: 'Pre-Rolls',
    icon: Cigarette,
  },
  {
    id: '3',
    name: 'Edibles',
    icon: Cookie,
  },
  {
    id: '4',
    name: 'Vapes',
    icon: Zap,
  },
];