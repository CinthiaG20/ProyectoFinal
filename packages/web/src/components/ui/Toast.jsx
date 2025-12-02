export default function Toast({ id, type = 'info', children, onClose }) {
<<<<<<< HEAD
  const isError = type === 'error';
  const isSuccess = type === 'success';
  const bg = isError
    ? 'rgba(248,113,113,0.14)'
    : isSuccess
      ? 'rgba(34,197,94,0.14)'
      : 'rgba(129,140,248,0.18)';
  const border = isError
    ? 'rgba(248,113,113,0.9)'
    : isSuccess
      ? 'rgba(34,197,94,0.85)'
      : 'rgba(129,140,248,0.85)';
  const color = isError ? '#fecaca' : isSuccess ? '#bbf7d0' : '#c7d2fe';

  return (
    <div
      style={{
        minWidth: 260,
        maxWidth: 340,
        marginBottom: 10,
        padding: '0.7rem 0.85rem',
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${border}`,
        boxShadow:
          '0 18px 35px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.9)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.65rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: 1 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 0 6px ${bg}`,
          }}
        />
        <div style={{ fontSize: '0.82rem' }}>{children}</div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificacion"
        style={{
          marginLeft: 4,
          background: 'transparent',
          border: 'none',
          color,
          cursor: 'pointer',
          fontSize: '0.86rem',
        }}
      >
        ✕
      </button>
=======
  const bg = type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#eef2ff';
  const color = type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#3730a3';
  return (
    <div style={{ minWidth: 240, marginBottom: 8, padding: '0.65rem 0.75rem', borderRadius: 6, background: bg, color, boxShadow: '0 2px 6px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>{children}</div>
      <button onClick={onClose} style={{ marginLeft: 12, background: 'transparent', border: 'none', color, cursor: 'pointer' }}>✕</button>
>>>>>>> main
    </div>
  );
}
