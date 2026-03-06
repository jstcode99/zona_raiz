# ⚡ Configuración Avanzada de Cursor

## 📍 Dónde poner los archivos

### 1. `.cursorrules` (Raíz del proyecto)
```
proyecto/
├── .cursorrules           ← Reglas generales
├── .cursor/
│   └── config.json        ← Configuración específica (opcional)
└── ...
```

**Cómo usarla:**
- Cursor lee automáticamente `.cursorrules` en la raíz
- Si quieres múltiples reglas, puedes usar comentarios dentro del mismo archivo
- Las reglas se aplican a todos los archivos del proyecto

---

## 🎯 Prompts Optimizados para Cursor

### Para Crear un Nuevo Módulo

```
Create a complete [Module] module following DDD architecture:

Entity: domain/entities/[module].entity.ts
- Implement [Module] interface with id, name, createdAt, updatedAt
- Create [ModuleStatus] enum with values: ACTIVE, INACTIVE

Error: domain/errors/[module].error.ts
- [Module]NotFoundError extends Error

Port: domain/ports/[module].port.ts
- I[Module]Repository interface with CRUD methods

UseCase: domain/use-cases/[modules].use-cases.ts
- [Module]UseCases class with findById, findAll, create, update, delete

Adapter: infrastructure/adapters/supabase/supabase-[module].adapter.ts
- Implement I[Module]Repository with Supabase

Container: application/containers/[module].container.ts
- Create and wire dependencies

Don't add comments. Use types only, no "type" keyword. Follow the DDD structure exactly.
```

---

### Para Crear una Server Action

```
Create a server action at application/actions/[module].action.ts:

1. Add "use server" at top
2. Get current user with getCurrentUser()
3. Validate user exists (throw UnauthorizedError if not)
4. Validate user role matches requirements (throw ForbiddenError if not)
5. Validate input with appropriate Zod schema
6. Get module container and useCases
7. Call useCase method and return result

Handle UnauthorizedError and ForbiddenError appropriately.
Validate input early.
```

---

### Para Crear un Componente Reutilizable

```
Create a reusable component at features/[module]/[component].tsx:

Props must be typed with interface [Component]Props
- Primary prop should be the data entity
- Optional props for callbacks and state
- Use function signature with props parameter

Add "use client" if component uses hooks
Export as default or named function
Keep component presentational, no business logic
No direct imports of adapters or useCases
Handle loading and error states gracefully
```

---

### Para Crear Validación Zod

```
Create validation schema at application/validation/[module].schema.ts:

Use Zod with:
- z.string(), z.number(), z.enum(), z.boolean()
- .min(), .max() for sizes with clear error messages
- .email() for emails, .url() for URLs
- .optional() for optional fields
- .parse() in actions, .safeParse() for debugging

Export both schema and type (z.infer<typeof schema>)
Messages in Spanish for user-facing errors
```

---

## 🧠 Cómo Usar Cursor Efectivamente

### 1. Ctrl+K (o Cmd+K) - Editar con IA

**Patrón:** Seleccionar código + Ctrl+K + instrucción

```
Selecciona este componente y pide:
"Add 'use client' directive and convert this to use useState for managing selection"
```

---

### 2. Ctrl+L - Seleccionar líneas

```
Ctrl+L varias veces para seleccionar múltiples líneas
Luego Ctrl+K para editar
```

---

### 3. @ (En chat de Cursor)

Referenciar archivos específicos:

```
@domain/use-cases/property.use-cases.ts
Create a test file for this UseCase following this pattern:

describe("PropertyUseCases", () => {
  it("should throw PropertyNotFoundError if not exists", async () => {
    // Test
  })
})
```

---

### 4. Crear Archivos Nuevos

**En Cursor IDE:**
- Ctrl+Shift+P → "Create file"
- O usar Ctrl+K con instrucción explícita

---

## 💬 Prompts Específicos por Caso

### Refactorizar Código para Seguir DDD

```
Refactor this component to follow DDD architecture:
- Move business logic to a UseCase in domain/
- Keep component presentation-only
- Create proper Port and Adapter if needed
- Add types with interface, not type keyword

Current component: @[component-path]
Target structure: DDD with domain, application, infrastructure separation
```

---

### Generar Tests para UseCase

```
Generate unit tests for this UseCase:
@domain/use-cases/[module].use-cases.ts

Test both:
1. Happy path scenarios
2. Error cases (throw Custom Error)
3. Validation of inputs

Use describe/it pattern (Jest or Vitest)
No comments, types only (interface, not type)
```

---

### Crear Formulario con Validación

```
Create a form component:

Location: features/[module]/[module]-form.tsx
"use client" with form submission

Schema to validate: @application/validation/[module].schema.ts

Features:
- Display validation errors from Zod
- Show loading state during submission
- Call server action on submit
- Clear form after success
- Show toast/notification on error

Props: onSuccess?: () => void
```

---

### Depurar Tipo TypeScript

```
I'm getting a TypeScript error in this file:
@[file-path]

Error: Type 'X' is not assignable to type 'Y'

Current implementation uses:
- Entity: @[entity]
- Interface: @[interface]
- Implementation: @[implementation]

Fix the types to match the interface exactly.
```

---

## 🚀 Atajos Efectivos

| Atajo | Función | Uso |
|-------|---------|-----|
| `Ctrl+K` | Editar selección con IA | Refactorizar código |
| `Ctrl+Shift+K` | Usar el chat actual | Preguntar contexto |
| `Ctrl+Shift+P` | Command palette | Crear archivos |
| `Ctrl+L` | Seleccionar bloque | Seleccionar múltiples líneas |
| `@` | Referenciar archivo | En chat, linkar contexto |
| `Ctrl+/` | Comentar | Toggle comentarios (luego borrar) |

