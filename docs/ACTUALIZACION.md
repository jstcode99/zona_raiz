# 🔄 ACTUALIZACIÓN: Patrones Reales Detectados

## ✨ Cambios Principales en Documentación

Tu proyecto real difiere del template original. Hemos actualizado TODO a los patrones reales.

---

## 🔴 Cambios Críticos Detectados

### 1. Validación: **Yup en lugar de Zod**

**Antes:**
```typescript
❌ import { z } from "zod"
❌ export const schema = z.object({ ... })
```

**Ahora:**
```typescript
✅ import * as yup from "yup"
✅ export const schema = yup.object().shape({ ... })
✅ export type Input = yup.InferType<typeof schema>
```

**Dónde:** `application/validation/[module].validation.ts`

---

### 2. Interfaces de Puertos: **SIN prefijo I**

**Antes:**
```typescript
❌ export interface IProfileRepository { }
```

**Ahora:**
```typescript
✅ export interface ProfilePort { }
```

**Por qué:** Más limpio y sigue convención del proyecto

**Ubicación:** `domain/[module].port.ts` (directamente en `domain/`)

---

### 3. Use-Cases: **`.cases.ts` o `.use-cases.ts`**

**Proyecto usa ambos:**
```typescript
✅ domain/use-cases/profile.cases.ts
✅ domain/use-cases/session.use-cases.ts
```

**Patrón:** 
- Usa `.cases.ts` para módulos principales
- Usa `.use-cases.ts` para módulos complejos

---

### 4. Errores: **No heredan de Error en todos lados**

**Tu proyecto:**
```typescript
✅ export class ProfileNotFoundError extends Error { }
✅ También existe AppError en application/
```

**AppError es global:**
```typescript
// application/errors/app.error.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400
  ) {}
}
```

---

### 5. Server Actions: **Envueltas en withServerAction()**

**Patrón del proyecto:**
```typescript
"use server"

export const updateProfileAction = withServerAction(
  async (formData: FormData) => {
    try {
      // Lógica
    } catch (error) {
      handleError(error)
    }
  }
)
```

**No devuelve nada explícitamente** - el hook maneja la respuesta

---

### 6. Componentes Form: **React Hook Form + Yup Resolver**

**Tu stack:**
```typescript
✅ react-hook-form
✅ @hookform/resolvers/yup
✅ yupResolver()
```

**NO Zod**, **NO Shadcn Form**, usa componentes custom

---

### 7. Componentes UI: **shadcn/ui modificado**

**Componentes usados:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/ui/field"
```

**Tienen extensiones propias** (Form.Input, Form.Phone, Form.Set)

---

### 8. i18n: **i18next en lugar de traduções estáticas**

```typescript
✅ import { useTranslation } from "react-i18next"
✅ import i18next from "i18next"
✅ t("forms.profile.title")
✅ i18next.t("key")
```

---

### 9. Toasts: **Sonner (no Shadcn Toast)**

```typescript
✅ import { toast } from "sonner"
✅ toast.success(message)
✅ toast.error(message)
```

---

### 10. Archivos Helpers Importantes

**Que existen en tu proyecto:**

```typescript
// shared/redirect.ts
export function encodedRedirect(type, path, message) { }

// shared/hooks/use-server-mutation.hook.ts
export function useServerMutation({ action, onSuccess, onError, setError }) { }

// shared/hooks/with-server-action.ts
export function withServerAction(fn) { }

// application/errors/handle-error.ts
export function handleError(error) { }

// infrastructure/cache/cache.ts
export function cached(fn) { }

// lib/utils.ts
export function cn(...classes) { }
```

---

## 📊 Tabla Comparativa: Esperado vs Real

| Aspecto | Original | Tu Proyecto |
|---------|----------|------------|
| Validación | Zod | **Yup** |
| Prefijo Interfaces | `I` | **Sin prefijo** |
| Extension UseCase | `.use-case.ts` | **`.cases.ts`** |
| Form Library | shadcn/form | **React Hook Form** |
| Resolver Form | Zod | **Yup** |
| i18n | sin especificar | **i18next** |
| Toasts | shadcn/toast | **Sonner** |
| Port Location | `domain/ports/` | **`domain/`** |
| Error App-level | No | **AppError** |
| Server Actions | básico | **withServerAction()** |

---

## 🎯 Qué Hemos Actualizado

### ✅ `.cursorrules`
- ✅ Stack real documentado
- ✅ Estructura real mapeada
- ✅ Ejemplos de código reales
- ✅ Reglas basadas en tu proyecto
- ✅ Patrones Yup en lugar de Zod
- ✅ withServerAction() documentado

### ✅ `TEMPLATES.md`
- ✅ Todos los templates con Yup
- ✅ Interfaces sin prefijo `I`
- ✅ `.cases.ts` en UseCase
- ✅ Puertos en `domain/`
- ✅ React Hook Form ejemplos
- ✅ Sonner para toasts

### ✅ `USERS_PATTERNS.md`
- ✅ Patrones de validación Yup
- ✅ Server Actions con withServerAction()
- ✅ Flujos reales de usuario

### ✅ `CHECKLIST.md`
- ✅ Verificaciones Yup (no Zod)
- ✅ Validaciones interfaces sin `I`
- ✅ Checks para withServerAction()

### ✅ `TROUBLESHOOTING.md`
- ✅ Problemas comunes Yup
- ✅ Debugging con Yup
- ✅ Errores React Hook Form

### ✅ `CURSOR_CONFIG.md`
- ✅ Prompts adaptados a Yup
- ✅ Ejemplos con React Hook Form

---

## 🚨 IMPORTANTE: Lo Que Debes Cambiar YA

### En nuevos módulos:

```typescript
// ✅ Validación Yup
import * as yup from "yup"
export const schema = yup.object().shape({ ... })

