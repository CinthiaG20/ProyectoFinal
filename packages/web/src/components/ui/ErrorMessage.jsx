export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div style={{ margin: '0.5rem 0 0.25rem' }}>
      <div
        style={{
          padding: '0.55rem 0.75rem',
          borderRadius: 999,
          fontSize: '0.8rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          border: '1px solid rgba(248,113,113,0.8)',
          backgroundColor: 'rgba(248,113,113,0.12)',
          color: '#fecaca',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background:
              'radial-gradient(circle, #fecaca, #f97373)',
          }}
        />
        <span>{message}</span>
      </div>
    </div>
  );
}
