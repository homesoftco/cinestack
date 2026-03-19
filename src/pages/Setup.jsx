import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
  width: '100%', padding: '12px', background: '#1a1a1a',
  border: '1px solid #333', borderRadius: '8px', color: '#fff',
  fontSize: '16px', boxSizing: 'border-box',
};
const labelStyle = { color: '#b3b3b3', fontSize: '14px', display: 'block', marginBottom: '8px' };
const fieldWrap = { marginBottom: '16px' };
const primaryBtn = (disabled) => ({
  width: '100%', padding: '14px', background: '#1d4ed8',
  border: 'none', borderRadius: '8px', color: '#fff',
  fontSize: '16px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1, marginTop: '8px',
});
const errorBox = {
  background: '#dc262620', border: '1px solid #dc2626',
  borderRadius: '8px', padding: '12px', marginBottom: '20px',
  color: '#dc2626', fontSize: '14px',
};
const successBox = {
  background: '#27ae6020', border: '1px solid #27ae60',
  borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
  color: '#27ae60', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
};

export default function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 7;

  // Step 2
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authToken, setAuthToken] = useState(null);

  // Step 3 — Radarr
  const [radarrUrl, setRadarrUrl] = useState('http://localhost:7878');
  const [radarrKey, setRadarrKey] = useState('');
  const [radarrOk, setRadarrOk] = useState(false);

  // Step 4 — Sonarr
  const [sonarrUrl, setSonarrUrl] = useState('http://localhost:8989');
  const [sonarrKey, setSonarrKey] = useState('');
  const [sonarrOk, setSonarrOk] = useState(false);

  // Step 5 — Prowlarr
  const [prowlarrUrl, setProwlarrUrl] = useState('http://localhost:9696');
  const [prowlarrKey, setProwlarrKey] = useState('');
  const [prowlarrOk, setProwlarrOk] = useState(false);

  // Step 6 — Jellyfin
  const [jellyfinUrl, setJellyfinUrl] = useState('');
  const [jellyfinKey, setJellyfinKey] = useState('');
  const [jellyfinOk, setJellyfinOk] = useState(false);
  const [jellyfinSkipped, setJellyfinSkipped] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testStatus, setTestStatus] = useState(''); // 'testing' | 'ok' | 'fail'
  const [testError, setTestError] = useState('');

  // If setup already complete, redirect to app
  useEffect(() => {
    fetch('/api/setup/status')
      .then(r => r.json())
      .then(d => { if (d.complete) navigate('/app'); });
  }, []);

  // Reset test state when connection fields change
  useEffect(() => { setRadarrOk(false); setTestStatus(''); setTestError(''); }, [radarrUrl, radarrKey]);
  useEffect(() => { setSonarrOk(false); setTestStatus(''); setTestError(''); }, [sonarrUrl, sonarrKey]);
  useEffect(() => { setProwlarrOk(false); setTestStatus(''); setTestError(''); }, [prowlarrUrl, prowlarrKey]);
  useEffect(() => { setJellyfinOk(false); setTestStatus(''); setTestError(''); }, [jellyfinUrl, jellyfinKey]);

  async function testConnection(type, url, apiKey) {
    setTestStatus('testing');
    setTestError('');
    const res = await fetch('/api/setup/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, url, apiKey }),
    });
    const data = await res.json();
    if (data.success) {
      setTestStatus('ok');
      return true;
    } else {
      setTestStatus('fail');
      setTestError(data.error || 'Connection failed');
      return false;
    }
  }

  async function saveSettings(obj) {
    await fetch('/api/setup/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    });
  }

  // Step handlers
  async function handleRegister() {
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName, email, password, role: 'admin' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setAuthToken(data.token);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRadarrNext() {
    await saveSettings({ radarr_url: radarrUrl, radarr_api_key: radarrKey });
    setStep(4);
  }

  async function handleSonarrNext() {
    await saveSettings({ sonarr_url: sonarrUrl, sonarr_api_key: sonarrKey });
    setStep(5);
  }

  async function handleProwlarrNext() {
    await saveSettings({ prowlarr_url: prowlarrUrl, prowlarr_api_key: prowlarrKey });
    setStep(6);
  }

  async function handleJellyfinNext() {
    if (!jellyfinSkipped && jellyfinUrl) {
      await saveSettings({ jellyfin_url: jellyfinUrl, jellyfin_api_key: jellyfinKey });
    }
    setStep(7);
  }

  async function handleTestJellyfin() {
    setTestStatus('testing');
    setTestError('');
    try {
      const res = await fetch(`${jellyfinUrl}/System/Info/Public`);
      if (res.ok) {
        setTestStatus('ok');
        setJellyfinOk(true);
      } else {
        setTestStatus('fail');
        setTestError(`HTTP ${res.status} — check your Jellyfin URL`);
      }
    } catch {
      setTestStatus('fail');
      setTestError('Could not reach Jellyfin — is it running?');
    }
  }

  // Step 7 mount — mark setup complete
  useEffect(() => {
    if (step === 7) {
      fetch('/api/setup/complete', { method: 'POST' });
    }
  }, [step]);

  function handleGoToApp() {
    localStorage.setItem('token', authToken);
    navigate('/app');
  }

  // ─── Progress Dots ───────────────────────────────────────────────────────────
  function ProgressDots() {
    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} style={{
            width: i + 1 === step ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: i + 1 < step ? '#1d4ed8' : i + 1 === step ? '#1d4ed8' : '#333',
            transition: 'all 0.3s ease',
            opacity: i + 1 < step ? 0.5 : 1,
          }} />
        ))}
      </div>
    );
  }

  // ─── Shared connection step renderer ────────────────────────────────────────
  function ConnectionStep({ title, subtitle, type, url, setUrl, apiKey, setApiKey, settingsPath, ok, setOk, onNext }) {
    return (
      <>
        <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '8px' }}>{title}</h2>
        <p style={{ color: '#b3b3b3', fontSize: '14px', marginBottom: '24px' }}>{subtitle}</p>

        <div style={fieldWrap}>
          <label style={labelStyle}>{title.split(' ')[1]} URL</label>
          <input style={inputStyle} value={url} onChange={e => setUrl(e.target.value)} />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>
            API Key —{' '}
            <a href={`${url}/settings/general`} target="_blank" rel="noreferrer"
              style={{ color: '#1d4ed8', textDecoration: 'none' }}>
              Find it in {title.split(' ')[1]} → Settings → General
            </a>
          </label>
          <input style={inputStyle} value={apiKey} onChange={e => setApiKey(e.target.value)}
            placeholder="Paste your API key" />
        </div>

        {testStatus === 'ok' && ok && (
          <div style={successBox}>✓ Connected successfully</div>
        )}
        {testStatus === 'fail' && (
          <div style={errorBox}>{testError}</div>
        )}

        <button
          onClick={async () => {
            const result = await testConnection(type, url, apiKey);
            if (result) setOk(true);
          }}
          disabled={!url || !apiKey || testStatus === 'testing'}
          style={{ ...primaryBtn(!url || !apiKey), background: '#2a2a2a', marginBottom: '8px' }}
        >
          {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>

        <button onClick={onNext} disabled={!ok} style={primaryBtn(!ok)}>
          Next
        </button>
      </>
    );
  }

  // ─── Card wrapper ────────────────────────────────────────────────────────────
  const card = (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#141414', borderRadius: '12px', padding: '48px',
        width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <h1 style={{ fontSize: '22px', marginBottom: '32px' }}>
          <span style={{ color: '#1d4ed8' }}>Cine</span><span style={{ color: '#fff' }}>Stack</span>
        </h1>

        <ProgressDots />

        {/* ── Step 1 — Welcome ── */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '12px' }}>Welcome to CineStack</h2>
            <p style={{ color: '#b3b3b3', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
              Let's get you set up in a few minutes.
            </p>
            <button onClick={() => setStep(2)} style={primaryBtn(false)}>Get Started</button>
          </>
        )}

        {/* ── Step 2 — Create Admin Account ── */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '24px' }}>Create your admin account</h2>
            {error && <div style={errorBox}>{error}</div>}
            <div style={fieldWrap}>
              <label style={labelStyle}>Display Name</label>
              <input style={inputStyle} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button onClick={handleRegister} disabled={loading || !displayName || !email || !password || !confirmPassword} style={primaryBtn(loading || !displayName || !email || !password || !confirmPassword)}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </>
        )}

        {/* ── Step 3 — Radarr ── */}
        {step === 3 && (
          <ConnectionStep
            title="Connect Radarr" subtitle="Radarr manages your movie downloads."
            type="radarr" url={radarrUrl} setUrl={setRadarrUrl}
            apiKey={radarrKey} setApiKey={setRadarrKey}
            ok={radarrOk} setOk={setRadarrOk}
            onNext={handleRadarrNext}
          />
        )}

        {/* ── Step 4 — Sonarr ── */}
        {step === 4 && (
          <ConnectionStep
            title="Connect Sonarr" subtitle="Sonarr manages your TV show downloads."
            type="sonarr" url={sonarrUrl} setUrl={setSonarrUrl}
            apiKey={sonarrKey} setApiKey={setSonarrKey}
            ok={sonarrOk} setOk={setSonarrOk}
            onNext={handleSonarrNext}
          />
        )}

        {/* ── Step 5 — Prowlarr ── */}
        {step === 5 && (
          <ConnectionStep
            title="Connect Prowlarr" subtitle="Prowlarr manages your indexers."
            type="prowlarr" url={prowlarrUrl} setUrl={setProwlarrUrl}
            apiKey={prowlarrKey} setApiKey={setProwlarrKey}
            ok={prowlarrOk} setOk={setProwlarrOk}
            onNext={handleProwlarrNext}
          />
        )}

        {/* ── Step 6 — Jellyfin (optional) ── */}
        {step === 6 && (
          <>
            <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '8px' }}>Connect Jellyfin <span style={{ color: '#666', fontSize: '16px' }}>(optional)</span></h2>
            <p style={{ color: '#b3b3b3', fontSize: '14px', marginBottom: '24px' }}>Skip this if you don't have Jellyfin set up yet.</p>

            <div style={fieldWrap}>
              <label style={labelStyle}>Jellyfin URL</label>
              <input style={inputStyle} value={jellyfinUrl} onChange={e => setJellyfinUrl(e.target.value)} placeholder="http://localhost:8096" />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>API Key</label>
              <input style={inputStyle} value={jellyfinKey} onChange={e => setJellyfinKey(e.target.value)} placeholder="Paste your API key" />
            </div>

            {testStatus === 'ok' && jellyfinOk && <div style={successBox}>✓ Connected successfully</div>}
            {testStatus === 'fail' && <div style={errorBox}>{testError}</div>}

            {jellyfinUrl && (
              <button
                onClick={handleTestJellyfin}
                disabled={testStatus === 'testing'}
                style={{ ...primaryBtn(testStatus === 'testing'), background: '#2a2a2a', marginBottom: '8px' }}
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
            )}

            <button
              onClick={handleJellyfinNext}
              disabled={jellyfinUrl ? !jellyfinOk : false}
              style={primaryBtn(jellyfinUrl ? !jellyfinOk : false)}
            >
              Next
            </button>

            <button
              onClick={() => { setJellyfinSkipped(true); setStep(7); }}
              style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', color: '#666', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
            >
              Skip for now
            </button>
          </>
        )}

        {/* ── Step 7 — Done ── */}
        {step === 7 && (
          <>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
              <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '12px' }}>You're all set.</h2>
              <p style={{ color: '#b3b3b3', fontSize: '16px', marginBottom: '32px' }}>CineStack is ready to go.</p>
              <button onClick={handleGoToApp} style={primaryBtn(false)}>Go to CineStack</button>
            </div>
          </>
        )}

      </div>
    </div>
  );

  return card;
}