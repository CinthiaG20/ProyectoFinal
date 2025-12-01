import Navbar from '../ui/Navbar.jsx';

export default function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>{children}</main>
    </div>
  );
}
