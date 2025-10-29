# Xyra.Digital - Projekt-Dokumentation für Claude

## 📋 Projekt-Übersicht

**Projekt:** Xyra.Digital Website
**Repository:** https://github.com/davidklouis-sketch/xyra-ai-finished
**Live URL:** https://xyra.digital
**Letzte Aktualisierung:** 2025-10-29

## 🎯 Branding-Strategie

**Wichtig - Konsistente Verwendung:**
- **Website Display:** "Xyra.Digital" (in Header, Footer, Titeln, Meta-Tags)
- **Legal Entity:** "Xyra.AI" (in Impressum, Datenschutz, AGBs, Cookie-Richtlinie)
- **Domain:** xyra.digital
- **Email:** david.louis@xyra.digital

**Farbschema:**
- Primary (Neon Green): `#00ff88`
- Text in Header/Footer: `Xyra<span className="text-primary">.Digital</span>`

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.4
- **Styling:** TailwindCSS 3.4.16
- **Animation:** Framer Motion 11.11.17
- **Routing:** React Router DOM 6.28.0
- **SEO:** react-helmet-async 2.0.5
- **Icons:** Lucide React 0.468.0

### Backend/Infrastructure
- **Web Server:** Nginx 1.27 (Alpine)
- **Reverse Proxy:** Traefik v2.11
- **SSL/TLS:** Let's Encrypt (via Traefik)
- **Container Platform:** Docker + Docker Compose
- **Registry:** GitHub Container Registry (GHCR)

### Internationalization
- **System:** Custom lightweight i18n provider
- **Languages:** German (default), English
- **Storage:** localStorage persistence
- **Files:**
  - `src/i18n/i18n.jsx` - Provider
  - `src/i18n/translations/de.json`
  - `src/i18n/translations/en.json`

## 📁 Projekt-Struktur

```
ai-website/
├── .github/workflows/
│   ├── ci.yml          # Build & Test Pipeline
│   └── cd.yml          # Deploy Pipeline
├── public/
│   ├── favicon.svg
│   └── legal/
│       ├── impressum.html
│       ├── datenschutz.html
│       ├── agb.html
│       └── cookies.html
├── src/
│   ├── main.jsx        # React Entry Point
│   ├── App.jsx         # Main Component
│   ├── index.css       # Tailwind Imports
│   ├── components/
│   │   ├── Navbar.jsx  # Header mit Xyra.Digital
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx  # Footer mit Xyra.Digital
│   │   ├── Logo.jsx
│   │   └── LanguageSwitcher.jsx
│   └── i18n/
│       ├── i18n.jsx
│       └── translations/
│           ├── de.json
│           └── en.json
├── traefik/
│   └── letsencrypt/
│       └── acme.json    # SSL Certificates
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile          # Multi-stage Docker Build
├── docker-compose.yml  # Traefik + Website
├── nginx.conf          # SPA Routing + Caching
├── package.json
└── CLAUDE_NOTES.md     # Diese Datei

```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

**1. CI Workflow (`.github/workflows/ci.yml`)**
- **Trigger:** Push auf `main`, Pull Requests
- **Schritte:**
  1. Checkout Code
  2. Setup Node.js 20
  3. Install Dependencies (`npm ci`)
  4. Build (`npm run build`)
  5. Upload Build Artifact

**2. CD Workflow (`.github/workflows/cd.yml`)**
- **Trigger:** Push auf `main`
- **Job 1: Docker Build & Push**
  - Baut Multi-stage Docker Image
  - Pusht zu GHCR: `ghcr.io/davidklouis-sketch/xyra-ai-finished/website`
  - Tags: `:main`, `:latest`, `:sha-<commit>`

- **Job 2: Remote Deploy**
  - Requires: Job 1 erfolgreich
  - SSH auf Server: `49.12.236.104`
  - Rsync: `docker-compose.yml` und `traefik/`
  - Befehle:
    ```bash
    docker login ghcr.io
    docker compose pull --quiet
    docker compose up -d --force-recreate
    docker compose ps
    docker image prune -f
    ```

### Required Secrets
- `SSH_KEY` - Private SSH Key
- `SSH_HOST` - Server IP (49.12.236.104)
- `SSH_USER` - SSH Username (dlouis)
- `REMOTE_DIR` - Deploy-Verzeichnis (/home/dlouis/)
- `DOMAIN` - xyra.digital
- `TRAEFIK_EMAIL` - david.louis@xyra.digital
- `GITHUB_TOKEN` - Automatisch bereitgestellt

## 🐳 Docker Setup

