import { PropertyImageEntity } from "../entities/property-image.entity";
import { PropertyImagePort } from "../ports/property-image.port"

export class PropertyImageUseCases {
  constructor(private repository: PropertyImagePort) { }

  getById(id: string) {
    return this.repository.getById(id)
  }

  getByPropertyId(propertyId: string) {
    return this.repository.getByPropertyId(propertyId)
  }

  async create(propertyId: string, input: Partial<PropertyImageEntity>) {
    return this.repository.create(propertyId, input)
  }

  async update(propertyImageId: string, input: Partial<PropertyImageEntity>) {
    const exist = await this.repository.getById(propertyImageId);

    if (!exist) {
      throw new Error("El recurso no fue encontrado");
    }

    return this.repository.update(exist.id ?? '', input)
  }

  delete(id: string) {
    return this.repository.delete(id)
  }

  async uploadFile(propertyId: string, name: string, image: File): Promise<string> {
    return this.repository.uploadFile(propertyId, name, image)
  }

  async updatePath(propertyImageId: string, path: string): Promise<PropertyImageEntity> {
    return this.repository.updatePath(propertyImageId, path)
  }
}