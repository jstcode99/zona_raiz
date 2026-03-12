"use server"

import { revalidatePath } from "next/cache"
import { propertyImageModule } from "../modules/property-image.module"
import { propertyImageSchema, propertyImageUpdateSchema } from "../validation/property-image.validation"
import { propertyModule } from "../modules/property.module"
import sizeOf from "image-size"
import { pickDefined } from "@/lib/utils"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { ROUTES } from "@/infrastructure/config/routes"
import { getRoute } from "@/i18n/get-route"
import { getLangServerSide } from "@/shared/utils/lang"

export const createPropertyImageAction = withServerAction(
  async (
    propertyId: string,
    formData: FormData
  ) => {
    try {
      const lang = await getLangServerSide()
      const { propertyImageService } = await propertyImageModule(lang)

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

      if (width < 400 || height < 300) {
        throw new Error("La imagen debe tener mínimo 400x300 píxeles")
      }

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

      revalidatePath(`${ROUTES.properties.es}`)
      revalidatePath(`${ROUTES.properties.en}`)
      revalidatePath(`${getRoute('property', 'es', { propertyId })}`)
      revalidatePath(`${getRoute('property', 'en', { propertyId })}`)

    } catch (error) {
      throw new Error("No se pudo crear recurso de la propiedad")
    }
  })

/**
 * UPDATE
 */
export const updatePropertyImageAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    try {
      const lang = await getLangServerSide()
      const { propertyImageService } = await propertyImageModule(lang)

      const raw = Object.fromEntries(formData)

      const validated = await propertyImageUpdateSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      const payload = pickDefined(validated)

      await propertyImageService.update(id, payload)

      revalidatePath(`${ROUTES.properties.es}`)
      revalidatePath(`${ROUTES.properties.en}`)
      revalidatePath(`${getRoute('property', 'es', { id })}`)
      revalidatePath(`${getRoute('property', 'en', { id })}`)
      
    } catch (error) {
      throw new Error("No se pudo actualizar el recurso de la propiedad")
    }
  })

/**
 * DELETE
 */
export async function deletePropertyImageAction(id: string) {
  try {
    const lang = await getLangServerSide()
    const { propertyImageService } = await propertyImageModule(lang)
    await propertyImageService.delete(id)

    revalidatePath(`/es${ROUTES.dashboard.es}`)
    revalidatePath(`/en${ROUTES.dashboard.en}`)
  } catch (error) {
    throw new Error("No se pudo eliminar la propiedad")
  }
}