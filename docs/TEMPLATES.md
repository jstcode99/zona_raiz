# 📦 Templates Actualizados - Patrones Reales del Proyecto

## 🎯 Ejemplo Real: Módulo Profile

Todos los templates siguen el ejemplo real de `profile` que ya existe en el proyecto.

---

## 📋 1. Entity Template

**Ubicación:** `domain/entities/[module].entity.ts`

```typescript
export interface ProfileEntity {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: EUserRole
  created_at: string
  updated_at: string
}

export enum EUserRole {
  ADMIN = "admin",
  AGENT = "agent",
  CLIENT = "client"
}

export enum EProfileStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned"
}
```

**Reglas:**
- ✅ Nombres de BD (snake_case)
- ✅ Enums con prefijo `E`
- ✅ Tipos explícitos (`string | null`)
- ✅ Solo datos, sin métodos

---

## 🔌 2. Port Template

**Ubicación:** `domain/[module].port.ts` (directamente en `domain/`)

```typescript
import { ProfileEntity } from "@/domain/entities/profile.entity"

export interface ProfilePort {
  getProfileByUserId(userId: string): Promise<ProfileEntity | null>
  updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<void>
  uploadAvatar(userId: string, file: File): Promise<string>
  updatePathAvatarProfile(userId: string, avatarUrl: string): Promise<void>
  searchProfilesByEmail(email: string): Promise<ProfileEntity[]>
  getRoleByUserId(userId: string): Promise<string>
  updateRole(userId: string, role: EUserRole): Promise<void>
}
```

**Reglas:**
- ✅ Sin prefijo `I`
- ✅ Sufijo `Port` (no `Repository`)
- ✅ Métodos que describe el repositorio
- ✅ `Promise<T | null>` para búsquedas
- ❌ SIN lógica de negocio

---

## 🚨 3. Error Template

**Ubicación:** `domain/errors/[module].error.ts`

```typescript
export class ProfileNotFoundError extends Error {
  constructor(userId: string) {
    super(`Profile not found for user: ${userId}`)
    this.name = "ProfileNotFoundError"
  }
}

export class InvalidAvatarError extends Error {
  constructor(reason: string) {
    super(`Invalid avatar: ${reason}`)
    this.name = "InvalidAvatarError"
  }
}

export class UnauthorizedProfileError extends Error {
  constructor(userId: string) {
    super(`Unauthorized access to profile: ${userId}`)
    this.name = "UnauthorizedProfileError"
  }
}
```

**Reglas:**
- ✅ Extends `Error`
- ✅ `this.name` = nombre de clase
- ✅ Mensaje descriptivo
- ✅ Constructor con parámetros relevantes
- ❌ Sin comentarios

---

## 💼 4. UseCase Template

**Ubicación:** `domain/use-cases/[module].cases.ts`

```typescript
import { ProfileEntity, EUserRole } from "@/domain/entities/profile.entity"
import { ProfilePort } from "@/domain/profile.port"
import {
  ProfileNotFoundError,
  InvalidAvatarError,
  UnauthorizedProfileError
} from "@/domain/errors/profile.error"

export class ProfileUseCases {
  constructor(private repository: ProfilePort) {}

  async getProfile(userId: string): Promise<ProfileEntity> {
    const profile = await this.repository.getProfileByUserId(userId)
    if (!profile) {
      throw new ProfileNotFoundError(userId)
    }
    return profile
  }

  async updateProfile(
    userId: string,
    data: { full_name?: string; phone?: string }
  ): Promise<void> {
    const existing = await this.repository.getProfileByUserId(userId)
    if (!existing) {
      throw new ProfileNotFoundError(userId)
    }

    await this.repository.updateProfile(userId, data)
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
      throw new InvalidAvatarError("Must be an image file")
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new InvalidAvatarError("File must be less than 5MB")
    }

    return this.repository.uploadAvatar(userId, file)
  }

  async updateAvatarPath(userId: string, avatarUrl: string): Promise<void> {
    await this.repository.updatePathAvatarProfile(userId, avatarUrl)
  }

  async changeRole(userId: string, newRole: EUserRole): Promise<void> {
    const profile = await this.repository.getProfileByUserId(userId)
    if (!profile) {
      throw new ProfileNotFoundError(userId)
    }

    await this.repository.updateRole(userId, newRole)
  }

  async getCurrentUserId(userId: string): Promise<string> {
    const role = await this.repository.getRoleByUserId(userId)
    if (!role) {
      throw new UnauthorizedProfileError(userId)
    }
    return role
  }
}
```

