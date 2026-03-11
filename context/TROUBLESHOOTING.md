---
description: Troubleshooting & Comandos Útiles
---

## 🚀 Comandos del Proyecto

```bash
# Desarrollo
npm run dev              # Iniciar servidor dev
npm run build          # Build de producción
npm run lint           # Verificar TypeScript
npm test               # Ejecutar tests (si existen)

# Supabase
npx supabase start     # Iniciar Supabase local
npx supabase stop      # Detener Supabase
npx supabase db reset  # Reset base de datos local
npx supabase gen types # Generar tipos de BD

# Verificaciones
npx tsc --noEmit       # Verificar tipos sin compilar
npm run lint:types     # Si está configurado
```

---

## 📦 Verificar Dependencias

```bash
# Ver versiones instaladas
npm ls next
npm ls zod
npm ls @supabase/ssr

# Actualizar dependencias
npm outdated           # Ver qué está desactualizado
npm update             # Actualizar todas
npm update zod@latest # Actualizar específico
```

**IMPORTANTE:** Siempre verificar `package.json` antes de usar una librería.

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "@supabase/ssr": "^0.x.x",
    "zod": "^3.x.x",
    "tailwindcss": "^3.x.x"
  }
}
```

---

## 🐛 Problemas Comunes

### Problema: "Cannot find module '@/domain/...'"

**Causa:** Path alias no configurado correctamente

**Solución:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// next.config.js
export default {
  typescript: {
    ignoreBuildErrors: false
  }
}
```

---

### Problema: "Supabase client not initialized"

**Causa:** Intentar usar cliente sin SSR

**Solución:**
```typescript
// ❌ Incorrecto
import { createClient } from "@supabase/supabase-js"

// ✅ Correcto
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server"

export async functionPropertyModule() {
  const supabase = await SupabaseServerClient()
  // ...
}
```

---

### Problema: "Unexpected token 'export' in server component"

**Causa:** Usar `"use client"` en archivo que necesita `"use server"`

**Solución:**
```typescript
// ❌ Incorrecto
"use client"

export async function myAction() {} // No permitido aquí

// ✅ Correcto - Server Action en archivo separado
"use server"

export async function myAction() {
  // Server logic
}

// Luego importar en componente cliente
"use client"
import { myAction } from "@/application/actions/..."
```

---

### Problema: "Type 'User' is not assignable to type 'IUserRepository'"

**Causa:** Interfaz no implementada correctamente

**Solución:**
```typescript
// ❌ Incorrecto
interface IUserRepository {
  find(id: string): Promise<User>
}

class UserAdapter implements IUserRepository {
  find(id: string) { // Falta tipo de retorno
    return somePromise
  }
}

// ✅ Correcto
class UserAdapter implements IUserRepository {
  async find(id: string): Promise<User> {
    return await this.supabase.from("users").select()
  }
}
```

---

### Problema: "Zod validation failed"

**Causa:** Schema no coincide con datos

**Solución:**
```typescript
// Debug: Usar .safeParse() para ver errores
const result = createUserSchema.safeParse(input)

if (!result.success) {
  console.log(result.error.errors) // Ver validaciones fallidas
  throw new Error(result.error.message)
}

const validated = result.data
```

---

### Problema: "Can't use 'await' outside async function"

**Causa:** Función no es async

**Solución:**
```typescript
// ❌ Incorrecto
function getUser() {
  const user = await getCurrentUser() // Error
}

// ✅ Correcto
async function getUser() {
  const user = await getCurrentUser()
}
```

---

### Problema: "ReferenceError: process is not defined"

**Causa:** Usar `process.env` en componente cliente

**Solución:**
```typescript
// ❌ Incorrecto - En componente cliente
export function MyComponent() {
  const apiUrl = process.env.DATABASE_URL // ERROR
}

// ✅ Correcto - En server action o server component
"use server"
export async function myServerAction() {
  const secret = process.env.SECRET_KEY // OK
}

// ✅ Usar NEXT_PUBLIC_ para datos públicos
export function MyComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL // OK
}
```

---

### Problema: "Hook 'useState' is called in a component that's not a client component"

**Causa:** Olvido de `"use client"`

**Solución:**
```typescript
// ❌ Incorrecto
export function PropertyCard({ property }) {
  const [isSaved, setIsSaved] = useState(false)
  // Error
}

// ✅ Correcto
"use client"

export function PropertyCard({ property }) {
  const [isSaved, setIsSaved] = useState(false)
  // OK
}
```

