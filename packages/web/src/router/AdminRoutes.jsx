import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import UserForm from '../pages/admin/UserForm.jsx';
import UserList from '../pages/admin/UserList.jsx';

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id" element={<UserForm />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
