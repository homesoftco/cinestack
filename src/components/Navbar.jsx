import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { path: '/', label: 'Home' },
    { path: '/movies', label: 'Movies' },
    { path: '/tv', label: 'TV Shows' },
    { path: '/requests', label: 'Requests' },
    { path: '/downloads', label: 'Downloads' },
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
          }}>
            C
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
        </div>
      )}
    </>
  )
}