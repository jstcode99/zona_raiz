# Skill: Frontend Developer

Este skill define las convenciones y patrones para el desarrollo frontend en este proyecto Next.js. **Debe consultarse SIEMPRE que se vaya a crear un CRUD, componente de mutación (formularios, acciones que modifican datos) o componente de lectura (tablas, listas, gráficos, cards).**

## Arquitectura General

### Estructura de Carpetas

```
├── app/[lang]/              # Páginas con soporte i18n
│   ├── auth/                # Rutas de autenticación
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── otp/
│   │   └── callback/
│   └── (otras rutas)
├── features/                # Componentes de negocio organizados por dominio
│   ├── auth/               # Formularios de auth
│   ├── agents/             # Componentes relacionados con agentes
│   ├── dashboard/         # Componentes del dashboard
│   ├── listing/            # Componentes de listings/publicaciones
│   ├── properties/         # Componentes de propiedades
│   ├── users/              # Componentes de usuarios
│   └── navigation/         # Componentes de navegación
├── components/ui/          # Componentes shadcn/ui
├── application/actions/    # Server Actions (mutaciones)
├── application/validation/ # Schemas Yup para validación
└── domain/entities/       # Entidades TypeScript
```

## Convenciones para Componentes

### Componentes de Lectura (Listas, Tablas, Gráficos, Cards)

**Ubicación:** `features/[dominio]/[nombre-componente].tsx`

**Patrón observado en:**
- `features/agents/agent-list.tsx` - Lista con acciones de eliminación
- `features/dashboard/listings-by-status-chart.tsx` - Gráfico con filtros
- `features/listing/listing-table.tsx` - Tabla con datos
- `features/listing/listing-card.tsx` - Card de property

**Características:**
- Recibe datos como props (NO hacen fetch directo)
- Use `useTranslation` de `react-i18next` para textos
- No mutan estado directamente (solo para UI local como filtros)
- NO llaman Server Actions directamente para mutaciones (usan handlers passed as props)
- Componentes puros de presentación cuando es posible

**Ejemplo de estructura:**
```tsx
'use client'

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Importar tipos de dominio, NO tipos de DB

interface MyComponentProps {
  data: MyEntity[]
  onAction?: (id: string) => void
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')

  const filteredData = useMemo(() => {
    return data.filter(...)
  }, [data, filter])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('sections:my_section')}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* renderizado */}
      </CardContent>
    </Card>
  )
}
```

### Componentes de Mutación (Formularios, Actions)

**Ubicación:** `features/[dominio]/[nombre-form].tsx`

**Patrón observado en:**
- `features/auth/sign-in-form.tsx` - Formulario de login
- `features/agents/add-agent-form.tsx` - Formulario para agregar agente
- `features/listing/listing-form.tsx` - Formulario de publicación

**Características:**
- Usan Server Actions de `@/application/actions`
- Usan schemas de validación de `@/application/validation`
- Usan `useTransition` para estados de carga
- Manejan errores con try/catch
- Usan `useRouter` de `next/navigation` para navegación

**Ejemplo de estructura:**
```tsx
'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { myAction } from '@/application/actions/my.actions'
import { mySchema } from '@/application/validation/my.validation'

export function MyForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await myAction(formData)
        router.push('/success')
      } catch (error) {
        console.error('Error:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* campos del formulario */}
      <Button type="submit" disabled={isPending}>
        {isPending ? t('words:loading') : t('actions:submit')}
      </Button>
    </form>
  )
}
```

## Validación con Yup

**Ubicación:** `application/validation/[nombre].validation.ts`

**IMPORTANTE - Formato de namespace:**
- El namespace es `validations` y se accede con **dos puntos** (`:`), NO con punto (`.`)
- Correcto: `i18next.t('validations:required', { attribute: 'name' })`
- Incorrecto: `i18next.t('validations.required', { attribute: 'name' })`

**Estructura típica:**
```tsx
import * as yup from 'yup'
import i18next from 'i18next'
import { emailSchema } from './base/email.schema'
import { idSchema } from './base/id.schema'

export const mySchema = yup.object({
  name: yup
    .string()
    .required(() => i18next.t('validations:required', { attribute: 'name' }))
    .max(100, () => i18next.t('validations:max.string', { attribute: 'name', max: 100 })),
  email: emailSchema,
  foreignId: idSchema,
})

export type MyFormInput = yup.InferType<typeof mySchema>

export const defaultMyValues: MyFormInput = {
  name: '',
  email: null,
}
```

