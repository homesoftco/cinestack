import { useState, useEffect } from 'react'
import axios from 'axios'
import { getPosterUrl, getBackdropUrl } from '../hooks/useTMDB'

const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  'Content-Type': 'application/json',
}

const statusColor = {
  downloading: '#f5a623',
  available: '#27ae60',
  pending: '#dc2626',
}
const statusLabel = {
  downloading: 'Downloading',
  available: '✓ Available',
  pending: 'Pending',
}

function MediaCard({ item, onClick }) {
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const poster = item.poster_path ? `${IMG_BASE}/w342${item.poster_path}` : null

  return (
    <div className="card" onClick={() => onClick(item)}>
      {poster ? (
        <img src={poster} alt={title} loading="lazy" />
      ) : (
        <div style={{
          width: '100%', aspectRatio: '2/3', background: '#2a2a2a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#666', fontSize: '0.8rem', padding: '8px', textAlign: 'center',
        }}>{title}</div>
      )}
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-year">{year}</div>
      </div>
    </div>
  )
}

function DetailModal({ item, onClose, onRequest, existingRequests }) {
  const [details, setDetails] = useState(null)
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const backdrop = item.backdrop_path ? `${IMG_BASE}/w1280${item.backdrop_path}` : null
  const poster = item.poster_path ? `${IMG_BASE}/w342${item.poster_path}` : null
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv')
  const isRequested = existingRequests.some(r => r.tmdb_id === item.id)
  const existingRequest = existingRequests.find(r => r.tmdb_id === item.id)

  useEffect(() => {
    axios.get(`${BASE_URL}/${mediaType}/${item.id}`, { headers })
      .then(res => setDetails(res.data))
      .catch(() => {})
  }, [item.id, mediaType])

  const rating = item.vote_average ? item.vote_average.toFixed(1) : null
  const overview = item.overview
  const genres = details?.genres?.slice(0, 3) || []
  const runtime = details?.runtime
  const seasons = details?.number_of_seasons

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{
        background: '#141414', borderRadius: '12px', maxWidth: '600px',
        width: '100%', border: '1px solid #2a2a2a', overflow: 'hidden',
        maxHeight: '90vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Backdrop */}
        {backdrop && (
          <div style={{ position: 'relative', height: '220px' }}>
            <img src={backdrop} alt={title} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #141414 0%, transparent 60%)',
            }} />
            <button onClick={onClose} style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', color: '#fff', cursor: 'pointer',
              fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        )}

        <div style={{ padding: '24px', display: 'flex', gap: '20px' }}>
          {/* Poster */}
          {poster && (
            <img src={poster} alt={title} style={{
              width: '100px', borderRadius: '8px', flexShrink: 0,
              marginTop: backdrop ? '-60px' : '0', position: 'relative',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }} />
          )}

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>
              {title} {year && <span style={{ color: '#666', fontWeight: 400, fontSize: '1rem' }}>({year})</span>}
            </h2>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
              {rating && (
                <span style={{ color: '#f5a623', fontSize: '0.9rem', fontWeight: '600' }}>
                  ★ {rating}/10
                </span>
              )}
              {runtime && (
                <span style={{ color: '#666', fontSize: '0.85rem' }}>{runtime} min</span>
              )}
              {seasons && (
                <span style={{ color: '#666', fontSize: '0.85rem' }}>{seasons} season{seasons > 1 ? 's' : ''}</span>
              )}
              <span style={{
                background: '#2a2a2a', color: '#b3b3b3', fontSize: '0.75rem',
                padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase',
              }}>
                {mediaType === 'tv' ? 'TV Show' : 'Movie'}
              </span>
            </div>

            {genres.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {genres.map(g => (
                  <span key={g.id} style={{
                    background: '#1d4ed822', color: '#1d4ed8', fontSize: '0.75rem',
                    padding: '2px 10px', borderRadius: '20px', border: '1px solid #1d4ed844',
                  }}>{g.name}</span>
                ))}
              </div>
            )}

            <p style={{ color: '#b3b3b3', fontSize: '0.9rem', lineHeight: 1.6 }}>{overview}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {isRequested ? (
            <button className="btn" style={{
              background: `${statusColor[existingRequest?.status]}22`,
              color: statusColor[existingRequest?.status],
              border: `1px solid ${statusColor[existingRequest?.status]}44`,
              cursor: 'default',
            }}>
              {statusLabel[existingRequest?.status]}
            </button>
          ) : (
            <button className="btn btn-accent" onClick={() => {
              onRequest(item, mediaType)
              onClose()
            }}>
              + Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Requests() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [myRequests, setMyRequests] = useState([])
  const [searching, setSearching] = useState(false)

  // Load popular content on mount
  useEffect(() => {
    axios.get(`${BASE_URL}/movie/popular`, { headers })
      .then(res => setPopularMovies(res.data.results.slice(0, 18)))
    axios.get(`${BASE_URL}/tv/popular`, { headers })
      .then(res => setPopularTV(res.data.results.slice(0, 18)))
  }, [])

  // Load existing requests from backend
  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => setMyRequests(data))
      .catch(err => console.error('Failed to fetch requests:', err))
  }, [])

  const handleSearch = () => {
    if (!query.trim()) { setSearchResults([]); return }
    setSearching(true)
    axios.get(`${BASE_URL}/search/multi`, { headers, params: { query } })
      .then(res => {
        setSearchResults(res.data.results.filter(r => r.poster_path && (r.media_type === 'movie' || r.media_type === 'tv')))
        setSearching(false)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleRequest = async (item, mediaType) => {
    const title = item.title || item.name
    const type = mediaType === 'tv' ? 'TV Show' : 'Movie'
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, tmdb_id: item.id, poster_path: item.poster_path }),
      })
      const newRequest = await res.json()
      setMyRequests(prev => [newRequest, ...prev])
    } catch (err) {
      console.error('Failed to create request:', err)
    }
  }

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/requests/${id}`, { method: 'DELETE' })
      setMyRequests(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error('Failed to remove request:', err)
    }
  }

  const displayGrid = searchResults.length > 0 ? searchResults : [...popularMovies, ...popularTV]

  return (
    <div style={{ paddingTop: '84px' }}>

      {/* Search Bar */}
      <div className="section">
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Discover & Request</h1>
        <p style={{ color: '#b3b3b3', marginBottom: '24px' }}>Search for any movie or TV show to request it</p>
        <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', marginBottom: '32px' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, TV shows..."
            style={{
              flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '8px', padding: '12px 16px', color: '#fff',
              fontSize: '1rem', outline: 'none',
            }}
          />
          <button className="btn btn-accent" onClick={handleSearch}>
            {searching ? '...' : 'Search'}
          </button>
          {searchResults.length > 0 && (
            <button className="btn btn-secondary" onClick={() => { setSearchResults([]); setQuery('') }}>
              Clear
            </button>
          )}
        </div>

        {/* Discovery Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {displayGrid.map(item => (
            <MediaCard key={`${item.id}-${item.media_type}`} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      </div>

      {/* My Requests Section */}
      {myRequests.length > 0 && (
        <div className="section">
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>My Requests</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px' }}>
            {myRequests.map(req => (
              <div key={req.id} style={{
                background: '#1a1a1a', borderRadius: '10px', padding: '16px',
                border: '1px solid #2a2a2a', display: 'flex', gap: '16px', alignItems: 'center',
              }}>
                {req.poster_path && (
                  <img
                    src={`${IMG_BASE}/w92${req.poster_path}`}
                    alt={req.title}
                    style={{ width: '46px', borderRadius: '4px', flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{req.title}</div>
                  <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>{req.type}</div>
                  {req.status === 'downloading' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ height: '3px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${req.progress}%`,
                          background: '#f5a623', borderRadius: '2px', transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>{req.progress}% complete</div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    color: statusColor[req.status], fontSize: '0.8rem', fontWeight: '600',
                    background: `${statusColor[req.status]}22`, padding: '4px 10px', borderRadius: '20px',
                  }}>
                    {statusLabel[req.status]}
                  </span>
                  {req.status === 'available' && (
                    <button className="btn btn-accent" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      Watch
                    </button>
                  )}
                  <button onClick={() => handleRemove(req.id)} style={{
                    background: 'none', border: 'none', color: '#666', cursor: 'pointer',
                    fontSize: '1rem', padding: '4px',
                  }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRequest={handleRequest}
          existingRequests={myRequests}
        />
      )}
    </div>
  )
}
