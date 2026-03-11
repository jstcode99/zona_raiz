import { PropertyPort } from "@/domain/ports/property.port";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { unstable_cache } from "next/cache";

export class PropertyService {
  constructor(private propertyPort: PropertyPort) { }

  all(filters?: any) {
    return this.propertyPort.all(filters);
  }

  getCachedAll(filters?: any) {
    const cacheKey = filters ? `property:all:${JSON.stringify(filters)}` : "property:all";

    return unstable_cache(
      async () => this.propertyPort.all(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property:all"],
      }
    )();
  }

  getById(id: string) {
    return this.propertyPort.getById(id);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.propertyPort.getById(id),
      [`property:${id}`],
      {
        revalidate: 300,
        tags: ["properties", `property:${id}`],
      }
    )();
  }

  getBySlug(slug: string) {
    return this.propertyPort.getBySlug(slug);
  }

  getCachedBySlug(slug: string) {
    return unstable_cache(
      async () => this.propertyPort.getBySlug(slug),
      [`property:slug:${slug}`],
      {
        revalidate: 300,
        tags: ["properties", `property:slug:${slug}`],
      }
    )();
  }

  getByRealEstate(realEstateId: string) {
    return this.propertyPort.getByRealEstate(realEstateId);
  }

  getCachedByRealEstate(realEstateId: string) {
    return unstable_cache(
      async () => this.propertyPort.getByRealEstate(realEstateId),
      [`property:real-estate:${realEstateId}`],
      {
        revalidate: 300,
        tags: ["properties", `real-estate:${realEstateId}`],
      }
    )();
  }

  count(filters?: any) {
    return this.propertyPort.count(filters);
  }

  getCachedCount(filters?: any) {
    const cacheKey = filters?.real_estate_id
      ? `property:count:${filters.real_estate_id}`
      : "property:count";

    return unstable_cache(
      async () => this.propertyPort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property-count"],
      }
    )();
  }

  countByTypes(realEstateId?: string) {
    return this.propertyPort.countByTypes(realEstateId);
  }

  getCachedCountByTypes(realEstateId?: string) {
    const cacheKey = realEstateId ? `property:count:types:${realEstateId}` : "property:count:types";

    return unstable_cache(
      async () => this.propertyPort.countByTypes(realEstateId),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property-count"],
      }
    )();
  }

  async create(realEstateId: string, input: Partial<PropertyEntity>) {
    let slug = input?.title as string;

    if (!input.slug) {
      slug = await this.propertyPort.generateSlug(input.title!);
    }

    const isAvailable = await this.propertyPort.isSlugAvailable(slug);

    if (!isAvailable) {
      slug = await this.propertyPort.generateSlug(input.title!);
    }

    return this.propertyPort.create(realEstateId, {
      ...input,
      slug,
    });
  }

  async update(id: string, input: Partial<PropertyEntity>) {
    const existing = await this.propertyPort.getById(id);

    if (existing && existing.slug !== input.slug) {
      const isAvailable = await this.propertyPort.isSlugAvailable(input.slug!, id);
      if (!isAvailable) {
        throw new Error("El slug ya está en uso");
      }
    }

    return this.propertyPort.update(id, input);
  }

  delete(id: string) {
    return this.propertyPort.delete(id);
  }

  generateSlug(title: string) {
    return this.propertyPort.generateSlug(title);
  }

  isSlugAvailable(slug: string, excludeId?: string) {
    return this.propertyPort.isSlugAvailable(slug, excludeId);
  }

  async getCountByRealEstate(realEstateId: string): Promise<number> {
    return this.propertyPort.count({ real_estate_id: realEstateId });
  }

  getCachedCountByRealEstate(realEstateId: string) {
    return unstable_cache(
      async () => this.propertyPort.count({ real_estate_id: realEstateId }),
      [`property:count:real-estate:${realEstateId}`],
      {
        revalidate: 300,
        tags: ["properties", `real-estate:${realEstateId}`],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string, filters?: { real_estate_id?: string }) {
    const cacheKey = `property:count:date-range:${startDate}:${endDate}:${filters?.real_estate_id || "all"}`;

    return unstable_cache(
      async () => this.propertyPort.count({ ...filters }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property-count"],
      }
    )();
  }

  getCachedCountByRealEstateWithDateRange(realEstateId: string, startDate: string, endDate: string) {
    const cacheKey = `property:count:real-estate:${realEstateId}:date-range:${startDate}:${endDate}`;

    return unstable_cache(
      async () => this.propertyPort.count({ real_estate_id: realEstateId }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", `real-estate:${realEstateId}`],
      }
    )();
  }

}
