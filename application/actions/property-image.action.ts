"use server"

import { revalidatePath } from "next/cache"
import { ROUTES } from "@/infrastructure/config/constants"
import { createPropertyImageModule } from "../containers/property-image.container"
import { propertyImageSchema, propertyImageUpdateSchema } from "../validation/property-image.validation"
import { createPropertyModule } from "../containers/property.container"
import sizeOf from "image-size"
import { pickDefined } from "@/lib/utils"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { console } from "inspector"

export const createPropertyImageAction = withServerAction(
  async (
    propertyId: string,
    formData: FormData
  ) => {
  try {
    const { useCases } = await createPropertyImageModule()

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

    const propertyImage = await useCases.create(propertyId, {
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

    const url = await useCases.uploadFile(propertyId, slug, file)

    await useCases.updatePath(propertyImage.id ?? "", url)

    revalidatePath(ROUTES.DASHBOARD)
    revalidatePath(`/${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/${propertyId}`)
    revalidatePath(`/${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/${propertyId}/images`)
    revalidatePath(`/${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/${propertyId}/listing`)

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
    const { useCases } = await createPropertyImageModule()
    const raw = Object.fromEntries(formData)

    const validated = await propertyImageUpdateSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const payload = pickDefined(validated)

    const propertyImage = await useCases.update(id, payload)

    const propertyModule = await createPropertyModule()

    const property = await propertyModule.useCases.getById(propertyImage.property_id)

    revalidatePath(ROUTES.DASHBOARD)
    revalidatePath(`/${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/${id}`)
    revalidatePath(`/${ROUTES.PROPERTIES}/${id}`)
    revalidatePath(`/${ROUTES.PROPERTIES}/${property?.slug}`)
  } catch (error) {
    throw new Error("No se pudo actualizar el recurso de la propiedad")
  }
})

/**
 * DELETE
 */
export async function deletePropertyImageAction(id: string) {
  try {
    const { useCases } = await createPropertyImageModule()
    await useCases.delete(id)

    revalidatePath(ROUTES.DASHBOARD)
  } catch (error) {
    throw new Error("No se pudo eliminar la propiedad")
  }
}