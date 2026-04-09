# zona_raiz 🏠

Plataforma inmobiliaria multi-tenant con Next.js 16 + Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Características

- **Multi-tenant**: Múltiples inmobiliarias en una sola instancia
- **Autenticación**: OAuth Google + Email/OTP
- **Propiedades**: Gestión completa de propiedades con imágenes
- **Listados**: Publicación y búsqueda de propiedades
- **Importación**: Importación masiva desde Excel/CSV
- **i18n**: Soporte para español e inglés
- **Dashboard**: Panel de administración completo

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|-------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Estilos | Tailwind CSS, shadcn/ui, Radix UI |
| Base de datos | PostgreSQL 15 (Supabase self-hosted) |
| Auth | Supabase Auth + Google OAuth |
| Storage | MinIO (S3-compatible) |
| Formularios | React Hook Form + Yup |
| Testing | Vitest |
| i18n | i18next |
| Despliegue | Docker, Digital Ocean |

## 📋 Requisitos

- Node.js 20.x
- pnpm 10.x
- Docker (para desarrollo local con Supabase)
- PostgreSQL 15 (producción)

## 🏃‍♂️ Inicio rápido

### Desarrollo local

```bash
# Instalar dependencias
pnpm install

# Iniciar Supabase local
pnpm supabase:start

# Copiar variables de entorno
cp .env.example .env

# Ejecutar migraciones
pnpm supabase:db:push

# Iniciar servidor de desarrollo
pnpm dev
```

### Producción con Docker

```bash
# Clonar repositorio
git clone https://github.com/jstcode99/zona_raiz.git
cd zona_raiz

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores de producción

# Deploy automático
chmod +x deploy-do.sh
./deploy-do.sh
```

Ver [DEPLOY.md](DEPLOY.md) para documentación completa de despliegue.

## 📁 Estructura del proyecto

```
zona_raiz/
├── app/                    # Next.js App Router
│   └── [lang]/            # i18n routing (es/en)
├── application/           # Server Actions, validación, módulos
├── domain/                # Entidades, puertos, servicios
├── infrastructure/       # Adaptadores (Supabase, cookies, config)
├── features/             # Componentes UI por dominio
├── shared/               # Hooks, utils, redirect
├── supabase/             # Migraciones SQL
├── locales/              # Traducciones (es/en)
└── docker/               # Configuración Docker
```

## 🐳 Docker

### Servicios incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Next.js | 3000 | Aplicación principal |
| PostgreSQL | 5432 | Base de datos |
| MinIO | 9000/9001 | Storage (S3-compatible) |
| Kong | 8000/8001 | API Gateway |
| Mailhog | 1025/8025 | SMTP mock (desarrollo) |
| Loki | 3100 | Agregación de logs |
| Grafana | 3001 | Dashboard de logs |
| Promtail | - | Recolector de logs |

### Comandos Docker

```bash
# Iniciar servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Reiniciar un servicio
docker compose restart nextjs
```

## 🔧 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Iniciar producción |
| `pnpm test` | Ejecutar tests |
| `pnpm lint` | Linting |
| `pnpm supabase:start` | Iniciar Supabase local |
| `pnpm supabase:db:push` | Enviar migraciones |

## 📝 Variables de entorno

Ver `.env.example` para todas las variables disponibles.

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Tests en watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 🌐 Endpoints

- **App**: http://localhost:3000 (desarrollo) | http://tu-dominio.com (producción)
- **Grafana**: http://localhost:3001
- **MinIO Console**: http://localhost:9001
- **Mailhog**: http://localhost:8025
- **Kong**: http://localhost:8000

## 📄 Licencia

MIT License

---

<div align="center">
  <sub>Construido con ❤️ por zona_raiz</sub>
</div>