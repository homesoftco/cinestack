import { useState } from 'react'
import { useMultiFetch, getPosterUrl, getBackdropUrl } from '../hooks/useTMDB'

function MediaCard({ item, onRequest }) {
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const poster = getPosterUrl(item.poster_path)

  return (
    <div className="card" onClick={() => onRequest(item)}>
      {poster ? (
        <img src={poster} alt={title} loading="lazy" />
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '2/3',
          background: '#2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.8rem',
          padding: '8px',
          textAlign: 'center',
        }}>
          {title}
        </div>
      )}
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-year">{year}</div>
      </div>
    </div>
  )
}

function RequestModal({ item, onClose, onConfirm }) {
  const title = item.title || item.name
  const overview = item.overview
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const backdrop = getBackdropUrl(item.backdrop_path)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {backdrop && (
          <img
            src={backdrop}
            alt={title}
            style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '16px',
              objectFit: 'cover',
              height: '180px',
            }}
          />
        )}
        <h2>{title} {year && <span style={{ color: '#666', fontWeight: 400, fontSize: '1rem' }}>({year})</span>}</h2>
        <p style={{ marginTop: '8px' }}>{overview}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => { onConfirm(item); onClose() }}>
            + Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [requested, setRequested] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  const { results, loading } = useMultiFetch([
    '/movie/popular',
    '/movie/top_rated',
    '/trending/all/week',
    '/tv/popular',
    '/movie/now_playing',
  ])

  const handleRequest = (item) => {
    setSelectedItem(item)
  }

  const handleConfirm = (item) => {
    setRequested(prev => [...prev, item.id])
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '64px' }}>
        <div className="loading">Loading CineStack...</div>
      </div>
    )
  }

  const [popular, topRated, trending, tvPopular, nowPlaying] = results

  const hero = trending?.results?.[0]
  const heroBackdrop = getBackdropUrl(hero?.backdrop_path)
  const heroTitle = hero?.title || hero?.name
  const heroYear = (hero?.release_date || hero?.first_air_date || '').slice(0, 4)

  const rows = [
    { title: '🔥 Trending This Week', items: trending?.results },
    { title: '🎬 Popular Movies', items: popular?.results },
    { title: '⭐ Top Rated', items: topRated?.results },
    { title: '📺 Popular TV Shows', items: tvPopular?.results },
    { title: '🎭 Now Playing', items: nowPlaying?.results },
  ]

  return (
    <div style={{ paddingTop: '0' }}>
      {/* Hero Banner */}
      {hero && (
        <div style={{
          position: 'relative',
          height: '85vh',
          minHeight: '500px',
          overflow: 'hidden',
          marginBottom: '40px',
        }}>
          {heroBackdrop && (
            <img
              src={heroBackdrop}
              alt={heroTitle}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
          {/* Gradient overlays */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 40%)',
          }} />

          {/* Hero Content */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '40px',
            maxWidth: '500px',
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#1d4ed8',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Trending Now
            </div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              lineHeight: 1.1,
              marginBottom: '16px',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              {heroTitle}
            </h1>
            {heroYear && (
              <div style={{ color: '#b3b3b3', marginBottom: '12px', fontSize: '0.95rem' }}>
                {heroYear}
              </div>
            )}
            <p style={{
              color: '#b3b3b3',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {hero.overview}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary">▶ Play</button>
              <button
                className="btn btn-secondary"
                onClick={() => handleRequest(hero)}
              >
                + Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows */}
      {rows.map(row => (
        <div key={row.title} className="section">
          <div className="section-title">{row.title}</div>
          <div className="card-row">
            {row.items?.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onRequest={handleRequest}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Request Modal */}
      {selectedItem && (
        <RequestModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
