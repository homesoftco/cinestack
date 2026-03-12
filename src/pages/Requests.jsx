import { useState } from 'react'

export default function Requests() {
  const [requests, setRequests] = useState([
    { id: 1, title: 'Dune: Part Two', type: 'Movie', status: 'downloading', progress: 72 },
    { id: 2, title: 'The Last of Us', type: 'TV Show', status: 'available', progress: 100 },
    { id: 3, title: 'Oppenheimer', type: 'Movie', status: 'pending', progress: 0 },
  ])

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

  return (
    <div style={{ paddingTop: '84px' }}>
      <div className="section">
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Requests</h1>
        <p style={{ color: '#b3b3b3', marginBottom: '32px' }}>Track the status of your requested content</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px' }}>
          {requests.map(req => (
            <div key={req.id} style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: '20px',
              border: '1px solid #2a2a2a',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1rem' }}>{req.title}</div>
                  <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '2px' }}>{req.type}</div>
                </div>
                <div style={{
                  color: statusColor[req.status],
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  background: `${statusColor[req.status]}22`,
                  padding: '4px 12px',
                  borderRadius: '20px',
                }}>
                  {statusLabel[req.status]}
                </div>
              </div>

              {req.status === 'downloading' && (
                <div>
                  <div style={{ height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${req.progress}%`,
                      background: '#f5a623',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '6px' }}>{req.progress}% complete</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
