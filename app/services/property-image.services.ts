import { cached } from "@/infrastructure/cache/cache";
import { createPropertyImageModule } from "@/application/containers/property-image.container";

export const getPropertyImagesById = cached(
  async function (propertyId: string) {
    const { useCases } = await createPropertyImageModule()
    return useCases.getByPropertyId(propertyId);
  }
);
