import { PropertyFilters } from "../entities/property.entity";
import { PropertyFormValues } from "../entities/schemas/property.schema";
import { PropertyPort } from "../ports/property.port";

export class ListProperties {
  constructor(
    private property: PropertyPort,
  ) {}

  async execute(filters?: PropertyFilters) {
    return await this.property.all(filters);
  }
}

export class GetPropertyById {
  constructor(
    private property: PropertyPort,
  ) {}

  async execute(id: string) {
    if (!id) {
      throw new Error("ID requerido");
    }
    return await this.property.getById(id);
  }
}

export class CreateProperty {
  constructor(
    private property: PropertyPort,
  ) {}

  async execute(realEstateId: string, input: PropertyFormValues) {
    if (!input || !realEstateId) {
      throw new Error("Datos inválidos");
    }

    // Generar slug si no existe
    if (!input.slug) {
      input.slug = await this.property.generateSlug(input.title);
    }

    // Verificar disponibilidad del slug
    const isAvailable = await this.property.isSlugAvailable(input.slug);
    if (!isAvailable) {
      input.slug = await this.property.generateSlug(input.title);
    }

    return await this.property.create(realEstateId, input);
  }
}

export class UpdateProperty {
  constructor(
    private property: PropertyPort,
  ) {}

  async execute(id: string, input: PropertyFormValues) {
    if (!id || !input) {
      throw new Error("Datos inválidos");
    }

    // Verificar disponibilidad del slug si cambió
    const existing = await this.property.getById(id);
    if (existing && existing.slug !== input.slug) {
      const isAvailable = await this.property.isSlugAvailable(input.slug, id);
      if (!isAvailable) {
        throw new Error("El slug ya está en uso");
      }
    }

    return await this.property.update(id, input);
  }
}

export class DeleteProperty {
  constructor(
    private property: PropertyPort,
  ) {}

  async execute(id: string) {
    if (!id) {
      throw new Error("ID requerido");
    }
    await this.property.delete(id);
  }
}