import { InquiryEntity } from "@/domain/entities/inquiry.entity";
import { InquirySource, InquiryStatus } from "@/domain/entities/inquiry.enums";

export function mapInquiryRowToEntity(row: any): InquiryEntity {
  return {
    id: row.id,
    listing_id: row.listing_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    source: row.source as InquirySource,
    utm_source: row.utm_source,
    utm_medium: row.utm_medium,
    utm_campaign: row.utm_campaign,
    referrer: row.referrer,
    ip_address: row.ip_address,
    user_agent: row.user_agent,
    status: row.status as InquiryStatus,
    notes: row.notes,
    assigned_to: row.assigned_to,
    created_at: row.created_at,
    contacted_at: row.contacted_at,
    converted_at: row.converted_at,
  };
}
