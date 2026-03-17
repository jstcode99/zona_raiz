# Services API — Referencia de métodos

Todos los servicios se obtienen desde `appModule()`. Esta es la API pública de cada uno.

---

## sessionService

El servicio más importante. Siempre verificar sesión antes de cualquier mutación.

```typescript
// Obtener usuario actual
const userId = await sessionService.getCurrentUserId()   // string | null

// Verificar roles
const isAdmin      = await sessionService.isAdmin()        // boolean
const isCoordinator = await sessionService.isCoordinator() // boolean
const isAgent      = await sessionService.isAgent()        // boolean

// Obtener perfil completo de la sesión
const session = await sessionService.getSession()
```

---

## authService

```typescript
// Login
await authService.signIn({ email, password })

// Registro
await authService.signUp({ email, password, full_name })

// Logout
await authService.signOut()

// Recuperar contraseña
await authService.resetPassword(email)
```

---

## profileService

```typescript
// Obtener perfil por userId
const profile = await profileService.findById(userId)

// Verificar rol de un agente en una inmobiliaria específica
const agentRole = await profileService.getAgentRoleInRealEstate(userId, realEstateId)
// Retorna el rol o null si no pertenece

// Actualizar perfil
await profileService.update(userId, { full_name, avatar_url })
```

---

## inquiryService

```typescript
// Listado con filtros opcionales
const inquiries = await inquiryService.all({
  listing_id?: string,
  status?: string,          // "new" | "contacted" | "qualified" | "converted" | "lost"
  assigned_to?: string,
  source?: string,
  start_date?: string,      // ISO string
  end_date?: string,
})

// Por ID (retorna null si no existe)
const inquiry = await inquiryService.findById(id)

// Por listing
const inquiries = await inquiryService.findByListingId(listingId)

// Por agente asignado
const inquiries = await inquiryService.findByAgentId(agentId)

// Crear
await inquiryService.create({ listing_id, name, email, phone, message, source })

// Actualizar campos arbitrarios
await inquiryService.update(id, { status, assigned_to })

// Eliminar
await inquiryService.delete(id)

// Contar
const total = await inquiryService.count(filters)

// Cambios de estado predefinidos
await inquiryService.markAsContacted(id)   // status = "contacted", contacted_at = now
await inquiryService.markAsQualified(id)   // status = "qualified"
await inquiryService.markAsConverted(id)   // status = "converted", converted_at = now
await inquiryService.markAsLost(id)        // status = "lost"
```

---

## propertyService

```typescript
const properties = await propertyService.all(filters)
const property   = await propertyService.findById(id)       // null si no existe
const property   = await propertyService.findBySlug(slug)   // null si no existe
await propertyService.create(data)
await propertyService.update(id, data)
await propertyService.delete(id)
const total      = await propertyService.count(filters)
```

---

## propertyImageService

```typescript
const images = await propertyImageService.findByPropertyId(propertyId)
await propertyImageService.create({ property_id, url, order })
await propertyImageService.update(id, { order, is_cover })
await propertyImageService.delete(id)
await propertyImageService.setCover(id, propertyId)  // marca como imagen principal
```

---

## listingService

```typescript
const listings = await listingService.all(filters)
const listing  = await listingService.findById(id)
const listing  = await listingService.findBySlug(slug)
await listingService.create(data)
await listingService.update(id, data)
await listingService.delete(id)
await listingService.publish(id)    // cambia status a "published"
await listingService.unpublish(id)  // cambia status a "draft"
```

---

## agentService

```typescript
const agents = await agentService.all(filters)
const agent  = await agentService.findById(id)
const agents = await agentService.findByRealEstateId(realEstateId)
await agentService.create(data)
await agentService.update(id, data)
await agentService.delete(id)
```

---

## realEstateService

```typescript
const realEstates = await realEstateService.all()
const realEstate  = await realEstateService.findById(id)
await realEstateService.create(data)
await realEstateService.update(id, data)
await realEstateService.delete(id)
```

---

## userService

```typescript
const users = await userService.all()
const user  = await userService.findById(id)
await userService.update(id, data)
await userService.delete(id)
```

---

## onboardingService

```typescript
// Verificar si el usuario completó el onboarding
const completed = await onboardingService.isCompleted(userId)

// Completar paso de onboarding
await onboardingService.completeStep(userId, step)

// Obtener estado actual del onboarding
const status = await onboardingService.getStatus(userId)
```

---

## cookiesService

```typescript
// Obtener cookie
const value = await cookiesService.get(name)

// Establecer cookie
await cookiesService.set(name, value, options)

// Eliminar cookie
await cookiesService.delete(name)
```

---

## Notas importantes

1. **`findById` siempre retorna `null`** si no existe — nunca lanza error por "not found"
2. **Los filtros son opcionales** — pasar `undefined` retorna todos los registros
3. **Los métodos de estado** (`markAsContacted`, `publish`, etc.) son helpers que envuelven `update()` con valores predefinidos
4. Si un método que necesitas no existe en el servicio, **agrégalo al service**, nunca en el action