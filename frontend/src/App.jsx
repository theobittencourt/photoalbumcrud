import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Albums from './pages/Albums';
import AlbumPhotos from './pages/AlbumPhotos';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/albums"
            element={
              <PrivateRoute>
                <Albums />
              </PrivateRoute>
            }
          />
          <Route
            path="/albums/:id"
            element={
              <PrivateRoute>
                <AlbumPhotos />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/albums" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
