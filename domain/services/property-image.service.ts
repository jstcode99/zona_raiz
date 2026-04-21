import { PropertyImagePort } from "@/domain/ports/property-image.port";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export class PropertyImageService {
  constructor(
    private propertyImagePort: PropertyImagePort,
    private lang: Lang = "es",
  ) {}

  getById(id: string) {
    return this.propertyImagePort.getById(id);
  }

  getByPropertyId(propertyId: string) {
    return this.propertyImagePort.getByPropertyId(propertyId);
  }

  existPath(path: string) {
    return this.propertyImagePort.existPath(path);
  }

  create(propertyId: string, data: Parameters<PropertyImagePort["create"]>[1]) {
    return this.propertyImagePort.create(propertyId, data);
  }

  update(
    propertyImageId: string,
    data: Parameters<PropertyImagePort["update"]>[1],
  ) {
    return this.propertyImagePort.update(propertyImageId, data);
  }

  uploadFile(propertyId: string, name: string, image: File) {
    return this.propertyImagePort.uploadFile(propertyId, name, image);
  }

  updatePath(propertyImageId: string, path: string) {
    return this.propertyImagePort.updatePath(propertyImageId, path);
  }

  delete(id: string) {
    return this.propertyImagePort.delete(id);
  }

  deleteByPropertyId(propertyId: string) {
    return this.propertyImagePort.deleteByPropertyId(propertyId);
  }

  deleteFile(public_url: string) {
    return this.propertyImagePort.deleteFile(public_url);
  }

  // Batch mutations
  updateDisplayOrder(updates: Array<{ id: string; display_order: number }>) {
    return this.propertyImagePort.updateDisplayOrder(updates);
  }

  setPrimary(propertyId: string, imageId: string) {
    return this.propertyImagePort.setPrimary(propertyId, imageId);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.propertyImagePort.getById(id),
      [CACHE_TAGS.PROPERTY_IMAGE.KEYS.BY_ID(id)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.PROPERTY_IMAGE.PRINCIPAL,
          CACHE_TAGS.PROPERTY_IMAGE.DETAIL(id),
        ],
      },
    )();
  }

  getCachedByPropertyId(propertyId: string) {
    return unstable_cache(
      async () => this.propertyImagePort.getByPropertyId(propertyId),
      [CACHE_TAGS.PROPERTY_IMAGE.KEYS.BY_PROPERTY_ID(propertyId)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.PROPERTY_IMAGE.PRINCIPAL,
          CACHE_TAGS.PROPERTY_IMAGE.BY_PROPERTY(propertyId),
          CACHE_TAGS.PROPERTY.DETAIL(propertyId), // ← cross-tag con PROPERTY
        ],
      },
    )();
  }
}
