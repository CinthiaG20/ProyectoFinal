
export default function Table({ children, style, className }) {
  const base = {};
  return (
    <div className="table-shell">
      <table className={`table ${className || ''}`.trim()} style={{ ...base, ...style }}>
        {children}
      </table>
    </div>
  );
}
