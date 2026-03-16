import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Demo() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/demo')
      .then(r => r.json())
      .then(data => {
        if (data.token) {
          login(data.token, data.display_name);
          navigate('/app');
        }
      })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div style={{
      background: '#0a0a0a',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ color: '#666', fontSize: '0.9rem' }}>Loading demo...</div>
    </div>
  );
}
