export default function AlbumCard({ album, onOpen, onDelete }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{album.title}</h5>
        <p className="card-text text-muted small">{album.description}</p>
        <span className="badge bg-secondary">
          {album.photosCount} foto{album.photosCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="card-footer d-flex gap-2">
        <button className="btn btn-primary btn-sm flex-fill" onClick={onOpen}>Abrir</button>
        <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>Excluir</button>
      </div>
    </div>
  );
}
