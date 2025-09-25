import useUser from "~/hooks/useUser";
import KYC from "~/pages/kyc/Page";
import Login from "~/pages/login/Page";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireKyc?: boolean;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useUser();
  if (!user.data) return <Login />;
  if (!user.data.isValid) return <KYC />;

  return <>{children}</>;
};
