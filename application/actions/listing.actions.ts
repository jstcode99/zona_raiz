"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { listingModule } from "../modules/listing.module";
import { createListingSchema } from "../validation/listing.validation";
import { handleError } from "../errors/handle-error";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/infrastructure/config/routes"
import { getRoute } from "@/i18n/get-route"
import { propertyModule } from "../modules/property.module";

export const createListingAction = withServerAction(
  async (formData: FormData) => {
    try {
      const raw = Object.fromEntries(formData)

      const validated = await createListingSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      const { listingService } = await listingModule()
      const { propertyService } = await propertyModule()

      const property = await propertyService.getById(validated.property_id)
      if (!property) throw new Error("Property not found")

      const listing = await listingService.create(validated)

      if (!listing) throw new Error("Listing not created")


      revalidatePath(`/es${ROUTES.listing.es}`)
      revalidatePath(`/en${ROUTES.listing.en}`)
      revalidatePath(`/es${getRoute('listings', 'es', { id: listing.id })}`)
      revalidatePath(`/en${getRoute('listings', 'en', { id: listing.id })}`)

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

      const { listingService } = await listingModule()

      const listing = await listingService.update(id, validated)

      if (!listing) throw new Error("Listing not updated")

      revalidatePath(`/es${ROUTES.listing.es}`)
      revalidatePath(`/en${ROUTES.listing.en}`)
      revalidatePath(`/es${getRoute('listings', 'es', { id })}`)
      revalidatePath(`/en${getRoute('listings', 'en', { id })}`)

    } catch (error) {
      handleError(error)
    }
  }
)

export async function deleteListingAction(id: string) {
  const { listingService } = await listingModule();

  revalidatePath(`/es${ROUTES.listing.es}`)
  revalidatePath(`/en${ROUTES.listing.en}`)
  revalidatePath(`/es${getRoute('listings', 'es', { id })}`)
  revalidatePath(`/en${getRoute('listings', 'en', { id })}`)

  return listingService.delete(id);
}
