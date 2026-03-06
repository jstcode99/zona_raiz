# 🚀 Guía Rápida de Inicio

## 📦 Archivos Creados

Se han generado 5 archivos de configuración:

### 1. **.cursorrules** ⭐
- **Ubicación:** Raíz del proyecto
- **Qué hace:** Define reglas para Cursor/Claude
- **Incluye:** Estructura DDD, convenciones, ejemplos de código
- **Acción:** Copiar directamente a la raíz de tu proyecto

### 2. **USERS_PATTERNS.md**
- **Qué contiene:** Patrones por tipo de usuario (Cliente, Real Estate, Admin)
- **Incluye:** Actions, validaciones, componentes específicos
- **Referencia:** Cuando necesites implementar lógica de usuario

### 3. **CHECKLIST.md**
- **Qué contiene:** Validación antes de commit/PR
- **Incluye:** Reglas obligatorias, violaciones críticas
- **Referencia:** Antes de hacer push a rama

### 4. **TROUBLESHOOTING.md**
- **Qué contiene:** Problemas comunes y soluciones
- **Incluye:** Snippets, comandos útiles, debugging
- **Referencia:** Cuando algo no funciona

### 5. **CURSOR_CONFIG.md**
- **Qué contiene:** Cómo usar Cursor efectivamente
- **Incluye:** Prompts optimizados, atajos, mejores prácticas
- **Referencia:** Para trabajar mejor con Cursor

---

## ⚡ Primeros Pasos

### 1. Configurar Cursor

```bash
# 1. Copiar .cursorrules a la raíz del proyecto
cp .cursorrules ~/tu-proyecto/

# 2. Abrir proyecto en Cursor
cursor ~/tu-proyecto/

# 3. Reiniciar Cursor (Ctrl+Shift+P → Reload Window)
```

### 2. Verificar Estructura

```bash
# Debería verse así:
proyecto/
├── .cursorrules           ← Nuevo ✨
├── app/                   # Next.js app
├── domain/                # Entities, UseCases, Errors, Ports
├── application/           # Actions, Containers, Validation
├── infrastructure/        # Adapters, Cache, DB, Config
├── features/              # Componentes reutilizables
├── shared/                # Hooks compartidos
├── services/              # Services con caché
└── package.json
```

### 3. Crear Primer Módulo

**En Cursor, abre chat (Ctrl+L) y pega:**

```
Create a complete Property module following DDD architecture:

Entity: domain/entities/property.entity.ts
- PropertyType enum: HOUSE, APARTMENT, LAND, COMMERCIAL
- PropertyStatus enum: DRAFT, PUBLISHED, SOLD, RENTED
- Property interface with id, title, description, address, price, type, status, agentId

Error: domain/errors/property.error.ts
- PropertyNotFoundError extends Error

Port: domain/ports/property.port.ts
- IPropertyRepository interface with CRUD methods

UseCase: domain/use-cases/properties.use-cases.ts
- PropertyUseCases class with findById, findAll, create, update, publish, delete

Adapter: infrastructure/adapters/supabase/supabase-property.adapter.ts
- SupabasePropertyAdapter implements IPropertyRepository

Container: application/containers/property.container.ts
- createPropertyModule() function that wires everything

Don't add comments. Use enum and interface only (no type keyword).
```

---

## 🎯 Workflow Diario

### Cuando vas a Trabajar

1. **Abrir Cursor**
   ```bash
   cursor .
   ```

2. **Leer la tarea**
   - ¿Es crear módulo nuevo? → Ver USERS_PATTERNS.md
   - ¿Es bugfix? → Revisar CHECKLIST.md
   - ¿Algo no funciona? → Revisar TROUBLESHOOTING.md

3. **Usar Cursor Chat (Ctrl+K)**
   - Seleccionar código o archivo
   - `Ctrl+K` → Pedir cambio con instrucción clara
   - Ejemplo: "Refactor this to follow DDD: move logic to UseCase"

4. **Antes de Commit**
   - Revisar CHECKLIST.md
   - `npx tsc --noEmit` (verificar tipos)
   - `npm run build` (verificar build)

5. **Crear PR**
   - Branch: `feature/nombre` o `fix/nombre`
   - Solicitar revisión
   - NO mergear sin aprobación

---

## 📚 Referencias Rápidas

### Crear Entity

```typescript
// domain/entities/[module].entity.ts
export interface [Module] {
  id: string
  name: string
  createdAt: Date
}

export enum [Status] {
  ACTIVE = "ACTIVE"
}
```

### Crear UseCase

```typescript
// domain/use-cases/[modules].use-cases.ts
export class [Module]UseCases {
  constructor(private repo: I[Module]Repository) {}

  async findById(id: string): Promise<[Module]> {
    const data = await this.repo.findById(id)
    if (!data) throw new [Module]NotFoundError(id)
    return data
  }
}
```

