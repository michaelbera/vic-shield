import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  isKycCompleted: boolean;
  walletAddress: string | null;
  user: any | null;
  primaryWallet: any | null;
  
  // Actions
  setAuth: (user: any, primaryWallet: any) => void;
  setKycStatus: (isCompleted: boolean) => void;
  logout: () => void;
  checkKycStatus: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isKycCompleted: false,
      walletAddress: null,
      user: null,
      primaryWallet: null,

      setAuth: (user: any, primaryWallet: any) => {
        const walletAddress = primaryWallet?.address;
        const kycStatus = walletAddress ? localStorage.getItem(`kyc_completed_${walletAddress}`) === 'true' : false;
        
        set({
          isAuthenticated: true,
          user,
          primaryWallet,
          walletAddress,
          isKycCompleted: kycStatus,
        });
      },

      setKycStatus: (isCompleted: boolean) => {
        const { walletAddress } = get();
        if (walletAddress) {
          localStorage.setItem(`kyc_completed_${walletAddress}`, isCompleted.toString());
          if (isCompleted) {
            localStorage.setItem(`kyc_completed_date_${walletAddress}`, new Date().toISOString());
          }
        }
        
        set({ isKycCompleted: isCompleted });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isKycCompleted: false,
          walletAddress: null,
          user: null,
          primaryWallet: null,
        });
      },

      checkKycStatus: () => {
        const { walletAddress } = get();
        if (!walletAddress) return false;
        
        const kycStatus = localStorage.getItem(`kyc_completed_${walletAddress}`) === 'true';
        set({ isKycCompleted: kycStatus });
        return kycStatus;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isKycCompleted: state.isKycCompleted,
        walletAddress: state.walletAddress,
      }),
    }
  )
);
