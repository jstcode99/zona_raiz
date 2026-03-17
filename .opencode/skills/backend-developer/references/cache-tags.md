# Cache Tags - Referencia Completa

## 📦 Entidades y Tags Disponibles

### Listing (Listados)
- `LISTING.PRINCIPAL` - "listings"
- `LISTING.ALL` - "listing:all"
- `LISTING.ACTIVE` - "listing:active"
- `LISTING.FEATURED` - "listing:featured"
- `LISTING.DETAIL(id)` - `listing:${id}`
- `LISTING.SLUG(slug)` - `listing:slug:${slug}`
- `LISTING.COUNT` - "listing-count"
- `LISTING.SEARCH` - "listing-search"
- `REAL_ESTATE.DETAIL(id)` - "real-estate:${id}" (usar cuando un listing afecta su inmobiliaria)

### Property (Propiedades)
- `PROPERTY.PRINCIPAL` - "properties"
- `PROPERTY.ALL` - "property:all"
- `PROPERTY.DETAIL(id)` - `property:${id}`
- `PROPERTY.SLUG(slug)` - `property:slug:${slug}`
- `PROPERTY.COUNT` - "property-count"
- `REAL_ESTATE.DETAIL(id)` - "real-estate:${id}" (usar cuando una propiedad afecta su inmobiliaria)

### User (Usuarios)
- `USER.PRINCIPAL` - "users"
- `USER.DETAIL(id)` - `user:${id}`
- `USER.EMAIL(email)` - `user:email:${email}`
- `USER.LIST` - "user:list"

### RealEstate (Inmobiliarias)
- `REAL_ESTATE.PRINCIPAL` - "real-estates"
- `REAL_ESTATE.ALL` - "real-estate:all"
- `REAL_ESTATE.DETAIL(id)` - `real-estate:${id}`
- `REAL_ESTATE.COUNT` - "real-estate-count"

### Agent (Agentes)
- `AGENT.PRINCIPAL` - "agents"
- `AGENT.BY_REAL_ESTATE(realEstateId)` - `agent:real-estate:${realEstateId}`

### Inquiry (Consultas/Leads)
- `INQUIRY.PRINCIPAL` - "inquiries"
- `INQUIRY.ALL` - "inquiry:all"
- `INQUIRY.DETAIL(id)` - `inquiry:${id}`
- `INQUIRY.COUNT` - "inquiry-count"
- `LISTING.DETAIL(listingId)` - `listing:${listingId}` (cuando una consulta afecta su listado)
- `AGENT.BY_REAL_ESTATE(agentId)` - `agent:real-estate:${agentId}` (cuando se asigna un agente)

### Dashboard
- `DASHBOARD.METRICS` - "dashboard-metrics"

---

## 🎯 Cómo Usar en Server Actions

### Importar constantes:
```typescript
import { CACHE_TAGS } from "@/infrastructure/config/constants"
```

### Invalidar tags después de una mutación:
```typescript
revalidateTag(CACHE_TAGS.LISTING.PRINCIPAL, { expire: 0 })
revalidateTag(CACHE_TAGS.LISTING.DETAIL(id), { expire: 0 })
revalidateTag(CACHE_TAGS.LISTING.COUNT, { expire: 0 })
```

### Parámetros de `revalidateTag`
- **tag**: string o función (de las constantes)
- **profile**: `{ expire: number }` - segundos hasta que expire el cache (0 = inmediato)

---

## 📝 Regla General

Siempre invalidar:

1. **Tag principal** de la entidad mutada (ej: `CACHE_TAGS.LISTING.PRINCIPAL`)
2. **Tag específico** de la entidad si aplica (ej: `CACHE_TAGS.LISTING.DETAIL(id)`)
3. **Tag de conteo** si los datos numéricos cambiaron (ej: `CACHE_TAGS.LISTING.COUNT`)
4. **Tags relacionados** de otras entidades afectadas (ej: `CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId)`)

---

**⚠️ Importante**: Todos los servicios usan `unstable_cache` con estos tags definidos. Al mutar datos, **debe** llamarse a `revalidateTag()` para que el cache se actualice correctamente.

**📚 Ubicación de constantes**: `@/infrastructure/config/constants.ts` dentro de `CACHE_TAGS`
