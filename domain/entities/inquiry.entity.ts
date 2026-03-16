import { InquirySource, InquiryStatus } from "./inquiry.enums";

export interface InquiryEntity {
  id: string;
  listing_id: string;

  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;

  source: InquirySource;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referrer?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;

  status: InquiryStatus;
  notes?: string | null;
  assigned_to?: string | null;

  // Relaciones (joins)
  assigned_to_profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;

  listing?: {
    id: string;
    title: string | null;
    slug: string | null;
    real_estate_id: string;
  } | undefined;

  created_at: string;
  contacted_at?: string | null;
  converted_at?: string | null;
}

export const inquirySourceOptions = [
  { label: "Web", value: InquirySource.WEB },
  { label: "WhatsApp", value: InquirySource.WHATSAPP },
  { label: "Teléfono", value: InquirySource.PHONE },
  { label: "Email", value: InquirySource.EMAIL },
  { label: "Referido", value: InquirySource.REFERRAL },
]

export const inquiryStatusOptions = [
  { label: "Nuevo", value: InquiryStatus.NEW },
  { label: "Contactado", value: InquiryStatus.CONTACTED },
  { label: "Calificado", value: InquiryStatus.QUALIFIED },
  { label: "Convertido", value: InquiryStatus.CONVERTED },
  { label: "Perdido", value: InquiryStatus.LOST },
]

export const inquirySourceLabels: Record<InquirySource, string> = {
  [InquirySource.WEB]: "Web",
  [InquirySource.WHATSAPP]: "WhatsApp",
  [InquirySource.PHONE]: "Teléfono",
  [InquirySource.EMAIL]: "Email",
  [InquirySource.REFERRAL]: "Referido",
}

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  [InquiryStatus.NEW]: "Nuevo",
  [InquiryStatus.CONTACTED]: "Contactado",
  [InquiryStatus.QUALIFIED]: "Calificado",
  [InquiryStatus.CONVERTED]: "Convertido",
  [InquiryStatus.LOST]: "Perdido",
}
