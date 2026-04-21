import { EnquiryPort, EnquiryFilters } from "../ports/enquiry.port";
import { EnquiryEntity } from "../entities/enquiry.entity";
import { EnquiryStatus } from "../entities/enquiry.enums";

export type CreateEnquiryInput = Omit<
  EnquiryEntity,
  "id" | "created_at" | "contacted_at" | "converted_at" | "status"
>;

export class EnquiryService {
  constructor(private readonly enquiry: EnquiryPort) {}

  all(filters?: EnquiryFilters) {
    return this.enquiry.all(filters);
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
