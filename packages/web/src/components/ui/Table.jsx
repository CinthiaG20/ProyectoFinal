
export default function Table({ children, style, className }) {
  const base = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
  };
  return (
    <table className={className} style={{ ...base, ...style }}>
      {children}
    </table>
  );
}
