"use server"

import { revalidatePath } from "next/cache"
import { propertyModule } from "../modules/property.module"
import { propertySchema } from "../validation/property.schema"
import { PropertyType } from "@/domain/entities/property.enums"
import { sessionModule } from "../modules/session.module"
import { AppError } from "../errors/app.error"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { ROUTES } from "@/infrastructure/config/routes"
import { getRoute } from "@/i18n/get-route"

export const createPropertyAction = withServerAction(
  async (
    realEstateId: string,
    formData: FormData
  ) => {
    try {
      const { propertyService } = await propertyModule()
      const { sessionService } = await sessionModule('es')

      const raw = Object.fromEntries(formData)

      const input = await propertySchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      const id = await sessionService.getCurrentUserId()

      if (!id) {
        throw new AppError("No autorizado", "RLS", 403)
      }

      await propertyService.create(realEstateId, {
        ...input,
        property_type: input.property_type as PropertyType,
        created_by: id
      })

      revalidatePath(`${ROUTES.properties.es}`)
      revalidatePath(`${ROUTES.properties.en}`)
      revalidatePath(`${getRoute('property', 'es', { id })}`)
      revalidatePath(`${getRoute('property', 'en', { id })}`)
    }
    catch (error) {
      throw new Error("No se pudo crear la propiedad")
    }
  })

/**
 * UPDATE
 */
export const updatePropertyAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    try {
      const { propertyService } = await propertyModule()
      const raw = Object.fromEntries(formData)

      const input = await propertySchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      await propertyService.update(id, {
        ...input,
        property_type: input.property_type as PropertyType
      })

      revalidatePath(`/es${ROUTES.properties.es}`)
      revalidatePath(`/en${ROUTES.properties.en}`)
      revalidatePath(`/es${getRoute('property', 'es', { id })}`)
      revalidatePath(`/en${getRoute('property', 'en', { id })}`)
    } catch (error) {
      console.error("updatePropertyAction", error)
      throw new Error("No se pudo actualizar la propiedad")
    }
  })

/**
 * DELETE
 */
export async function deletePropertyAction(id: string) {
  try {
    const { propertyService } = await propertyModule()
    await propertyService.delete(id)

    revalidatePath(`/es${ROUTES.dashboard.es}`)
    revalidatePath(`/en${ROUTES.dashboard.en}`)
  } catch (error) {
    console.error("deletePropertyAction", error)
    throw new Error("No se pudo eliminar la propiedad")
  }
}