### Dockerfile (Multi-stage Build)

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3
```

### docker-compose.yml

**Services:**

1. **Traefik** (Reverse Proxy)
   - Image: `traefik:v2.11`
   - Ports: 80, 443
   - Features:
     - Docker Provider (auto-discovery)
     - Let's Encrypt HTTP Challenge
     - HTTPS Redirect
   - Volumes:
     - Docker Socket (read-only)
     - Let's Encrypt Storage

2. **Website**
   - Image: `ghcr.io/davidklouis-sketch/xyra-ai-finished/website:main`
   - Labels (Traefik Config):
     ```yaml
     traefik.enable: "true"
     traefik.http.routers.website.rule: "Host(`xyra.digital`)"
     traefik.http.routers.website.entrypoints: "web,websecure"
     traefik.http.routers.website.tls: "true"
     traefik.http.routers.website.tls.certresolver: "letsencrypt"
     traefik.http.services.website.loadbalancer.server.port: "80"
     ```

### Nginx Configuration

**Wichtige Einstellungen:**

```nginx
# SPA Routing
location / {
    try_files $uri $uri/ /index.html;
}

# index.html: NO CACHE (fetch new bundles on updates)
location = /index.html {
    add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";
}

# Static assets: 7-day immutable cache
location ~* \.(js|css|svg|png|jpg|jpeg|gif|webp|ico)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, immutable";
}
```

**Rationale:**
- `index.html` wird NIE gecached → Garantiert, dass neue Deployments sofort wirksam werden
- JS/CSS mit Hash-Namen werden 7 Tage gecached (immutable) → Optimale Performance

## 🌐 DNS & Domain Setup

### Aktuelle Konfiguration

**Domain:** xyra.digital
**DNS Provider:** Cloudflare
**Nameservers:** jobs.ns.cloudflare.com, vita.ns.cloudflare.com

**A Record:**
- **Type:** A
- **Name:** @ (root)
- **Value:** 49.12.236.104 (Server IP)
- **Proxy Status:** ❌ OFF (Cloudflare Proxy deaktiviert)
- **Grund:** Let's Encrypt HTTP-01 Challenge benötigt direkten Zugriff

**Wichtig:** Cloudflare Proxy MUSS ausgeschaltet sein, damit Traefik SSL-Zertifikate ausstellen kann!

### SSL/TLS
- **Provider:** Let's Encrypt
- **Challenge Type:** HTTP-01
- **Renewal:** Automatisch via Traefik
- **Storage:** `/home/dlouis/app/traefik/letsencrypt/acme.json`
- **Zertifikat gültig für:** xyra.digital

## 🖥️ Server-Details

**IP:** 49.12.236.104
**SSH User:** dlouis
**SSH Key:** `C:\Users\david\.ssh\id_rsa`
**Deploy Directory:** `/home/dlouis/app/`

### Wichtige Server-Befehle

```bash
# Connect to Server
ssh dlouis@49.12.236.104

# Navigate to Deploy Directory
cd /home/dlouis/app

# Check Container Status
docker compose ps

# View Logs
docker compose logs traefik --tail 50
docker compose logs website --tail 50

# Restart Services
export DOMAIN=xyra.digital
export TRAEFIK_EMAIL=david.louis@xyra.digital
docker compose restart

# Full Redeploy
docker compose down
docker compose pull
docker compose up -d --force-recreate

# Check Traefik Routes (Debug Mode)
docker logs app-traefik-1 | grep -E 'router|website|Configuration received'
```

## 🔧 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Build Output:**
- Directory: `dist/`
- Entry: `dist/index.html`
- Assets: `dist/assets/` (mit Content-Hash)

## 🎨 Tailwind Configuration

**Wichtige Custom Config:**

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#00ff88',      // Neon Green
      dark: '#0B0B12',         // Background
      'dark-lighter': '#1A1A24'
    }
  }
}
```

## 📝 Wichtige Komponenten

### Navbar.jsx
- **Logo:** Xyra.Digital (mit .Digital in primary color)
- **Navigation:** Home, Services, Features, Pricing, Contact
- **Features:** Language Switcher, Mobile Menu

### Footer.jsx
- **Logo:** Xyra.Digital
- **Sections:** Services, Legal, Social Links
- **Email:** david.louis@xyra.digital
- **Legal Links:** /legal/impressum.html, /legal/datenschutz.html, etc.

### Logo.jsx
- **SVG Component:** Neon Ring Logo
- **Colors:** Gradient von primary zu cyan
- **Props:** className (für Größe/Animation)

## 🔐 Legal Pages (Static HTML)

**Alle in:** `public/legal/`

**Company Name:** Xyra.AI
**Person:** David Louis
**Address:** 68723 Schwetzingen, Deutschland
**Email:** david.louis@xyra.digital
**Phone:** +49 151 64657852