**Reglas:**
- ✅ Constructor inyecta port
- ✅ Métodos `async`
- ✅ Devuelve `Promise<T>`
- ✅ Valida con errores custom
- ✅ NO conoce Supabase
- ✅ NO valida con Yup
- ❌ Sin comentarios

---

## 🔗 5. Adapter Template

**Ubicación:** `infrastructure/adapters/supabase/supabase-[module].adapter.ts`

```typescript
import { SupabaseClient } from "@supabase/supabase-js"
import { ProfilePort } from "@/domain/profile.port"
import { ProfileEntity, EUserRole } from "@/domain/entities/profile.entity"

export class SupabaseProfileAdapter implements ProfilePort {
  constructor(private supabase: SupabaseClient) {}

  async getProfileByUserId(userId: string): Promise<ProfileEntity | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null // Not found
      throw error
    }

    return data as ProfileEntity
  }

  async updateProfile(
    userId: string,
    data: Partial<ProfileEntity>
  ): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .update(data)
      .eq("id", userId)

    if (error) throw error
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const timestamp = Date.now()
    const path = `${userId}/${timestamp}_${file.name}`

    const { error: uploadError } = await this.supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = this.supabase.storage
      .from("avatars")
      .getPublicUrl(path)

    return data.publicUrl
  }

  async updatePathAvatarProfile(
    userId: string,
    avatarUrl: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId)

    if (error) throw error
  }

  async searchProfilesByEmail(email: string): Promise<ProfileEntity[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${email}%`)

    if (error) throw error
    return data as ProfileEntity[]
  }

  async getRoleByUserId(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data?.role || ""
  }

  async updateRole(userId: string, role: EUserRole): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)

    if (error) throw error
  }
}
```

**Reglas:**
- ✅ `implements ProfilePort`
- ✅ Conoce Supabase
- ✅ Maneja errores específicos
- ✅ Devuelve tipos de Entity
- ✅ Timestamps con `Date.now()`

---

## 📦 6. Container Template

**Ubicación:** `application/containers/[module].container.ts`

```typescript
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter"
import { ProfileUseCases } from "@/domain/use-cases/profile.cases"

export async function createProfileModule() {
  const supabase = await createSupabaseServerClient()
  const adapter = new SupabaseProfileAdapter(supabase)
  const useCases = new ProfileUseCases(adapter)

  return { useCases }
}
```

**Reglas:**
- ✅ Async (Supabase es async)
- ✅ Crea adapter + lo wireia a usecase
- ✅ Devuelve `{ useCases }`
- ✅ Una por módulo
- ✅ Simple y directo

---

## ✅ 7. Validation Schema Template (Yup)

**Ubicación:** `application/validation/[module].validation.ts`

```typescript
import * as yup from "yup"

export const profileSchema = yup.object().shape({
  full_name: yup
    .string()
    .max(255, "Max 255 characters")
    .optional(),
  phone: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
})

export type ProfileInput = yup.InferType<typeof profileSchema>

export const profileAvatarSchema = yup.object().shape({
  avatar: yup
    .mixed<File>()
    .required("Avatar is required")
    .test("fileSize", "File must be less than 5MB", (file) => {
      return file instanceof File && file.size <= 5 * 1024 * 1024
    })
    .test("fileType", "Must be a valid image file", (file) => {
      return file instanceof File && file.type.startsWith("image/")
    })
})

export type ProfileAvatarInput = yup.InferType<typeof profileAvatarSchema>

export const updateRoleSchema = yup.object().shape({
  role: yup
    .string()
    .oneOf(["admin", "agent", "client"], "Invalid role")
    .required("Role is required")
})

export type UpdateRoleInput = yup.InferType<typeof updateRoleSchema>
```

**Reglas:**
- ✅ **Yup, NO Zod**
- ✅ `InferType<typeof schema>` para tipos
- ✅ Mensajes claros
- ✅ Custom tests para archivos
- ✅ Exporta tipo + schema

---

## ⚡ 8. Server Action Template

**Ubicación:** `application/actions/[module].actions.ts`

```typescript
"use server"

import { handleError } from "@/application/errors/handle-error"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { createProfileModule } from "@/application/containers/profile.container"
import { createSessionModule } from "@/application/containers/session.container"
import {
  profileSchema,
  profileAvatarSchema,
  updateRoleSchema
} from "@/application/validation/profile.validation"
import { AppError } from "@/application/errors/app.error"
import { revalidatePath } from "next/cache"

