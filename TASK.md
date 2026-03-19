# Task: Landing Page - Actualización Completa

## Scope
- **Agente:** orchestrator
- **Issue Linear:** [KRO-95]
- **Rama:** N/A (issue principal)

## Descripción
Coordinar la actualización completa del landing page: backend para API y Server Actions, frontend para todas las secciones (nav, hero, listings, trust, cities, footer), i18n inglés, y animaciones globales.

---

# Task: Backend - API y Server Actions para Landing

## Scope
- **Agente:** backend
- **Issue Linear:** [KRO-96]
- **Rama:** feature/landing-2-backend

## Descripción
Crear Server Actions para el landing page y añadir métodos al listing adapter/service para obtener ciudades y stats globales.

## Checklist
- [ ] Crear `application/actions/landing.actions.ts` con:
  - `getLandingData()` → trae listings destacados, ciudades con conteos, stats globales
  - `searchListingsAction()` → Server Action que valida con Yup y redirige a página de resultados
- [ ] Añadir método `findCitiesWithListings()` en `listing.port.ts` con interfaz `CityWithCount { name: string, slug: string, count: number }`
- [ ] Implementar `findCitiesWithListings()` en `infrastructure/adapters/supabase/supabase-listing.adapter.ts`
- [ ] Añadir método `findCitiesWithListings()` en `domain/services/listing.service.ts` con cache
- [ ] Añadir método `getStats()` en listing service para obtener: total listings, total agentes, total ciudades

## Restricciones
- Seguir patrón de `application/actions/listing.actions.ts`
- Usar `appModule()` para obtener servicios
- No modificar entity existentes - solo añadir nuevos métodos al port/service
- Usar `unstable_cache` de Next.js para métodos cacheados

## Criterios de aceptación
- [ ] `getLandingData()` retorna `{ listings: ListingEntity[], cities: CityStats[], stats: GlobalStats }`
- [ ] `searchListingsAction()` valida con Yup y redirige correctamente a `/${lang}/_search?params...`
- [ ] `findCitiesWithListings()` retorna ciudades con conteo de listings activos
- [ ] `getStats()` retorna `{ totalListings: number, totalAgents: number, totalCities: number }`

## Casos de test para QA
- [ ] GET landing page muestra listings reales y stats actualizados
- [ ] Búsqueda desde hero redirige correctamente con filtros
- [ ] Ciudades mostradas coinciden con listings activos en DB

---

# Task: Frontend - Landing Nav

## Scope
- **Agente:** frontend
- **Issue Linear:** [KRO-97]
- **Rama:** feature/landing-3-nav

## Descripción
Implementar navegación completa con menú móvil funcional, animaciones y soporte i18n.

## Checklist
- [ ] Implementar menú móvil desplegable con animación (collapse/expand)
- [ ] Navegación real a: Inicio (`/${lang}`), Listados (`/${lang}/colombia`), Agentes (`/${lang}/agents`), Páginas
- [ ] Botón Login/Sign Up → `/autenticacion/login` (ES) o `/auth/sign-in` (EN) usando `createRouter()`
- [ ] Botón CTA "Publicar Propiedad" → página de signup/onboarding
- [ ] Soporte i18n completo usando `useTranslation("landing")`
- [ ] Animación de entrada (fade-in + slide-down) con CSS o framer-motion

## Restricciones
- Usar componentes shadcn/ui existentes (Button, Sheet para mobile menu)
- No crear nuevos componentes si existen en `features/navigation/`
- Usar `createRouter()` para rutas con lang

## Criterios de aceptación
- [ ] Menú móvil abre/cierra con animación suave
- [ ] Todos los links navegan a rutas válidas
- [ ] Responsive en mobile/tablet/desktop
- [ ] Transiciones de hover en desktop

## Casos de test para QA
- [ ] Click en logo redirige a home
- [ ] Click en Login abre ruta correcta según lang
- [ ] Menú móvil se abre y cierra correctamente
- [ ] Navegación funciona en todos los breakpoints

