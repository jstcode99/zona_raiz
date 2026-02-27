"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { createListingModule } from "../containers/listing.container";
import { createListingSchema } from "../validation/listing.validation";
import { handleError } from "../errors/handle-error";

export const createListingAction = withServerAction(
  async (formData: FormData) => {
    try {
      const raw = Object.fromEntries(formData)

      const input = await createListingSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      })

      const { useCases } = await createListingModule()
      await useCases.create(input)

    } catch (error) {
      handleError(error)
    }
  }
)

export async function updateListing(id: string, input: any) {
  const { useCases } = await createListingModule();
  return useCases.update(id, input);
}

export async function getListing(id: string) {
  const { useCases } = await createListingModule();
  return useCases.findById(id);
}

export async function getActiveListings() {
  const { useCases } = await createListingModule();
  return useCases.findActive();
}

export async function deleteListing(id: string) {
  const { useCases } = await createListingModule();
  return useCases.delete(id);
}