import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import LoadingScreen from '../components/ui/LoadingScreen/LoadingScreen';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <LoadingScreen/>;
  
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;