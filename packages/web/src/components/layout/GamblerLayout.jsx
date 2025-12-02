import Navbar from '../ui/Navbar.jsx';

export default function GamblerLayout({ children }) {
  return (
<<<<<<< HEAD
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <div className="app-card">{children}</div>
      </main>
=======
    <div>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>{children}</main>
>>>>>>> main
    </div>
  );
}
