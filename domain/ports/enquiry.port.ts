import { EnquiryEntity } from "../entities/enquiry.entity";

export interface EnquiryFilters {
  listing_id?: string;
  real_estate_id?: string;
  status?: string;
  assigned_to?: string;
  source?: string;
  start_date?: string;
  end_date?: string;
}

export interface EnquiryPort {
  all(filters?: EnquiryFilters): Promise<EnquiryEntity[]>;
  create(data: Partial<EnquiryEntity>): Promise<EnquiryEntity>;
  update(id: string, data: Partial<EnquiryEntity>): Promise<EnquiryEntity>;
  findById(id: string): Promise<EnquiryEntity | null>;
  findByListingId(listingId: string): Promise<EnquiryEntity[]>;
  findByAgentId(agentId: string): Promise<EnquiryEntity[]>;
  delete(id: string): Promise<void>;
  count(filters?: EnquiryFilters): Promise<number>;
}
