export default function Navbar({ title, onBack, actions }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <div className="d-flex align-items-center gap-3">
        {onBack && (
          <button className="btn btn-outline-light btn-sm" onClick={onBack}>← Voltar</button>
        )}
        <span className="navbar-brand mb-0">{title}</span>
      </div>
      {actions && <div className="d-flex gap-2">{actions}</div>}
    </nav>
  );
}
