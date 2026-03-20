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

## Skills del proyecto

Leer la skill relevante **antes** de escribir cualquier código.

<available_skills>

<skill>
<name>arquitectura</name>
<description>
Arquitectura real del proyecto zona_raiz — Clean/Hexagonal con Next.js 16 App Router.
Usar SIEMPRE al crear features nuevas, módulos, rutas, componentes, o cuando el usuario
pregunte dónde va un archivo o cómo organizar código nuevo.
</description>
<location>.claude/skills/arquitectura/SKILL.md</location>
</skill>

<skill>
<name>code-conventions</name>
<description>
Convenciones de código reales del proyecto zona_raiz — TypeScript, Server Actions,
React, formularios, hooks, cache, i18n. Usar SIEMPRE al escribir o revisar cualquier
archivo TypeScript/React del proyecto, o cuando el usuario pregunte cómo implementar algo.
</description>
<location>.claude/skills/code-conventions/SKILL.md</location>
</skill>

<skill>
<name>workflows</name>
<description>
Flujos de trabajo del proyecto zona_raiz: desarrollo local, migraciones Supabase,
cache tags, testing con Vitest, deploy. Usar al preguntar sobre comandos, migraciones,
cache, tests, o cualquier tarea del ciclo de desarrollo.
</description>
<location>.claude/skills/workflows/SKILL.md</location>
</skill>

<skill>
<name>integraciones</name>
<description>
Integraciones con servicios externos en zona_raiz: Supabase Auth, Storage (buckets reales),
RLS multi-tenant, Google Maps, hCaptcha, Google OAuth. Usar al trabajar con autenticación,
subida de archivos, políticas RLS, mapas, o cualquier servicio externo del proyecto.
</description>
<location>.claude/skills/integraciones/SKILL.md</location>
</skill>

</available_skills>

## Reglas para todos los agentes

- Leer la skill relevante ANTES de escribir código
- Nunca instanciar clientes Supabase fuera de `infrastructure/db/`
- Nunca instanciar adapters o servicios fuera de `appModule()`
- Usar `CACHE_TAGS` de constants.ts — nunca strings crudos para revalidateTag
- Sin `any` en TypeScript (excepto mappers con rows de Supabase sin tipo)
- Usar `@/` para todos los imports — nunca rutas relativas
- Issues solo en Linear — nunca GitHub Issues
- Traducciones siempre en `locales/es/` y `locales/en/` al mismo tiempo
