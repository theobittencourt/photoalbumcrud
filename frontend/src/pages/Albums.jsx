import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { albumService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../hooks/useAlert';
import Navbar from '../components/Navbar';
import AlbumCard from '../components/AlbumCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => { loadAlbums(); }, []);

  const loadAlbums = async () => {
    const { data } = await albumService.getAll();
    setAlbums(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await albumService.create({ title, description });
    setShowModal(false);
    setTitle('');
    setDescription('');
    loadAlbums();
    alert.success('Álbum criado!');
  };

  const handleDelete = async (id) => {
    const result = await alert.confirm('Excluir álbum?', 'Esta ação não pode ser desfeita.');
    if (result.isConfirmed) {
      try {
        await albumService.delete(id);
        loadAlbums();
        alert.success('Álbum excluído!');
      } catch {
        alert.error('Não é possível excluir um álbum com fotos.');
      }
    }
  };

  const navActions = (
    <>
      <button className="btn btn-outline-light btn-sm" onClick={() => setShowModal(true)}>+ Novo Álbum</button>
      <button className="btn btn-outline-danger btn-sm" onClick={logout}>Sair</button>
    </>
  );

  return (
    <div>
      <Navbar title="Meu Photo Album" actions={navActions} />

      <div className="container mt-4">
        {albums.length === 0 ? (
          <EmptyState
            message="Nenhum álbum criado ainda."
            actionLabel="Criar primeiro álbum"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="row g-3">
            {albums.map((album) => (
              <div key={album.id} className="col-sm-6 col-md-4 col-lg-3">
                <AlbumCard
                  album={album}
                  onOpen={() => navigate(`/albums/${album.id}`)}
                  onDelete={() => handleDelete(album.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Novo Álbum" onClose={() => setShowModal(false)} onSubmit={handleCreate} submitLabel="Criar">
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <textarea className="form-control" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </Modal>
      )}
    </div>
  );
}
