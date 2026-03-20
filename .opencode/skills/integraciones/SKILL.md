---
name: integraciones
description: >
  Integraciones con servicios externos en zona_raiz: Supabase Auth, Storage (buckets reales),
  RLS multi-tenant, Google Maps, hCaptcha, Google OAuth. Usar al trabajar con autenticación,
  subida de archivos, políticas RLS, mapas, o cualquier servicio externo del proyecto.
---

# Integraciones — zona_raiz

## Clientes de Supabase — cuál usar

| Contexto | Import | Cuándo |
|---|---|---|
| Server Components / Server Actions | `SupabaseServerClient()` de `@/infrastructure/db/supabase.server` | Lectura/escritura server-side normal |
| Operaciones admin (bypass RLS) | `SupabaseAdminClient()` de `@/infrastructure/db/supabase.server-admin` | Triggers, operaciones entre tenants |
| Client Components | `createClientFromLib()` de `@/app/lib/supabase.client` | Solo para auth listeners en el cliente |
| Proxy server components | `@/infrastructure/db/supabase.proxy` | Componentes server con revalidación |

**Nunca inicialices `createServerClient()` o `createBrowserClient()` directamente.**

```typescript
// ✅ Server Action / Server Component
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
const supabase = await SupabaseServerClient();

// ✅ Admin (bypass RLS)
import { SupabaseAdminClient } from "@/infrastructure/db/supabase.server-admin";
const supabase = await SupabaseAdminClient();
```

## Supabase Auth

```typescript
// Obtener usuario actual en server (siempre getUser, nunca getSession)
const { data: { user } } = await supabase.auth.getUser();

// Verificar sesión en Server Action via sessionService
const { sessionService } = await appModule(lang, { cookies: cookieStore });
const userId = await sessionService.getCurrentUserId();
if (!userId) throw new Error(t("common:exceptions.unauthorized"));
```

### Roles de usuario (cookies)
```typescript
const { cookiesService } = await appModule(lang, { cookies: cookieStore });

const role = await cookiesService.getProfileRole();
// "admin" | "coordinator" | "agent" | "client"

const realEstateId = await cookiesService.getRealEstateId();
const realEstateRole = await cookiesService.getRealEstateRole();
```

Nombres de cookies definidos en `COOKIE_NAMES` de `infrastructure/config/constants.ts`:
- `ROLE`: `"user_role"`
- `REAL_ESTATE`: `"real_estate_id"`
- `REAL_ESTATE_ROLE`: `"real_estate_role"`

## Supabase Storage — buckets reales del proyecto

```typescript
import { STORAGE_BUCKETS } from "@/infrastructure/config/constants";

// STORAGE_BUCKETS.AVATARS          = "avatars"
// STORAGE_BUCKETS.REAL_ESTATE_LOGOS = "real-estate-logos"
// STORAGE_BUCKETS.PROPERTIES        = "property-images"
```

### Subir archivo
```typescript
const supabase = await SupabaseServerClient();

const { data, error } = await supabase.storage
  .from(STORAGE_BUCKETS.PROPERTIES)
  .upload(`${realEstateId}/${propertyId}/${fileName}`, file, {
    cacheControl: "3600",
    upsert: false,
  });

if (error) throw new Error(`Upload fallido: ${error.message}`);
```

### URL pública
```typescript
const { data } = supabase.storage
  .from(STORAGE_BUCKETS.PROPERTIES)
  .getPublicUrl(`${realEstateId}/${propertyId}/${fileName}`);

const url = data.publicUrl;
```

### Eliminar archivo
```typescript
await supabase.storage
  .from(STORAGE_BUCKETS.PROPERTIES)
  .remove([`${realEstateId}/${propertyId}/${fileName}`]);
```

### Límites de archivos (FILE_LIMITS de constants.ts)
```typescript
// FILE_LIMITS.AVATAR_MAX_SIZE   = 5MB
// FILE_LIMITS.LOGO_MAX_SIZE     = 2MB
// FILE_LIMITS.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
```

## RLS — políticas multi-tenant

El proyecto usa aislamiento por `real_estate_id`. Patrón estándar:

```sql
-- Usuarios ven solo datos de su inmobiliaria
CREATE POLICY "tenant_isolation"
  ON public.mi_tabla FOR ALL
  USING (
    real_estate_id IN (
      SELECT real_estate_id FROM public.real_estate_agents
      WHERE profile_id = auth.uid()
    )
  );

-- O via función de seguridad (ver infrastructure/db/supabase.server)
CREATE POLICY "tenant_isolation_v2"
  ON public.mi_tabla FOR SELECT
  USING (
    get_user_real_estate_id() = real_estate_id
  );
```

`SupabaseAdminClient()` usa `service_role` y bypassa RLS — usarlo solo para operaciones que necesiten ver datos de múltiples tenants.

## Google Maps

```typescript
// features/places/place-selector-google.tsx
// Usa @googlemaps/js-api-loader y use-places-autocomplete
// Variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

Para selectores de dirección, usar el componente existente `PlaceSelectorGoogle` de `features/places/`.

## Google OAuth

```typescript
// features/auth/google-auth.tsx
// Usa @react-oauth/google
// Variable: NEXT_PUBLIC_GOOGLE_CLIENT_ID
// Callback manejado en app/[lang]/auth/callback/route.ts
```

## hCaptcha

```typescript
// features/auth/ — sign-up y sign-in forms
// Usa @hcaptcha/react-hcaptcha
// Variable: NEXT_PUBLIC_HCAPTCHA_SITE_KEY
```

## Notificaciones (servidor)

```typescript
// infrastructure/notifications/notification.service.ts
// Usado para notificaciones internas del sistema
import { NotificationService } from "@/infrastructure/notifications/notification.service";
```

## Integrar un servicio externo nuevo

1. Definir port en `domain/ports/<servicio>.port.ts`
2. Crear adapter en `infrastructure/adapters/<servicio>/<servicio>.adapter.ts`
3. Registrar en `application/modules/app.module.ts`
4. Credenciales en `.env.local` (nunca hardcodeadas)
5. Acceder solo desde Server Actions — nunca desde Client Components

## Rutas de la app (`infrastructure/config/routes.ts`)

```typescript
import { createRouter } from "@/i18n/router";

// En server
const routes = createRouter(lang);
routes.dashboard()
routes.properties()
routes.property(id)
routes.listings()
routes.listing(id)
routes.realEstates()
routes.realEstate(id)
routes.users()
routes.profile()
// etc.

// En client
import { useRoutes } from "@/i18n/client-router";
const routes = useRoutes();
```
