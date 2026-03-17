---
name: backend-developer
description: >
  Guía de arquitectura y convenciones para desarrollar backend en este proyecto Next.js con Clean Architecture, Supabase y TypeScript.
  Usar SIEMPRE que el agente vaya a: crear un nuevo servicio, adapter, port, action, módulo, entidad o cualquier archivo backend.
  Usar también cuando se modifique lógica de dominio, acceso a base de datos, autenticación, sesión, autorización por rol, o se registre un nuevo servicio en appModule.
  Si el agente está a punto de escribir lógica de negocio directamente en un Server Action, o mezclar infraestructura con dominio, DEBE consultar este skill primero.
---

# Backend Developer Skill

Este proyecto usa **Clean Architecture** en Next.js con Supabase como backend de datos. Todo el código backend sigue un flujo estricto de capas. Desviarse de este flujo es un error de arquitectura.

---

## Capas y su responsabilidad

```
Server Action (interfaces/http)
    ↓
appModule()          ← instancia servicios y adapters
    ↓
Service (domain)     ← lógica de negocio pura
    ↓
Port (domain)        ← interfaz/contrato (solo tipos)
    ↓
Adapter (infrastructure) ← implementación con Supabase
    ↓
Supabase DB
```

**Regla de oro**: cada capa solo conoce la capa inmediatamente inferior a través de una interfaz (Port). Nunca saltarse capas.

---

## 1. Convención de archivos

| Tipo | Ubicación | Nombre |
|------|-----------|--------|
| Entidad | `domain/entities/` | `[nombre].entity.ts` |
| Port | `domain/ports/` | `[nombre].port.ts` |
| Service | `domain/services/` | `[nombre].service.ts` |
| Adapter | `infrastructure/adapters/supabase/` | `supabase-[nombre].adapter.ts` |
| Mapper | `application/mappers/` | `[nombre].mapper.ts` |
| Server Action | `application/actions/` | `[nombre].action.ts` |

---

## 2. Implementar un módulo completo

Para cada nuevo recurso sigue este orden exacto:

### Paso 1 — Entidad
```typescript
// domain/entities/[nombre].entity.ts
export interface [Nombre]Entity {
  id: string;
  created_at: string;
  // ... campos del dominio
}
```

### Paso 2 — Port (contrato)
```typescript
// domain/ports/[nombre].port.ts
import { [Nombre]Entity } from "../entities/[nombre].entity";

export interface [Nombre]Port {
  all(filters?: any): Promise<[Nombre]Entity[]>;
  findById(id: string): Promise<[Nombre]Entity | null>;
  create(data: Partial<[Nombre]Entity>): Promise<[Nombre]Entity>;
  update(id: string, data: Partial<[Nombre]Entity>): Promise<[Nombre]Entity>;
  delete(id: string): Promise<void>;
  count(filters?: any): Promise<number>;
}
```

### Paso 3 — Mapper
```typescript
// application/mappers/[nombre].mapper.ts
import { [Nombre]Entity } from "@/domain/entities/[nombre].entity";

export function map[Nombre]RowToEntity(row: any): [Nombre]Entity {
  return {
    id: row.id,
    created_at: row.created_at,
    // mapea todos los campos
  };
}
```

### Paso 4 — Adapter (Supabase)
```typescript
// infrastructure/adapters/supabase/supabase-[nombre].adapter.ts
import { map[Nombre]RowToEntity } from "@/application/mappers/[nombre].mapper";
import { [Nombre]Entity } from "@/domain/entities/[nombre].entity";
import { [Nombre]Port } from "@/domain/ports/[nombre].port";
import { SupabaseClient } from "@supabase/supabase-js";

export class Supabase[Nombre]Adapter implements [Nombre]Port {
  constructor(private readonly supabase: SupabaseClient) {}

  async all(filters?: any): Promise<[Nombre]Entity[]> {
    let query = this.supabase
      .from("[tabla]")
      .select("*")
      .order("created_at", { ascending: false });

    // aplicar filtros dinámicamente
    if (filters?.campo) query = query.eq("campo", filters.campo);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(map[Nombre]RowToEntity);
  }

  async findById(id: string): Promise<[Nombre]Entity | null> {
    const { data: row, error } = await this.supabase
      .from("[tabla]")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !row) return null;
    return map[Nombre]RowToEntity(row);
  }

  async create(data: Partial<[Nombre]Entity>): Promise<[Nombre]Entity> {
    const { data: row, error } = await this.supabase
      .from("[tabla]")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return map[Nombre]RowToEntity(row);
  }

  async update(id: string, data: Partial<[Nombre]Entity>): Promise<[Nombre]Entity> {
    const { data: row, error } = await this.supabase
      .from("[tabla]")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return map[Nombre]RowToEntity(row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("[tabla]").delete().eq("id", id);
    if (error) throw error;
  }

  async count(filters?: any): Promise<number> {
    const { count, error } = await this.supabase
      .from("[tabla]")
      .select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return count || 0;
  }
}
```

