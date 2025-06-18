import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appInfo from '@/constants/appInfo';

interface PromoState {
  validPromoCodes: Record<string, number>;
  validatePromoCode: (code: string) => number | null;
}

export const usePromoStore = create<PromoState>()(
  persist(
    (set, get) => ({
      validPromoCodes: {
        [appInfo.promoCode]: appInfo.promoDiscount,
        [appInfo.eighthsPromotion?.code || 'EIGHTHS1']: 0, // Eighths promotion is handled separately
      },
      
      validatePromoCode: (code: string) => {
        const { validPromoCodes } = get();
        const normalizedCode = code.trim().toUpperCase();
        return validPromoCodes[normalizedCode] !== undefined ? validPromoCodes[normalizedCode] : null;
      },
    }),
    {
      name: 'promo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);