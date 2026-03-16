# CineStack

> One interface. Every piece of your media stack. Zero compromise.

CineStack replaces Sonarr, Radarr, Prowlarr, Jellyseerr, and Jellyfin with a single unified application built for people who refuse to accept that self-hosted media has to feel like a homelab project.

**Browse → Request → Download → Watch. That's it.**

---

## Why CineStack Exists

The self-hosted media community solved the hard problems years ago. Transcoding, automation, indexer management — all solved. What nobody solved was the experience of actually using it every day.

Five separate apps. Five logins. Five ports. Five configuration systems. Five points of failure.

CineStack is the answer to a simple question: why does your personal media server feel like infrastructure and not a streaming service?

---

## Live Demo

Try it now at **[cinestack.app](https://cinestack.app)**

The demo runs the real app with placeholder data — no login required.

---

## What's Built

| Feature | Status |
|---|---|
| Clean, modern browsing UI | ✅ Live |
| TMDB-powered discovery (movies + TV) | ✅ Live |
| Jellyseerr-style request system | ✅ Live |
| Real-time download queue with progress | ✅ Live |
| Sonarr integration (TV automation) | ✅ Live |
| Radarr integration (movie automation) | ✅ Live |
| Prowlarr integration (indexer management) | ✅ Live |
| Jellyfin integration (Watch Now) | ✅ Live |
| JWT authentication + user profiles | ✅ Live |
| DB-backed settings (all integrations) | ✅ Live |
| Light/dark theme toggle | ✅ Live |
| **Seedbox SFTP auto-transfer** | ✅ Live |
| Single Docker Compose deployment | ✅ Live |
| Waitlist landing page | ✅ Live |
| Real Radarr/Sonarr queue polling | ⏭️ Phase 3 |
| Multiple user accounts | ⏭️ Phase 3 |
| Native mobile app (iOS + Android) | ⏭️ Phase 3 |
| Push notifications | ⏭️ Phase 3 |
| Parental controls + PIN profiles | ⏭️ Phase 3 |

---

## Pricing

CineStack is free and open source for solo self-hosters. Pro features are unlocked via a license key — no subscription required.

| Tier | Price | For |
|---|---|---|
| **Free** | $0 forever | Solo self-hosters |
| **Annual** | $49/year | Anyone sharing with family or friends |
| **Lifetime** | $149 one-time | Everything in Annual + early access + direct support + GitHub sponsors credit |

License keys are delivered instantly via [Lemon Squeezy](https://lemonsqueezy.com). No servers to run — you self-host, we sell software.

**The pitch:** *Free for yourself. Pro for everyone you share it with.*

---

## Tech Stack

### Frontend
- React + Vite
- react-router-dom
- TMDB API for metadata
- Custom dark cinematic UI (Outfit font, `#1d4ed8` accent)

### Backend
- Node.js + Express
- PostgreSQL 16
- JWT authentication (bcryptjs + jsonwebtoken)
- PM2 process management
- `ssh2-sftp-client` for seedbox SFTP transfers

### Infrastructure
- Nginx reverse proxy
- Cloudflare DNS + SSL (Flexible)
- Docker + Docker Compose
- Deployed on Hetzner Cloud (CPX42 — 8 vCPU, 16GB RAM)

### Integrations
- Sonarr API v3
- Radarr API v3
- Prowlarr API v1
- Jellyfin API
- Listmonk (waitlist email)
- Lemon Squeezy (payments + license keys — Phase 4)

---

## Architecture

```
User Browser
     │
     ▼
Cloudflare (SSL + DDoS)
     │
     ▼
Nginx (reverse proxy)
     │
     ├──▶ /api/* ──▶ Express API (PM2) ──▶ PostgreSQL
     │                    │
     │                    ├──▶ Sonarr  (TV automation)
     │                    ├──▶ Radarr  (movie automation)
     │                    ├──▶ Prowlarr (indexer management)
     │                    ├──▶ Jellyfin (playback / Watch Now)
     │                    └──▶ Seedbox  (SFTP auto-transfer)
     │
     └──▶ /* ──▶ React + Vite (dist)
```

---

## Getting Started (Self-Hosted)

### Prerequisites

- Ubuntu 22.04 / 24.04
- Node.js 20+
- PostgreSQL 16
- Docker + Docker Compose
- Nginx
- PM2

### 1. Clone the repos

```bash
git clone https://github.com/csaul253-blip/cinestack.git
git clone https://github.com/csaul253-blip/cinestack-api.git
```

### 2. Configure environment

**Frontend** (`cinestack/.env`):
```
VITE_TMDB_TOKEN=your_tmdb_read_access_token
```

**API** (`cinestack-api/.env`):
```
PORT=3004
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinestack
DB_USER=cinestack
DB_PASSWORD=your_db_password
RADARR_URL=http://localhost:7879
RADARR_API_KEY=your_radarr_api_key
SONARR_URL=http://localhost:8990
SONARR_API_KEY=your_sonarr_api_key
PROWLARR_URL=http://localhost:9696
PROWLARR_API_KEY=your_prowlarr_api_key
JWT_SECRET=your_strong_random_secret
JELLYFIN_URL=https://your-jellyfin-url
JELLYFIN_API_KEY=your_jellyfin_api_key
```

> ⚠️ Generate a strong JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
> **Do not change JWT_SECRET after first run** — seedbox passwords are encrypted using a key derived from it.

### 3. Set up the database

```bash
sudo -u postgres psql
CREATE DATABASE cinestack;
CREATE USER cinestack WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cinestack TO cinestack;
ALTER DATABASE cinestack OWNER TO cinestack;
\q
```

```sql
-- Run in the cinestack database
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  display_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  tmdb_id INTEGER,
  poster_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  speed VARCHAR(50),
  eta VARCHAR(50),
  file_size VARCHAR(50),
  tmdb_id INTEGER,
  poster_path VARCHAR(255),
  request_id INTEGER REFERENCES requests(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cinestack;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cinestack;
```

### 4. Start the media stack

```bash
cd cinestack-media && docker compose up -d
```

### 5. Build and start

```bash
# API
cd cinestack-api && npm install
pm2 start index.js --name cinestack-api
pm2 save && pm2 startup

# Frontend
cd cinestack && npm install && npm run build
```

### 6. Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /path/to/cinestack/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 7. Verify

```bash
curl https://your-domain.com/api/health
# {"status":"ok","database":"connected","radarr":"connected","sonarr":"connected"}
```

---

## Seedbox SFTP Auto-Transfer (Pro)

CineStack Pro automates the most painful step in the seedbox workflow — transferring completed files from your remote seedbox to your local media folder.

**Before CineStack:** Radarr/Sonarr → seedbox downloads → you manually SFTP files home → Jellyfin picks up.

**With CineStack Pro:** Radarr/Sonarr → seedbox downloads → CineStack auto-transfers → Jellyfin library scan fires → Watch Now lights up. You do nothing.

Configure it in Settings → Integrations → Seedbox SFTP Auto-Transfer. Password is encrypted at rest with AES-256-GCM.

---

## Roadmap

### Phase 1 — Foundation ✅ Complete
Unified UI, TMDB integration, request system, download queue, Sonarr/Radarr/Prowlarr integration.

### Phase 2 — Backend ✅ Complete
JWT auth, Jellyfin integration, DB-backed settings, profile page, light/dark theme, seedbox SFTP auto-transfer, Dockerfiles, unified Docker Compose.

### Phase 3 — Polish + Pro Groundwork
Real Radarr/Sonarr queue polling, multiple user accounts, license key system, native mobile app (Capacitor), push notifications, parental controls, PIN profiles, admin dashboard, onboarding wizard.

### Phase 4 — Monetization
Wyoming LLC, Lemon Squeezy (Annual $49/yr + Lifetime $149), DMCA agent registration, ProductHunt launch.

---

## Legal

CineStack is software only. It does not host, store, stream, or distribute any media content. Users bring their own download clients, storage, and media. What users do with the software is their own responsibility — the same legal position as Sonarr, Radarr, Plex, and Jellyfin.

---

## License

MIT

---

Built by [@csaul253-blip](https://github.com/csaul253-blip)
