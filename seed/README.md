# 🌱 Database Seed - Zona Raíz

Este directorio contiene dos sistemas de seed:

1. **Generador SQL (nuevo)** - Genera `seed.sql` sin conexión a Supabase
2. **Seed directo (legacy)** - Inserta directamente en Supabase

## 🎯 Uso Recomendado: Generador SQL

El nuevo sistema genera un archivo SQL listo para ejecutar en cualquier cliente PostgreSQL.

### Comandos

```bash
# Generar seed.sql (sin TRUNCATE)
pnpm seed:sql

# Generar con TRUNCATE (borra datos existentes)
pnpm seed:sql --truncate

# Ver SQL en consola sin guardar
pnpm seed:sql --dry-run

# Guardar en archivo específico
pnpm seed:sql -o mi-seed.sql
```

### Opciones

| Opción | Descripción |
|--------|-------------|
| `--truncate, -t` | Incluir TRUNCATE al inicio del SQL |
| `--output, -o` | Nombre del archivo de salida (default: seed.sql) |
| `--dry-run, -d` | Mostrar SQL en consola sin escribir archivo |
| `--help, -h` | Mostrar ayuda |

### Ejecutar el SQL

Una vez generado `seed.sql`:

```bash
# En Supabase local
psql -h localhost -U postgres -d postgres -f seed/seed.sql

# En Supabase dashboard
# Copiar y pegar el contenido en el SQL Editor

# Con la CLI de Supabase
npx supabase db execute --file seed/seed.sql
```

## 📊 Datos que se Generan

### Inmobiliarias (2 por defecto)
- **Inmobiliaria Costa del Plata** - Mar del Plata
- **Urban Living Argentina** - Buenos Aires
- **Sierra Propiedades** - Córdoba

### Perfiles
- Coordinadores (1 por inmobiliaria)
- Agentes (3 por inmobiliaria)
- Clientes (3 por defecto)

### Propiedades (~10)
Distribuidas entre las inmobiliarias con diferentes tipos:
- Departamentos, Casas, Condominios, Terrenos, Comercial

### Listados, Imágenes, Favoritos, Inquiries
Relaciones completas entre todas las entidades.

## 📁 Estructura

```
seed/
├── generate-sql.ts           # Script CLI principal
├── seed.sql                   # Archivo generado (no commiteado)
├── types.ts                   # Tipos TypeScript
├── lib/
│   ├── logger.ts             # Utilidades de logging
│   ├── faker-data/           # Generadores de datos fake
│   │   ├── index.ts
│   │   ├── uuid.ts
│   │   ├── real-estates.ts
│   │   ├── profiles.ts
│   │   ├── properties.ts
│   │   ├── listings.ts
│   │   ├── property-images.ts
│   │   ├── favorites.ts
│   │   └── inquiries.ts
│   └── sql-generator/        # Generadores SQL
│       ├── index.ts          # Orquestador principal
│       ├── sql-builder.ts    # Utilidades SQL
│       ├── real-estates.ts
│       ├── profiles.ts
│       ├── real-estate-agents.ts
│       ├── properties.ts
│       ├── property-images.ts
│       ├── listings.ts
│       ├── favorites.ts
│       └── inquiries.ts
├── run-seed.ts               # DEPRECATED: Seed directo a Supabase
└── lib/supabase.ts           # DEPRECATED: Cliente Supabase
```

## 🔧 Personalización

Edita `types.ts` → `DEFAULT_SEED_OPTIONS` para cambiar cantidades:

```typescript
export const DEFAULT_SEED_OPTIONS: SeedOptions = {
  realEstateCount: 2,        // Cantidad de inmobiliarias
  agentsPerRealEstate: 3,     // Agentes por inmobiliaria
  clientsCount: 3,            // Clientes
  propertiesPerRealEstate: 5, // Propiedades por inmobiliaria
  listingsPerProperty: 1,     // Listados por propiedad
  favoritesCount: 5,          // Favoritos
  inquiriesCount: 8,           // Inquiries/consultas
};
```

## ⚠️ Notas

### seed.sql no está en git
El archivo `seed.sql` está en `.gitignore` ya que es generado automáticamente.

### Faker seed para reproducibilidad
El sistema usa `faker.seed(42)` para garantizar datos consistentes entre ejecuciones.

### No incluye auth.users
Los usuarios de autenticación deben crearse manualmente o desde otro proceso.

---

## Legacy: Seed Directo (Deprecated)

**⚠️ Este método está deprecated. Usar el generador SQL.**

El script `run-seed.ts` inserta datos directamente en Supabase. Requiere:
- Variables de entorno configuradas
- Conexión a Supabase

```bash
pnpm seed           # Seed completo
pnpm seed:dry-run   # Ver qué se insertaría
```

Este método ya no se mantiene y será eliminado en una versión futura.