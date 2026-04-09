export default function Lightbox({ photo, onClose }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.9)', zIndex: 9999 }}
      onClick={onClose}
    >
      <button
        className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
        style={{ scale: '1.5' }}
        onClick={onClose}
      />
      <div className="text-center px-3" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.url}
          alt={photo.title}
          style={{ maxHeight: '85vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '4px' }}
        />
        <div className="mt-3 text-white">
          <p className="fw-bold mb-1">{photo.title}</p>
          {photo.description && <p className="text-white-50 small mb-0">{photo.description}</p>}
        </div>
      </div>
    </div>
  );
}
