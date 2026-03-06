# Pre-Commit & Pre-PR Checklist

## ✅ Antes de Hacer Commit

### Estructura y Convenciones

- [ ] Archivos nombrados con formato `modulo.tipo.ts`
  - ✅ `agent.entity.ts`
  - ✅ `agent.use-case.ts`
  - ❌ `Agent.ts` o `agentEntity.ts`

- [ ] No hay carpetas con nombres en PascalCase
  - ✅ `infrastructure/adapters/`
  - ❌ `Infrastructure/Adapters/`

- [ ] Estructura respeta capas
  - [ ] Domain → entities, errors, ports, use-cases
  - [ ] Application → actions, containers, validation
  - [ ] Infrastructure → adapters, cache, config, db
  - [ ] Features → componentes reutilizables
  - [ ] Shared → hooks

### DDD Backend

- [ ] Toda lógica de negocio está en `domain/`
- [ ] Entities tienen solo datos e interfaces
- [ ] UseCase es una clase con métodos
- [ ] Puertos son interfaces con `I` al inicio
- [ ] Adapters implementan puertos
- [ ] Errores heredan de `Error`

```typescript
✅ Correcto:
export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User ${id} not found`)
    this.name = "UserNotFoundError"
  }
}

❌ Incorrecto:
export const UserNotFoundError = new Error()
```

- [ ] Inyección de dependencias via constructor
  ```typescript
  ✅ Correcto:
  export class PropertyUseCases {
    constructor(private repository: IPropertyRepository) {}
  }

  ❌ Incorrecto:
  import { repository } from "@/adapters"
  export class PropertyUseCases {
    async find() { return repository.find() }
  }
  ```

- [ ] No hay comentarios innecesarios
  ```typescript
  ✅ Correcto:
  async findActiveProperties(): Promise<Property[]> {
    return this.repository.findByStatus("ACTIVE")
  }

  ❌ Incorrecto:
  // Busca propiedades activas
  async findActiveProperties(): Promise<Property[]> {
    // Llamar al repo
    return this.repository.findByStatus("ACTIVE")
  }
  ```

### TypeScript

- [ ] Solo `enum` e `interface`, **nunca** `type`
  ```typescript
  ✅ Correcto:
  export enum UserRole {
    ADMIN = "ADMIN",
    CLIENT = "CLIENT"
  }

  export interface User {
    id: string
    role: UserRole
  }

  ❌ Incorrecto:
  type UserRole = "ADMIN" | "CLIENT"
  type User = { id: string; role: UserRole }
  ```

- [ ] Tipos de retorno explícitos en funciones
  ```typescript
  ✅ async findById(id: string): Promise<User> {}
  ❌ async findById(id: string) {}
  ```

- [ ] Interfaces en Domain, servicios implementan
  ```typescript
  // domain/ports/
  export interface IPropertyRepository { }

  // infrastructure/adapters/
  export class SupabasePropertyAdapter implements IPropertyRepository { }
  ```

### Validación

- [ ] Schemas Zod en `application/validation/`
- [ ] Todos los inputs validados en actions
  ```typescript
  export async function createPropertyAction(input: unknown) {
    const validated = createPropertySchema.parse(input) // ✅
    // ... usar validated
  }
  ```

- [ ] Mensajes de error descriptivos
  ```typescript
  ❌ email: z.string()
  ✅ email: z.string().email("Email inválido")
  ```

### Server Actions

- [ ] Tienen `"use server"` al inicio
- [ ] Validan usuario actual
- [ ] Validan rol del usuario
- [ ] Llaman a container para obtener useCases
- [ ] Validan input con schema

```typescript
✅ Patrón correcto:
"use server"

import { getCurrentUser } from "@/infrastructure/auth/get-user"

