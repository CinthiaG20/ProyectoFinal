
export default function Table({ children, style, className }) {
<<<<<<< HEAD
  const base = {};
  return (
    <div className="table-shell">
      <table className={`table ${className || ''}`.trim()} style={{ ...base, ...style }}>
        {children}
      </table>
    </div>
=======
  const base = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
  };
  return (
    <table className={className} style={{ ...base, ...style }}>
      {children}
    </table>
>>>>>>> main
  );
}
