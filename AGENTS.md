# AGENTS.md

Este archivo es leído por opencode antes de cualquier ejecución.
Define la arquitectura, patrones y reglas del proyecto.

---

## Stack

- Next.js 16+ App Router (SSR por defecto)
- TypeScript estricto
- Supabase (auth + database + storage)
- Redis (caché de sesiones y rate limiting)
- Tailwind CSS + shadcn/ui
- Yup (validación)
- pnpm
- i18n con rutas dinámicas `[lang]`

## Arquitectura (Clean / Hexagonal)

Capas en orden de dependencia (exterior → interior):

```
Presentación  →  app/, features/
Aplicación    →  application/actions/, application/mappers/, application/validation/
Infraestructura → infrastructure/adapters/, infrastructure/db/
Dominio       →  domain/entities/, domain/ports/, domain/services/
```

La dependencia va siempre hacia adentro. Nunca importes infraestructura desde dominio.

## Estructura de carpetas clave

```
zona_raiz/
├── app/[lang]/              # Rutas App Router con i18n
│   ├── auth/                # Sign in, sign up, OTP, callback
│   ├── dashboard/           # Propiedades, listings, usuarios, inquiries
│   └── onboarding/
├── application/
│   ├── actions/             # Server Actions por entidad
│   ├── mappers/             # Entidad ↔ DTO
│   ├── modules/             # Inversión de dependencias
│   └── validation/          # Schemas Yup
├── domain/
│   ├── entities/            # Entidades de negocio puras
│   ├── ports/               # Interfaces abstractas
│   ├── services/            # Lógica de dominio
│   └── errors/
├── features/                # Componentes UI por dominio
│   ├── agents/, auth/, dashboard/, properties/, listings/
│   ├── real-states/, users/, inquiries/, profile/
│   └── navigation/, onboarding/, image-manager/
├── infrastructure/
│   ├── adapters/supabase/   # Implementaciones de puertos
│   ├── db/                  # supabase.server.ts, supabase.proxy.ts
│   ├── config/              # routes.ts, constants.ts, cache.ts
│   └── cookies/
├── i18n/                    # Cliente, server, router, provider
├── locales/en/, locales/es/ # Traducciones JSON
├── shared/hooks/, shared/utils/
└── supabase/migrations/
```

## Convenciones obligatorias

### Supabase
- Server Components y Server Actions → `infrastructure/db/supabase.server.ts`
- Client Components → `app/lib/supabase.client.ts`
- Admin operations → `infrastructure/db/supabase.server-admin.ts`
- Nunca inicialices un cliente Supabase directamente fuera de estos archivos

### Server Actions
- Viven en `application/actions/<entidad>.actions.ts`
- Usan schemas Yup de `application/validation/`
- Devuelven `ActionResult` via `shared/hooks/to-action-result.ts`
- Se invocan desde el cliente con `useServerMutation` de `shared/hooks/`

### Puertos y Adaptadores
- Define el puerto en `domain/ports/<entidad>.port.ts`
- Implementa el adaptador en `infrastructure/adapters/supabase/<entidad>.adapter.ts`
- Registra en `application/modules/app.module.ts`

### Componentes UI
- Componentes base (shadcn) → `app/components/ui/`
- Componentes por feature → `features/<dominio>/`
- No pongas lógica de negocio en componentes — usa Server Actions

### i18n
- Todas las rutas llevan prefijo `[lang]`
- Traducciones en `locales/[en|es]/`
- Usa `i18n/server.ts` en Server Components, `i18n/client.ts` en Client Components

### TypeScript
- Estricto — sin `any`
- Entidades en `domain/entities/`, tipos compartidos en `shared/`

## Agentes disponibles

- `@orchestrator` — coordina el ciclo completo
- `@planner` — genera tasks y crea issues en Linear
- `@backend-developer` — Server Actions, adaptadores, puertos
- `@frontend-developer` — componentes en features/, rutas en app/
- `@code-reviewer` — solo lectura, revisa arquitectura y seguridad
- `@test-writer` — tests E2E con Playwright
- `@pr-manager` — merge y cierre de issues

## Ciclo de trabajo

```
@orchestrator → @planner → [aprobación usuario]
→ @backend-developer + @frontend-developer (paralelo)
→ @code-reviewer → @test-writer → [QA pass]
→ @pr-manager
```

## Gestión de Issues

### ⚠️ SOLO Linear

**NUNCA usar:**
- GitHub Issues
- Otros tableros (Trello, Asana, Jira, etc.)

**SIEMPRE usar Linear** para todas las issues del proyecto.

### Reglas
- Crear issues SOLO en Linear
- Actualizar estados en Linear
- Reportar IDs de Linear
- Si existe issue en otro sistema, migrarla a Linear primero

## Carga lazy de reglas

CRITICAL: Carga estos archivos solo cuando sean relevantes:
- Implementar backend → @.opencode/skills/backend-developer/SKILL.md
- Implementar frontend → @.opencode/skills/frontend-developer/SKILL.md
- Crear issues Linear → @.opencode/skills/linear-planning/SKILL.md
- Commits y ramas → @.opencode/rules/git.md
