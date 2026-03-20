# zona_raiz — Claude Code Context

Plataforma inmobiliaria multi-tenant con Next.js 16 + Supabase + Clean Architecture.

## Stack

- **Next.js 16** App Router, React 19, TypeScript estricto
- **Supabase** — auth, PostgreSQL con RLS multi-tenant, Storage
- **Clean/Hexagonal Architecture** — domain → ports → adapters
- **Tailwind CSS** + shadcn/ui + Radix UI
- **Yup** (validación), **react-hook-form**, **Vitest** (tests)
- **i18n** con rutas dinámicas `[lang]` (es/en)
- **pnpm**

## Agentes disponibles

- `@task-orchestrator` — enruta solicitudes al agente correcto
- `@builder` — implementa features e issues de Linear end-to-end
- `@implementation-tester` — valida con Vitest, type check y patrones del proyecto
- `@linear-planning-agent` — crea y gestiona issues en Linear (nunca GitHub Issues)

## Ciclo de desarrollo
 
```
"inicia KRO-X"
    │
    ▼
@issue-starter ── crea worktree + rama + Linear: In Progress
    │
    ▼
@builder ── implementa en worktree con commits semánticos granulares
    │
    ▼
@implementation-tester ── type check + tests + patrones
    │ NECESITA CORRECCIONES → vuelve a @builder
    │ APROBADO
    ▼
@pr-manager (Fase 1) ── push + crea PR + Linear: In Review
    │
    ▼
[tú revisas el PR en GitHub — Vercel preview activo]
    │
    ▼ "aprobado" / "merge KRO-X"
@pr-manager (Fase 2) ── squash merge + Linear: Done + elimina worktree
```
 
## Skills disponibles
 
Las skills se cargan bajo demanda con la herramienta `skill`.
 
| Skill | Cuándo usarla |
|---|---|
| `arquitectura` | Crear features, módulos, rutas — dónde va cada archivo |
| `code-conventions` | Escribir o revisar cualquier código TypeScript/React |
| `integraciones` | Supabase Auth, Storage, RLS, Google Maps |
| `workflows` | Migraciones, CACHE_TAGS, comandos pnpm, testing |
| `git-workflow` | Worktrees, commits semánticos, PRs, merge squash |

# MCP disponibles por agente
 
| Agente | linear | supabase | context7 |
|---|---|---|---|
| `issue-starter` | ✅ | ❌ | ❌ |
| `builder` | ❌ | ✅ | ✅ |
| `implementation-tester` | ❌ | ✅ | ❌ |
| `pr-manager` | ✅ | ❌ | ❌ |
| `linear-planning-agent` | ✅ | ❌ | ❌ |

## Convenciones de ramas
 
- Features: `feature/kro-X-slug`
- Bugs: `fix/kro-X-slug`
- Worktrees en: `~/projects/zona_raiz-<slug>/`

## Reglas para todos los agentes

- Leer la skill relevante ANTES de escribir código
- Nunca instanciar clientes Supabase fuera de `infrastructure/db/`
- `withServerAction` en todos los Server Actions — nunca try/catch manual
- Nunca instanciar adapters o servicios fuera de `appModule()`
- Usar `CACHE_TAGS` de constants.ts — nunca strings crudos para revalidateTag
- Sin `any` en TypeScript (excepto mappers con rows de Supabase sin tipo)
- Usar `@/` para todos los imports — nunca rutas relativas
- Issues solo en Linear — nunca GitHub Issues
- Traducciones siempre en `locales/es/` y `locales/en/` al mismo tiempo
- Seguir la estructura de uso de useTraslation