export const updateProfileAction = withServerAction(
  async (formData: FormData) => {
    try {
      // 1. Extraer datos
      const raw = Object.fromEntries(formData)

      // 2. Validar con Yup
      const { full_name, phone } = await profileSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true
      })

      // 3. Obtener módulos
      const profileModule = await createProfileModule()
      const sessionModule = await createSessionModule()

      // 4. Obtener usuario actual
      const userId = await sessionModule.useCases.getCurrentUserId()
      if (!userId) {
        throw new AppError("Unauthorized", "RLS", 403)
      }

      // 5. Ejecutar use-case
      await profileModule.useCases.updateProfile(userId, {
        full_name,
        phone
      })

      // 6. Revalidar cache
      revalidatePath("/dashboard/account")
    } catch (error) {
      handleError(error)
    }
  }
)

export const uploadAvatarAction = withServerAction(
  async (formData: FormData) => {
    try {
      const raw = Object.fromEntries(formData)

      const { avatar } = await profileAvatarSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true
      })

      const profileModule = await createProfileModule()
      const sessionModule = await createSessionModule()

      const userId = await sessionModule.useCases.getCurrentUserId()
      if (!userId) {
        throw new AppError("Unauthorized", "RLS", 403)
      }

      const avatarUrl = await profileModule.useCases.uploadAvatar(
        userId,
        avatar
      )
      await profileModule.useCases.updateAvatarPath(userId, avatarUrl)

      revalidatePath("/dashboard/account")
    } catch (error) {
      handleError(error)
    }
  }
)

export const updateRoleAction = withServerAction(
  async (formData: FormData) => {
    try {
      const raw = Object.fromEntries(formData)

      const { role } = await updateRoleSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true
      })

      const profileModule = await createProfileModule()
      const sessionModule = await createSessionModule()

      const adminId = await sessionModule.useCases.getCurrentUserId()
      if (!adminId) {
        throw new AppError("Unauthorized", "RLS", 403)
      }

      const targetUserId = formData.get("userId") as string
      await profileModule.useCases.changeRole(
        targetUserId,
        role as any
      )

      revalidatePath("/dashboard/users")
    } catch (error) {
      handleError(error)
    }
  }
)
```

**Reglas:**
- ✅ `"use server"` al inicio
- ✅ Envuelto en `withServerAction()`
- ✅ Try-catch + `handleError()`
- ✅ Validar con Yup
- ✅ Obtener usuario actual
- ✅ `revalidatePath()` después
- ✅ FormData para uploads

---

## 🔧 9. Service Template (Caché)

**Ubicación:** `services/[module].services.ts`

```typescript
import { createProfileModule } from "@/application/containers/profile.container"
import { createSessionModule } from "@/application/containers/session.container"
import { cached } from "@/infrastructure/cache/cache"

export const getCurrentUser = cached(
  async function () {
    const { useCases } = await createSessionModule()
    return useCases.getCurrentUser()
  }
)

export const getProfileById = cached(
  async function (userId: string) {
    const { useCases } = await createProfileModule()
    return useCases.getProfile(userId)
  }
)

export const searchProfiles = cached(
  async function (email: string) {
    const { useCases } = await createProfileModule()
    return useCases.searchProfilesByEmail(email)
  }
)
```

**Reglas:**
- ✅ Usa `cached()` helper
- ✅ SOLO para queries
- ✅ Nombres descriptivos
- ✅ Async functions

---

## 🧩 10. Card Component Template

**Ubicación:** `features/[module]/[module]-section-card.tsx`

```typescript
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import i18next from "i18next"
import { ComponentProps } from "react"
import { ProfileEntity } from "@/domain/entities/profile.entity"
import { AvatarUpload } from "./avatar-upload"
import { ProfileForm } from "./profile-form"

interface ProfileSectionCardProps extends ComponentProps<"div"> {
  defaultValues: ProfileEntity
}

