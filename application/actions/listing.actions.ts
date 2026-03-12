"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { listingModule } from "../modules/listing.module";
import { createListingSchema } from "../validation/listing.validation";
import { handleError } from "../errors/handle-error";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/infrastructure/config/routes"
import { getRoute } from "@/i18n/get-route"
import { propertyModule } from "../modules/property.module";
import { sessionModule } from "../modules/session.module";
import { AppError } from "../errors/app.error";
import { Lang } from "@/i18n/settings";
import { getLangServerSide } from "@/shared/utils/lang";

export const createListingAction = withServerAction(
  async (formData: FormData) => {
    try {
      const raw = Object.fromEntries(formData);

      const validated = await createListingSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      });

      const lang = await getLangServerSide();
      const { listingService } = await listingModule(lang);
      const { propertyService } = await propertyModule(lang);
      const { sessionService } = await sessionModule(lang);

      const property = await propertyService.getById(validated.property_id);
      if (!property) throw new Error("Property not found");

      const agent_id = await sessionService.getCurrentUserId();

      if (!agent_id) {
        throw new AppError("No autorizado", "RLS", 403);
      }

      const listing = await listingService.create({
        ...validated,
        agent_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expenses_included: raw.expenses_included === 'on',
        featured: raw.featured === 'on',
        available_from: validated.available_from ? validated.available_from.toISOString() : undefined,
      });

      if (!listing) throw new Error("Listing not created");


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

      const lang = await getLangServerSide();
      const { listingService } = await listingModule(lang);
      const { sessionService } = await sessionModule(lang);

      const currentListing = await listingService.findById(id);

      if (!currentListing) {
        throw new Error("Listing not found");
      }

      const agent_id = currentListing.agent_id; // Asumiendo que el agent_id no cambia en la actualización

      const dataToUpdate = {
        ...currentListing,
        ...validated,
        agent_id,
        updated_at: new Date().toISOString(),
        expenses_included: raw.expenses_included === 'on',
        featured: raw.featured === 'on',
        available_from: validated.available_from ? validated.available_from.toISOString() : currentListing.available_from,
        property_id: currentListing.property_id, // Asegurar que property_id se mantiene
      };

      const listing = await listingService.update(id, dataToUpdate)

      if (!listing) throw new Error("Listing not updated")

      revalidatePath(`/dashboard/listings`)
      revalidatePath(`${getRoute('listings', 'es')}`)
      revalidatePath(`${getRoute('listings', 'en')}`)
      revalidatePath(`${getRoute('listing', 'es', { id })}`)
      revalidatePath(`${getRoute('listing', 'en', { id })}`)

    } catch (error) {
      handleError(error)
    }
  }
)

export async function deleteListingAction(id: string) {
  const lang = await getLangServerSide();
  const { listingService } = await listingModule(lang);

  revalidatePath(`/dashboard/listings`)
  revalidatePath(`${getRoute('listings', 'es')}`)
  revalidatePath(`${getRoute('listings', 'en')}`)

  return listingService.delete(id);
}
