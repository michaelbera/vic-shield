import { Link } from "react-router-dom";
import { useAuthStore } from "~/store/authStore";
import Container from "./UI/Container";

const Navbar: React.FC = () => {
  const { isAuthenticated, isKycCompleted, walletAddress, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container innerClassName="p-4">
      <nav className="flex justify-between items-center px-2 py-2 bg-[#111324] rounded-full">
        <div className="font-bold text-xl">
          <Link to="/" className="flex flex-row items-center gap-2">
            <img src="/logo.png" className="w-12 h-auto object-contain" />
            <p>VicShield</p>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <div className="font-medium">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'User'}
                </div>
                <div className="text-xs text-gray-400">
                  {isKycCompleted ? '✅ KYC Verified' : '⚠️ KYC Pending'}
                </div>
              </div>
            </div>
            
            {isKycCompleted && (
              <Link to="/contracts" className="btn btn-primary btn-sm rounded-full">
                Contracts
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-sm rounded-full"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn btn-outline btn-sm rounded-full">
              Login
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm rounded-full">
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </Container>
  );
};

export default Navbar;
