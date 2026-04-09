export default function PhotoTable({ photos, onDelete, onView }) {
  return (
    <table className="table table-bordered table-hover align-middle">
      <thead className="table-light">
        <tr>
          <th style={{ width: '60px' }}></th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Tamanho</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {photos.map((photo) => (
          <tr key={photo.id}>
            <td>
              <img
                src={photo.url}
                alt={photo.title}
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', cursor: 'zoom-in' }}
                onClick={() => onView(photo)}
              />
            </td>
            <td>{photo.title}</td>
            <td style={{ maxWidth: '200px' }}>
              <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {photo.description}
              </span>
            </td>
            <td className="text-nowrap">{(photo.size / 1024).toFixed(1)} KB</td>
            <td className="text-nowrap">{new Date(photo.acquisitionDate).toLocaleDateString('pt-BR')}</td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onView(photo)}>🔍</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(photo.id)}>Excluir</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