export default function ProfileSectionCard({
  className,
  defaultValues,
  ...props
}: ProfileSectionCardProps) {
  return (
    <Card className="z-1 w-full border-none sm:max-w-md" {...props}>
      <CardHeader className="gap-2">
        <CardTitle className="text-xl">
          {i18next.t("forms.profile.title")}
        </CardTitle>
        <CardDescription className="text-base">
          {i18next.t("forms.profile.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="px-6 max-w-35 mx-auto flex items-center relative">
          <AvatarUpload
            avatarUrl={defaultValues.avatar_url || ""}
            full_name={defaultValues.full_name || ""}
          />
        </div>
        <ProfileForm
          defaultValues={{
            full_name: defaultValues.full_name || "",
            phone: defaultValues.phone || ""
          }}
        />
      </CardContent>
    </Card>
  )
}
```

**Reglas:**
- ✅ `"use client"`
- ✅ Props tipadas con `interface`
- ✅ Shadcn/ui components
- ✅ i18n con `i18next.t()`
- ❌ Sin lógica de negocio

---

## 📝 11. Form Component Template

**Ubicación:** `features/[module]/[module]-form.tsx`

```typescript
"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ComponentProps, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { cn } from "@/lib/utils"
import {
  ProfileInput,
  profileSchema
} from "@/application/validation/profile.validation"
import { updateProfileAction } from "@/application/actions/profile.actions"

interface ProfileFormProps extends ComponentProps<"form"> {
  defaultValues: ProfileInput
}

export function ProfileForm({
  className,
  defaultValues,
  ...props
}: ProfileFormProps) {
  const { t } = useTranslation()

  const form = useForm<ProfileInput>({
    resolver: yupResolver(profileSchema),
    defaultValues: defaultValues,
    mode: "onBlur"
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty }
  } = form

  const mutation = useServerMutation({
    action: updateProfileAction,
    setError: form.setError,
    onSuccess: () => {
      toast.success(t("forms.profile.success") || "Profile updated")
      reset(form.getValues())
    },
    onError: (error) => {
      console.error("Error:", error)
    }
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    mutation.action(formData)
  })

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      <Form.Set className="space-y-4">
        <Form.Input
          name="full_name"
          label={t("forms.profile.fields.full_name.label") || "Full Name"}
          autoComplete="name"
          disabled={isLoading}
        />

        <Form.Phone
          name="phone"
          label={t("forms.profile.fields.phone.label") || "Phone"}
          disabled={isLoading}
        />

        <Field className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isDirty}
          >
            {isLoading && (
              <Spinner
                data-icon="inline-start"
                className="mr-2 h-4 w-4"
              />
            )}
            {t("words.save") || "Save"}
          </Button>
        </Field>
      </Form.Set>
    </Form>
  )
}
```

**Reglas:**
- ✅ React Hook Form + Yup resolver
- ✅ `useServerMutation` hook
- ✅ Toast con Sonner
- ✅ i18n labels
- ✅ `isDirty` para validar cambios
- ✅ FormData en submit

---

## 📄 12. Server Page Component Template

**Ubicación:** `app/[section]/[page]/page.tsx`

```typescript
import { encodedRedirect } from "@/shared/redirect"
import AuthBackgroundShape from "@/assets/svg/background-shape"
import ProfileSectionCard from "@/features/profile/profile-section-card"
import { getCurrentUser } from "@/services/session.services"

export default async function AccountPage() {
  const profile = await getCurrentUser()

  if (!profile) {
    return encodedRedirect(
      "error",
      "/auth/sign-in",
      "Could not load profile"
    )
  }

  return (
    <div className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>
      <ProfileSectionCard defaultValues={profile} />
    </div>
  )
}
```

**Reglas:**
- ✅ Async server component
- ✅ Llama service (caché)
- ✅ Valida datos
- ✅ `encodedRedirect` en error
- ✅ Pasa datos al componente client

---

## ✨ Resumen: Orden de Implementación

### 1. Backend (Domain)

```typescript
1. Entity          domain/entities/[module].entity.ts
2. Port            domain/[module].port.ts
3. Error           domain/errors/[module].error.ts
4. UseCase         domain/use-cases/[module].cases.ts
```

### 2. Infrastructure

```typescript
5. Adapter         infrastructure/adapters/supabase/supabase-[module].adapter.ts
6. Container       application/containers/[module].container.ts
```

### 3. Application

```typescript
7. Validation      application/validation/[module].validation.ts
8. Actions         application/actions/[module].actions.ts
9. Service         services/[module].services.ts
```

### 4. Frontend

```typescript
10. Components     features/[module]/[module]-*.tsx
11. Page          app/[section]/page.tsx
```

---

## 🚀 Copy-Paste Rápido

En Cursor, pedir:

```
Create Profile module following these patterns:

Reference files:
@domain/entities/profile.entity.ts
@domain/profile.port.ts
@infrastructure/adapters/supabase/supabase-profile.adapter.ts
@domain/use-cases/profile.cases.ts
@application/containers/profile.container.ts
@application/validation/profile.validation.ts
@application/actions/profile.actions.ts
@features/profile/profile-section-card.tsx

Use same structure and patterns. Create [NewModule] following profile.

Naming rules:
- Entity: domain/entities/[module].entity.ts
- Port: domain/[module].port.ts
- UseCase: domain/use-cases/[module].cases.ts
- Adapter: infrastructure/adapters/supabase/supabase-[module].adapter.ts
- Container: application/containers/[module].container.ts
- Validation: application/validation/[module].validation.ts
- Action: application/actions/[module].actions.ts
```