// ✅ Puertos sin I
export interface EntityPort { }

// ✅ UseCase .cases.ts
domain/use-cases/[module].cases.ts

// ✅ Form componentes
"use client"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

// ✅ Server Actions wrapped
export const action = withServerAction(async (formData) => {
  try { ... } catch(e) { handleError(e) }
})

// ✅ Toasts Sonner
import { toast } from "sonner"
toast.success(message)

// ✅ i18next
import { useTranslation } from "react-i18next"
const { t } = useTranslation()
```

---

## 📝 Checklist de Actualización

Si estás actualizo código existente:

- [ ] Cambiar Zod a Yup en validation files
- [ ] Remover prefijo `I` de interfaces de puertos
- [ ] Mover puertos a `domain/[module].port.ts`
- [ ] Actualizar resolvers a yupResolver
- [ ] Agregar withServerAction() a server actions
- [ ] Cambiar toast import a sonner
- [ ] Usar i18next.t() para i18n
- [ ] Usar AppError para errores app-level
- [ ] Usar cached() para services
- [ ] `npx tsc --noEmit` ✅
- [ ] `npm run build` ✅

---

## 🔗 Referencias en Documentación

**Buscar estos cambios en:**

1. `.cursorrules` - Stack real completamente reescrito
2. `TEMPLATES.md` - Todos los templates con Yup
3. `USERS_PATTERNS.md` - Server Actions reales
4. `CHECKLIST.md` - Validaciones actualizadas
5. `TROUBLESHOOTING.md` - Problemas Yup
6. `CURSOR_CONFIG.md` - Prompts adaptados

---

## 💡 Tips for Migration

### Si tienes código viejo con Zod:

```typescript
// Antes
const schema = z.object({ name: z.string() })
const { data } = schema.safeParse(input)

// Después
const schema = yup.object().shape({ name: yup.string() })
const data = await schema.validate(input, { abortEarly: false })
```

### Si tienes interfaces con I:

```typescript
// Antes
export interface IUserRepository { ... }

// Después
export interface UserPort { ... }
```

### Si Server Actions no tienen wrapper:

```typescript
// Antes
export async function updateUser(formData) { ... }

// Después
export const updateUserAction = withServerAction(
  async (formData) => { ... }
)
```

---

## 🎓 Por Qué Estos Cambios

### Yup vs Zod
- Más compatible con React Hook Form
- Mejor error handling `abortEarly: false`
- Más usado en proyectos empresa

### Sin prefijo I
- Más limpio en IDE
- Siguen convención moderna
- Menos ruido visual

### Port en domain/
- Organización más clara
- No hay subcarpeta "ports"
- Más fácil de encontrar

### `.cases.ts`
- Más descriptivo que `.use-case.ts`
- Indica múltiples casos (plural)
- Siguiendo tu proyecto existente

### React Hook Form + Yup
- Mejor validación en tiempo real
- Mejor manejo de errores de campo
- Mejor integración con Yup

### withServerAction()
- Manejo centralizado de errores
- Consistencia en todo el proyecto
- Ya existe en tu código

---

## ✅ Validar Actualización

```bash
# 1. Verificar tipos
npx tsc --noEmit

# 2. Build
npm run build

# 3. Correr dev
npm run dev

# 4. Revisar CHECKLIST.md
```

Si todo verde ✅ - Documentación actualizada correctamente!

---

## 🎯 Próximos Pasos

1. **Lee** `.cursorrules` completo (actualizado)
2. **Copia** a raíz del proyecto
3. **Usa** `TEMPLATES.md` para nuevos módulos
4. **Valida** con `CHECKLIST.md`
5. **Debugea** con `TROUBLESHOOTING.md`

---

## 📞 Resumen de Cambios Por Archivo

| Archivo | Cambios |
|---------|---------|
| `.cursorrules` | **Completamente reescrito** con stack real |
| `TEMPLATES.md` | Todos templates con Yup, interfaces sin I |
| `QUICK_START.md` | Actualizado con nuevos atajos |
| `USERS_PATTERNS.md` | Server Actions con withServerAction() |
| `CHECKLIST.md` | Validaciones Yup |
| `TROUBLESHOOTING.md` | Problemas Yup |
| `CURSOR_CONFIG.md` | Prompts adaptados |
| `README.md` | Referencias actualizadas |

---

**¡Documentación sincronizada con tu proyecto real!** 🎉

