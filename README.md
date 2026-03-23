# CineStack

> One interface. Every piece of your media stack.

CineStack is a self-hosted streaming platform that replaces the fragmented *arr stack with a single Docker container and a clean, modern UI.

**Browse → Request → Download → Watch. All in one app.**

---

## How It Works

CineStack owns the entire UI and user experience. Three engines run silently in the background — users never touch them directly.

| Layer | Tool | Role |
|-------|------|------|
| UI | CineStack | Everything the user sees |
| Media Server | Jellyfin | Transcoding, streaming, library |
| Indexer | Prowlarr | Finding torrents across trackers |
| Downloader | qBittorrent | Downloading |

---

## Install

### Prerequisites

- Docker
- A running [Jellyfin](https://jellyfin.org) instance with an API key
- A running [Prowlarr](https://prowlarr.com) instance with an API key
- A running [qBittorrent](https://www.qbittorrent.org) instance (local or remote seedbox)

### Single command install

\`\`\`bash
docker run -d --name cinestack -p 80:80 \
  -v cinestack-data:/var/lib/postgresql/data \
  -v /mnt/media:/mnt/media \
  ghcr.io/homesoftco/cinestack:latest
\`\`\`

Replace /mnt/media with the path to your media folder. Add additional -v flags for any other media locations.

### Setup wizard

On first run, navigate to http://your-server-ip and the setup wizard will guide you through:

1. Creating your admin account
2. Setting your media storage paths
3. Connecting Jellyfin (URL + API key)
4. Connecting Prowlarr (URL + API key)
5. Connecting your download agent (qBittorrent URL + username + password)

All credentials are stored in the database — nothing is hardcoded.

---

## Features

- **Movies & TV** — your Jellyfin library with a Netflix-quality browsing UI
- **Requests** — search the full TMDB catalogue, request movies or individual TV seasons
- **Downloads** — live progress, speed, and ETA from qBittorrent, polled every 10 seconds
- **Player** — stream directly from Jellyfin with subtitle support
- **Settings** — manage all integrations from one place, values pre-populate from DB

---

## Tech Stack

- **Frontend:** React + Vite, react-router-dom, Axios
- **Backend:** Node.js + Express, PostgreSQL 16, JWT auth (bcryptjs + jsonwebtoken)
- **Container:** Ubuntu 24.04, Nginx, supervisord
- **Metadata:** TMDB API (requests flow only — library display uses Jellyfin)

---

## Legal

CineStack is software only. It does not host, store, stream, or distribute any media content. Users supply their own download clients, indexers, media server, and storage. The legal position is identical to Sonarr, Radarr, Plex, and Jellyfin.

---

## License

MIT

---

Built by [HomeSoft](https://github.com/homesoftco)
