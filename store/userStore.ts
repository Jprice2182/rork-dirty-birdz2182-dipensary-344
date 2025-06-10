import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserAvatar {
  id: string;
  url: string;
  isSelected: boolean;
}

export interface UserState {
  isVerified: boolean;
  name: string;
  email: string;
  phone: string;
  birthday: string | null;
  addresses: Address[];
  selectedAddressIndex: number;
  isNewUser: boolean;
  hasUsedDiscount: boolean;
  hasUsedPromoCode: boolean;
  appRating: number | null;
  driverRatings: Record<string, number>;
  reviews: Array<{
    id: string;
    text: string;
    rating: number;
    date: string;
  }>;
  avatars: UserAvatar[];
  notificationPreferences: {
    newFlower: boolean;
    newVapes: boolean;
    newEdibles: boolean;
    newPreRolls: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
  lastUpdated: string | null;
  
  setVerified: (verified: boolean) => void;
  updateUserInfo: (name: string, email: string, phone: string) => void;
  setBirthday: (date: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (index: number) => void;
  updateAddress: (index: number, address: Address) => void;
  selectAddress: (index: number) => void;
  markDiscountAsUsed: () => void;
  markPromoCodeAsUsed: () => void;
  markAsExistingUser: () => void;
  setAppRating: (rating: number) => void;
  setDriverRating: (driverId: string, rating: number) => void;
  addReview: (text: string, rating: number) => void;
  addAvatar: (url: string) => void;
  selectAvatar: (id: string) => void;
  removeAvatar: (id: string) => void;
  updateNotificationPreference: (key: keyof UserState['notificationPreferences'], value: boolean) => void;
  refreshUserData: () => Promise<void>;
  resetUserData: () => void;
}

const initialState = {
  isVerified: false,
  name: '',
  email: '',
  phone: '',
  birthday: null,
  addresses: [],
  selectedAddressIndex: 0,
  isNewUser: true,
  hasUsedDiscount: false,
  hasUsedPromoCode: false,
  appRating: null,
  driverRatings: {},
  reviews: [],
  avatars: [],
  notificationPreferences: {
    newFlower: true,
    newVapes: true,
    newEdibles: true,
    newPreRolls: true,
    promotions: true,
    orderUpdates: true,
  },
  lastUpdated: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setVerified: (verified: boolean) => {
        const now = new Date().toISOString();
        console.log('Setting user verification status:', verified);
        set({ isVerified: verified, lastUpdated: now });
      },
      
      updateUserInfo: (name: string, email: string, phone: string) => {
        const now = new Date().toISOString();
        set({ name: name.trim(), email: email.trim(), phone: phone.trim(), lastUpdated: now });
      },
      
      setBirthday: (date: string) => {
        const now = new Date().toISOString();
        set({ birthday: date, lastUpdated: now });
      },
      
      addAddress: (address: Address) => {
        const now = new Date().toISOString();
        set((state) => {
          const newAddresses = [...state.addresses, address];
          return { 
            addresses: newAddresses,
            selectedAddressIndex: newAddresses.length - 1,
            lastUpdated: now
          };
        });
      },
      
      removeAddress: (index: number) => {
        const now = new Date().toISOString();
        set((state) => {
          if (index < 0 || index >= state.addresses.length) {
            return state; // Invalid index, no change
          }
          
          const newAddresses = [...state.addresses];
          newAddresses.splice(index, 1);
          
          let newSelectedIndex = state.selectedAddressIndex;
          if (index === state.selectedAddressIndex) {
            newSelectedIndex = Math.max(0, Math.min(newSelectedIndex, newAddresses.length - 1));
          } else if (index < state.selectedAddressIndex) {
            newSelectedIndex--;
          }
          
          return { 
            addresses: newAddresses,
            selectedAddressIndex: newAddresses.length > 0 ? newSelectedIndex : 0,
            lastUpdated: now
          };
        });
      },
      
      updateAddress: (index: number, address: Address) => {
        const now = new Date().toISOString();
        set((state) => {
          if (index < 0 || index >= state.addresses.length) {
            return state; // Invalid index, no change
          }
          
          const newAddresses = [...state.addresses];
          newAddresses[index] = address;
          return { addresses: newAddresses, lastUpdated: now };
        });
      },
      
      selectAddress: (index: number) => {
        const now = new Date().toISOString();
        set((state) => {
          if (index < 0 || index >= state.addresses.length) {
            return state; // Invalid index, no change
          }
          return { selectedAddressIndex: index, lastUpdated: now };
        });
      },
        
      markDiscountAsUsed: () => {
        const now = new Date().toISOString();
        set({ hasUsedDiscount: true, isNewUser: false, lastUpdated: now });
      },
        
      markPromoCodeAsUsed: () => {
        const now = new Date().toISOString();
        set({ hasUsedPromoCode: true, lastUpdated: now });
      },
        
      markAsExistingUser: () => {
        const now = new Date().toISOString();
        set({ isNewUser: false, lastUpdated: now });
      },
        
      setAppRating: (rating: number) => {
        const now = new Date().toISOString();
        if (rating >= 1 && rating <= 5) {
          set({ appRating: rating, lastUpdated: now });
        }
      },
        
      setDriverRating: (driverId: string, rating: number) => {
        const now = new Date().toISOString();
        if (rating >= 1 && rating <= 5 && driverId.trim()) {
          set((state) => ({
            driverRatings: {
              ...state.driverRatings,
              [driverId]: rating
            },
            lastUpdated: now
          }));
        }
      },
        
      addReview: (text: string, rating: number) => {
        const now = new Date().toISOString();
        if (text.trim() && rating >= 1 && rating <= 5) {
          set((state) => ({
            reviews: [
              {
                id: Date.now().toString(),
                text: text.trim(),
                rating,
                date: now
              },
              ...state.reviews
            ],
            lastUpdated: now
          }));
        }
      },
        
      addAvatar: (url: string) => {
        const now = new Date().toISOString();
        if (url.trim()) {
          set((state) => {
            const isFirstAvatar = state.avatars.length === 0;
            return {
              avatars: [
                ...state.avatars,
                {
                  id: Date.now().toString(),
                  url: url.trim(),
                  isSelected: isFirstAvatar
                }
              ],
              lastUpdated: now
            };
          });
        }
      },
        
      selectAvatar: (id: string) => {
        const now = new Date().toISOString();
        if (id.trim()) {
          set((state) => ({
            avatars: state.avatars.map(avatar => ({
              ...avatar,
              isSelected: avatar.id === id
            })),
            lastUpdated: now
          }));
        }
      },
        
      removeAvatar: (id: string) => {
        const now = new Date().toISOString();
        if (id.trim()) {
          set((state) => {
            const filteredAvatars = state.avatars.filter(avatar => avatar.id !== id);
            // If we removed the selected avatar, select the first one if available
            if (state.avatars.find(a => a.id === id)?.isSelected && filteredAvatars.length > 0) {
              filteredAvatars[0].isSelected = true;
            }
            return { avatars: filteredAvatars, lastUpdated: now };
          });
        }
      },
        
      updateNotificationPreference: (key, value) => {
        const now = new Date().toISOString();
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value
          },
          lastUpdated: now
        }));
      },
      
      refreshUserData: async () => {
        // In a real app, you would fetch fresh user data from server
        const now = new Date().toISOString();
        set({ lastUpdated: now });
      },
      
      resetUserData: () => {
        console.log('Resetting user data to initial state');
        set(initialState);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isVerified: state.isVerified,
        name: state.name,
        email: state.email,
        phone: state.phone,
        birthday: state.birthday,
        addresses: state.addresses,
        selectedAddressIndex: state.selectedAddressIndex,
        isNewUser: state.isNewUser,
        hasUsedDiscount: state.hasUsedDiscount,
        hasUsedPromoCode: state.hasUsedPromoCode,
        appRating: state.appRating,
        driverRatings: state.driverRatings,
        reviews: state.reviews,
        avatars: state.avatars,
        notificationPreferences: state.notificationPreferences,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);