---

### Problema: "Infinite loop en useEffect"

**Causa:** Dependencia faltante o incorrecta

**Solución:**
```typescript
// ❌ Incorrecto
useEffect(() => {
  fetchData()
}, []) // Se ejecuta pero fetchData puede variar

// ✅ Correcto
useEffect(() => {
  fetchData()
}, [propertyId]) // Ejecutar solo cuando propertyId cambia

// ✅ Con función estable
const fetchData = useCallback(async () => {
  // ...
}, [propertyId])

useEffect(() => {
  fetchData()
}, [fetchData])
```

---

## 📋 Snippets Rápidos

### Crear un nuevo módulo (Copy-Paste)

```bash
# 1. Crear estructura
mkdir -p domain/entities domain/ports domain/errors domain/use-cases
mkdir -p application/{actions,containers,validation}
mkdir -p infrastructure/adapters/supabase
mkdir -p features/[module]
mkdir -p services

# 2. Entity
cat > domain/entities/[module].entity.ts << 'EOF'
export interface [Module] {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export enum [ModuleStatus] {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}
EOF

# 3. Error
cat > domain/errors/[module].error.ts << 'EOF'
export class [Module]NotFoundError extends Error {
  constructor(id: string) {
    super(`[Module] with id ${id} not found`)
    this.name = "[Module]NotFoundError"
  }
}
EOF

# 4. Port
cat > domain/ports/[module].port.ts << 'EOF'
import { [Module] } from "@/domain/entities/[module].entity"

export interface I[Module]Repository {
  findById(id: string): Promise<[Module]>
  findAll(): Promise<[Module][]>
  save(data: [Module]): Promise<void>
  delete(id: string): Promise<void>
}
EOF

# 5. UseCase
cat > domain/use-cases/[modules].use-cases.ts << 'EOF'
import { I[Module]Repository } from "@/domain/ports/[module].port"
import { [Module]NotFoundError } from "@/domain/errors/[module].error"

export class [Module]UseCases {
  constructor(private repository: I[Module]Repository) {}

  async findById(id: string) {
    const data = await this.repository.findById(id)
    if (!data) throw new [Module]NotFoundError(id)
    return data
  }
}
EOF
```

---

### Adapter Supabase Boilerplate

```typescript
import { SupabaseClient } from "@supabase/supabase-js"
import { I[Module]Repository } from "@/domain/ports/[module].port"
import { [Module] } from "@/domain/entities/[module].entity"

export class Supabase[Module]Adapter implements I[Module]Repository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<[Module]> {
    const { data, error } = await this.supabase
      .from("[modules]")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data as [Module]
  }

  async findAll(): Promise<[Module][]> {
    const { data, error } = await this.supabase
      .from("[modules]")
      .select("*")

    if (error) throw error
    return data as [Module][]
  }

  async save(data: [Module]): Promise<void> {
    const { error } = await this.supabase
      .from("[modules]")
      .upsert(data)

    if (error) throw error
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("[modules]")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
```

---

### Server Action Boilerplate

```typescript
"use server"

import { SupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { get[Module]Module } from "@/application/containers/[module].container"
import { getCurrentUser } from "@/infrastructure/auth/get-user"
import { UnauthorizedError, ForbiddenError } from "@/domain/errors/user.error"
import { [Module]Schema } from "@/application/validation/[module].schema"

export async function[Module]Action(input: unknown) {
  // 1. Validar usuario
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()

  // 2. Validar rol (si aplica)
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  // 3. Validar input
  const validated = [Module]Schema.parse(input)

  // 4. Obtener useCases
  const { useCases } = await get[Module]Module()

  // 5. Ejecutar lógica
  return useCases.create(validated)
}
```

---

### Container Boilerplate

```typescript
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { [Module]UseCases } from "@/domain/use-cases/[modules].use-cases"
import { Supabase[Module]Adapter } from "@/infrastructure/adapters/supabase/supabase-[module].adapter"

export async function get[Module]Module() {
  const supabase = await SupabaseServerClient()
  const adapter = new Supabase[Module]Adapter(supabase)
  const useCases = new [Module]UseCases(adapter)

  return { useCases, adapter }
}
```

---

### Schema Zod Boilerplate

```typescript
import { z } from "zod"

export const create[Module]Schema = z.object({
  name: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(255, "Máximo 255 caracteres"),
  description: z
    .string()
    .min(10, "Mínimo 10 caracteres")
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
})

export type Create[Module]Input = z.infer<typeof create[Module]Schema>

export const update[Module]Schema = create[Module]Schema.partial()
export type Update[Module]Input = z.infer<typeof update[Module]Schema>
```

