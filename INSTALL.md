# CineStack — Beta Install Guide

Thanks for being a beta tester. This guide will get CineStack running on your machine in about 20 minutes.

---

## What You Need Before Starting

CineStack is a UI layer — it connects to tools you already run. Before installing CineStack, you need:

| Tool | What It Does | Where to Get It |
|------|-------------|-----------------|
| **Docker** | Runs CineStack | [docs.docker.com](https://docs.docker.com/get-docker/) |
| **Jellyfin** | Your media library + streaming | [jellyfin.org](https://jellyfin.org) |
| **Prowlarr** | Finds torrents across trackers | [prowlarr.com](https://prowlarr.com) |
| **qBittorrent** | Downloads torrents | [qbittorrent.org](https://www.qbittorrent.org) |

If you're running a seedbox, your qBittorrent and Prowlarr are likely already there — you just need the URLs and credentials.

---

## Step 1 — Get Your Credentials Ready

Before running CineStack, grab these from your existing setup:

### Jellyfin
1. Open Jellyfin -> Dashboard -> API Keys
2. Create a new API key, name it "CineStack"
3. Copy the key and your Jellyfin URL (e.g. http://192.168.1.100:8096)

### Prowlarr
1. Open Prowlarr -> Settings -> General
2. Copy the API Key
3. Copy your Prowlarr URL (e.g. http://192.168.1.100:9696)

### qBittorrent
1. You need the URL, username, and password for qBittorrent's web UI
2. Default URL is usually http://192.168.1.100:8080
3. Default credentials are admin / adminadmin unless you changed them

---

## Step 2 — Install CineStack

Run this on the machine where you want CineStack:
```bash
docker run -d --name cinestack -p 80:80 \
  -v cinestack-data:/var/lib/postgresql/data \
  -v /mnt/media:/mnt/media \
  ghcr.io/homesoftco/cinestack:latest
```

Replace /mnt/media with the actual path to your media folder. If you have media in multiple locations, add a -v flag for each.

Wait about 10 seconds for the container to fully start, then open http://your-server-ip in a browser.

---

## Step 3 — Run the Setup Wizard

### Step 1 — Welcome
Just an intro screen. Click Next.

### Step 2 — Create Your Admin Account
Enter your name, email, and a password. This is your CineStack login.

### Step 3 — Media Storage
Enter the path(s) to your media folder(s). These must match the -v volume paths you used in the docker run command. Click Validate, then Save.

### Step 4 — Connect Jellyfin
Enter your Jellyfin URL and API key. Click Test then Save and Continue.

### Step 5 — Connect Prowlarr
Enter your Prowlarr URL and API key. Click Test then Save and Continue.

### Step 6 — Connect Download Agent
Enter your qBittorrent URL, username, and password. Click Save and Continue.

### Step 7 — Done
CineStack will log you in automatically and take you to the app.

---

## Step 4 — Verify Everything Works

1. Movies and TV tabs should show your Jellyfin library.
2. Requests tab — search for a movie, hit Request, check the Downloads tab.
3. Player — click any title in your library and hit Play.

---

## Troubleshooting

**Movies/TV tabs are empty**
- Go to Settings and check your Jellyfin URL and API key
- Make sure Jellyfin is running and accessible from the CineStack machine

**Requests aren't downloading**
- Go to Settings and check your Prowlarr and qBittorrent credentials
- Make sure Prowlarr has at least one indexer configured

**Can't reach CineStack**
- Check the container is running: docker ps
- Check logs: docker logs cinestack --tail 30

**Restart CineStack**
docker restart cinestack

**Full reinstall (wipes all data)**
docker stop cinestack && docker rm cinestack && docker volume rm cinestack-data

---

## Updating CineStack
```bash
docker pull ghcr.io/homesoftco/cinestack:latest
docker stop cinestack && docker rm cinestack
docker run -d --name cinestack -p 80:80 \
  -v cinestack-data:/var/lib/postgresql/data \
  -v /mnt/media:/mnt/media \
  ghcr.io/homesoftco/cinestack:latest
```

Your data survives updates — it lives in the cinestack-data volume.

---

## Feedback

Reach out directly: chris@cinestack.app
