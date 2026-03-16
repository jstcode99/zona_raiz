"use server"

import { revalidatePath } from "next/cache"
import { propertyImageSchema, propertyImageUpdateSchema } from "../validation/property-image.validation"
import sizeOf from "image-size"
import { pickDefined } from "@/lib/utils"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { getLangServerSide } from "@/shared/utils/lang"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { initI18n } from "@/i18n/server"
import { appModule } from "../modules/app.module"

export const createPropertyImageAction = withServerAction(
  async (
    propertyId: string,
    formData: FormData
  ) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { propertyImageService } = await appModule(lang, { cookies: cookieStore })

    const raw = Object.fromEntries(formData)
    const validated = await propertyImageSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true
    })

    const { file } = validated

    const buffer = Buffer.from(await validated?.file.arrayBuffer())
    const dimensions = sizeOf(buffer)

    const width = dimensions.width ?? 0
    const height = dimensions.height ?? 0

    if (width < 400 || height < 300) throw new Error(t('exceptions:max_size_pixels'))

    const propertyImage = await propertyImageService.create(propertyId, {
      filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      width: dimensions.width ?? 0,
      height: dimensions.height ?? 0,
      display_order: (validated.display_order ?? 0),
      is_primary: validated.is_primary,
      alt_text: validated.alt_text ?? file.name,
      caption: validated.caption ?? file.name
    })

    const slug = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const url = await propertyImageService.uploadFile(propertyId, slug, file)

    await propertyImageService.updatePath(propertyImage.id ?? "", url)

    revalidatePath(routes.properties())
    revalidatePath(routes.property(propertyId))
  })

/**
 * UPDATE
 */
export const updatePropertyImageAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)

    const { propertyImageService } = await appModule(lang, { cookies: cookieStore })

    const raw = Object.fromEntries(formData)

    const validated = await propertyImageUpdateSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const payload = pickDefined(validated)

    await propertyImageService.update(id, payload)

    revalidatePath(routes.properties())
    revalidatePath(routes.property(id))
  })

/**
 * DELETE
 */
export const deletePropertyImageAction = withServerAction(
  async (
    id: string,
  ) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)

    const { propertyImageService } = await appModule(lang, { cookies: cookieStore })
    
    await propertyImageService.delete(id)

    revalidatePath(routes.dashboard())
    revalidatePath(routes.properties())
    revalidatePath(routes.property(id))
  })