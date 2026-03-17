"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { propertySchema } from "../validation/property.schema"
import { PropertyType } from "@/domain/entities/property.enums"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { getLangServerSide } from "@/shared/utils/lang"
import { createRouter } from "@/i18n/router"
import { initI18n } from "@/i18n/server"
import { appModule } from "../modules/app.module"
import { CACHE_TAGS } from "@/infrastructure/config/constants"

export const createPropertyAction = withServerAction(
  async (
    realEstateId: string,
    formData: FormData
  ) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { sessionService, propertyService } = await appModule(lang, { cookies: cookieStore })

    const raw = Object.fromEntries(formData)

    const input = await propertySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const userId = await sessionService.getCurrentUserId()

    if (!userId) throw new Error(t('exceptions:unauthorized'))

    await propertyService.create(realEstateId, {
      ...input,
      property_type: input.property_type as PropertyType,
      created_by: userId
    })

    revalidatePath(routes.dashboard())
    revalidatePath(routes.properties())

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.PROPERTY.PRINCIPAL, { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.ALL, { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.COUNT, { expire: 0 })
    revalidateTag(CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId), { expire: 0 })
  }
)

export const updatePropertyAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { propertyService } = await appModule(lang, { cookies: cookieStore })

    const raw = Object.fromEntries(formData)

    const input = await propertySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const currentProperty = await propertyService.getById(id);
    if (!currentProperty) throw new Error(t('exceptions:data_not_found'))

    await propertyService.update(id, {
      ...input,
      property_type: input.property_type as PropertyType
    })

    revalidatePath(routes.dashboard())
    revalidatePath(routes.properties())
    revalidatePath(routes.property(id))

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.PROPERTY.PRINCIPAL, { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.ALL, { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.DETAIL(id), { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.COUNT, { expire: 0 })
    if (currentProperty.real_estate_id) {
      revalidateTag(CACHE_TAGS.REAL_ESTATE.DETAIL(currentProperty.real_estate_id), { expire: 0 })
    }
  }
)

export const deletePropertyAction = withServerAction(
  async (id: string) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { propertyService } = await appModule(lang, { cookies: cookieStore })

    const currentProperty = await propertyService.getById(id);
    if (!currentProperty) throw new Error(t('exceptions:data_not_found'))

    await propertyService.delete(id)

    revalidatePath(routes.dashboard())
    revalidatePath(routes.properties())
    revalidatePath(routes.property(id))

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.PROPERTY.PRINCIPAL, { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.ALL, { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.DETAIL(id), { expire: 0 })
    revalidateTag(CACHE_TAGS.PROPERTY.COUNT, { expire: 0 })
    if (currentProperty.real_estate_id) {
      revalidateTag(CACHE_TAGS.REAL_ESTATE.DETAIL(currentProperty.real_estate_id), { expire: 0 })
    }
  }
)
