import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { albumService, photoService } from '../services/api';
import { useAlert } from '../hooks/useAlert';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import PhotoTable from '../components/PhotoTable';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Lightbox from '../components/Lightbox';
import Spinner from '../components/Spinner';

export default function AlbumPhotos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    const [albumRes, photosRes] = await Promise.all([
      albumService.getById(id),
      photoService.getByAlbum(id),
    ]);
    setAlbum(albumRes.data);
    setPhotos(photosRes.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('acquisitionDate', acquisitionDate ? new Date(acquisitionDate).toISOString() : new Date().toISOString());
      await photoService.upload(id, formData);
      setShowModal(false);
      setFile(null);
      setTitle('');
      setDescription('');
      setAcquisitionDate('');
      loadData();
      alert.success('Foto enviada!');
    } catch {
      alert.error('Erro ao enviar foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    const result = await alert.confirm('Excluir foto?', 'Esta ação não pode ser desfeita.');
    if (result.isConfirmed) {
      await photoService.delete(photoId);
      loadData();
      alert.success('Foto excluída!');
    }
  };

  if (!album) return <Spinner />;


  const navActions = (
    <>
      <button className="btn btn-outline-light btn-sm" onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
        {viewMode === 'grid' ? '☰ Tabela' : '⊞ Grid'}
      </button>
      <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Upload</button>
    </>
  );

  return (
    <div>
      <Navbar title={album.title} onBack={() => navigate('/albums')} actions={navActions} />

      <div className="container mt-4">
        {photos.length === 0 ? (
          <EmptyState
            message="Nenhuma foto neste álbum."
            actionLabel="Fazer upload"
            onAction={() => setShowModal(true)}
          />
        ) : viewMode === 'grid' ? (
          <div className="row g-3">
            {photos.map((photo) => (
              <div key={photo.id} className="col-6 col-md-4 col-lg-3">
                <PhotoCard photo={photo} onDelete={() => handleDelete(photo.id)} onView={() => setSelectedPhoto(photo)} />
              </div>
            ))}
          </div>
        ) : (
          <PhotoTable photos={photos} onDelete={handleDelete} onView={setSelectedPhoto} />
        )}
      </div>

      {selectedPhoto && <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}

      {showModal && (
        <Modal title="Upload de Foto" onClose={() => setShowModal(false)} onSubmit={handleUpload} submitLabel="Upload" submitting={uploading}>
          <div className="mb-3">
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <textarea className="form-control" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="mb-3">
            <input type="date" className="form-control" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
          </div>
        </Modal>
      )}
    </div>
  );
}
