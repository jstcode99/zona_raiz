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
    listing: row.listing?.property ? {
      id: row.listing.id,
      title: row.listing.property.title,
      slug: row.listing.property.slug
    } : undefined,
    assigned_to_profile: row.assigned_to_profile?.profile ? {
      id: row.assigned_to_profile.profile.id,
      full_name: row.assigned_to_profile.profile.full_name,
      avatar_url: row.assigned_to_profile.profile.avatar_url,
      email: row.assigned_to_profile.profile.email
    } : undefined,
    created_at: row.created_at,
    contacted_at: row.contacted_at,
    converted_at: row.converted_at,
  };
}
