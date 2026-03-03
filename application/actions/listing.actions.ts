"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { createListingModule } from "../containers/listing.container";
import { createListingSchema } from "../validation/listing.validation";
import { handleError } from "../errors/handle-error";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/infrastructure/config/constants";

export const createListingAction = withServerAction(
  async (formData: FormData) => {
    try {
      const raw = Object.fromEntries(formData)

      const validated = await createListingSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      const { useCases } = await createListingModule()

      const listing = await useCases.create(validated)

      revalidatePath(ROUTES.DASHBOARD)
      revalidatePath(`${ROUTES.DASHBOARD}/${ROUTES.LISTING}/${listing.id}`)
      revalidatePath(`${ROUTES.LISTING}/${listing.id}`)
      revalidatePath(`${ROUTES.LISTING}/${listing.property.slug}`)

    } catch (error) {
      handleError(error)
    }
  }
)

export const updateListingAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    try {
      const raw = Object.fromEntries(formData)

      const validated = await createListingSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      const { useCases } = await createListingModule()

      const listing = await useCases.update(id, validated)

      revalidatePath(ROUTES.DASHBOARD)
      revalidatePath(`${ROUTES.DASHBOARD}/${ROUTES.LISTING}/${id}`)
      revalidatePath(`${ROUTES.LISTING}/${id}`)
      revalidatePath(`${ROUTES.LISTING}/${listing.property.slug}`)

    } catch (error) {
      handleError(error)
    }
  }
)

export async function deleteListingAction(id: string) {
  const { useCases } = await createListingModule();
  return useCases.delete(id);
}