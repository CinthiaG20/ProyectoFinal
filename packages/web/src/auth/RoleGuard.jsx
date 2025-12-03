import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth.js';

export default function RoleGuard({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

<<<<<<< HEAD
=======
  // user.role está normalizado en mayúsculas por el AuthContext
>>>>>>> main
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
