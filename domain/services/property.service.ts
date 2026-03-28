import { PropertyPort } from "@/domain/ports/property.port";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { PropertySearchFormInput } from "@/application/validation/property-search.schema";

export class PropertyService {
  constructor(
    private propertyPort: PropertyPort,
    private lang: Lang = "es",
  ) {}

  all(filters?: PropertySearchFormInput) {
    return this.propertyPort.all(filters);
  }

  getCachedAll(filters?: PropertySearchFormInput) {
    return unstable_cache(
      async () => this.propertyPort.all(filters),
      [CACHE_TAGS.PROPERTY.KEYS.ALL(filters)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROPERTY.PRINCIPAL, CACHE_TAGS.PROPERTY.ALL],
      },
    )();
  }

  getById(id: string) {
    return this.propertyPort.getById(id);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.propertyPort.getById(id),
      [CACHE_TAGS.PROPERTY.KEYS.BY_ID(id)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROPERTY.PRINCIPAL, CACHE_TAGS.PROPERTY.DETAIL(id)],
      },
    )();
  }

  getBySlug(slug: string) {
    return this.propertyPort.getBySlug(slug);
  }

  getCachedBySlug(slug: string) {
    return unstable_cache(
      async () => this.propertyPort.getBySlug(slug),
      [CACHE_TAGS.PROPERTY.KEYS.BY_SLUG(slug)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROPERTY.PRINCIPAL, CACHE_TAGS.PROPERTY.SLUG(slug)],
      },
    )();
  }

  getByRealEstate(realEstateId: string) {
    return this.propertyPort.getByRealEstate(realEstateId);
  }

  getCachedByRealEstate(realEstateId: string) {
    return unstable_cache(
      async () => this.propertyPort.getByRealEstate(realEstateId),
      [CACHE_TAGS.PROPERTY.KEYS.BY_REAL_ESTATE(realEstateId)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.PROPERTY.PRINCIPAL,
          CACHE_TAGS.PROPERTY.BY_REAL_ESTATE(realEstateId),
          CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId), // ← cross-tag
        ],
      },
    )();
  }

  count(filters?: any) {
    return this.propertyPort.count(filters);
  }

  getCachedCount(filters?: any) {
    return unstable_cache(
      async () => this.propertyPort.count(filters),
      [CACHE_TAGS.PROPERTY.KEYS.COUNT(filters?.real_estate_id)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROPERTY.PRINCIPAL, CACHE_TAGS.PROPERTY.COUNT],
      },
    )();
  }

  countByTypes(realEstateId?: string) {
    return this.propertyPort.countByTypes(realEstateId);
  }

  getCachedCountByTypes(realEstateId?: string) {
    return unstable_cache(
      async () => this.propertyPort.countByTypes(realEstateId),
      [CACHE_TAGS.PROPERTY.KEYS.COUNT_BY_TYPES(realEstateId)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROPERTY.PRINCIPAL, CACHE_TAGS.PROPERTY.COUNT],
      },
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

    return this.propertyPort.create(realEstateId, { ...input, slug });
  }

  async update(id: string, input: Partial<PropertyEntity>) {
    const existing = await this.propertyPort.getById(id);

    if (existing && existing.slug !== input.slug) {
      const isAvailable = await this.propertyPort.isSlugAvailable(
        input.slug!,
        id,
      );
      if (!isAvailable) throw new Error("El slug ya está en uso");
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
      [CACHE_TAGS.PROPERTY.KEYS.COUNT_BY_REAL_ESTATE(realEstateId)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.PROPERTY.PRINCIPAL,
          CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId), // ← cross-tag
        ],
      },
    )();
  }

  getCachedCountWithDateRange(
    startDate: string,
    endDate: string,
    filters?: { real_estate_id?: string },
  ) {
    return unstable_cache(
      async () => this.propertyPort.count({ ...filters }),
      [
        CACHE_TAGS.PROPERTY.KEYS.COUNT_DATE_RANGE(
          startDate,
          endDate,
          filters?.real_estate_id,
        ),
      ],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROPERTY.PRINCIPAL, CACHE_TAGS.PROPERTY.COUNT],
      },
    )();
  }

  getCachedCountByRealEstateWithDateRange(
    realEstateId: string,
    startDate: string,
    endDate: string,
  ) {
    return unstable_cache(
      async () => this.propertyPort.count({ real_estate_id: realEstateId }),
      [
        CACHE_TAGS.PROPERTY.KEYS.COUNT_REAL_ESTATE_DATE_RANGE(
          realEstateId,
          startDate,
          endDate,
        ),
      ],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.PROPERTY.PRINCIPAL,
          CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId), // ← cross-tag
        ],
      },
    )();
  }
}
