import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

 if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!user) {
    // Redirect to login with return location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Optionally show notification about insufficient permissions
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;