import { useNavigate } from "react-router-dom";
import { useAuthStore } from "~/store/authStore";
import Container from "~/components/UI/Container";
import bg from "~/statics/images/banner/background.png";
import sImg from "~/statics/images/banner/s.png";

const Banner: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isKycCompleted } = useAuthStore();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      // User not logged in, redirect to login
      navigate('/login');
      return;
    }

    if (!isKycCompleted) {
      // User hasn't completed KYC, redirect to KYC page
      navigate('/kyc');
    } else {
      // User has completed KYC, redirect to contracts
      navigate('/contracts');
    }
  };

  return (
    <Container>
      <section className="relative grid grid-cols-12 py-20 px-6">
        <img
          src={bg}
          className="w-full h-full object-cover absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2"
        />
        <div className="page-title col-span-full md:col-span-8 flex flex-col gap-4 md:gap-8">
          <h1>Add ultimate security to your mutual agreement</h1>
          <span>Sign with Confidence. Contract with Transparency.</span>
          <button 
            className="btn btn-primary btn-lg self-start"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>
        <div className="col-span-full md:col-span-4 flex flex-col items-center justify-center">
          <img
            className="w-full md:w-10/12 object-contain"
            src={sImg}
            alt="shield"
          />
        </div>
      </section>
    </Container>
  );
};

export default Banner;
