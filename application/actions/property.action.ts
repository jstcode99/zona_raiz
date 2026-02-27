"use server"

import { revalidatePath } from "next/cache"
import { ROUTES } from "@/infrastructure/config/constants"
import { createPropertyModule } from "../containers/property.container"
import { propertySchema } from "../validation/property.schema"
import { PropertyType } from "@/domain/entities/property.enums"
import { createSessionModule } from "../containers/session.container"
import { AppError } from "../errors/app.error"

export async function getPropertiesAction(filters?: any) {
  try {
    const { useCases } = await createPropertyModule()
    return await useCases.all(filters)
  } catch (error) {
    console.error("getPropertiesAction", error)
    throw new Error("No se pudieron obtener las propiedades")
  }
}

export async function getPropertyByIdAction(id: string) {
  try {
    const { useCases } = await createPropertyModule()
    return await useCases.getById(id)
  } catch (error) {
    console.error("getPropertyByIdAction", error)
    throw new Error("No se pudo obtener la propiedad")
  }
}

export async function getPropertyBySlugAction(slug: string) {
  try {
    const { useCases } = await createPropertyModule()
    return await useCases.getBySlug(slug)
  } catch (error) {
    console.error("getPropertyBySlugAction", error)
    throw new Error("No se pudo obtener la propiedad")
  }
}

export async function createPropertyAction(
  realEstateId: string,
  formData: FormData
) {
  try {
    const { useCases } = await createPropertyModule()
    const sessionModule = await createSessionModule()

    const raw = Object.fromEntries(formData)

    const input = await propertySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const id = await sessionModule.useCases.getCurrentUserId()

    if (!id) {
      throw new AppError("No autorizado", "RLS", 403)
    }

    const property = await useCases.create(realEstateId, {
      ...input,
      property_type: input.property_type as PropertyType,
      created_by: id
    })

    revalidatePath(ROUTES.DASHBOARD)

    return property
  } catch (error) {
    console.error("createPropertyAction", error)
    throw new Error("No se pudo crear la propiedad")
  }
}

/**
 * UPDATE
 */
export async function updatePropertyAction(
  id: string,
  formData: FormData
) {
  try {
    const { useCases } = await createPropertyModule()
    const raw = Object.fromEntries(formData)

    const input = await propertySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const property = await useCases.update(id, {
      ...input,
      property_type: input.property_type as PropertyType
    })

    revalidatePath(ROUTES.DASHBOARD)
    revalidatePath(`${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/${id}`)
    revalidatePath(`${ROUTES.PROPERTIES}/${id}`)
    revalidatePath(`${ROUTES.PROPERTIES}/${input.slug}`)

    return property
  } catch (error) {
    console.error("updatePropertyAction", error)
    throw new Error("No se pudo actualizar la propiedad")
  }
}

/**
 * DELETE
 */
export async function deletePropertyAction(id: string) {
  try {
    const { useCases } = await createPropertyModule()
    await useCases.delete(id)

    revalidatePath(ROUTES.DASHBOARD)
  } catch (error) {
    console.error("deletePropertyAction", error)
    throw new Error("No se pudo eliminar la propiedad")
  }
}