---

# Task: Frontend - Landing Hero

## Scope
- **Agente:** frontend
- **Issue Linear:** [KRO-98]
- **Rama:** feature/landing-4-hero

## Descripción
Convertir formulario de búsqueda a usar Server Action con validación Yup y datos reales de ciudades.

## Checklist
- [ ] Crear `application/validation/landing-search.schema.ts` con Yup schema para búsqueda
- [ ] Actualizar formulario para usar Server Action `searchListingsAction`
- [ ] Selector de ciudad con dropdown de ciudades reales (datos de `getLandingData()`)
- [ ] Tipos de propiedad del enum `PropertyType`
- [ ] Inputs de beds/baths/max_price funcionales
- [ ] Validación con Yup schema antes de redirigir
- [ ] Animación de entrada suave

## Restricciones
- Usar `application/validation/landing-search.schema.ts` (crear si no existe)
- Datos de ciudades desde `getLandingData()` pasado como prop o fetch en Server Component
- Usar `Lang` para traducciones

## Criterios de aceptación
- [ ] Formulario valida y redirige a `/[lang]/_search?params...`
- [ ] Dropdown muestra ciudades con resultados (no hardcodeado)
- [ ] Animaciones suaves de entrada
- [ ] Validación Yup muestra errores inline

## Casos de test para QA
- [ ] Submit con campos vacíos muestra validación
- [ ] Submit con filtros redirige correctamente
- [ ] Selector de ciudad muestra opciones dinámicas

---

# Task: Frontend - Landing Listings

## Scope
- **Agente:** frontend
- **Issue Linear:** [KRO-99]
- **Rama:** feature/landing-5-listings

## Descripción
Renderizar listings reales del servidor con animaciones de scroll.

## Checklist
- [ ] Recibir `listings: ListingEntity[]` como prop
- [ ] Renderizar cada listing con imagen (`property.property_images[0]`), precio, ubicación, beds/baths/sqft
- [ ] Link a `/[lang]/listing/[id]` usando `createRouter()`
- [ ] Animaciones de scroll (Intersection Observer o CSS animations)
- [ ] "Explorar todo" → `/${lang}/colombia`
- [ ] Mostrar tag "Arriendo" o "Venta" según `listing_type`

## Restricciones
- Usar `formatCurrency` de `app/lib/utils.ts` para precios
- Usar `propertyTypeLabels` de `domain/entities/property.entity.ts`
- Animaciones con CSS si framer-motion no está instalado

## Criterios de aceptación
- [ ] Lista de listings reales del servidor
- [ ] Animación staggered al hacer scroll (fade-in + slide-up)
- [ ] Click navega a detalle del listing
- [ ] Tags de listing_type visibles

## Casos de test para QA
- [ ] Listings mostrados son activos en DB
- [ ] Click en listing navega a detalle correcto
- [ ] Animaciones se disparan con Intersection Observer

---

# Task: Frontend - Trust & Cities

## Scope
- **Agente:** frontend
- **Issue Linear:** [KRO-100]
- **Rama:** feature/landing-6-trust-cities

## Descripción
Actualizar secciones trust y cities con datos reales y animaciones.

## Checklist

**landing-trust.tsx:**
- [ ] Recibir `stats: GlobalStats` como prop
- [ ] Stats reales: total listings, total agentes, total ciudades
- [ ] Avatares de agentes reales (si disponibles en DB)
- [ ] Logos de inmobiliarias (hardcoded elegantes si no existen en DB)

**landing-cities.tsx:**
- [ ] Recibir `cities: { name: string, slug: string, count: number, image: string }[]` como prop
- [ ] Ciudades con más listings activos
- [ ] Animación hover en cada ciudad (scale + border)
- [ ] Link a búsqueda por ciudad

