# 🌱 Database Seed - Zona Raíz

Script para populate la base de datos de Supabase con datos de prueba realistas para desarrollo y testing.

## 📋 Requisitos

- Node.js 20.x
- pnpm 10.x
- Proyecto de Supabase configurado
- Variables de entorno configuradas

## 🚀 Uso Rápido

### 1. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Para desarrollo local con Supabase CLI
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=tu-local-service-role-key

# Para producción (obtén estas credenciales de tu dashboard de Supabase)
# NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=tu-production-service-role-key
```

Para obtener el `SUPABASE_SERVICE_ROLE_KEY` en desarrollo local:
```bash
# Con la CLI de Supabase
npx supabase status
```

### 2. Ejecutar el seed

```bash
# Seed completo con opciones por defecto
pnpm seed

# Dry-run: solo mostrar qué se insertaría
pnpm seed:dry-run

# Omitir creación de usuarios auth (más rápido)
pnpm seed --skip-auth

# Ver ayuda
pnpm seed:help
```

## 📊 Datos que se Generan

El seed crea datos realistas para todas las entidades del sistema:

### Inmobiliarias (2-3)
- **Inmobiliaria Costa del Plata** - Mar del Plata
- **Urban Living Argentina** - Buenos Aires
- **Sierra Propiedades** - Córdoba

### Perfiles y Usuarios (9)
- 3 Coordinadores (1 por inmobiliaria)
- 6 Agentes (3 por inmobiliaria)
- 3 Clientes

### Propiedades (15)
Distribuidas entre las inmobiliarias:
- Departamentos en Buenos Aires, Mar del Plata
- Casas en barrios privados y zonas residenciales
- Lofts de diseño en Palermo Soho
- Condominios de lujo en Puerto Madero
- Terrenos en zonas privilegiadas
- Propiedades en sierras de Córdoba
- Propiedades comerciales y oficinas
- Bodegas/naves industriales

### Listados (12+)
- Listados activos de venta y alquiler
- Algunos destacados (featured)
- Diferentes estados (active, draft, paused)
- Estadísticas de vistas y consultas

### Imágenes (16+)
- Imágenes de prueba usando picsum.photos
- Diferentes tamaños y orientaciones
- Imágenes primarias y secundarias

### Favoritos (5+)
- Relaciones aleatorias entre clientes y listados activos

### Inquiries/Consultas (8+)
- Leads con diferentes estados (nuevos, contactados, cualificados)
- Diferentes fuentes (web, whatsapp, teléfono, email)
- Distribución realista de estados

## 🔧 Opciones Avanzadas

### Modo Dry-Run
```bash
pnpm seed:dry-run
```
Solo muestra qué datos se插入arían sin ejecutarlos.

### Omitir Auth Users
```bash
pnpm seed --skip-auth
```
No intenta crear usuarios en `auth.users`. Útil cuando los usuarios ya existen.

### No Truncar Tablas
```bash
pnpm seed --no-truncate
```
Añade datos sin borrar los existentes. Útil para testing incremental.

### Combinar Opciones
```bash
pnpm seed --skip-auth --no-truncate
```

## 📁 Estructura del Proyecto

```
seed/
├── README.md              # Esta documentación
├── run-seed.ts            # Script ejecutable
├── index.ts               # Orquestador principal
├── types.ts               # Tipos TypeScript
├── data.ts                # Datos de prueba
└── lib/
    ├── supabase.ts        # Cliente Supabase
    ├── logger.ts          # Utilidades de logging
    └── seeders/
        ├── profile.seeder.ts       # Perfiles y auth
        ├── real-estate.seeder.ts   # Inmobiliarias
        ├── property.seeder.ts      # Propiedades
        ├── listing.seeder.ts       # Listados
        ├── favorite.seeder.ts      # Favoritos
        └── inquiry.seeder.ts        # Consultas
```

## 🔄 Idempotencia

El script es **idempotente**, lo que significa que puedes ejecutarlo múltiples veces sin efectos secundarios no deseados:

1. Por defecto, **trunca todas las tablas relacionadas** antes de insertar
2. Usa `UPSERT` con `ON CONFLICT` para manejar duplicados
3. Los IDs están predefinidos para garantizar consistencia

## ⚠️ Notas Importantes

### RLS (Row Level Security)
El script usa el **Service Role Key** para bypass de RLS. Esto es necesario porque:
- Los seeders insertan datos para múltiples tenants/inmobiliarias
- Las políticas RLS normalmente filtran por `auth.uid()`
- Service Role bypassa RLS completamente

### Imágenes de Prueba
Las imágenes usan `picsum.photos` para generarlas dinámicamente. En producción, deberías:
1. Subir las imágenes a Supabase Storage
2. Actualizar las URLs en `data.ts`
3. Configurar las políticas de Storage correspondientes

### Contraseñas de Prueba
Todos los usuarios de prueba usan la contraseña: `Test123456!`

### Limpieza Manual
Para limpiar todos los datos de prueba:
```sql
-- Ejecutar en SQL de Supabase
DELETE FROM favorites;
DELETE FROM inquiries;
DELETE FROM property_images;
DELETE FROM listings;
DELETE FROM properties;
DELETE FROM real_estate_agents;
DELETE FROM real_estates;
DELETE FROM profiles;
-- Nota: Los auth.users deben eliminarse desde el dashboard o CLI
```

## 🧪 Testing

Para verificar que el seed funciona correctamente:

```bash
# 1. Verificar conexión
pnpm seed:dry-run

# 2. Ejecutar seed
pnpm seed

# 3. Verificar datos en el dashboard de Supabase
# o usando la CLI:
npx supabase db select "SELECT COUNT(*) FROM profiles"
```

## 📝 Personalización

### Agregar más datos
Edita `data.ts` para agregar:
- Más inmobiliarias
- Más propiedades
- Más listados
- Imágenes personalizadas

### Cambiar cantidades
Edita `types.ts` → `DEFAULT_SEED_OPTIONS` para cambiar:
- Cantidad de inmobiliarias
- Agentes por inmobiliaria
- Propiedades por inmobiliaria
- etc.

### Agregar nuevos seeders
1. Crea un nuevo archivo en `lib/seeders/`
2. Implementa la función de seed
3. Llámala desde `index.ts`

## 🐛 Troubleshooting

### Error: "Variables de entorno faltantes"
```bash
# Verifica que tienes el archivo .env.local
cat .env.local

# O exporta las variables manualmente
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
export SUPABASE_SERVICE_ROLE_KEY=$(npx supabase status -o json | jq -r '.data.service_role_key')
```

### Error: "Connection refused"
```bash
# Verifica que Supabase local está corriendo
pnpm supabase:status

# Si no está corriendo, arráncalo
pnpm supabase:start
```

### Error: "duplicate key value"
Esto es normal si ejecutas el seed dos veces sin truncate. Usa `pnpm seed` (con truncate por defecto) o `pnpm seed --no-truncate` si quieres añadir datos增量.

## 📄 Licencia

Este script es parte del proyecto Zona Raíz y sigue las mismas licencias.
