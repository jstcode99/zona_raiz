import { PropertyPort } from "../ports/property.port";
import { PropertyEntity } from "../entities/property.entity"

export class PropertyUseCases {
  constructor(private repository: PropertyPort) { }

  all(filters?: any) {
    return this.repository.all(filters)
  }

  getById(id: string) {
    return this.repository.getById(id)
  }

  getBySlug(slug: string) {
    return this.repository.getBySlug(slug)
  }

  getByRealEstate(realEstateId: string) {
    return this.repository.getByRealEstate(realEstateId)
  }

  async create(realEstateId: string, input: Partial<PropertyEntity>) {
    // Generar slug si no existe
    let slug = input?.title as string

    if (!input.slug) {
      slug = await this.repository.generateSlug(input.title!)
    }

    // Verificar disponibilidad del slug
    const isAvailable = await this.repository.isSlugAvailable(slug);

    if (!isAvailable) {
      slug = await this.repository.generateSlug(input.title!);
    }

    return this.repository.create(realEstateId, {
      ...input,
      slug,
    })
  }

  async update(id: string, input: Partial<PropertyEntity>) {
    const existing = await this.repository.getById(id);
    
    if (existing && existing.slug !== input.slug) {
      const isAvailable = await this.repository.isSlugAvailable(input.slug!, id);
      if (!isAvailable) {
        throw new Error("El slug ya está en uso");
      }
    }

    return this.repository.update(id, input)
  }

  delete(id: string) {
    return this.repository.delete(id)
  }
}