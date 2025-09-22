import { useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAuthStore } from '~/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, primaryWallet, isLoggedIn } = useDynamicContext();
  const { setAuth, logout, checkKycStatus } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && user && primaryWallet) {
      // User is authenticated
      setAuth(user, primaryWallet);
      // Check KYC status from localStorage
      checkKycStatus();
    } else {
      // User is not authenticated
      logout();
    }
  }, [isLoggedIn, user, primaryWallet, setAuth, logout, checkKycStatus]);

  return <>{children}</>;
};
