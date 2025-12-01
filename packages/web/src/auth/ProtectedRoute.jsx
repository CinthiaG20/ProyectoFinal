import { Navigate, Outlet } from 'react-router-dom';
import Loading from '../components/ui/Loading.jsx';
import { useAuth } from './useAuth.js';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
