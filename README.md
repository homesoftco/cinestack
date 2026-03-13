# CineStack

> One interface. Every piece of your media stack. Zero compromise.

CineStack replaces Sonarr, Radarr, Prowlarr, Jellyseerr, and Jellyfin with a single, unified application built for people who refuse to accept that self-hosted media has to feel like a homelab project.

**Browse → Request → Download → Watch.** That's it.

---

## Why CineStack Exists

The self-hosted media community solved the hard problems years ago. Transcoding, automation, indexer management — all solved. What nobody solved was the experience of actually using it every day.

Five separate apps. Five logins. Five ports. Five configuration systems. Five points of failure.

CineStack is the answer to a simple question: *why does your personal media server feel like infrastructure and not a streaming service?*

---

## What It Does

| Feature | Status |
|---|---|
| Netflix-quality browsing UI | ✅ Live |
| TMDB-powered discovery (movies + TV) | ✅ Live |
| Jellyseerr-style request system | ✅ Live |
| PostgreSQL-backed request tracking | ✅ Live |
| Real-time download queue with progress | ✅ Live |
| Sonarr integration (TV automation) | ✅ Live |
| Radarr integration (movie automation) | ✅ Live |
| Prowlarr integration (indexer management) | ✅ Live |
| User authentication (JWT) | 🔨 In Progress |
| Jellyfin integration (playback) | 🔨 In Progress |
| Single Docker Compose deployment | ⏭️ Planned |
| Mobile iOS/Android apps | ⏭️ Planned |

---

## Tech Stack

**Frontend**
- React + Vite
- TMDB API for metadata
- Custom dark cinematic UI

**Backend**
- Node.js + Express
- PostgreSQL
- PM2 process management

**Infrastructure**
- Nginx reverse proxy
- Cloudflare DNS + SSL
- Docker + Docker Compose
- Deployed on Hetzner Cloud (Nuremberg, DE)

**Integrations**
- Sonarr API v3
- Radarr API v3
- Prowlarr API v1

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
     │                    ├──▶ Sonarr (TV automation)
     │                    ├──▶ Radarr (Movie automation)
     │                    └──▶ Prowlarr (Indexer management)
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
```env
VITE_TMDB_TOKEN=your_tmdb_read_access_token
```

**API** (`cinestack-api/.env`):
```env
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
```

### 3. Set up the database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE cinestack;
CREATE USER cinestack WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cinestack TO cinestack;
ALTER DATABASE cinestack OWNER TO cinestack;
\q
```

```bash
sudo -u postgres psql -d cinestack
```

```sql
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  tmdb_id INTEGER,
  poster_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE downloads (
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

GRANT ALL PRIVILEGES ON TABLE requests TO cinestack;
GRANT ALL PRIVILEGES ON TABLE downloads TO cinestack;
GRANT USAGE, SELECT ON SEQUENCE requests_id_seq TO cinestack;
GRANT USAGE, SELECT ON SEQUENCE downloads_id_seq TO cinestack;
\q
```

### 4. Start the media stack

```bash
cd cinestack-media && docker compose up -d
```

### 5. Build and start

```bash
# Frontend
cd cinestack && npm install && npm run build

# API
cd cinestack-api && npm install
pm2 start index.js --name cinestack-api
pm2 save && pm2 startup
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

## Roadmap

**Phase 1 — Foundation** ✅ Complete
- Unified UI, TMDB integration, request system, download queue, Sonarr/Radarr/Prowlarr integration

**Phase 2 — Backend** 🔨 In Progress
- User authentication (JWT), Jellyfin integration, WebSocket download progress, single Docker Compose deployment

**Phase 3 — Polish**
- Mobile responsive design, user profiles with PIN protection, parental controls, notification system

**Phase 4 — Monetization**
- CineStack Connect ($4.99/mo — managed indexer network)
- CineStack Cloud ($12.99/mo — fully hosted)

---

## Business Model

CineStack is and will always be **free and open source** for self-hosters.

Revenue comes from selling time and convenience — not features.

- **CineStack Connect** — managed indexer network that always works
- **CineStack Cloud** — fully hosted for people who want the result without the setup

---

## Contributing

CineStack is in active development. Issues and PRs welcome.

---

## License

MIT

---

*Built by [@csaul253-blip](https://github.com/csaul253-blip)*