export async function updatePropertyAction(id: string, input: UpdateInput) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  if (user.role !== "AGENT") throw new ForbiddenError(user.role)

  const validated = updatePropertySchema.parse(input)
  const { useCases } = await createPropertyModule()
  return useCases.updateProperty(id, validated, user)
}
```

### Componentes Frontend

- [ ] Props están tipadas
  ```typescript
  ✅ interface PropertyCardProps { property: Property; onClick?: (id: string) => void }
  ❌ function PropertyCard(props: any) {}
  ```

- [ ] Componentes son reutilizables
  ```typescript
  ✅ No contiene lógica de negocio, solo presentación
  ❌ Contiene server actions o queries directas
  ```

- [ ] `"use client"` en componentes interactivos
  ```typescript
  ✅ "use client" con useState, useEffect
  ❌ "use client" en componentes que solo renderizan
  ```

- [ ] Eventos manejan errores
  ```typescript
  ✅ onClick={async () => {
    try { await action() } catch (e) { /* manejar */ }
  }}
  ```

### Cache y Services

- [ ] Services están en `services/`
- [ ] Services usan `cached()` para queries
- [ ] Services instancian containers
  ```typescript
  export const getPropertyById = cached(
    async function (id: string) {
      const { useCases } = await createPropertyModule()
      return useCases.findById(id)
    }
  )
  ```

### Seguridad

- [ ] **NO hay** variables de `.env` en componentes
  ```typescript
  ✅ const API_URL = process.env.NEXT_PUBLIC_API_URL
  ❌ const SECRET = process.env.SECRET_KEY (en cliente)
  ```

- [ ] **NO hay** datos sensibles en `NEXT_PUBLIC_*`
  ```typescript
  ✅ NEXT_PUBLIC_SUPABASE_URL
  ❌ NEXT_PUBLIC_DATABASE_PASSWORD
  ```

- [ ] Server actions validan autenticación
  ```typescript
  ✅ const user = await getCurrentUser(); if (!user) throw
  ❌ async function updateProperty() { /* sin validar */ }
  ```

- [ ] Supabase usa SSR en servidor
  ```typescript
  ✅ import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
  ❌ import supabase client directo en component
  ```

### Archivos que NO deben Cambiar

- [ ] `package.json` - Solo versiones específicas en PR
- [ ] `tsconfig.json` - Sin cambios sin justificación
- [ ] `.env.example` - Actualizar si nuevo env var
- [ ] **NUNCA** secrets en `.env` (siempre `.env.local`)

---

## ✅ Antes de Crear PR

### Cambios Legítimos

- [ ] Cada commit es atómico (un cambio lógico)
  ```bash
  ✅ "feat: add property search"
  ❌ "update code, fix bugs, add feature, improve stuff"
  ```

- [ ] Commits son descriptivos
  ```bash
  ✅ feat: implement property publish action
  ✅ fix: prevent duplicate favorities on client
  ✅ refactor: extract PropertyCardComponent
  ❌ update
  ❌ fix stuff
  ```

- [ ] Cambios **NO son masivos**
  - < 400 líneas de código nuevo
  - Máximo 5 archivos modificados por PR
  - Si es más, dividir en múltiples PRs

- [ ] Branch tiene nombre descriptivo
  ```bash
  ✅ feature/property-publish
  ✅ fix/agent-permission-check
  ✅ refactor/use-cases-validation
  ❌ feature1, update, fix-bugs
  ```

### Descripción de PR

```markdown
## Descripción
Breve descripción de qué hace este PR.

## Tipo de Cambio
- [ ] Bugfix
- [x] Feature nueva
- [ ] Refactor
- [ ] Performance

## Testing
- [ ] Probado localmente
- [ ] Casos edge manejados
- [ ] Errores contemplados

## Checklist
- [x] Sigue DDD en backend
- [x] Nombres de archivo correcto
- [x] Sin comentarios innecesarios
- [x] Validaciones en place
- [x] Sin variables .env sensibles
```

### Tests (Si aplica)

- [ ] UseCase tiene tests unitarios
  ```typescript
  describe("PropertyUseCases", () => {
    it("should throw error if property status is not DRAFT", async () => {
      // Test de la regla de negocio
    })
  })
  ```

- [ ] Server action maneja errores
- [ ] Validación Zod testea casos edge

---

## 🚨 PROHIBIDO en Commits

### ❌ Violaciones Críticas

1. **Cambios sin revisión**
   ```bash
   ❌ Hacer commit directo a main
   ❌ Merge propio PR sin revisión
   ```

2. **Secrets en repo**
   ```
   ❌ .env en git
   ❌ API keys en código
   ❌ Database passwords
   ```

3. **Cambios masivos sin contexto**
   ```bash
   ❌ Reescribir 5+ archivos sin explicación
   ❌ Cambios globales sin justificación
   ```

4. **Código que viola DDD**
   ```typescript
   ❌ Lógica de negocio en component
   ❌ Import directo de adapter en component
   ❌ UseCase sin inyección de dependencias
   ```

5. **TypeScript incorrecto**
   ```typescript
   ❌ type User = { ... } (usar interface)
   ❌ any en lugar de tipos específicos
   ```

6. **Comentarios masivos**
   ```typescript
   ❌ // TODO: fix this
   ❌ // HACK: this is bad
   ❌ // Explicar obviedades
   ```

---

## 📋 Template de PR

```markdown
# [TYPE] Descripción Corta

