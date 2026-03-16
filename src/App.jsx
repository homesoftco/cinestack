import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TV from './pages/TV';
import Requests from './pages/Requests';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Demo from './pages/Demo';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/app/*" element={
            <ProtectedRoute>
              <div className="app">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/tv" element={<TV />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
