import { InquiryEntity } from "../entities/inquiry.entity";

export interface InquiryPort {
  all(filters?: any): Promise<InquiryEntity[]>;
  create(data: Partial<InquiryEntity>): Promise<InquiryEntity>;
  update(id: string, data: Partial<InquiryEntity>): Promise<InquiryEntity>;
  findById(id: string): Promise<InquiryEntity | null>;
  findByListingId(listingId: string): Promise<InquiryEntity[]>;
  findByAgentId(agentId: string): Promise<InquiryEntity[]>;
  delete(id: string): Promise<void>;
  count(filters?: any): Promise<number>;
}
