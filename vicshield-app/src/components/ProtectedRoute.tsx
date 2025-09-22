import { Navigate } from 'react-router-dom';
import { useAuthStore } from '~/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireKyc?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireKyc = false 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isKycCompleted } = useAuthStore();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If KYC is required but user hasn't completed KYC
  if (requireKyc && !isKycCompleted) {
    return <Navigate to="/kyc" replace />;
  }

  // If user is authenticated and KYC requirements are met
  return <>{children}</>;
};