### Paso 5 — Service
```typescript
// domain/services/[nombre].service.ts
import { [Nombre]Port } from "../ports/[nombre].port";
import { [Nombre]Entity } from "../entities/[nombre].entity";

export type Create[Nombre]Input = Omit<[Nombre]Entity, "id" | "created_at">;

export class [Nombre]Service {
  constructor(private readonly repo: [Nombre]Port) {}

  all(filters?: any)                          { return this.repo.all(filters); }
  findById(id: string)                        { return this.repo.findById(id); }
  create(data: Create[Nombre]Input)           { return this.repo.create(data); }
  update(id: string, data: Partial<[Nombre]Entity>) { return this.repo.update(id, data); }
  delete(id: string)                          { return this.repo.delete(id); }
  count(filters?: any)                        { return this.repo.count(filters); }
}
```

### Paso 6 — Registrar en appModule
```typescript
// application/modules/app.module.ts
// 1. Importar adapter y service nuevos
import { Supabase[Nombre]Adapter } from "@/infrastructure/adapters/supabase/supabase-[nombre].adapter"
import { [Nombre]Service } from "@/domain/services/[nombre].service"

export async function appModule(lang: Lang = "es", ctx: CookieContext) {
  const supabase = await SupabaseServerClient()
  // ... adapters existentes ...

  const [nombre]Adapter = new Supabase[Nombre]Adapter(supabase);  // 2. Instanciar adapter
  const [nombre]Service = new [Nombre]Service([nombre]Adapter);   // 3. Instanciar service

  return {
    // ... servicios existentes ...
    [nombre]Service,   // 4. Exportar
  }
}
```

---

## 3. Server Actions — patrón obligatorio

Todo Server Action **debe** seguir este patrón exacto. Ver referencia completa en `references/server-actions.md`.

```typescript
"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { revalidatePath } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { appModule } from "../modules/app.module"
import { initI18n } from "@/i18n/server"

export const [nombre]Action = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { sessionService, [nombre]Service } = await appModule(lang, { cookies: cookieStore })

    // 1. Extraer y validar inputs
    const id = formData.get("id") as string
    if (!id) throw new Error(t('validations:required', { attribute: 'ID' }))

    // 2. Verificar sesión
    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error(t('exceptions:unauthorized'))

    // 3. Verificar autorización por rol
    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()
    if (!isAdmin && !isCoordinator) throw new Error(t('exceptions:unauthorized'))

    // 4. Ejecutar lógica de negocio via service
    await [nombre]Service.delete(id)

    // 5. Revalidar ruta
    revalidatePath(routes.[nombre]s())
  }
)
```

**Prohibiciones en Server Actions:**
- ❌ No instanciar adapters directamente — siempre usar `appModule()`
- ❌ No escribir queries de Supabase — eso es responsabilidad del adapter
- ❌ No omitir verificación de sesión/autorización
- ❌ No usar `throw new Error("hardcoded string")` — siempre usar `t('clave')`

---

## 4. Autorización por roles — patrón estándar

Siempre verificar en este orden dentro de un Server Action:

```typescript
const userId = await sessionService.getCurrentUserId()
if (!userId) throw new Error(t('exceptions:unauthorized'))

const isAdmin = await sessionService.isAdmin()
const isCoordinator = await sessionService.isCoordinator()
const isAssignedAgent = entity.assigned_to === userId   // solo si aplica

if (!isAdmin && !isCoordinator && !isAssignedAgent) {
  throw new Error(t('exceptions:unauthorized'))
}
```

