export default function Toast({ id, type = 'info', children, onClose }) {
  const bg = type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#eef2ff';
  const color = type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#3730a3';
  return (
    <div style={{ minWidth: 240, marginBottom: 8, padding: '0.65rem 0.75rem', borderRadius: 6, background: bg, color, boxShadow: '0 2px 6px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>{children}</div>
      <button onClick={onClose} style={{ marginLeft: 12, background: 'transparent', border: 'none', color, cursor: 'pointer' }}>✕</button>
    </div>
  );
}
