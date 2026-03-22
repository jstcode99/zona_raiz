import { EnquiryEntity } from "../entities/enquiry.entity";

export interface EnquiryPort {
  all(filters?: any): Promise<EnquiryEntity[]>;
  create(data: Partial<EnquiryEntity>): Promise<EnquiryEntity>;
  update(id: string, data: Partial<EnquiryEntity>): Promise<EnquiryEntity>;
  findById(id: string): Promise<EnquiryEntity | null>;
  findByListingId(listingId: string): Promise<EnquiryEntity[]>;
  findByAgentId(agentId: string): Promise<EnquiryEntity[]>;
  delete(id: string): Promise<void>;
  count(filters?: any): Promise<number>;
}
