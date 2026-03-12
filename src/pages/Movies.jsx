import { useState } from 'react'
import { useTMDB, getPosterUrl } from '../hooks/useTMDB'

export default function Movies() {
  const { data, loading } = useTMDB('/movie/popular')
  const [genre, setGenre] = useState('all')

  if (loading) return <div className="loading" style={{ paddingTop: '100px' }}>Loading Movies...</div>

  return (
    <div style={{ paddingTop: '84px' }}>
      <div className="section">
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '24px' }}>Movies</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {data?.results?.map(movie => (
            <div key={movie.id} className="card">
              {movie.poster_path ? (
                <img src={getPosterUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
              ) : (
                <div style={{ aspectRatio: '2/3', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', padding: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                  {movie.title}
                </div>
              )}
              <div className="card-info">
                <div className="card-title">{movie.title}</div>
                <div className="card-year">{movie.release_date?.slice(0, 4)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