### Crear Server Action

```typescript
// application/actions/[module].action.ts
"use server"

export async function [action]Action(input: unknown) {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()

  const validated = [module]Schema.parse(input)
  const { useCases } = await create[Module]Module()
  return useCases.[method](validated)
}
```

### Crear Componente

```typescript
// features/[module]/[component].tsx
"use client"

interface [Component]Props {
  data: [Module]
}

export function [Component]({ data }: [Component]Props) {
  return <div>{data.name}</div>
}
```

---

## 🚫 Prohibido (Crítico)

### ❌ NUNCA

```typescript
// ❌ Usar type
type User = { id: string }

// ✅ Usar interface
interface User {
  id: string
}
```

```typescript
// ❌ Sin tipos explícitos
async function findUser(id) { }

// ✅ Con tipos
async function findUser(id: string): Promise<User> { }
```

```typescript
// ❌ Lógica en componente
"use client"
export function MyComponent() {
  const result = repository.find() // MAL
}

// ✅ Lógica en UseCase
export class MyUseCases {
  async find() { return repository.find() } // BIEN
}
```

```typescript
// ❌ Secrets en cliente
const secret = process.env.SECRET_KEY

// ✅ Secrets en servidor
"use server"
const secret = process.env.SECRET_KEY
```

---

## 🆘 Si Algo No Funciona

### Paso 1: ¿Es TypeScript?
```bash
npx tsc --noEmit
```
Si hay error → Revisar TROUBLESHOOTING.md → Error de tipos

### Paso 2: ¿Build funciona?
```bash
npm run build
```
Si falla → Revisar TROUBLESHOOTING.md → Error en build

### Paso 3: ¿Dev server funciona?
```bash
npm run dev
```
Si crashes → Revisar error en consola

### Paso 4: ¿Última opción?
```bash
# Limpiar y reiniciar
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📊 Resumen de Estructura

```
DOMAIN (Lógica Pura)
├── entities/        → Data + interfaces
├── errors/          → Custom errors
├── ports/           → Interfaces (I*)
└── use-cases/       → Lógica de negocio

APPLICATION (Orquestación)
├── actions/         → Server actions con "use server"
├── containers/      → Inyección de dependencias
└── validation/      → Schemas Zod

INFRASTRUCTURE (Implementación)
├── adapters/        → Implementan ports
├── cache/
├── config/
├── db/             → Supabase SSR
└── notifications/

FEATURES (Componentes)
└── [module]/       → Componentes reutilizables

SHARED (Compartido)
└── hooks/          → Hooks personalizados

SERVICES
└── [module].service.ts  → Servicios con caché
```

---

## 💡 Tips Más Importantes

1. **DDD primero**: Lógica en `domain/`, no en componentes
2. **Inyección**: Vía constructor, nunca imports directos
3. **Validación**: Zod en `application/`, siempre
4. **Tipos**: `interface` + `enum`, nunca `type`
5. **Componentes**: Presentación, sin lógica de negocio
6. **Seguridad**: Validar usuario en actions
7. **Caché**: Use `cached()` para queries
8. **Errores**: Custom errors en `domain/errors/`

---

## 🎓 Flujo Correcto Para Agregar Feature

### 1. Entity (Domain)
Define qué datos tienes

### 2. Error (Domain)
Qué puede salir mal

### 3. Port (Domain)
Cómo accedes a los datos (interfaz)

### 4. UseCase (Domain)
Lógica de negocio pura

### 5. Adapter (Infrastructure)
Implementación con Supabase

### 6. Container (Application)
Inyección de dependencias

### 7. Schema (Application)
Validación de inputs

### 8. Action (Application)
Endpoint que valida usuario + rol + input

### 9. Component (Features)
UI que llama a action

### 10. Service (Services)
Query cacheada si es lectura

---

## ✅ Checklist Mínimo Antes de PR

- [ ] `npx tsc --noEmit` ✅
- [ ] `npm run build` ✅
- [ ] Revisé CHECKLIST.md ✅
- [ ] Código sigue DDD ✅
- [ ] Sin secrets en código ✅
- [ ] PR con descripción clara ✅
- [ ] Esperando revisión ✅

---

## 📞 Recursos

| Recurso | Link |
|---------|------|
| Cursor Docs | https://cursor.com/docs |
| Next.js Docs | https://nextjs.org/docs |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side-rendering |
| Zod Docs | https://zod.dev |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ |

---

## 🎉 ¡Listo!

Ahora tienes:

✅ Configuración de Cursor (`.cursorrules`)
✅ Patrones por usuario
✅ Checklist de validación
✅ Soluciones de problemas
✅ Guía de Cursor

**Próximo paso:** Copiar `.cursorrules` a la raíz y empezar a desarrollar 🚀

