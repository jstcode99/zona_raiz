import { clearPathFiles } from "@/lib/utils";
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

  async delete(id: string) {
    const exist = await this.repository.getById(id);

    if (!exist) {
      throw new Error("El recurso no fue encontrado");
    }
    
    if (exist.public_url) {
      await this.deleteFile(exist.public_url)
    }
    return this.repository.delete(id)
  }

  async deleteFile(public_url: string) {
    // remove params from url to get the clear path
    const clearUrl = clearPathFiles(public_url)
    const exist = await this.repository.existPath(clearUrl)

    if (!exist) {
      throw new Error("El archivo no existe")
    }
    
    return this.repository.deleteFile(clearUrl)
  }

  async uploadFile(propertyId: string, name: string, image: File): Promise<string> {
    return this.repository.uploadFile(propertyId, name, image)
  }

  async updatePath(propertyImageId: string, path: string): Promise<PropertyImageEntity> {
    return this.repository.updatePath(propertyImageId, path)
  }
}