Roles disponibles en `sessionService`: `isAdmin()`, `isCoordinator()`, `isAgent()`.

---

## 5. Servicios disponibles en appModule

Referencia rápida de lo que ya existe. **No reinstanciar lo que ya existe.**

| Variable exportada | Responsabilidad |
|---|---|
| `authService` | Login, registro, recuperación de contraseña |
| `sessionService` | Usuario actual, roles, validación de sesión |
| `profileService` | Perfil de usuario, rol en inmobiliaria |
| `userService` | Gestión de usuarios |
| `agentService` | Agentes inmobiliarios |
| `realEstateService` | Inmobiliarias |
| `propertyService` | Propiedades |
| `propertyImageService` | Imágenes de propiedades |
| `listingService` | Publicaciones/listings |
| `inquiryService` | Consultas/leads de clientes |
| `onboardingService` | Flujo de onboarding |
| `cookiesService` | Manejo de cookies |

Para detalles de métodos disponibles en cada servicio → ver `references/services-api.md`

---

## 6. Errores comunes a evitar

| ❌ Anti-patrón | ✅ Corrección |
|---|---|
| Usar `supabase` directamente en un Action | Usar el adapter via service |
| Crear adapter sin su Port correspondiente | Siempre definir el Port primero |
| Service con lógica de query SQL/Supabase | La query va en el adapter |
| Omitir el mapper y usar `row` directamente | Siempre mapear con `mapXRowToEntity()` |
| Registrar adapter pero no el service en appModule | Registrar ambos |
| `findById` que lanza error si no existe | Debe retornar `null` |
| Queries sin manejo de `error` de Supabase | Siempre `if (error) throw new Error(error.message)` |

---

## 7. Scripts disponibles
 
### `scripts/validate-architecture.ts` — Ejecución automática por el agente
 
El agente **debe ejecutar este script** al finalizar cualquier cambio que toque las capas de backend (nuevo módulo, refactor de service, nuevo action, etc.).
 
```bash
# Validar sin sugerencias
npx ts-node scripts/validate-architecture.ts
 
# Validar con sugerencias de corrección
npx ts-node scripts/validate-architecture.ts --fix
```
 
**Qué valida (5 reglas):**
 
| Regla | Descripción |
|-------|-------------|
| R1 · Aislamiento de dominio | `domain/*` no importa de `infrastructure/` ni `application/` |
| R2 · Adapter implementa Port | Cada adapter tiene `implements XxxPort` y el Port existe |
| R3 · Actions solo usan appModule | Ningún action importa adapters directamente ni tiene queries Supabase |
| R4 · Consistencia de appModule | Todo adapter instanciado tiene su service, y está en el `return` |
| R5 · Pureza de Services | Ningún service contiene lógica de Supabase |
 
**Cuándo el agente lo ejecuta:**
- Después de crear cualquier archivo en `domain/`, `infrastructure/`, `application/`
- Después de modificar `app.module.ts`
- Antes de declarar que una tarea de backend está completa
 
Si hay violaciones → corregirlas antes de continuar. Exit 0 = sin errores.
 
---
 
### `scripts/dev-check.mjs` — Ejecutado por el desarrollador
 
Agrupa lint + types + tests en un solo comando. El agente lo **genera/sugiere** pero el desarrollador lo corre manualmente (requiere el proyecto instalado).
 
```bash
# Correr todo
node scripts/dev-check.mjs
 
# Solo lint
node scripts/dev-check.mjs lint
 
# Solo TypeScript
node scripts/dev-check.mjs types
 
# Solo tests
node scripts/dev-check.mjs test
 
# Solo validación de arquitectura
node scripts/dev-check.mjs arch
 
# Combinaciones
node scripts/dev-check.mjs lint types arch
```
 
**Cuándo el agente lo sugiere:**
- Al finalizar un módulo completo (entidad + port + adapter + service + appModule)
- Cuando el desarrollador pide "verificar que todo esté bien"
- Antes de un commit importante
 
**Detección automática** de: `pnpm` / `yarn` / `npm`, `vitest` / `jest`, rutas de directorios del proyecto.
 
---
 
## Referencias adicionales
 
- `references/server-actions.md` — Patrones completos de Server Actions con ejemplos reales
- `references/services-api.md` — API completa de cada servicio existente
 