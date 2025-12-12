# Deployment-Anleitung - Das große Datebuch

## 🚀 Hetzner Deployment (Port 3005)

### Voraussetzungen

- Hetzner Server: `91.99.177.238`
- Docker + Docker Compose installiert
- Traefik Reverse Proxy läuft
- Zugriff via SSH: `ssh root@91.99.177.238`

### Erstmaliges Setup

#### 1. Deployment-Verzeichnis erstellen

```bash
ssh root@91.99.177.238

# Verzeichnis erstellen
mkdir -p /opt/apps/datebuch
cd /opt/apps/datebuch

# Repository clonen
git clone https://github.com/NickHeymann/dasgro-edatebuch.git .
```

#### 2. Environment Variables konfigurieren

```bash
# .env-Datei erstellen
cp .env.example .env
nano .env

# Fülle alle Secrets aus (siehe .env.example)
```

#### 3. Deploy-Script ausführbar machen

```bash
chmod +x deploy.sh
```

#### 4. Erster Deployment

```bash
./deploy.sh
```

Die App läuft jetzt auf: **http://91.99.177.238:3005**

---

## 🔄 Nachfolgende Deployments

### Automatisches Deployment (empfohlen)

```bash
ssh root@91.99.177.238
cd /opt/apps/datebuch
./deploy.sh
```

Das Script führt automatisch aus:
1. Git Pull (latest changes)
2. Design Tokens builden
3. Docker Image neu bauen
4. Container neustarten
5. Health Check

### Manuelles Deployment

```bash
# Auf Hetzner
cd /opt/apps/datebuch

# Pull changes
git pull origin main

# Build & Start
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f datebuch
```

---

## 📊 Monitoring & Debugging

### Container-Status prüfen

```bash
docker ps | grep datebuch
```

### Logs anzeigen

```bash
# Live-Logs
docker-compose logs -f datebuch

# Letzte 100 Zeilen
docker-compose logs --tail=100 datebuch
```

### Health Check

```bash
curl http://91.99.177.238:3005/health
# Expected: "healthy"
```

### Container neu starten

```bash
docker-compose restart datebuch
```

### Container-Shell öffnen

```bash
docker exec -it datebuch sh
```

---

## 🔧 Traefik-Integration

### Labels-Übersicht

Die App nutzt diese Traefik-Labels (siehe `docker-compose.yml`):

- `traefik.http.routers.datebuch.rule` - Routing-Regel
- `traefik.http.services.datebuch.loadbalancer.server.port=80` - Backend-Port
- `traefik.http.middlewares.datebuch-stripprefix` - URL-Prefix entfernen

### Test Traefik-Routing

```bash
# Von lokalem Rechner
curl -v http://91.99.177.238:3005
```

---

## 🛡️ Security

### Nginx Security Headers

Automatisch gesetzt in `nginx.conf`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Content Security Policy (CSP)

Nach Event Delegation Migration aktivieren in `nginx.conf`:
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://esm.sh; ..." always;
```

### Container-Security

- Läuft als non-root User (`nginx`)
- Capabilities gedroppt (`cap_drop: ALL`)
- Resource Limits gesetzt (256MB RAM, 0.25 CPU)

---

## 🔄 CI/CD (Optional)

### GitHub Actions Webhook

Erstelle `.github/workflows/deploy.yml` für automatisches Deployment bei Git Push:

```yaml
name: Deploy to Hetzner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HETZNER_HOST }}
          username: root
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/apps/datebuch
            ./deploy.sh
```

---

## 🎨 Design Tokens builden

### Nach Theme-Änderungen

```bash
# Lokal
cd /path/to/datebuch
npm run build:tokens
git add css/themes/
git commit -m "Update design tokens"
git push

# Auf Hetzner (automatisch via deploy.sh)
./deploy.sh
```

---

## 🐛 Troubleshooting

### Problem: Container startet nicht

```bash
# Logs prüfen
docker-compose logs datebuch

# Häufige Fehler:
# - Port bereits belegt → anderen Port in docker-compose.yml
# - Nginx-Config-Fehler → nginx -t testen
# - Fehlende Dateien → Git Pull prüfen
```

### Problem: Traefik erreicht Container nicht

```bash
# Traefik-Logs prüfen
docker logs traefik

# Traefik-Dashboard
curl http://91.99.177.238:8080/api/http/routers
```

### Problem: 502 Bad Gateway

```bash
# Health Check
curl http://91.99.177.238:3005/health

# Nginx-Logs im Container
docker exec datebuch cat /var/log/nginx/error.log
```

---

## 📈 Performance-Monitoring

### Resource Usage

```bash
# CPU & Memory
docker stats datebuch

# Disk Usage
docker system df
```

### Response Time

```bash
# Curl mit Timing
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://91.99.177.238:3005
```

---

## 🔐 Backup & Restore

### Backup erstellen

```bash
# Git-basiert (empfohlen)
cd /opt/apps/datebuch
git add .
git commit -m "Backup $(date +%Y-%m-%d)"
git push

# Docker-Image
docker save datebuch:latest | gzip > datebuch-backup-$(date +%Y%m%d).tar.gz
```

### Restore

```bash
# Von Git
git pull origin main
./deploy.sh

# Von Docker-Image
docker load < datebuch-backup-20251211.tar.gz
docker-compose up -d
```

---

## 📞 Support

Bei Problemen:
1. Logs prüfen: `docker-compose logs datebuch`
2. Health Check: `curl http://91.99.177.238:3005/health`
3. Container neu starten: `docker-compose restart datebuch`
4. Issue auf GitHub: https://github.com/NickHeymann/dasgro-edatebuch/issues
