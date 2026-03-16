import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const links = [
  { path: '/app', label: 'Home' },
  { path: '/app/movies', label: 'Movies' },
  { path: '/app/tv', label: 'TV Shows' },
  { path: '/app/requests', label: 'Requests' },
  { path: '/app/downloads', label: 'Downloads' },
  { path: '/app/settings', label: 'Settings' },
  { path: '/app/profile', label: 'Profile' },
]

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', zIndex: 101 }}>
          <div style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            color: '#1d4ed8',
          }}>
            Cine<span style={{ color: '#ffffff' }}>Stack</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.path ? '#ffffff' : '#b3b3b3',
                fontWeight: location.pathname === link.path ? '600' : '400',
                fontSize: '0.95rem',
                transition: 'color 0.2s ease',
                borderBottom: location.pathname === link.path ? '2px solid #1d4ed8' : '2px solid transparent',
                paddingBottom: '4px',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* User avatar + logout on desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           <Link to="/app/profile" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: '#ffffff',
              }}>
                {user?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'C'}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="logout-btn-desktop"
              style={{
                background: 'none',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#b3b3b3',
                padding: '6px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 101,
            }}
          >
            <span style={{
              display: 'block', width: '24px', height: '2px',
              background: '#fff',
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }} />
            <span style={{
              display: 'block', width: '24px', height: '2px',
              background: '#fff',
              transition: 'all 0.3s ease',
              opacity: menuOpen ? 0 : 1
            }} />
            <span style={{
              display: 'block', width: '24px', height: '2px',
              background: '#fff',
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(0,0,0,0.97)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
        }}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.path ? '#ffffff' : '#b3b3b3',
                fontWeight: location.pathname === link.path ? '700' : '400',
                fontSize: '1.8rem',
                letterSpacing: '-0.5px',
                borderBottom: location.pathname === link.path ? '2px solid #1d4ed8' : '2px solid transparent',
                paddingBottom: '4px',
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#b3b3b3',
              padding: '12px 32px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              marginTop: '16px',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </>
  )
}
