---
description: Patrones Específicos por Tipo de Usuario
---

## 👥 Tres Tipos de Usuarios

### 1. **Cliente** (Comprador/Inquilino)
- Busca propiedades
- Guarda favoritos
- Contacta con agents
- **Enums:**
  - `ClientSearchStatus` (ACTIVE, ARCHIVED, COMPLETED)
  - `FavoriteStatus` (SAVED, REMOVED)

### 2. **Real Estate** (Agente)
- Publica propiedades
- Gestiona contactos
- Ve reportes
- **Enums:**
  - `PropertyStatus` (DRAFT, PUBLISHED, SOLD, RENTED)
  - `PropertyType` (HOUSE, APARTMENT, LAND, COMMERCIAL)

### 3. **Admin** (Administrador)
- Gestiona usuarios
- Modera contenido
- Acceso total
- **Enums:**
  - `UserRole` (ADMIN, AGENT, CLIENT)
  - `ModerationStatus` (PENDING, APPROVED, REJECTED)

---

## 🔐 Seguridad por Usuario

### Domain Layer (Igual para todos)

```typescript
// domain/entities/user.entity.ts
export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  CLIENT = "CLIENT"
}

// domain/errors/user.error.ts
export class UnauthorizedError extends Error {
  constructor(message: string = "No autorizado") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor(role: UserRole) {
    super(`El rol ${role} no tiene acceso a este recurso`)
    this.name = "ForbiddenError"
  }
}
```

### UseCase con Validación de Rol

```typescript
// domain/use-cases/property.use-cases.ts
import { User } from "@/domain/entities/user.entity"
import { Property } from "@/domain/entities/property.entity"
import { IPropertyRepository } from "@/domain/ports/property.port"
import { ForbiddenError } from "@/domain/errors/user.error"

export class PropertyUseCases {
  constructor(private repository: IPropertyRepository) {}

  async publishProperty(
    property: Property,
    currentUser: User
  ): Promise<void> {
    // Solo AGENT puede publicar
    if (currentUser.role !== "AGENT") {
      throw new ForbiddenError(currentUser.role)
    }

    // El agent solo puede publicar sus propias propiedades
    if (property.agentId !== currentUser.id) {
      throw new ForbiddenError(currentUser.role)
    }

    await this.repository.save(property)
  }

  async deleteProperty(id: string, currentUser: User): Promise<void> {
    // Solo ADMIN o el AGENT propietario
    if (currentUser.role === "CLIENT") {
      throw new ForbiddenError(currentUser.role)
    }

    const property = await this.repository.findById(id)

    if (
      currentUser.role === "AGENT" &&
      property.agentId !== currentUser.id
    ) {
      throw new ForbiddenError(currentUser.role)
    }

    await this.repository.delete(id)
  }
}
```

---

## 🎯 Patrones de Server Actions por Usuario

### Cliente - Solo lectura

```typescript
// application/actions/client.action.ts
"use server"

import { createPropertyModule } from "@/application/containers/property.container"
import { getCurrentUser } from "@/infrastructure/auth/get-user"
import { UnauthorizedError, ForbiddenError } from "@/domain/errors/user.error"
import { UserRole } from "@/domain/entities/user.entity"

export async function searchPropertiesAction(filters: PropertySearchInput) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()

  const { useCases } = await createPropertyModule()
  return useCases.searchActive(filters)
}

export async function saveFavoriteAction(propertyId: string) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "CLIENT") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.addToFavorites(propertyId, user.id)
}

export async function contactAgentAction(agentId: string, message: string) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()

  const { useCases } = await createPropertyModule()
  return useCases.sendMessage(agentId, user.id, message)
}
```

### Real Estate - Gestión de propiedades

```typescript
// application/actions/agent.action.ts
"use server"

import { createPropertyModule } from "@/application/containers/property.container"
import { getCurrentUser } from "@/infrastructure/auth/get-user"
import { UnauthorizedError, ForbiddenError } from "@/domain/errors/user.error"
import { UserRole } from "@/domain/entities/user.entity"
import { createPropertySchema } from "@/application/validation/property.schema"

export async function createPropertyAction(input: CreatePropertyInput) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  const validated = createPropertySchema.parse(input)
  const { useCases } = await createPropertyModule()

  return useCases.createProperty({ ...validated, agentId: user.id })
}

export async function updatePropertyAction(
  id: string,
  input: UpdatePropertyInput
) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.updateProperty(id, input, user)
}

export async function publishPropertyAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.publishProperty(id, user)
}

export async function getMyPropertiesAction() {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.findByAgentId(user.id)
}

export async function getAgentStats() {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.getAgentStats(user.id)
}
```

### Admin - Control total

