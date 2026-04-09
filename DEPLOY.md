# 📦 Despliegue en Producción

Documentación completa para desplegar zona_raiz en un VPS con Docker.

---

## 🖥️ Requisitos del servidor

### Hardware mínimo

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| vCPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| SSD | 30 GB | 50 GB |

### Software

- Ubuntu 22.04 LTS (recomendado)
- Docker 24+
- Docker Compose 2+

### Proveedores compatibles

- Digital Ocean
- Linode
- Vultr
- Hetzner
- AWS EC2
- GCP Compute Engine

---

## 🚀 Despliegue rápido

### 1. Crear droplet

```bash
# Digital Ocean: Ubuntu 22.04 LTS
# 4 vCPU, 4GB RAM, 50GB SSD ≈ $24/mes
```

### 2. Conectar al servidor

```bash
ssh root@tu_ip_droplet
```

### 3. Ejecutar deploy

```bash
cd /opt
git clone https://github.com/jstcode99/zona_raiz.git
cd zona_raiz
chmod +x deploy-do.sh
./deploy-do.sh
```

El script automáticamente:
- ✅ Instala Docker y Docker Compose
- ✅ Configura firewall (ufw)
- ✅ Configura swap si RAM < 8GB
- ✅ Clona el repositorio
- ✅ Crea archivo `.env`
- ✅ Levanta todos los servicios

### 4. Configurar variables de entorno

```bash
nano .env
```

Edita los valores:

```env
# PostgreSQL - GENERA UNA CONTRASEÑA FUERTE
POSTGRES_PASSWORD=tu_contraseña_fuerte_aquí

# MinIO
MINIO_ROOT_PASSWORD=tu_contraseña_minio

# Grafana
GRAFANA_PASSWORD=tu_contraseña_grafana

# Supabase - genera con: openssl rand -base64 32
SUPABASE_JWT_SECRET=tu_jwt_secret

# Keys de Supabase (obtén de tu proyecto o genera nuevas)
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 5. Reiniciar servicios

```bash
docker compose restart
```

---

## 🌐 Configurar dominio y SSL

### Opción 1: Nginx como reverse proxy (recomendado)

```bash
# Instalar Nginx
apt install nginx

# Obtener certificado Let's Encrypt
apt install certbot python3-certbot-nginx
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

### Opción 2: Solo HTTP (desarrollo)

Simplemente actualiza en `.env`:

```env
NEXT_PUBLIC_APP_URL=http://tu-ip-o-dominio.com
```

### Configuración Nginx

Crear `/etc/nginx/sites-available/zona_raiz`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar configuración
ln -s /etc/nginx/sites-available/zona_raiz /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 📊 Servicios y puertos

| Servicio | Puerto interno | URL | Propósito |
|----------|---------------|-----|-----------|
| Next.js | 3000 | http://localhost:3000 | App principal |
| Kong | 8000 | http://localhost:8000 | API Gateway |
| PostgreSQL | 5432 | localhost:5432 | Base de datos |
| MinIO | 9000 | http://localhost:9000 | Storage API |
| MinIO Console | 9001 | http://localhost:9001 | UI Storage |
| Loki | 3100 | http://localhost:3100 | Logs |
| Grafana | 3001 | http://localhost:3001 | Dashboard |
| Mailhog | 8025 | http://localhost:8025 | Email UI |
| Mailhog SMTP | 1025 | localhost:1025 | SMTP |

---

## 🔧 Comandos de gestión

### Ver servicios

```bash
docker compose ps
```

### Logs en tiempo real

```bash
# Todos los servicios
docker compose logs -f

# Solo Next.js
docker compose logs -f nextjs

# Solo PostgreSQL
docker compose logs -f postgres
```

### Reiniciar servicios

```bash
# Reiniciar todo
docker compose restart

# Reiniciar solo un servicio
docker compose restart nextjs
```

### Backup manual

```bash
cd /opt/zona_raiz
./scripts/backup.sh backup
```

### Actualizar aplicación

```bash
cd /opt/zona_raiz
git pull origin master
docker compose up -d --build
```

---

## 🔒 Variables de producción importantes

### Generar secrets seguros

```bash
# Passwords aleatorios
openssl rand -base64 24

# JWT Secret
openssl rand -base64 32
```

### Variables obligatorias

| Variable | Descripción |
|----------|-------------|
| `POSTGRES_PASSWORD` | Password de PostgreSQL |
| `SUPABASE_JWT_SECRET` | Secret para JWT tokens |
| `SUPABASE_SERVICE_ROLE_KEY` | Key de admin (SECRETA) |
| `MINIO_ROOT_PASSWORD` | Password MinIO |
| `GRAFANA_PASSWORD` | Password admin Grafana |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de la API |

---

## 🛡️ Seguridad recomendada

### 1. Firewall

El script `deploy-do.sh` ya configura ufw. Verificar:

```bash
ufw status
```

### 2. Actualizaciones de seguridad

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Actualizar Docker
docker compose pull
```

### 3. Monitoreo

Acceder a Grafana: http://tu-ip:3001

- Usuario: `admin`
- Password: el configurado en `.env`

Dashboards disponibles:
- Logs de aplicación (Loki)
- Estado de contenedores

### 4. Backups automáticos

Configurar cron para backups diarios:

```bash
crontab -e
```

Añadir:

```cron
0 2 * * * /opt/zona_raiz/scripts/backup.sh backup >> /var/log/backup.log 2>&1
```

---

## 🚨 Solución de problemas

### Servicios no inician

```bash
# Ver logs detallados
docker compose logs nextjs

# Verificar red
docker network ls
```

### Puerto en uso

```bash
# Ver qué proceso usa el puerto
lsof -i :3000

# Cambiar puerto en docker-compose.yml si es necesario
```

### Memoria insuficiente

```bash
# Ver uso de memoria
free -h

# Agregar swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Base de datos no conecta

```bash
# Verificar PostgreSQL
docker exec -it zona_raiz_postgres psql -U postgres

# Verificar conexión desde Next.js
docker exec -it zona_raiz_nextjs sh
nc -zv postgres 5432
```

---

## 📞 Próximos pasos opcionales

- [ ] Configurar dominio con SSL (Let's Encrypt)
- [ ] Configurar backups automáticos a cloud (RClone → G Drive/S3)
- [ ] Configurar alertas en Grafana
- [ ] Configurar monitoring de recursos (Prometheus)
- [ ] Configurar CDN para assets estáticos

---

## 🔗 Recursos

- [Documentación Docker](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Self-hosted](https://supabase.com/docs/guides/self-hosting)
- [Let's Encrypt](https://letsencrypt.org/docs/)

---

*Última actualización: Abril 2026*