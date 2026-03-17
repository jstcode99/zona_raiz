# Server Actions — Referencia completa

## Estructura base obligatoria

Todo Server Action en este proyecto **debe** tener exactamente esta estructura. No es opcional.

```typescript
"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { revalidatePath } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { appModule } from "../modules/app.module"
import { initI18n } from "@/i18n/server"
```

El wrapper `withServerAction` maneja: try/catch, formato de error, y tipado del retorno.
**Nunca** escribir un Server Action sin él.

---

## Ejemplos reales del proyecto

### Delete con autorización multi-rol

```typescript
export const deleteInquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { sessionService, inquiryService } = await appModule(lang, { cookies: cookieStore })

    // Validar input
    const id = formData.get("id") as string
    if (!id) throw new Error(t('validations:required', { attribute: 'ID' }))

    // Verificar sesión
    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error(t('exceptions:unauthorized'))

    // Cargar entidad para verificar ownership
    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error(t('exceptions:data_not_found'))

    // Autorización por rol + ownership
    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()
    const isAssignedAgent = inquiry.assigned_to === userId

    if (!isAdmin && !isCoordinator && !isAssignedAgent) {
      throw new Error(t('exceptions:unauthorized'))
    }

    await inquiryService.delete(id)
    revalidatePath(routes.inquiries())
  }
)
```

### Update de estado (status)

```typescript
export const updateInquiryStatusAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { sessionService, inquiryService } = await appModule(lang, { cookies: cookieStore })

    const id = formData.get("id") as string
    const status = formData.get("status") as string
    if (!id || !status) throw new Error(t('validations:required', { attribute: 'ID y status' }))

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error(t('exceptions:unauthorized'))

    const inquiry = await inquiryService.findById(id)
    if (!inquiry) throw new Error(t('exceptions:data_not_found'))

    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()
    const isAssignedAgent = inquiry.assigned_to === userId

    if (!isAdmin && !isCoordinator && !isAssignedAgent) {
      throw new Error(t('exceptions:unauthorized'))
    }

    await inquiryService.update(id, { status: status as any })
    revalidatePath(routes.inquiries())
  }
)
```

### Assign con validación de pertenencia a inmobiliaria

```typescript
export const assignInquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { sessionService, inquiryService, profileService } = await appModule(lang, { cookies: cookieStore })

    const id = formData.get("id") as string
    const assigned_to = formData.get("assigned_to") as string
    if (!id || !assigned_to) throw new Error(t('exceptions:unauthorized'))

    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error(t('exceptions:data_not_found'))

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error(t('exceptions:unauthorized'))

    // Solo admin o coordinador pueden asignar
    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()
    if (!isAdmin && !isCoordinator) throw new Error(t('exceptions:unauthorized'))

    // Verificar que el agente destino pertenece a la misma inmobiliaria
    const realEstateId = inquiry.listing.real_estate_id
    const targetAgent = await profileService.getAgentRoleInRealEstate(assigned_to, realEstateId)
    if (!targetAgent) throw new Error(t('exceptions:unauthorized'))

    await inquiryService.update(id, { assigned_to })
    revalidatePath(routes.inquiries())
  }
)
```

---

## Claves de i18n disponibles

```typescript
t('validations:required', { attribute: 'NombreCampo' })  // campo requerido
t('exceptions:unauthorized')                              // no autorizado
t('exceptions:data_not_found')                           // entidad no encontrada
```

Si necesitas una clave nueva, agregarla al namespace correspondiente en `i18n/`.

---

## Checklist antes de crear un Server Action

- [ ] Tiene `"use server"` al inicio
- [ ] Está envuelto en `withServerAction()`
- [ ] Instancia servicios solo desde `appModule()`
- [ ] Valida todos los inputs de `formData`
- [ ] Verifica sesión con `sessionService.getCurrentUserId()`
- [ ] Verifica autorización por rol
- [ ] Usa `t()` para todos los mensajes de error
- [ ] Llama a `revalidatePath()` al final si muta datos
- [ ] Llama a `revalidateTag()` con tags específicos para invalidar cache (obligatorio)
  - Importar `CACHE_TAGS` desde `@/infrastructure/config/constants`
  - Ver `references/cache-tags.md` para la lista de tags disponibles