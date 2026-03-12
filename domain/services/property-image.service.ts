import { PropertyImagePort } from "@/domain/ports/property-image.port";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";

export class PropertyImageService {
  constructor(private propertyImagePort: PropertyImagePort, private lang: Lang = "es") {}

  getById(id: string) {
    return this.propertyImagePort.getById(id);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.propertyImagePort.getById(id),
      [`property-image:${id}`],
      {
        revalidate: 300,
        tags: ["property-images", `property-image:${id}`],
      }
    )();
  }

  getByPropertyId(propertyId: string) {
    return this.propertyImagePort.getByPropertyId(propertyId);
  }

  getCachedByPropertyId(propertyId: string) {
    return unstable_cache(
      async () => this.propertyImagePort.getByPropertyId(propertyId),
      [`property-image:property:${propertyId}`],
      {
        revalidate: 300,
        tags: ["property-images", `property:${propertyId}`],
      }
    )();
  }

  existPath(path: string) {
    return this.propertyImagePort.existPath(path);
  }

  create(propertyId: string, data: Parameters<PropertyImagePort["create"]>[1]) {
    return this.propertyImagePort.create(propertyId, data);
  }

  update(propertyImageId: string, data: Parameters<PropertyImagePort["update"]>[1]) {
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

  deleteFile(public_url: string) {
    return this.propertyImagePort.deleteFile(public_url);
  }
}
