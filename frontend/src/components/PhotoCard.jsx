export default function PhotoCard({ photo, onDelete, onView }) {
  return (
    <div className="card h-100">
      <img
        src={photo.url}
        alt={photo.title}
        className="card-img-top"
        style={{ height: '180px', objectFit: 'cover', cursor: 'zoom-in' }}
        onClick={onView}
      />
      <div className="card-body p-2">
        <p className="card-title small fw-bold mb-1">{photo.title}</p>
        {photo.description && (
          <p className="text-muted mb-1" style={{ fontSize: '11px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {photo.description}
          </p>
        )}
        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{(photo.size / 1024).toFixed(1)} KB</p>
      </div>
      <div className="card-footer p-2 d-flex gap-1">
        <button className="btn btn-outline-secondary btn-sm flex-fill" onClick={onView}>🔍 Ver</button>
        <button className="btn btn-outline-danger btn-sm flex-fill" onClick={onDelete}>Excluir</button>
      </div>
    </div>
  );
}
