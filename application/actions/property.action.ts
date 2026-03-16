"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { propertySchema } from "../validation/property.schema"
import { PropertyType } from "@/domain/entities/property.enums"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { getLangServerSide } from "@/shared/utils/lang"
import { createRouter } from "@/i18n/router"
import { initI18n } from "@/i18n/server"
import { appModule } from "../modules/app.module"

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

    const id = await sessionService.getCurrentUserId()

    if (!id) throw new Error(t('exceptions:unauthorized'))


    await propertyService.create(realEstateId, {
      ...input,
      property_type: input.property_type as PropertyType,
      created_by: id
    })

    revalidatePath(routes.dashboard())
    revalidatePath(routes.properties())
  })

export const updatePropertyAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)

    const { propertyService } = await appModule(lang, { cookies: cookieStore })

    const raw = Object.fromEntries(formData)

    const input = await propertySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    await propertyService.update(id, {
      ...input,
      property_type: input.property_type as PropertyType
    })

    revalidatePath(routes.dashboard())
    revalidatePath(routes.properties())
    revalidatePath(routes.property(id))
  })

export async function deletePropertyAction(id: string) {
  const lang = await getLangServerSide()
  const cookieStore = await cookies()
  const routes = createRouter(lang)

  const { propertyService } = await appModule(lang, { cookies: cookieStore })

  await propertyService.delete(id)

  revalidatePath(routes.dashboard())
  revalidatePath(routes.properties())
  revalidatePath(routes.property(id))
}