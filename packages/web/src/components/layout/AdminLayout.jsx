import Navbar from '../ui/Navbar.jsx';

export default function AdminLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <div className="app-card">{children}</div>
      </main>
    </div>
  );
}