---

## 🎨 Configuración de Cursor Settings

### Configurar Cursor para el Proyecto

En VS Code / Cursor, `Ctrl+,` (Preferences):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[tsx]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 📋 Templates de Prompts para Tareas Comunes

### Template: Crear UseCase

```
Create UseCase following DDD:
- File: domain/use-cases/[name].use-cases.ts
- Class: [Name]UseCases
- Constructor: inject I[Name]Repository
- Methods: [list methods needed]
- Errors: throw custom errors extending Error
- No imports from application or infrastructure
- Types explicit for all methods

Example interface to implement:
@domain/ports/[port].port.ts
```

---

### Template: Crear Adapter

```
Create Adapter implementing port:
- File: infrastructure/adapters/supabase/supabase-[name].adapter.ts
- Class: Supabase[Name]Adapter implements I[Name]Repository
- Constructor: inject SupabaseClient
- Methods from: @[port-file]
- Error handling: throw Supabase errors
- Types: Entity type from @[entity-file]

Reference adapter for patterns:
@infrastructure/adapters/supabase/supabase-[reference].adapter.ts
```

---

### Template: Crear Server Action

```
Create server action with full DDD integration:
- File: application/actions/[module].action.ts
- "use server" at top
- getCurrentUser() from @/infrastructure/auth/get-user
- Validate user exists and role
- Validate input with Zod schema from @[schema-file]
- Get container from @[container-file]
- Return useCases.[method]()
- Handle UnauthorizedError and ForbiddenError

Action: [action name]
Required role: [ADMIN|AGENT|CLIENT|none]
```

---

## 🔧 Troubleshooting Cursor Mismo

### Cursor no sugiere imports correctamente

```
Solución:
1. Ctrl+Shift+P → "TypeScript: Restart TS Server"
2. Verifica tsconfig.json paths están correctas
3. Cierra y reabre carpeta del proyecto
```

---

### Cursor lento con archivos grandes

```
Solución:
1. Desactivar "editor.formatOnSave" temporalmente
2. Cerrar archivos no usados
3. Reiniciar Cursor
```

---

### IA suggestions no respetan .cursorrules

```
Solución:
1. Verifica .cursorrules esté en raíz del proyecto
2. Incluye instrucción explícita en el prompt:
   "Remember to follow .cursorrules file in this project"
3. Menciona la regla específica: "Use enum not type"
```

---

## 💡 Mejores Prácticas con Cursor

### 1. Proporcionar Contexto

```
❌ "Create a component"
✅ "@domain/entities/property.entity.ts Create a component to display this entity"
```

---

### 2. Ser Específico sobre Restricciones

```
❌ "Generate code"
✅ "Generate code using:
- No 'type' keyword, only 'interface' and 'enum'
- Async/await pattern
- Explicit return types
- No comments"
```

---

### 3. Referenciar Archivos Existentes

```
❌ "Follow DDD pattern"
✅ "@domain/use-cases/agent.use-cases.ts Create similar UseCase for Property"
```

---

### 4. Iterar en Pequeños Pasos

```
✅ Paso 1: Create entity
✅ Paso 2: Create port (interface)
✅ Paso 3: Create adapter
✅ Paso 4: Create use-case
✅ Paso 5: Wire in container

❌ "Create entire module in one go"
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para Crear Nuevo Módulo

1. **Chat de Cursor**: Pedir estructura general
   ```
   @domain/entities/agent.entity.ts
   Create similar structure for Property module
   ```

2. **Entity**: Crear primero
   ```
   File: domain/entities/property.entity.ts
   Referenced from: @domain/entities/agent.entity.ts
   ```

3. **Port**: Crear interfaz
   ```
   File: domain/ports/property.port.ts
   Methods based on: @domain/entities/property.entity.ts
   ```

4. **Adapter**: Implementar
   ```
   File: infrastructure/adapters/supabase/supabase-property.adapter.ts
   Implements: @domain/ports/property.port.ts
   Reference: @infrastructure/adapters/supabase/supabase-agent.adapter.ts
   ```

5. **UseCase**: Lógica de negocio
   ```
   File: domain/use-cases/properties.use-cases.ts
   Injects: @domain/ports/property.port.ts
   ```

6. **Container**: Inyección de dependencias
   ```
   File: application/containers/property.container.ts
   Wires: entity, port, adapter, usecase
   ```

7. **Schema**: Validación
   ```
   File: application/validation/property.schema.ts
   Fields from: @domain/entities/property.entity.ts
   ```

8. **Actions**: Server actions
   ```
   File: application/actions/property.action.ts
   Uses: @domain/use-cases/properties.use-cases.ts
   ```

9. **Components**: UI reutilizable
   ```
   Files in: features/property/
   Reference: @features/agent/agent-card.tsx
   ```

---

## 📚 Recursos para Cursor

- Documentación oficial: https://cursor.com/docs
- Keyboard shortcuts: https://cursor.com/docs/commands/keyboard-shortcuts
- Chat features: https://cursor.com/docs/features/chat

---

## ✅ Checklist Antes de Usar Cursor para Generar Código

- [ ] ¿Existe archivo similar para referenciar? (@file)
- [ ] ¿He especificado restricciones? (no type, enum/interface)
- [ ] ¿Incluí la estructura esperada? (DDD layers)
- [ ] ¿Proporcioné contexto suficiente? (entidades, relaciones)
- [ ] ¿Es una tarea pequeña y específica? (mejor que genérica)
- [ ] ¿Estoy iterando paso a paso?

**Si cumples con todo → mejor resultado ✅**

