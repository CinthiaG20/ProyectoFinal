export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#ffe5e5',
        color: '#a30000',
        borderRadius: '4px',
        margin: '0.5rem 0',
        fontSize: '0.9rem',
      }}
    >
      {message}
    </div>
  );
}