## 🎯 Objetivo
Qué problema resuelve o qué feature agrega.

## 📝 Cambios
- Agregado: ...
- Modificado: ...
- Eliminado: ...

## 🏗️ Estructura
- [ ] DDD respetado
- [ ] Convenciones seguidas
- [ ] Archivos nombrados correctamente

## 🔒 Seguridad
- [ ] Sin secrets expuestos
- [ ] Validaciones en place
- [ ] Roles verificados (si aplica)

## 🧪 Testing
- [ ] Probado en dev
- [ ] Casos edge considerados
- [ ] Sin console.log de debug

## 📦 Dependencias
- [ ] No agrega dependencias nuevas (o justifica)
- [ ] package.json no modificado innecesariamente

---

Solicitado por: @tu-usuario
Revisado por: [Esperar asignación]
```

---

## 🔍 Proceso de Revisión (Para Reviewers)

### Checklist del Reviewer

1. **Estructura DDD**
   - ¿Entities están en domain/?
   - ¿UseCase tiene puerto inyectado?
   - ¿Adapter implementa interfaz?

2. **Convenciones**
   - ¿Nombre de archivo formato `modulo.tipo.ts`?
   - ¿Solo enum e interface, sin type?
   - ¿Directorios en minúscula?

3. **Seguridad**
   - ¿Se valida usuario actual en actions?
   - ¿Se valida rol correctamente?
   - ¿Hay secrets en código?

4. **Validación**
   - ¿Inputs validados con Zod?
   - ¿Mensajes de error descriptivos?

5. **Testing**
   - ¿Código funciona localmente?
   - ¿Maneja errores?

### Feedback Constructivo

```markdown
✅ Buena estructura DDD aquí
❌ Este useState debería ser en useHook
💡 Considera usar cached() para esta query
🤔 ¿Por qué imports directo en lugar de inyectar?
```

---

## 🚀 Merge Checklist (Para Maintainers)

- [ ] ✅ Aprobado por reviewer
- [ ] ✅ Todos los checks pasan
- [ ] ✅ Sin conflictos
- [ ] ✅ Commits limpios y descriptivos
- [ ] ✅ PR bien documentado
- [ ] ✅ Cambios son atómicos

**Después del merge:**
- [ ] Eliminar rama
- [ ] Crear tag de release (si aplica)
- [ ] Actualizar docs (si aplica)

---

## 📚 Referencias Rápidas

| Violación | Solución |
|-----------|----------|
| `type User = {}` | Cambiar a `interface User {}` |
| Lógica en component | Mover a UseCase en domain |
| Import directo de adapter | Pasar via constructor (DI) |
| `async function(){}` sin tipos | Agregar `: Promise<Type>` |
| Secrets en código | Mover a env var, luego a vault |
| PR masivo | Dividir en múltiples PRs pequeñas |
| Sin revisión | Crear PR y solicitar review |

---

## 💬 Preguntas Antes de Hacer Commit

1. ¿Este cambio respeta DDD?
2. ¿Los archivos están nombrados correctamente?
3. ¿Hay secrets o datos sensibles?
4. ¿Están las validaciones en place?
5. ¿Se valida el rol del usuario (si aplica)?
6. ¿El código se lee sin comentarios?
7. ¿Hay tipos explícitos?
8. ¿Es un cambio pequeño y atómico?

**Si responden SÍ a todo → ✅ Listo para PR**