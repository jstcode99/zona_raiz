# AGENTS.md

Este archivo es leído por opencode antes de cualquier ejecución.
Define la arquitectura, patrones y reglas del proyecto.

---

## Stack

- Next.js 16+ App Router (SSR por defecto)
- TypeScript estricto
- Supabase (auth + database)
- Redis (caché de sesiones y rate limiting)
- Tailwind CSS

---
# Acerca del proyecto

## Vista General
Este proyecto es una aplicación Next.js 16+ con TypeScript, Clean Architecture (Hexagonal/Onion), Supabase, Tailwind CSS y shadcn/ui.

```
zona_raiz/
├── .env.ia
├── .env
├── .gitignore
├── .npmrc
├── components.json
├── eslint.config.mjs
├── FOLDER_STRUCTURE.md
├── global.d.ts
├── next-env.d.ts
├── next.config.ts
├── opencode.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── zona_raiz.code-workspace
├── .opencode/
│   ├── package.json
│   └── skills/
│       ├── backend-developer/
│       │   ├── references/
│       │   └── scripts/
│       │       └── validate-architecture.ts
│       ├── finish-issue/
│       ├── frontend-developer/
│       ├── linear-planning/
│       ├── start-issue/
│       └── (otros directorios de skills)
├── .vscode/
│   ├── agents.yml
│   └── settings.json
├── app/
│   ├── api/
│   │   └── agents/
│   │       └── route.ts
│   ├── components/
│   │   └── ui/ (componentes shadcn/ui)
│   ├── config/
│   │   ├── fonts.ts
│   │   └── site.ts
│   ├── hooks/
│   │   ├── use-is-current-route.tsx
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── countries.json
│   │   ├── supabase.client.ts
│   │   └── utils.ts
│   ├── [lang]/
│   │   ├── _search/
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   ├── layout.tsx
│   │   │   ├── otp/
│   │   │   ├── sign-in/
│   │   │   ├── sign-out/
│   │   │   │   └── route.ts
│   │   │   └── sign-up/
│   │   ├── dashboard/
│   │   │   ├── inquiries/
│   │   │   ├── listings/
│   │   │   │   └── [id]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   ├── properties/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── images/
│   │   │   │   │   └── listing/
│   │   │   │   ├── new/
│   │   │   │   └── [id].ts
│   │   │   ├── real-estate/
│   │   │   ├── real-estates/
│   │   │   │   ├── [id]/
│   │   │   │   └── new/
│   │   │   ├── users/
│   │   │   │   ├── [id]/
│   │   │   │   └── new/
│   │   ├── estate/
│   │   │   └── [slug]/
│   │   ├── listing/
│   │   │   └── [slug]/
│   │   ├── [...location]/
│   │   ├── onboarding/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── register-real-estate/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   ├── search-page-client.tsx
│   │   └── globals.css
│   └── favicon.ico
├── application/
│   ├── actions/ (Server Actions por entidad)
│   ├── errors/ (manejo de errores de aplicación)
│   ├── mappers/ (transformación entre entidades y DTOs)
│   ├── modules/ (módulos de la aplicación, ej: app.module.ts)
│   └── validation/ (schemas de validación Zod)
├── assets/
│   └── svg/ (componentes SVG reutilizables)
├── domain/
│   ├── entities/ (entidades del dominio)
│   ├── errors/ (errores específicos del dominio)
│   ├── ports/ (interfaces/puertos para adaptadores)
│   └── services/ (servicios de lógica de dominio)
├── features/
│   ├── agents/ (componentes UI para agents)
│   ├── auth/ (componentes de autenticación)
│   ├── dashboard/ (estadísticas y gráficos)
│   ├── image-manager/ (gestión de imágenes)
│   ├── inquiries/ (tablas y formularios de inquiries)
│   ├── landing/ (página landing)
│   ├── listing/ (componentes de listings)
│   ├── loader/ (componentes de carga)
│   ├── navigation/ (navegación, sidebars, header)
│   ├── onboarding/ (flujo de onboarding)
│   ├── places/ (selectores deubicación)
│   ├── profile/ (componentes de perfil)
│   ├── properties/ (componentes de propiedades)
│   ├── real-states/ (componentes de inmobiliarias)
│   └── users/ (componentes de usuarios)
├── i18n/
│   ├── client-router.ts
│   ├── client.ts
│   ├── detect-lang.ts
│   ├── get-route.ts
│   ├── provider.tsx
│   ├── router.ts
│   ├── server.ts
│   └── settings.ts
├── infrastructure/
│   ├── adapters/
│   │   └── supabase/ (adaptadores para cada puerto)
│   ├── config/
│   │   ├── cache.ts
│   │   ├── constants.ts
│   │   └── routes.ts
│   ├── cookies/
│   │   └── cookies.adapter.ts
│   ├── db/
│   │   ├── supabase.proxy.ts
│   │   ├── supabase.server.ts
│   │   └── supabase.server-admin.ts
│   └── notifications/
│       └── notification.service.ts
├── interfaces/
│   └── http/
│       └── http-context.ts
├── locales/
│   ├── en/ (cadenas en inglés)
│   └── es/ (cadenas en español)
├── public/
│   └── images/
├── scripts/
├── shared/
│   ├── hooks/
│   │   ├── to-action-result.ts
│   │   ├── use-server-mutation.hook.ts
│   │   └── with-server-action.ts
│   └── utils/
│       └── lang.ts
└── supabase/
    ├── .branches/
    ├── .temp/
    ├── migrations/
    └── snippets/
```