**Claves disponibles en `locales/[lang]/validations.json`:**
- `validations:required` - Campo requerido
- `validations:email` - Email inválido
- `validations:min.string`, `validations:min.numeric` - Valor mínimo
- `validations:max.string`, `validations:max.numeric` - Valor máximo
- `validations:uuid` - UUID inválido
- `validations:url` - URL inválida
- `validations:phone` - Teléfono inválido
- `validations:slugFormat` - Formato de slug inválido
- `validations:date_format` - Formato de fecha inválido
- `validations:enum` - Valor de enumeración inválido

**NOTA:** Usar funciones flecha (`() =>`) para evaluación lazy del mensaje, NO valores directos.

**Schemas base disponibles en `application/validation/base/`:**
- email.schema.ts, id.schema.ts, phone.schema.ts, price.schema.ts
- search.schema.ts, status.schema.ts, date-range.schema.ts
- name.schema.ts, title.schema.ts, description.schema.ts
- address.schema.ts, latitude.schema.ts, longitude.schema.ts
- etc.

## Uso de shadcn/ui

**Componentes disponibles en `@/components/ui/`:**
- Button, Input, Label, Textarea
- Card, CardContent, CardHeader, CardTitle, CardDescription
- Select, Dialog, DropdownMenu
- Table, Tabs, Avatar
- Form (con react-hook-form + zod cuando sea necesario)
- Toast, Skeleton, Spinner
- Command, Popover, Combobox
- Chart (de recharts)

**Para agregar nuevo componente shadcn:**
```bash
npx shadcn@latest add [component-name]
```

## Internacionalización (i18n)

**Archivos de traducción en `locales/[lang]/`:**
- `common.json` - Textos generales
- `words.json` - Palabras sueltas (save, delete, cancel, etc.)
- `actions.json` - Textos de botones y acciones
- `sections.json` - Títulos de secciones
- `validations.json` - Mensajes de validación
- `exceptions.json` - Mensajes de error

**Uso en componentes:**
```tsx
const { t } = useTranslation()
// t('words:save'), t('sections:my_section'), t('validations:required')
```

**En schemas Yup:**
```tsx
// IMPORTANTE: Usar dos puntos para el namespace
() => i18next.t('validations:required', { attribute: 'name' })
```

## Integración con Pages

**Las páginas en `app/[lang]/` son wrapper mínimos:**
```tsx
// app/[lang]/auth/sign-in/page.tsx
import { SignInForm } from "@/features/auth/sign-in-form"

export default function Page() {
  return <SignInForm />
}
```

## Reglas para Crear Nuevos Componentes

### Para CRUD completo (Create, Read, Update, Delete):

1. **Crear schemas de validación** en `application/validation/`
2. **Crear Server Actions** en `application/actions/`
3. **Crear componentes de lectura** en `features/[dominio]/[list|table|chart|card].tsx`
4. **Crear componentes de mutación** en `features/[dominio]/[form|modal].tsx`
5. **Crear página wrapper** en `app/[lang]/[ruta]/page.tsx`
6. **Agregar traducciones** en `locales/[lang]/`

### Nombrado de archivos:
- Tablas: `[entidad]-table.tsx` (ej: `listing-table.tsx`)
- Listas: `[entidad]-list.tsx` (ej: `agent-list.tsx`)
- Cards: `[entidad]-card.tsx` (ej: `property-card.tsx`)
- Formularios: `[entidad]-form.tsx` (ej: `listing-form.tsx`)
- Columnas (para tablas): `[entidad]-columns.tsx` (ej: `listing-columns.tsx`)
- Acciones de fila: `[entidad]-row-actions.tsx`
- Filtros: `[entidad]-filters.tsx` o `[entidad]-form-filters.tsx`

### Importaciones:
- Siempre usar paths absolutos con `@/`
- Entidades desde `@/domain/entities/`
- Componentes shadcn desde `@/components/ui/`
- Actions desde `@/application/actions/`
- Schemas desde `@/application/validation/`
- Features desde `@/features/[dominio]/`