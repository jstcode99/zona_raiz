---
name: arquitectura
description: >
  Arquitectura real del proyecto zona_raiz — Clean/Hexagonal con Next.js 16 App Router.
  Usar SIEMPRE al crear features nuevas, módulos, rutas, componentes, o cuando el usuario
  pregunte dónde va un archivo o cómo organizar código nuevo.
---

# Arquitectura — zona_raiz

## Capas y regla de dependencia

```
app/, features/          ← Presentación (UI, rutas)
application/             ← Aplicación (actions, validation, mappers, modules)
infrastructure/          ← Infraestructura (adapters, db, config)
domain/                  ← Dominio puro (entities, ports, services, errors)
```

**La dependencia siempre va hacia adentro: app → application → domain ← infrastructure**  
Nunca importes `infrastructure/` desde `domain/`.

## Árbol de carpetas

```
zona_raiz/
├── app/[lang]/                     # App Router con i18n obligatoria
│   ├── auth/                       # sign-in, sign-up, otp, callback, sign-out
│   ├── dashboard/                  # properties, listings, users, enquiries, profile
│   ├── onboarding/                 # primer acceso, registro inmobiliaria
│   ├── listing/[slug]/             # página pública de listado
│   ├── estate/[slug]/              # página pública de inmobiliaria
│   ├── [..location]/               # búsqueda por ubicación
│   ├── layout.tsx, page.tsx        # landing
│   └── providers.tsx               # ThemeProvider, ReactQueryProvider, etc.
│
├── application/
│   ├── actions/                    # Server Actions por entidad
│   ├── mappers/                    # row DB → entidad de dominio
│   ├── modules/app.module.ts       # único punto de composición DI
│   ├── validation/                 # schemas Yup (base/ + por entidad)
│   └── errors/                     # handle-error.ts, to-action-result.ts
│
├── domain/
│   ├── entities/                   # tipos puros del negocio + enums
│   ├── ports/                      # interfaces que la infra debe implementar
│   ├── services/                   # lógica de negocio + unstable_cache
│   ├── errors/                     # domain-error.ts, auth-error.ts, user.error.ts
│   └── types/                      # tipos auxiliares de dominio
│
├── infrastructure/
│   ├── adapters/supabase/          # implementaciones de puertos con Supabase
│   ├── cookies/cookies.adapter.ts  # implementa CookiesPort
│   ├── db/
│   │   ├── supabase.server.ts      # cliente server (SSR)
│   │   ├── supabase.server-admin.ts # cliente admin (service_role)
│   │   └── supabase.proxy.ts       # proxy para server components
│   ├── config/
│   │   ├── constants.ts            # CACHE_TAGS, COOKIE_NAMES, STORAGE_BUCKETS, FILE_LIMITS
│   │   ├── routes.ts               # ROUTES + createRouter(lang)
│   │   └── cache.ts                # CacheConfig interface
│   └── notifications/              # notification.service.ts
│
├── features/                       # componentes UI agrupados por dominio
│   ├── agents/, auth/, dashboard/
│   ├── properties/, listings/, real-states/
│   ├── users/, enquiries/, profile/
│   ├── favorites/, image-manager/, import/
│   ├── places/, landing/, navigation/
│   └── onboarding/, loader/
│
├── shared/
│   ├── hooks/
│   │   ├── with-server-action.ts   # wrapper que produce ActionResult
│   │   ├── use-server-mutation.hook.ts # hook cliente para invocar actions
│   │   └── to-action-result.ts     # convierte errores a ActionResult
│   ├── redirect.ts
│   └── utils/lang.ts               # getLangServerSide()
│
├── app/components/ui/              # componentes shadcn/ui base
├── app/hooks/                      # hooks de app (use-mobile, use-routes, etc.)
├── app/lib/
│   ├── supabase.client.ts          # cliente browser para Client Components
│   └── utils.ts                    # cn, flatten, generateSlug
│
├── i18n/                           # settings, server, client, router, provider
├── locales/[en|es]/                # archivos JSON de traducción
├── interfaces/http/http-context.ts # CookieContext type
└── supabase/migrations/            # migraciones SQL
```

## Dónde va cada cosa nueva

| Qué creas | Dónde |
|---|---|
| Entidad de negocio | `domain/entities/<entidad>.entity.ts` |
| Enum de dominio | `domain/entities/<entidad>.enums.ts` |
| Interfaz de repositorio | `domain/ports/<entidad>.port.ts` |
| Lógica de negocio | `domain/services/<entidad>.service.ts` |
| Implementación Supabase | `infrastructure/adapters/supabase/supabase-<entidad>.adapter.ts` |
| Schema de validación | `application/validation/<entidad>.validation.ts` o `.schema.ts` |
| Server Action | `application/actions/<entidad>.actions.ts` |
| Mapper DB→entidad | `application/mappers/<entidad>.mapper.ts` |
| Componente de feature | `features/<dominio>/<componente>.tsx` |
| Componente UI base | `app/components/ui/<componente>.tsx` |
| Página de ruta | `app/[lang]/<ruta>/page.tsx` |
| Hook del cliente | `app/hooks/use-<nombre>.ts` |
| Migración SQL | `supabase/migrations/<timestamp>_<descripcion>.sql` |
| Cache tag nuevo | `infrastructure/config/constants.ts` → `CACHE_TAGS` |
| Bucket nuevo | `infrastructure/config/constants.ts` → `STORAGE_BUCKETS` |

## Entidades del dominio actuales

`auth`, `profile`, `real-estate`, `agent`, `property`, `listing`, `property-image`, `inquiry`, `favorite`, `session`, `user`, `import`

Al añadir una entidad nueva, sigue este orden:
1. `domain/entities/` → entidad + enums
2. `domain/ports/` → interfaz
3. `domain/services/` → servicio
4. `infrastructure/adapters/supabase/` → adapter
5. `application/validation/` → schema Yup
6. `application/mappers/` → mapper
7. `application/modules/app.module.ts` → registrar
8. `application/actions/` → Server Actions
9. `features/<dominio>/` → componentes UI
10. `app/[lang]/` → rutas/páginas
