import { useState } from 'react'
import { useTMDB, getPosterUrl } from '../hooks/useTMDB'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original'
const POSTER_BASE = 'https://image.tmdb.org/t/p/w342'

async function fetchBackdrop(showId) {
  const res = await fetch(`/api/tmdb/tv/${showId}/images`, {
  })
  const data = await res.json()
  const backdrops = data.backdrops || []
  const pool = backdrops.filter(b => b.iso_639_1 === null || b.iso_639_1 === 'en')
  if (pool.length === 0) return backdrops[0]?.file_path || null
  return pool[Math.floor(Math.random() * pool.length)].file_path
}

export default function TV() {
  const { data, loading } = useTMDB('/tv/popular')
  const [selected, setSelected] = useState(null)
  const [backdrop, setBackdrop] = useState(null)
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)

  const handleSelect = async (show) => {
    setSelected(show)
    setRequested(false)
    setBackdrop(null)
    const path = await fetchBackdrop(show.id)
    setBackdrop(path)
  }

  const handleRequest = async () => {
    if (!selected) return
    setRequesting(true)
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selected.name,
          type: 'tv',
          tmdb_id: selected.id,
          poster_path: selected.poster_path,
        })
      })
      setRequested(true)
    } catch (err) {
      console.error('Request failed:', err)
    } finally {
      setRequesting(false)
    }
  }

  const closeModal = () => {
    setSelected(null)
    setBackdrop(null)
    setRequested(false)
  }

  if (loading) return <div className="loading" style={{ paddingTop: '100px' }}>Loading TV Shows...</div>

  return (
    <div style={{ paddingTop: '84px' }}>
      <div className="section">
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '24px' }}>TV Shows</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {data?.results?.map(show => (
            <div key={show.id} className="card" onClick={() => handleSelect(show)}>
              {show.poster_path ? (
                <img src={getPosterUrl(show.poster_path)} alt={show.name} loading="lazy" />
              ) : (
                <div style={{ aspectRatio: '2/3', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', padding: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                  {show.name}
                </div>
              )}
              <div className="card-info">
                <div className="card-title">{show.name}</div>
                <div className="card-year">{show.first_air_date?.slice(0, 4)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          overflow: 'hidden',
          background: '#000',
        }}>
          {(backdrop || selected.backdrop_path) && (
            <img
              src={`${BACKDROP_BASE}${backdrop || selected.backdrop_path}`}
              alt={selected.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
          )}

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 45%)',
          }} />

          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >✕</button>

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 48px',
            display: 'flex',
            gap: '28px',
            alignItems: 'flex-end',
          }}>
            {selected.poster_path && (
              <img
                src={`${POSTER_BASE}${selected.poster_path}`}
                alt={selected.name}
                style={{
                  width: '110px',
                  borderRadius: '8px',
                  flexShrink: 0,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                }}
              />
            )}

            <div style={{ maxWidth: '520px' }}>
              <div style={{
                display: 'inline-block',
                background: '#1d4ed8',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '4px 12px',
                borderRadius: '20px',
                marginBottom: '12px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                📺 TV Show
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '900',
                lineHeight: '1.05',
                marginBottom: '10px',
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                letterSpacing: '-1px',
                color: '#fff',
              }}>
                {selected.name}
              </h1>

              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '14px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={{ color: '#f5a623', fontWeight: '700', fontSize: '1rem' }}>
                  ★ {selected.vote_average?.toFixed(1)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                  {selected.first_air_date?.slice(0, 4)}
                </span>
              </div>

              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '28px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textShadow: '0 1px 6px rgba(0,0,0,0.8)',
              }}>
                {selected.overview}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {requested ? (
                  <div style={{
                    background: '#27ae6022',
                    color: '#27ae60',
                    padding: '12px 28px',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    border: '1px solid #27ae60',
                  }}>
                    ✓ Requested
                  </div>
                ) : (
                  <button
                    onClick={handleRequest}
                    disabled={requesting}
                    style={{
                      background: '#1d4ed8',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '700',
                      opacity: requesting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    + Request
                  </button>
                )}
                <button
                  onClick={closeModal}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 28px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