```typescript
// application/actions/admin.action.ts
"use server"

import { createPropertyModule } from "@/application/containers/property.container"
import { createUserModule } from "@/application/containers/user.container"
import { getCurrentUser } from "@/infrastructure/auth/get-user"
import { UnauthorizedError, ForbiddenError } from "@/domain/errors/user.error"
import { UserRole } from "@/domain/entities/user.entity"

export async function moderatePropertyAction(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "ADMIN") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.moderateProperty(id, status)
}

export async function deactivateUserAction(userId: string) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "ADMIN") throw new ForbiddenError(user.role)

  const { useCases } = await createUserModule()
  return useCases.deactivateUser(userId)
}

export async function getAdminDashboardAction() {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "ADMIN") throw new ForbiddenError(user.role)

  const { useCases } = await createPropertyModule()
  return useCases.getDashboardStats()
}
```

---

## 🧩 Componentes Reutilizables

### Shared Components (Sin contexto de usuario)

```typescript
// features/property/property-card.tsx
"use client"

import { Property } from "@/domain/entities/property.entity"

interface PropertyCardProps {
  property: Property
  isCompact?: boolean
  onClick?: (id: string) => void
  action?: React.ReactNode
}

export function PropertyCard({
  property,
  isCompact = false,
  onClick,
  action
}: PropertyCardProps) {
  return (
    <div
      className={`card card-property ${isCompact ? "compact" : ""}`}
      onClick={() => onClick?.(property.id)}
    >
      <img src={property.imageUrl} alt={property.title} />
      <h3>{property.title}</h3>
      <p className="text-muted">{property.address}</p>
      <div className="flex justify-between items-center">
        <span className="price">${property.price.toLocaleString()}</span>
        {action}
      </div>
    </div>
  )
}

// features/property/property-list.tsx
"use client"

import { Property } from "@/domain/entities/property.entity"
import { PropertyCard } from "./property-card"

interface PropertyListProps {
  properties: Property[]
  isLoading?: boolean
  onPropertyClick?: (id: string) => void
  renderAction?: (property: Property) => React.ReactNode
}

export function PropertyList({
  properties,
  isLoading = false,
  onPropertyClick,
  renderAction
}: PropertyListProps) {
  if (isLoading) return <div className="skeleton-grid" />

  return (
    <div className="grid gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onClick={onPropertyClick}
          action={renderAction?.(property)}
        />
      ))}
    </div>
  )
}
```

### Cliente - Components

```typescript
// features/client/search-form.tsx
"use client"

import { useCallback } from "react"
import { PropertySearchFormInput } from "@/application/validation/property.schema"
import { searchPropertiesAction } from "@/application/actions/client.action"

export function SearchForm() {
  const handleSearch = useCallback(async (filters: PropertySearchFormInput) => {
    const results = await searchPropertiesAction(filters)
    // Actualizar UI
  }, [])

  return (
    <form className="search-form">
      <input type="text" placeholder="Ubicación" />
      <input type="number" placeholder="Precio máximo" />
      <button type="submit">Buscar</button>
    </form>
  )
}

// features/client/favorite-button.tsx
"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { saveFavoriteAction } from "@/application/actions/client.action"

interface FavoriteButtonProps {
  propertyId: string
  isSaved?: boolean
}

export function FavoriteButton({ propertyId, isSaved = false }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleToggle = async () => {
    try {
      await saveFavoriteAction(propertyId)
      setSaved(!saved)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`btn-icon ${saved ? "active" : ""}`}
    >
      <Heart size={20} fill={saved ? "currentColor" : "none"} />
    </button>
  )
}
```

### Real Estate - Components

```typescript
// features/agent/property-form.tsx
"use client"

import { useCallback, useState } from "react"
import { CreatePropertyInput } from "@/application/validation/property.schema"
import { createPropertyAction } from "@/application/actions/agent.action"

export function PropertyForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (data: CreatePropertyInput) => {
    setIsLoading(true)
    try {
      await createPropertyAction(data)
      // Redirigir o mostrar éxito
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      // Recopilar datos y enviar
    }} className="property-form">
      <fieldset disabled={isLoading}>
        <input type="text" placeholder="Título" required />
        <textarea placeholder="Descripción" required />
        <input type="number" placeholder="Precio" required />
        <select required>
          <option>Tipo de propiedad</option>
          <option value="HOUSE">Casa</option>
          <option value="APARTMENT">Apartamento</option>
          <option value="LAND">Terreno</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </fieldset>
    </form>
  )
}

// features/agent/property-list.tsx
"use client"

import { useEffect, useState } from "react"
import { Property } from "@/domain/entities/property.entity"
import { getMyPropertiesAction } from "@/application/actions/agent.action"
import { PropertyCard } from "../property/property-card"
import { PublishButton } from "./publish-button"

export function MyPropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPropertiesAction()
        setProperties(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) return <div>Cargando...</div>

  return (
    <div className="properties-grid">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          action={<PublishButton propertyId={property.id} />}
        />
      ))}
    </div>
  )
}
```

