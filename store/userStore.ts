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
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
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
      
      setVerified: (verified: boolean) => set({ isVerified: verified }),
      
      updateUserInfo: (name: string, email: string, phone: string) => 
        set({ name, email, phone }),
      
      setBirthday: (date: string) => 
        set({ birthday: date }),
      
      addAddress: (address: Address) => 
        set((state) => {
          const newAddresses = [...state.addresses, address];
          return { 
            addresses: newAddresses,
            selectedAddressIndex: newAddresses.length - 1
          };
        }),
      
      removeAddress: (index: number) => 
        set((state) => {
          const newAddresses = [...state.addresses];
          newAddresses.splice(index, 1);
          
          let newSelectedIndex = state.selectedAddressIndex;
          if (index === state.selectedAddressIndex) {
            newSelectedIndex = Math.max(0, newAddresses.length - 1);
          } else if (index < state.selectedAddressIndex) {
            newSelectedIndex--;
          }
          
          return { 
            addresses: newAddresses,
            selectedAddressIndex: newSelectedIndex
          };
        }),
      
      updateAddress: (index: number, address: Address) => 
        set((state) => {
          const newAddresses = [...state.addresses];
          newAddresses[index] = address;
          return { addresses: newAddresses };
        }),
      
      selectAddress: (index: number) => 
        set({ selectedAddressIndex: index }),
        
      markDiscountAsUsed: () => 
        set({ hasUsedDiscount: true, isNewUser: false }),
        
      markPromoCodeAsUsed: () => 
        set({ hasUsedPromoCode: true }),
        
      markAsExistingUser: () => 
        set({ isNewUser: false }),
        
      setAppRating: (rating: number) => 
        set({ appRating: rating }),
        
      setDriverRating: (driverId: string, rating: number) => 
        set((state) => ({
          driverRatings: {
            ...state.driverRatings,
            [driverId]: rating
          }
        })),
        
      addReview: (text: string, rating: number) => 
        set((state) => ({
          reviews: [
            {
              id: Date.now().toString(),
              text,
              rating,
              date: new Date().toISOString()
            },
            ...state.reviews
          ]
        })),
        
      addAvatar: (url: string) => 
        set((state) => {
          const isFirstAvatar = state.avatars.length === 0;
          return {
            avatars: [
              ...state.avatars,
              {
                id: Date.now().toString(),
                url,
                isSelected: isFirstAvatar
              }
            ]
          };
        }),
        
      selectAvatar: (id: string) => 
        set((state) => ({
          avatars: state.avatars.map(avatar => ({
            ...avatar,
            isSelected: avatar.id === id
          }))
        })),
        
      removeAvatar: (id: string) => 
        set((state) => {
          const filteredAvatars = state.avatars.filter(avatar => avatar.id !== id);
          // If we removed the selected avatar, select the first one if available
          if (state.avatars.find(a => a.id === id)?.isSelected && filteredAvatars.length > 0) {
            filteredAvatars[0].isSelected = true;
          }
          return { avatars: filteredAvatars };
        }),
        
      updateNotificationPreference: (key, value) => 
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value
          }
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);