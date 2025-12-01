import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import RoleGuard from '../auth/RoleGuard.jsx';

import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';

import AdminRoutes from './AdminRoutes.jsx';
import GamblerRoutes from './GamblerRoutes.jsx';
import ManagerRoutes from './ManagerRoutes.jsx';

export default function AppRouter() {
  return (
    <Routes>

      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>

        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={<RoleGuard allowedRoles={['ADMIN']} />}
        >
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        {/* MANAGER */}
        <Route
          path="/manager/*"
          element={<RoleGuard allowedRoles={['ADMIN', 'MANAGER']} />}
        >
          <Route path="*" element={<ManagerRoutes />} />
        </Route>

        {/* GAMBLER */}
        <Route
          path="/gambler/*"
          element={<RoleGuard allowedRoles={['ADMIN', 'MANAGER', 'GAMBLER']}/>}
        >
          <Route path="*" element={<GamblerRoutes />} />
        </Route>

      </Route>

      {/* Default redirection */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
