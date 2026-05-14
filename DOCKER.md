# Docker Setup - CrackPOS Frontend

Panduan lengkap untuk menjalankan CrackPOS Frontend di Docker.

## 📋 Prerequisites

- Docker Desktop (atau Docker Engine)
- Docker Compose v2.0+
- Backend NestJS sudah running di `http://localhost:8080`

## 🚀 Quick Start

### 1. Build Docker Image

```bash
# Build image
docker build -t crackpos-frontend:latest .

# Atau gunakan docker-compose (auto-build)
docker-compose build
```

### 2. Run dengan Docker Compose

```bash
# Start container
docker-compose up -d

# Lihat logs
docker-compose logs -f frontend

# Stop container
docker-compose down
```

### 3. Akses Aplikasi

Buka browser: **http://localhost:3000**

---

## 🔗 Backend Connection

### Scenario 1: Backend di Host Machine (localhost:8080)

Gunakan `host.docker.internal` di docker-compose.yml:

```yaml
environment:
  NEXT_PUBLIC_API_URL: http://host.docker.internal:8080/api
```

**Cara kerja**:
- Docker container → `host.docker.internal` → Host machine (localhost:8080)
- Works di: Docker Desktop (Mac/Windows), Linux dengan `--add-host`

### Scenario 2: Backend juga di Docker (Recommended)

Gunakan service name dan network yang sama:

```yaml
services:
  frontend:
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080/api
    networks:
      - crackpos-network
    depends_on:
      - backend

  backend:
    image: crackpos-backend:latest
    networks:
      - crackpos-network

networks:
  crackpos-network:
    driver: bridge
```

### Test Connection

```bash
# Dari container
docker exec crackpos-frontend curl http://host.docker.internal:8080/api/health

# Atau
docker exec crackpos-frontend wget -O- http://host.docker.internal:8080/api/health
```

---

## 📊 Docker Commands

### Build Image

```bash
# Build dengan tag
docker build -t crackpos-frontend:1.0.0 .

# Build tanpa cache
docker build --no-cache -t crackpos-frontend:latest .
```

### Run Container

```bash
# Run dengan docker-compose
docker-compose up -d

# Run manual
docker run -d \
  --name crackpos-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  -e JWT_SECRET=your-secret \
  crackpos-frontend:latest
```

### View Logs

```bash
# Logs dari docker-compose
docker-compose logs -f frontend

# Logs dari container
docker logs -f crackpos-frontend

# Last 100 lines
docker logs --tail 100 crackpos-frontend
```

### Stop & Remove

```bash
# Stop container
docker-compose down

# Remove image
docker rmi crackpos-frontend:latest

# Remove semua (container + image + volume)
docker-compose down -v
```

### Health Check

```bash
# Check status
docker-compose ps

# Manual health check
curl http://localhost:3000
```

---

## 🐛 Troubleshooting

### Container tidak start

```bash
# Lihat error logs
docker-compose logs frontend

# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### Port sudah digunakan

```bash
# Cari process yang menggunakan port 3000
lsof -i :3000

# Atau ubah port di docker-compose.yml
ports:
  - "3001:3000"
```

### API Connection Error

Pastikan:
1. Backend running di `http://localhost:8080`
2. `NEXT_PUBLIC_API_URL` benar di docker-compose.yml
3. Network connectivity OK

```bash
# Test dari container
docker exec crackpos-frontend curl http://localhost:8080/api/health
```

### Build Error

```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

---

## 📦 Production Deployment

### Optimize Image Size

```bash
# Current size
docker images crackpos-frontend

# Gunakan alpine base (lebih kecil)
# Sudah digunakan di Dockerfile
```

### Push ke Registry

```bash
# Tag image
docker tag crackpos-frontend:latest myregistry/crackpos-frontend:1.0.0

# Push
docker push myregistry/crackpos-frontend:1.0.0
```

### Docker Compose untuk Production

```bash
# Start dengan production settings
docker-compose -f docker-compose.yml up -d

# Scale (jika perlu multiple instances)
docker-compose up -d --scale frontend=3
```

---

## 🔐 Security Best Practices

1. **Use non-root user** ✅ (sudah di Dockerfile)
2. **Health checks** ✅ (sudah di docker-compose.yml)
3. **Resource limits** ✅ (sudah di docker-compose.yml)
4. **Logging** ✅ (sudah di docker-compose.yml)
5. **Environment variables** - Jangan hardcode secrets

### Secure Environment Variables

```bash
# Gunakan .env file
docker-compose --env-file .env.production up -d

# Atau gunakan Docker secrets (untuk Swarm)
docker secret create jwt_secret -
```

---

## 📈 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats crackpos-frontend

# Memory usage
docker stats --no-stream crackpos-frontend
```

### Logs Monitoring

```bash
# Follow logs
docker-compose logs -f

# Filter by service
docker-compose logs -f frontend

# Timestamps
docker-compose logs -f --timestamps
```

---

## 🔄 Update & Rebuild

```bash
# Pull latest code
git pull origin test--admin-dashboard

# Rebuild image
docker-compose build --no-cache

# Restart container
docker-compose up -d

# Verify
docker-compose ps
curl http://localhost:3000
```

---

## 📝 Notes

- Image size: ~500MB (dengan node_modules)
- Build time: ~2-3 menit (first time)
- Runtime memory: ~256MB (reserved), ~512MB (limit)
- Health check interval: 30 detik

---

## 🆘 Support

Jika ada masalah:

1. Cek logs: `docker-compose logs frontend`
2. Verify environment: `docker-compose config`
3. Test connectivity: `docker exec crackpos-frontend curl http://localhost:8080/api`
4. Rebuild: `docker-compose build --no-cache && docker-compose up -d`
