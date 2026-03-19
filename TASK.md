# Task: Landing - Corrección de Arquitectura

## Contexto y Análisis

### Problema Identificado
El código del landing no sigue los patrones de arquitectura del proyecto, violando las reglas de Clean Architecture.

### Análisis Realizado

#### Archivos Analizados:
- `features/landing/*.tsx` - Componentes del landing
- `application/actions/landing.actions.ts` - Server Actions
- `application/validation/*.ts` - Schemas de validación
- `domain/services/listing.service.ts` - Servicio de listings

#### Violaciones Detectadas:

| # | Archivo | Problema | Gravedad |
|---|---------|----------|----------|
| 1 | `landing-hero.tsx` | Validación Yup inline en lugar de usar `landing-search.schema.ts` | 🔴 Alta |
| 2 | `landing-hero.tsx` | Routing manual en lugar de `searchListingsAction` | 🔴 Alta |
| 3 | `landing-cities.tsx` | Importa `LandingCity` desde `application/actions/` (capa incorrecta) | 🟡 Media |
| 4 | `landing.actions.ts` | Tipos en capa de aplicación en lugar de `domain/types/` | 🟡 Media |
| 5 | `landing-trust.tsx` | Client Component innecesario (no tiene estado) | 🟢 Baja |
| 6 | `landing-footer.tsx` | Client Component innecesario (no tiene estado) | 🟢 Baja |

### Causa Raíz
El código fue implementado sin seguir los patrones documentados en:
- `.opencode/skills/frontend-developer/SKILL.md`
- `.opencode/skills/backend-developer/SKILL.MD`

### Solución Propuesta

**Backend (KRO-105):**
1. Crear `domain/types/landing.types.ts` con tipos `LandingCity`, `LandingStats`, `LandingData`
2. Actualizar `landing.actions.ts` para importar tipos desde `domain/types/`
3. Crear `searchListingsAction` que valide con Yup y redirija

**Frontend (KRO-106):**
1. Actualizar `landing-hero.tsx` para usar `searchListingsAction` y schema de validación
2. Actualizar `landing-cities.tsx` para importar tipos desde `domain/types/`
3. Convertir `landing-trust.tsx` y `landing-footer.tsx` a Server Components

---

## Subtasks

### Backend (KRO-105)

**Archivos a modificar:**
- `domain/types/landing.types.ts` (CREAR)
- `application/actions/landing.actions.ts` (MODIFICAR)
- `application/validation/landing-search.schema.ts` (VERIFICAR)

**Checklist:**
- [ ] Crear `domain/types/landing.types.ts` con:
  - `LandingCity { name, slug, count, image }`
  - `LandingStats { totalListings, totalAgents, totalCities }`
  - `LandingData { listings, cities, stats }`
- [ ] Actualizar `landing.actions.ts`:
  - Importar tipos desde `domain/types/`
  - Crear `searchListingsAction` que valide con Yup y redirija
- [ ] Seguir patrón de `withServerAction`

**Referencias de Patrón:**
```typescript
// domain/types/landing.types.ts
export interface LandingCity {
  name: string
  slug: string
  count: number
  image?: string
}

export interface LandingStats {
  totalListings: number
  totalAgents: number
  totalCities: number
}

export interface LandingData {
  listings: ListingEntity[]
  cities: LandingCity[]
  stats: LandingStats
}
```

### Frontend (KRO-106)

**Archivos a modificar:**
- `features/landing/landing-hero.tsx` (MODIFICAR)
- `features/landing/landing-cities.tsx` (MODIFICAR)
- `features/landing/landing-trust.tsx` (MODIFICAR)
- `features/landing/landing-footer.tsx` (MODIFICAR)

**Checklist:**
- [ ] `landing-hero.tsx`:
  - Usar `searchListingsAction` en lugar de routing manual
  - Usar schema de `landing-search.schema.ts` para validación
- [ ] `landing-cities.tsx`:
  - Importar `LandingCity` desde `domain/types/landing.types.ts`
- [ ] `landing-trust.tsx`:
  - Convertir a Server Component (quitar "use client")
- [ ] `landing-footer.tsx`:
  - Convertir a Server Component (quitar "use client")

---

## Referencias

### Patrones de Backend
- `.opencode/skills/backend-developer/SKILL.MD`
- `.opencode/agents/backend-developer.md`

### Patrones de Frontend
- `.opencode/skills/frontend-developer/SKILL.md`
- `.opencode/agents/frontend-developer.md`

### Archivos de Referencia
- `application/actions/favorite.action.ts` - Ejemplo de Server Action con `withServerAction`
- `features/auth/sign-in-form.tsx` - Ejemplo de form con `useServerMutation`
- `infrastructure/config/routes.ts` - Rutas disponibles

### Skills Disponibles
```bash
# Skill de backend
@.opencode/skills/backend-developer/SKILL.MD

# Skill de frontend
@.opencode/skills/frontend-developer/SKILL.md
```

---

## Criterios de Aceptación

### Backend
- [ ] Tipos en `domain/types/` no en `application/`
- [ ] Server Actions usan `withServerAction`
- [ ] `searchListingsAction` valida y redirige correctamente

### Frontend
- [ ] Hero usa Server Action para búsqueda
- [ ] Imports correctos según capas
- [ ] Server Components cuando no hay estado (trust, footer)
- [ ] Sin "use client" innecesario

---

## Ramas y Worktrees

| Rama | Worktree | Linear |
|------|----------|--------|
| `feature/kro-105-backend` | `.opencode/worktrees/backend` | KRO-105 |
| `feature/kro-106-frontend` | `/home/dev/projects/zona_raiz` | KRO-106 |
