import { EnquiryPort } from "../ports/enquiry.port";
import { EnquiryEntity } from "../entities/enquiry.entity";

export type CreateEnquiryInput = Omit<
  EnquiryEntity,
  "id" | "created_at" | "contacted_at" | "converted_at"
>;

export class EnquiryService {
  constructor(private readonly enquiry: EnquiryPort) {}

  all(filters?: any) {
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

  count(filters?: any) {
    return this.enquiry.count(filters);
  }

  markAsContacted(id: string) {
    return this.enquiry.update(id, {
      status: "contacted" as any,
      contacted_at: new Date().toISOString(),
    });
  }

  markAsQualified(id: string) {
    return this.enquiry.update(id, { status: "qualified" as any });
  }

  markAsConverted(id: string) {
    return this.enquiry.update(id, {
      status: "converted" as any,
      converted_at: new Date().toISOString(),
    });
  }

  markAsLost(id: string) {
    return this.enquiry.update(id, { status: "lost" as any });
  }
}