## Descripción de Directorios Principales

### `/app`
Directorio de Next.js App Router. Contiene:
- Rutas dinámicas `[lang]` para internacionalización
- Páginas de autenticación, dashboard, propiedades, etc.
- Componentes UI reutilizables (shadcn/ui)
- Configuraciones de clientes y utilidades

### `/domain`
Capa de dominio puro (sin dependencias externas):
- **`/entities`**: Entidades de negocio (Agent, Property, Listing, User, etc.)
- **`/ports`**: Interfaces abstractas que definen contratos (ej: `agent.port.ts`)
- **`/services`**: Lógica de dominio compleja
- **`/errors`**: Errores específicos del dominio

### `/application`
Capa de aplicación (use cases):
- **`/actions`**: Server Actions que orquestan casos de uso
- **`/mappers`**: Transformaciones entre entidades y DTOs
- **`/validation`**: Schemas Zod para validación de entrada
- **`/modules`**: Módulos de la aplicación (inversión de dependencias)

### `/infrastructure`
Capa de infraestructura (adaptadores al mundo exterior):
- **`/adapters/supabase`**: Implementaciones de puertos usando Supabase
- **`/db`**: Clientes de base de datos
- **`/config`**: Configuraciones de rutas, constantes, caché
- **`/cookies`**: Manejo de cookies
- **`/notifications`**: Servicio de notificaciones

### `/features`
Componentes UI organizados por dominio o funcionalidad:
- `agents/`, `properties/`, `listings/`, `users/`, `dashboard/`, etc.
- Cada feature contiene componentes específicos (forms, tables, cards, etc.)

### `/i18n`
Configuración y lógica de internacionalización:
- Cliente y server para detección de idioma
- Router para cambiar entre idiomas
- Proveedor de contexto para React

### `/locales`
Archivos JSON con cadenas traducidas por idioma (en, es) y categoría (actions, fields, messages, etc.)

### `/shared`
Utilidades compartidas:
- **`/hooks`**: Hooks personalizados reutilizables
- **`/utils`**: Funciones utilitarias generales

### `/public`
Activos estáticos (imágenes, favicon, etc.)

### Archivos de Configuración Raíz

- **`package.json`**: Dependencias y scripts npm/pnpm
- **`tsconfig.json`**: Configuración de TypeScript
- **`next.config.ts`**: Configuración de Next.js
- **`tailwind.config.ts`**: Configuración de Tailwind CSS
- **`postcss.config.mjs`**: Configuración de PostCSS
- **`eslint.config.mjs`**: Configuración de ESLint
- **`components.json`**: Configuración de shadcn/ui
- **`proxy.ts`**: Configuración de proxy para APIs externas
- **`.env`**: Variables de entorno locales (no versionadas)
- **`.opencode/`**: Skills y configuraciones de opencode
- **`.vscode/`**: Configuraciones del espacio de trabajo VSCode

## Arquitectura (Clean/Hexagonal)

El proyecto sigue **Clean Architecture** con capas claramente separadas:

1. **Dominio** (`domain/`): Reglas de negocio puras, sin dependencias
2. **Aplicación** (`application/`): Casos de uso y orquestación
3. **Infraestructura** (`infrastructure/`): Adaptadores a BD, APIs, etc.
4. **Presentación** (`app/`, `features/`): UI y rutas de Next.js

La dependencia va desde la capa exterior hacia la interior. Se usa **Inversión de Dependencias** mediante puertos (`ports`) e implementaciones (`adapters`).

## Tecnologías Principales

- **Next.js 16+** con App Router
- **TypeScript**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Tailwind CSS**
- **shadcn/ui**
- **Zod** (validación de esquemas)
- **pnpm** (gestor de paquetes)

## Convenciones

- **Server Actions** en `application/actions/`
- **Schemas Zod** en `application/validation/`
- **Entidades** en `domain/entities/`
- **Adaptadores** en `infrastructure/adapters/`
- **Puertos** en `domain/ports/`
- **Componentes UI** en `app/components/ui/` (shadcn) y `features/` (específicos)
- **Traducciones** en `locales/[idioma]/`

---