## Restricciones
- Usar datos reales de `getLandingData()`
- Animaciones CSS para hover y entrada

## Criterios de aceptación
- [ ] Stats y ciudades son datos reales del servidor
- [ ] Animaciones de hover funcionan suavemente
- [ ] Ciudad clickeable para filtrar búsqueda

## Casos de test para QA
- [ ] Stats coinciden con conteos reales en DB
- [ ] Ciudades mostradas tienen listings activos
- [ ] Hover animations suaves sin lag

---

# Task: Frontend - Page Principal y Footer

## Scope
- **Agente:** frontend
- **Issue Linear:** [KRO-101]
- **Rama:** feature/landing-7-page-footer

## Descripción
Integrar datos del servidor en page.tsx y crear componente footer.

## Checklist

**app/[lang]/page.tsx:**
- [ ] Importar y usar `getLandingData()` de Server Actions
- [ ] Pasar datos a cada sección: `<LandingListings lang={lang} listings={listings} />`
- [ ] Añadir `<LandingFooter lang={lang} />`

**features/landing/landing-footer.tsx:**
- [ ] Crear componente footer con: Logo, links navegación, redes sociales, copyright
- [ ] Links: Acerca de, Términos, Privacidad, Contacto
- [ ] Soporte i18n en `locales/es/landing.json` → `footer` section
- [ ] Diseño responsive

## Restricciones
- Footer debe usar shadcn/ui components si disponibles
- Links de navegación usar `createRouter()`

## Criterios de aceptación
- [ ] Landing muestra datos reales del servidor
- [ ] Footer presente y funcional con todos los links
- [ ] Traducciones del footer funcionando

## Casos de test para QA
- [ ] Landing carga sin errores con datos reales
- [ ] Footer visible en todas las páginas del landing
- [ ] Links del footer funcionales

---

# Task: i18n - Locale Inglés

## Scope
- **Agente:** frontend
- **Issue Linear:** [KRO-102]
- **Rama:** feature/landing-8-i18n

## Descripción
Crear archivo de traducciones en inglés para el landing.

## Checklist
- [ ] Crear `locales/en/landing.json` con todas las claves de `locales/es/landing.json` traducidas
- [ ] Traducir: nav, hero, trust, listings, cities, agents, cta, footer
- [ ] Mantener consistencia de tono con el proyecto
- [ ] Añadir claves de footer que falten en español

## Restricciones
- Traducciones coherentes con el tono del proyecto
- Mismas claves que el archivo español

## Criterios de aceptación
- [ ] Archivo existe con todas las claves
- [ ] Traducciones coherentes con el tono del proyecto
- [ ] Landing funciona en ambos idiomas

## Casos de test para QA
- [ ] Cambiar URL a `/en` muestra traducciones en inglés
- [ ] No hay claves faltantes en consola

---

# Task: QA - Tests E2E Landing Page

## Scope
- **Agente:** qa
- **Issue Linear:** [KRO-103]
- **Rama:** feature/landing-9-qa

## Descripción
Verificar que todas las funcionalidades del landing funcionan correctamente.

## Criterios de aceptación para tests E2E
- [ ] Landing carga con datos reales de listings
- [ ] Navegación funciona en desktop y mobile
- [ ] Búsqueda desde hero redirige correctamente
- [ ] Click en listing navega a detalle
- [ ] Cambio de idioma funciona (ES/EN)
- [ ] Footer visible con todos los links
- [ ] Animaciones suaves sin errores de consola

## Casos de test para QA
- [ ] `cy.visit('/es')` muestra landing en español
- [ ] `cy.visit('/en')` muestra landing en inglés
- [ ] Click en "Listados" navega a `/${lang}/colombia`
- [ ] Formulario de búsqueda valida y redirige
- [ ] Cards de listings tienen datos reales
- [ ] Stats en Trust son números reales
- [ ] Ciudades en Cities tienen conteos reales
- [ ] Mobile menu abre y cierra correctamente
