import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Contracts = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to create page since this is the main contracts entry point
    navigate('/contracts/create', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  );
};

export default Contracts;