---

### Service con Caché Boilerplate

```typescript
import { cached } from "@/infrastructure/cache/cache"
import { get[Module]Module } from "@/application/containers/[module].container"

export const get[Module]ById = cached(
  async function (id: string) {
    const { useCases } = await get[Module]Module()
    return useCases.findById(id)
  }
)

export const getAll[Modules] = cached(
  async function () {
    const { useCases } = await get[Module]Module()
    return useCases.findAll()
  }
)
```

---

### Component Reutilizable Boilerplate

```typescript
"use client"

import { [Module] } from "@/domain/entities/[module].entity"

interface [Module]CardProps {
  data: [Module]
  isCompact?: boolean
  onClick?: (id: string) => void
  action?: React.ReactNode
}

export function [Module]Card({
  data,
  isCompact = false,
  onClick,
  action
}: [Module]CardProps) {
  return (
    <div
      className={`card ${isCompact ? "compact" : ""}`}
      onClick={() => onClick?.(data.id)}
    >
      <h3>{data.name}</h3>
      <div className="flex justify-between items-center">
        <span>{data.createdAt.toLocaleDateString()}</span>
        {action}
      </div>
    </div>
  )
}
```

---

## 🔍 Debugging Tips

### Ver qué está pasando en un UseCase

```typescript
// Agregar logs temporales (sin comentarios)
export class PropertyUseCases {
  async findById(id: string): Promise<Property> {
    console.log("Finding property:", id)
    const property = await this.repository.findById(id)
    console.log("Found:", property)
    return property
  }
}

// Luego remover antes de commit
```

---

### Validar tipos con tsc

```bash
# Ver errores sin compilar
npx tsc --noEmit

# Ver tipos de variable específica
npx tsc --noEmit --pretty
```

---

### Inspeccionar respuesta de Supabase

```typescript
const { data, error } = await this.supabase
  .from("properties")
  .select("*")

console.log("Data:", data)
console.log("Error:", error)

// Error típico
{
  message: "JWT expired",
  code: "PGRST301"
}
```

---

## 🚀 Performance Tips

### Caché eficiente

```typescript
// ✅ Cachear queries costosas
export const getAgentStats = cached(
  async function (agentId: string) {
    // Esta query es costosa, cachar 1 hora
  }
)

// ❌ No cachar acciones que mutan
// Una action que crea datos NO debe estar cacheada
```

---

### Lazy load containers

```typescript
// ✅ Crear container solo cuando se necesita
export async function getPropertyModule() {
  const supabase = await SupabaseServerClient()
  const adapter = new SupabasePropertyAdapter(supabase)
  return new PropertyUseCases(adapter)
}

// ❌ No crear globals
const globalModule = new PropertyUseCases(...)
```

---

### Validar early, return early

```typescript
// ✅ Validar al inicio
export async function updateProperty(id: string, input: unknown) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()

  const validated = updatePropertySchema.parse(input)
  if (!validated) return

  // Rest de lógica
}
```

---

## 📚 Referencias

| Problema | Referencia |
|----------|-----------|
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side-rendering |
| Next.js Server Actions | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions |
| Zod Validation | https://zod.dev |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ |
| Tailwind CSS | https://tailwindcss.com/docs |

---

## ✅ Checklist de Debugging

Antes de abrir issue:

- [ ] ¿El error está en desarrollo o producción?
- [ ] ¿Cuál es el error exacto (copiar stack trace)?
- [ ] ¿Reproducible localmente?
- [ ] ¿Cambios recientes lo causaron?
- [ ] ¿`npm run build` funciona?
- [ ] ¿TypeScript (`npx tsc`) no tiene errores?
- [ ] ¿Base de datos sincronizada (`npx supabase db reset`)?

---

## 💡 Mejores Prácticas Rápidas

| ✅ Hacer | ❌ Evitar |
|---------|----------|
| `interface User {}` | `type User = {}` |
| `async find(): Promise<T>` | `find()` sin tipo |
| Inyectar via constructor | Import directo |
| Error extends Error | throw "error string" |
| Validar en action | Sin validación |
| UseCase en domain | Lógica en component |
| Cached para queries | Sin caché |
| "use client" si hay hooks | Sin directiva |
| Componentes reutilizables | Componentes gigantes |
| Pequeños commits | Commits masivos |