**Dateien:**
- `impressum.html` - Impressum mit Dienstanbieter Xyra.AI
- `datenschutz.html` - Datenschutzerklärung, Verantwortlicher: Xyra.AI
- `agb.html` - Allgemeine Geschäftsbedingungen für Xyra.AI
- `cookies.html` - Cookie-Richtlinie

## 🚨 Bekannte Issues & Lösungen

### Problem: 404 nach Deployment (GELÖST ✅)
**Root Cause:** Traefik filtert Container im "starting" Status (Health-Check läuft noch)
- Container startet → Health-Check läuft (30s)
- CD-Script endete VOR Health-Check → Traefik sieht Container nicht
- Keine Route registriert → 404

**Lösung (implementiert in Commit 142268b):**
1. **Health-Check Wait Loop** im CD-Script:
   ```bash
   # Wait for website container to become healthy (max 60s)
   for i in {1..12}; do
     if docker inspect app-website-1 --format='{{.State.Health.Status}}' | grep -q "healthy"; then
       break
     fi
     sleep 5
   done
   ```
2. **Persistent .env File** auf Server: `DOMAIN=xyra.digital`, `TRAEFIK_EMAIL=...`
3. **Rsync .env**: .env wird automatisch deployed

**Manueller Fix (falls nötig):**
```bash
export DOMAIN=xyra.digital && export TRAEFIK_EMAIL=david.louis@xyra.digital
docker compose restart
# Warte 30-35 Sekunden auf Health-Check
```

### Problem: Änderungen nicht sichtbar nach Force-Reload
**Ursache:** Änderungen nicht committed/gepusht
**Lösung:**
```bash
git add -A
git commit -m "fix: description"
git push origin main
# Warte 3-5 Min auf CI/CD Pipeline
```

### Problem: Let's Encrypt Zertifikat nicht ausgestellt
**Ursache:** Cloudflare Proxy ist aktiviert
**Lösung:** Cloudflare DNS → A Record → Proxy Status OFF (grau)

### Problem: DNS zeigt alte IP
**Ursache:** DNS Cache
**Lösung:**
```bash
# Test authoritative nameserver
nslookup xyra.digital ns1.cloudflare.com
# Warte 5-15 Min auf Propagation
```

## 📊 Performance & Caching

### Vite Build Optimierung
- **Code Splitting:** Automatisch durch Vite
- **Tree Shaking:** Entfernt ungenutzten Code
- **Minification:** CSS + JS minimiert
- **Asset Hashing:** Cache-Busting via Content-Hash

### Nginx Caching Strategy
1. **HTML:** Kein Cache (immer frisch)
2. **JS/CSS:** 7 Tage immutable (mit Hash)
3. **Images:** 7 Tage mit Revalidation

### Deployment-Zeit
- **CI Build:** ~2-3 Minuten
- **Docker Push:** ~1 Minute
- **Deploy:** ~1 Minute
- **Gesamt:** ~3-5 Minuten

## 🔄 Workflow für Updates

### Code-Änderungen deployen:

1. **Lokal ändern:**
   ```bash
   # Edit files...
   npm run dev  # Test lokal
   ```

2. **Committen:**
   ```bash
   git add -A
   git commit -m "fix: description"
   git push origin main
   ```

3. **CI/CD überwachen:**
   - https://github.com/davidklouis-sketch/xyra-ai-finished/actions
   - Warte ~3-5 Minuten

4. **Verifizieren:**
   - https://xyra.digital
   - Force-Reload: Ctrl+Shift+R

### Branding-Änderungen:

**Immer konsistent halten:**
- Website: "Xyra.Digital" → Header, Footer, Titles
- Legal: "Xyra.AI" → Impressum, Datenschutz, AGBs
- Domain: "xyra.digital"

## 🎯 Wichtige Git-Commits

```
ed71f8c - fix: update Header/Footer branding and legal entity names
41663c7 - fix: rebrand from Xyra.Media to Xyra.Digital across all files
bb0a5e1 - fix: update domain from xyra.media to xyra.digital
9080aaf - fix: rebrand from xyra.ai to Xyra.Media
```

## 📞 Kontakt & Support

**Owner:** David Louis
**Email:** david.louis@xyra.digital
**GitHub:** davidklouis-sketch

## 🔮 Nächste Schritte (optional)

- [ ] Analytics einbinden (Google Analytics / Plausible)
- [ ] Contact Form Webhook konfigurieren (`VITE_CONTACT_WEBHOOK_URL`)
- [ ] SEO Optimization (Sitemap, robots.txt)
- [ ] Performance Monitoring (Lighthouse CI)
- [ ] Error Tracking (Sentry)
- [ ] CDN für Assets (optional mit Cloudflare)

---

**Letzte Aktualisierung:** 2025-10-29
**Claude Code Session:** Vollständiges Rebranding & Deployment-Fix