### Admin - Components

```typescript
// features/admin/moderation-queue.tsx
"use client"

import { useEffect, useState } from "react"
import { Property } from "@/domain/entities/property.entity"
import { moderatePropertyAction } from "@/application/actions/admin.action"

interface PendingProperty extends Property {
  status: "PENDING"
}

export function ModerationQueue() {
  const [pending, setPending] = useState<PendingProperty[]>([])

  const handleApprove = async (id: string) => {
    await moderatePropertyAction(id, "APPROVED")
    setPending(pending.filter((p) => p.id !== id))
  }

  const handleReject = async (id: string) => {
    await moderatePropertyAction(id, "REJECTED")
    setPending(pending.filter((p) => p.id !== id))
  }

  return (
    <div className="moderation-queue">
      {pending.map((property) => (
        <div key={property.id} className="moderation-item">
          <div className="property-preview">
            <img src={property.imageUrl} alt={property.title} />
            <h4>{property.title}</h4>
            <p>{property.address}</p>
          </div>
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={() => handleApprove(property.id)}
            >
              Aprobar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleReject(property.id)}
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔄 Ejemplo Completo: Publicar Propiedad

### 1. Entity + Enums

```typescript
// domain/entities/property.entity.ts
export interface Property {
  id: string
  title: string
  description: string
  address: string
  price: number
  type: PropertyType
  status: PropertyStatus
  agentId: string
  createdAt: Date
  updatedAt: Date
}

export enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  LAND = "LAND",
  COMMERCIAL = "COMMERCIAL"
}

export enum PropertyStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  SOLD = "SOLD",
  RENTED = "RENTED"
}
```

### 2. Validation

```typescript
// application/validation/property.schema.ts
import { z } from "zod"

export const createPropertySchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  address: z.string().min(5),
  price: z.number().positive(),
  type: z.enum(["HOUSE", "APARTMENT", "LAND", "COMMERCIAL"])
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
```

### 3. UseCase

```typescript
// domain/use-cases/property.use-cases.ts
export class PropertyUseCases {
  constructor(private repository: IPropertyRepository) {}

  async publishProperty(id: string, currentUser: User): Promise<void> {
    if (currentUser.role !== "AGENT") {
      throw new ForbiddenError(currentUser.role)
    }

    const property = await this.repository.findById(id)

    if (property.agentId !== currentUser.id) {
      throw new ForbiddenError(currentUser.role)
    }

    if (property.status !== "DRAFT") {
      throw new PropertyError("Solo se pueden publicar propiedades en DRAFT")
    }

    property.status = "PUBLISHED"
    property.updatedAt = new Date()

    await this.repository.save(property)
  }
}
```

### 4. Action

```typescript
// application/actions/agent.action.ts
export async function publishPropertyAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()

  const { useCases } = await createPropertyModule()
  return useCases.publishProperty(id, user)
}
```

### 5. Component

```typescript
// features/agent/publish-button.tsx
"use client"

import { useState } from "react"
import { publishPropertyAction } from "@/application/actions/agent.action"

export function PublishButton({ propertyId }: { propertyId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      await publishPropertyAction(propertyId)
      // Mostrar éxito
    } catch (error) {
      // Mostrar error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handlePublish} disabled={isLoading}>
      {isLoading ? "Publicando..." : "Publicar"}
    </button>
  )
}
```

---

## 📊 Comparativa: Flujos por Usuario

| Acción | Cliente | Real Estate | Admin |
|--------|---------|------------|-------|
| Ver propiedades | ✅ SearchAction | ✅ Query caché | ✅ Report |
| Crear propiedad | ❌ | ✅ CreateAction | ✅ CreateAction |
| Editar propiedad | ❌ | ✅ Own only | ✅ Any |
| Publicar | ❌ | ✅ Draft→Published | ✅ Any state |
| Eliminar | ❌ | ✅ Own only | ✅ Any |
| Moderar | ❌ | ❌ | ✅ Admin only |
| Ver analytics | ❌ | ✅ Own | ✅ Global |

---

## ✨ Resumen

**Cada tipo de usuario:**
1. Tiene sus propias actions en `application/actions/`
2. Usa validaciones compartidas en `application/validation/`
3. Accede a los mismos useCases pero con restricciones de rol
4. Componentes reutilizables en `features/`
5. Errores personalizados en `domain/errors/`

**DDD se mantiene en:** `domain/` (pura lógica)
**Seguridad en:** `application/actions/` (validar rol + datos)
