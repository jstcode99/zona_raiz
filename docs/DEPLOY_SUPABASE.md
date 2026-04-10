# Deploying zona_raiz (Supabase + Next.js) on a VPS

## Prerequisitos
- Ubuntu/Debian (or any distro with Docker)  
- Docker + Docker‑Compose installed (`docker version`, `docker compose version`)  
- Git access to the repository  

## Paso a paso

```bash
# 1️⃣ Clonar el repo
git clone https://github.com/yourorg/zona_raiz.git /opt/zona_raiz
cd /opt/zona_raiz

# 2️⃣ Copiar y rellenar variables de entorno
cp .env.supabase .env.supabase.local
nano .env.supabase.local   # ← pon POSTGRES_PASSWORD y cualquier otro secreto

# 3️⃣ Generar claves JWT/ANON/SERVICE_ROLE (solo la primera vez)
./scripts/supabase-up.sh generate-keys

# 4️⃣ Levantar la pila de Supabase
./scripts/supabase-up.sh start

# 5️⃣ Verificar que Kong responde
curl -s http://localhost:8000/health | jq   # debe devolver {"status":"healthy"}

# 6️⃣ Deploy del frontend
./scripts/deploy.sh          # o: docker compose -f docker-compose.yml up -d --build

# 7️⃣ Probar la app
curl -I http://localhost:3000   # 200 OK (o 307 → /es)

# 8️⃣ (Opcional) Configurar systemd para auto‑start
sudo cp scripts/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable supabase.service zona_raiz-nextjs.service
sudo systemctl start supabase.service zona_raiz-nextjs.service
