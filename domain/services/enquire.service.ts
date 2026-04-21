import { EnquiryPort, EnquiryFilters } from "../ports/enquiry.port";
import { EnquiryEntity } from "../entities/enquiry.entity";
import { EnquiryStatus } from "../entities/enquiry.enums";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { Lang } from "@/i18n/settings";

export type CreateEnquiryInput = Omit<
  EnquiryEntity,
  "id" | "created_at" | "contacted_at" | "converted_at" | "status"
>;

export class EnquiryService {
  constructor(
    private readonly enquiry: EnquiryPort,
    private readonly lang: Lang = "es",
  ) {}

  // Sin cache — para mutations y reads directos
  all(filters?: EnquiryFilters) {
    return this.enquiry.all(filters);
  }

  // Con cache — para reads en Server Components
  getCachedAll(filters?: EnquiryFilters) {
    const cacheKey = filters
      ? `${CACHE_TAGS.ENQUIRY.ALL}:${JSON.stringify(filters)}`
      : CACHE_TAGS.ENQUIRY.ALL;
    return unstable_cache(
      async () => this.enquiry.all(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.ENQUIRY.PRINCIPAL, CACHE_TAGS.ENQUIRY.ALL],
      },
    )();
  }

  create(data: CreateEnquiryInput) {
    return this.enquiry.create(data);
  }

  update(id: string, data: Partial<EnquiryEntity>) {
    return this.enquiry.update(id, data);
  }

  findById(id: string) {
    return this.enquiry.findById(id);
  }

  findByListingId(listingId: string) {
    return this.enquiry.findByListingId(listingId);
  }

  findByAgentId(agentId: string) {
    return this.enquiry.findByAgentId(agentId);
  }

  delete(id: string) {
    return this.enquiry.delete(id);
  }

  deleteByListingId(listingId: string) {
    return this.enquiry.deleteByListingId(listingId);
  }

  count(filters?: EnquiryFilters) {
    return this.enquiry.count(filters);
  }

  markAsContacted(id: string) {
    return this.enquiry.update(id, {
      status: EnquiryStatus.CONTACTED,
      contacted_at: new Date().toISOString(),
    });
  }

  markAsQualified(id: string) {
    return this.enquiry.update(id, { status: EnquiryStatus.QUALIFIED });
  }

  markAsConverted(id: string) {
    return this.enquiry.update(id, {
      status: EnquiryStatus.CONVERTED,
      converted_at: new Date().toISOString(),
    });
  }

  markAsLost(id: string) {
    return this.enquiry.update(id, { status: EnquiryStatus.LOST });
  }
}
