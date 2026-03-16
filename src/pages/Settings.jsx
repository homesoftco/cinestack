import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { token } = useAuth()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    torrentUrl: '',
    torrentApiKey: '',
    radarrUrl: '',
    radarrApiKey: '',
    sonarrUrl: '',
    sonarrApiKey: '',
    prowlarrUrl: '',
    prowlarrApiKey: '',
    storagePath: '',
    transcoding: 'direct',
    theme: 'dark',
  })
const [seedbox, setSeedbox] = useState({
    enabled:    false,
    host:       '',
    port:       '22',
    username:   '',
    password:   '',
    remotePath: '',
    localPath:  '/mnt/media',
  })
  const [seedboxSaving,    setSeedboxSaving]    = useState(false)
  const [seedboxSaved,     setSeedboxSaved]     = useState(false)
  const [seedboxTesting,   setSeedboxTesting]   = useState(false)
  const [seedboxTestResult,setSeedboxTestResult]= useState(null)

  useEffect(() => {
    fetch('/api/settings', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setForm(prev => ({ ...prev, ...data }))
        if (data.theme) applyTheme(data.theme)
      })
      .catch(() => {})
      .finally(() => setLoading(false))

      fetch('/api/settings/seedbox', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setSeedbox(data))
      .catch(() => {})
  }, [])

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cinestack_theme', theme)
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      applyTheme(form.theme)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    color: '#b3b3b3',
    marginBottom: '6px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  }

  const sectionHeaderStyle = {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#b3b3b3',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '16px',
  }

  const cardStyle = {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '12px',
  }

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  }

  const dividerStyle = {
    borderTop: '1px solid #1f1f1f',
    margin: '32px 0',
  }

  const optionCardStyle = (selected) => ({
    flex: 1,
    background: selected ? '#1d4ed822' : '#111',
    border: `1px solid ${selected ? '#1d4ed8' : '#2a2a2a'}`,
    borderRadius: '8px',
    padding: '14px 18px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  })

  if (loading) return <div className="loading" style={{ paddingTop: '100px' }}>Loading settings...</div>

  return (
    <div style={{ paddingTop: '84px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '6px' }}>Settings</h1>
          <p style={{ color: '#b3b3b3', fontSize: '0.95rem' }}>Configure your CineStack installation.</p>
        </div>

        {/* ─── Integrations ─────────────────────────────── */}
        <div style={sectionHeaderStyle}>Integrations</div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Torrent Provider</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>qBittorrent, Transmission, Deluge, etc.</div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Client URL</label>
              <input name="torrentUrl" value={form.torrentUrl} onChange={handleChange}
                placeholder="http://localhost:8080" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>API Key</label>
              <input name="torrentApiKey" value={form.torrentApiKey} onChange={handleChange}
                placeholder="••••••••••••" type="password" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Radarr</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Movie collection manager.</div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Radarr URL</label>
              <input name="radarrUrl" value={form.radarrUrl} onChange={handleChange}
                placeholder="http://localhost:7878" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>API Key</label>
              <input name="radarrApiKey" value={form.radarrApiKey} onChange={handleChange}
                placeholder="••••••••••••" type="password" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Sonarr</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>TV series collection manager.</div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Sonarr URL</label>
              <input name="sonarrUrl" value={form.sonarrUrl} onChange={handleChange}
                placeholder="http://localhost:8989" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>API Key</label>
              <input name="sonarrApiKey" value={form.sonarrApiKey} onChange={handleChange}
                placeholder="••••••••••••" type="password" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Prowlarr</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Indexer manager for Radarr and Sonarr.</div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Prowlarr URL</label>
              <input name="prowlarrUrl" value={form.prowlarrUrl} onChange={handleChange}
                placeholder="http://localhost:9696" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>API Key</label>
              <input name="prowlarrApiKey" value={form.prowlarrApiKey} onChange={handleChange}
                placeholder="••••••••••••" type="password" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Seedbox Auto-Transfer</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>
              CineStack will watch your seedbox for completed files and transfer them to your media folder automatically.
            </div>
          </div>

          {/* Enable toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <label style={{ ...labelStyle, margin: 0 }}>Enable Auto-Transfer</label>
            <div
              onClick={() => setSeedbox(s => ({ ...s, enabled: !s.enabled }))}
              style={{
                width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                background: seedbox.enabled ? '#1d4ed8' : '#333',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: seedbox.enabled ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </div>
          </div>

          {seedbox.enabled && (
            <>
              <div style={{ ...rowStyle, marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Seedbox Host</label>
                  <input style={inputStyle} placeholder="seedbox.example.com"
                    value={seedbox.host}
                    onChange={e => setSeedbox(s => ({ ...s, host: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Port</label>
                  <input style={inputStyle} placeholder="22" value={seedbox.port}
                    onChange={e => setSeedbox(s => ({ ...s, port: e.target.value }))} />
                </div>
              </div>

              <div style={{ ...rowStyle, marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Username</label>
                  <input style={inputStyle} placeholder="your username"
                    value={seedbox.username}
                    onChange={e => setSeedbox(s => ({ ...s, username: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type="password" placeholder="••••••••"
                    value={seedbox.password}
                    onChange={e => setSeedbox(s => ({ ...s, password: e.target.value }))} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Remote Path <span style={{ color: '#666', textTransform: 'none', fontWeight: '400' }}>— where completed files land on your seedbox</span></label>
                <input style={inputStyle} placeholder="/downloads/complete"
                  value={seedbox.remotePath}
                  onChange={e => setSeedbox(s => ({ ...s, remotePath: e.target.value }))} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Local Destination <span style={{ color: '#666', textTransform: 'none', fontWeight: '400' }}>— Jellyfin watches this folder</span></label>
                <input style={inputStyle} placeholder="/mnt/media"
                  value={seedbox.localPath}
                  onChange={e => setSeedbox(s => ({ ...s, localPath: e.target.value }))} />
              </div>

              {/* Test connection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <button
                  disabled={seedboxTesting || !seedbox.host || !seedbox.username}
                  onClick={async () => {
                    setSeedboxTesting(true)
                    setSeedboxTestResult(null)
                    try {
                      const res = await fetch('/api/seedbox/test', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(seedbox),
                      })
                      setSeedboxTestResult(await res.json())
                    } catch (err) {
                      setSeedboxTestResult({ ok: false, error: err.message })
                    } finally {
                      setSeedboxTesting(false)
                    }
                  }}
                  style={{
                    background: '#1a1a1a', color: '#fff', border: '1px solid #2a2a2a',
                    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: '600', opacity: seedboxTesting ? 0.6 : 1,
                  }}
                >
                  {seedboxTesting ? 'Testing…' : 'Test Connection'}
                </button>
                {seedboxTestResult && (
                  <span style={{ fontSize: '0.88rem', fontWeight: '600', color: seedboxTestResult.ok ? '#27ae60' : '#dc2626' }}>
                    {seedboxTestResult.ok
                      ? `✓ Connected — ${seedboxTestResult.files} file(s) in remote path`
                      : `✗ ${seedboxTestResult.error}`}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Save seedbox settings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              disabled={seedboxSaving}
              onClick={async () => {
                setSeedboxSaving(true)
                setSeedboxSaved(false)
                try {
                  await fetch('/api/settings/seedbox', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(seedbox),
                  })
                  setSeedboxSaved(true)
                  setTimeout(() => setSeedboxSaved(false), 3000)
                } catch (err) {
                  console.error('Failed to save seedbox settings:', err)
                } finally {
                  setSeedboxSaving(false)
                }
              }}
              style={{
                background: '#1d4ed8', color: '#fff', border: 'none',
                padding: '12px 36px', borderRadius: '6px', cursor: 'pointer',
                fontSize: '1rem', fontWeight: '700', opacity: seedboxSaving ? 0.6 : 1,
              }}
            >
              {seedboxSaving ? 'Saving…' : seedboxSaved ? '✓ Saved' : 'Save Seedbox Settings'}
            </button>
          </div>
        </div>
              <div style={dividerStyle} />

        {/* ─── Storage ──────────────────────────────────── */}
        <div style={sectionHeaderStyle}>Storage</div>
        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Media Storage Path</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Where your media files are stored on disk.</div>
          </div>
          <div>
            <label style={labelStyle}>Storage Path</label>
            <input name="storagePath" value={form.storagePath} onChange={handleChange}
              placeholder="/mnt/media" style={inputStyle} />
          </div>
        </div>

        <div style={dividerStyle} />

        {/* ─── Playback ─────────────────────────────────── */}
        <div style={sectionHeaderStyle}>Playback</div>
        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Transcoding Preference</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>
              Direct Play uses zero CPU. Transcoding converts on the fly but strains your server.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={optionCardStyle(form.transcoding === 'direct')}
              onClick={() => { setForm(p => ({ ...p, transcoding: 'direct' })); setSaved(false) }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px', color: form.transcoding === 'direct' ? '#fff' : '#b3b3b3' }}>
                Direct Play
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Device plays natively. No CPU load.</div>
            </div>
            <div style={optionCardStyle(form.transcoding === 'transcode')}
              onClick={() => { setForm(p => ({ ...p, transcoding: 'transcode' })); setSaved(false) }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px', color: form.transcoding === 'transcode' ? '#fff' : '#b3b3b3' }}>
                Transcode if Needed
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Converts for compatibility. Higher CPU.</div>
            </div>
          </div>
        </div>

        <div style={dividerStyle} />

        {/* ─── Appearance ───────────────────────────────── */}
        <div style={sectionHeaderStyle}>Appearance</div>
        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Theme</div>
            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Choose your preferred interface theme.</div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={optionCardStyle(form.theme === 'dark')}
              onClick={() => { setForm(p => ({ ...p, theme: 'dark' })); setSaved(false) }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px', color: form.theme === 'dark' ? '#fff' : '#b3b3b3' }}>
                🌙 Dark
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Easy on the eyes.</div>
            </div>
            <div style={optionCardStyle(form.theme === 'light')}
              onClick={() => { setForm(p => ({ ...p, theme: 'light' })); setSaved(false) }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px', color: form.theme === 'light' ? '#fff' : '#b3b3b3' }}>
                ☀️ Light
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>For the brave.</div>
            </div>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleSave} style={{
            background: '#1d4ed8', color: '#fff', border: 'none',
            padding: '12px 36px', borderRadius: '6px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: '700',
          }}>
            Save Settings
          </button>
          {saved && <span style={{ color: '#27ae60', fontWeight: '600', fontSize: '0.95rem' }}>✓ Saved</span>}
        </div>

      </div>
    </div>
  )
}
