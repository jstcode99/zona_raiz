import { InquiryPort } from "../ports/inquiry.port";
import { InquiryEntity } from "../entities/inquiry.entity";

export type CreateInquiryInput = Omit<InquiryEntity, "id" | "created_at" | "contacted_at" | "converted_at">;

export class InquiryUseCases {
  constructor(private readonly inquiry: InquiryPort) { }

  all(filters?: any) {
    return this.inquiry.all(filters);
  }

  create(data: CreateInquiryInput) {
    return this.inquiry.create(data);
  }

  update(id: string, data: Partial<InquiryEntity>) {
    return this.inquiry.update(id, data);
  }

  findById(id: string) {
    return this.inquiry.findById(id);
  }

  findByListingId(listingId: string) {
    return this.inquiry.findByListingId(listingId);
  }

  findByAgentId(agentId: string) {
    return this.inquiry.findByAgentId(agentId);
  }

  delete(id: string) {
    return this.inquiry.delete(id);
  }

  count(filters?: any) {
    return this.inquiry.count(filters);
  }

  markAsContacted(id: string) {
    return this.inquiry.update(id, { 
      status: "contacted" as any,
      contacted_at: new Date().toISOString() 
    });
  }

  markAsQualified(id: string) {
    return this.inquiry.update(id, { status: "qualified" as any });
  }

  markAsConverted(id: string) {
    return this.inquiry.update(id, { 
      status: "converted" as any,
      converted_at: new Date().toISOString() 
    });
  }

  markAsLost(id: string) {
    return this.inquiry.update(id, { status: "lost" as any });
  }
}
