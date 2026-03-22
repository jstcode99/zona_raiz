import { EnquirySource, EnquiryStatus } from "./enquiry.enums";

export interface EnquiryEntity {
  id: string;
  listing_id: string;

  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;

  source: EnquirySource;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referrer?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;

  status: EnquiryStatus;
  notes?: string | null;
  assigned_to?: string | null;

  // Relaciones (joins)
  assigned_to_profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;

  listing?:
    | {
        id: string;
        title: string | null;
        slug: string | null;
        real_estate_id: string;
      }
    | undefined;

  created_at: string;
  contacted_at?: string | null;
  converted_at?: string | null;
}

export const enquirySourceOptions = [
  { label: "Web", value: EnquirySource.WEB },
  { label: "WhatsApp", value: EnquirySource.WHATSAPP },
  { label: "Teléfono", value: EnquirySource.PHONE },
  { label: "Email", value: EnquirySource.EMAIL },
  { label: "Referido", value: EnquirySource.REFERRAL },
];

export const enquiryStatusOptions = [
  { label: "Nuevo", value: EnquiryStatus.NEW },
  { label: "Contactado", value: EnquiryStatus.CONTACTED },
  { label: "Calificado", value: EnquiryStatus.QUALIFIED },
  { label: "Convertido", value: EnquiryStatus.CONVERTED },
  { label: "Perdido", value: EnquiryStatus.LOST },
];

export const enquirySourceLabels: Record<EnquirySource, string> = {
  [EnquirySource.WEB]: "Web",
  [EnquirySource.WHATSAPP]: "WhatsApp",
  [EnquirySource.PHONE]: "Teléfono",
  [EnquirySource.EMAIL]: "Email",
  [EnquirySource.REFERRAL]: "Referido",
};

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  [EnquiryStatus.NEW]: "Nuevo",
  [EnquiryStatus.CONTACTED]: "Contactado",
  [EnquiryStatus.QUALIFIED]: "Calificado",
  [EnquiryStatus.CONVERTED]: "Convertido",
  [EnquiryStatus.LOST]: "Perdido",
};
