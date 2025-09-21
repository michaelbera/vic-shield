import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Container from "~/components/UI/Container";

const Login = () => {
  const navigate = useNavigate();
  const { user, primaryWallet } = useDynamicContext();

  useEffect(() => {
    if (user && primaryWallet) {
      // Get the wallet address
      const walletAddress = primaryWallet.address;
      
      if (walletAddress) {
        // Check if user has completed KYC by checking localStorage
        const kycStatus = localStorage.getItem(`kyc_completed_${walletAddress}`);
        
        if (kycStatus === 'true') {
          // User has completed KYC, redirect to home
          navigate('/');
        } else {
          // User hasn't completed KYC, redirect to KYC page
          navigate('/kyc');
        }
      }
    }
  }, [user, primaryWallet, navigate]);

  return (
    <Container>
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 md:px-8 gap-8 py-8 md:py-16">
        <div className="page-title flex flex-col gap-4 md:gap-6 items-center text-center max-w-2xl">
          <p>Welcome to VicShield</p>
          <span>
            Connect your wallet to get started with secure contract signing. 
            First-time users will need to complete KYC verification.
          </span>
        </div>

        <div className="card bg-base-300 p-6 md:p-8 w-full max-w-md">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Connect Wallet</h3>
              <p className="text-sm text-base-content/70">
                Choose your preferred wallet to continue
              </p>
            </div>
            
            <DynamicWidget />
            
            <div className="text-xs text-base-content/60 text-center max-w-xs">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Login;
