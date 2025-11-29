import Navbar from '../ui/Navbar.jsx';

export default function GamblerLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>{children}</main>
    </div>
  );
}
