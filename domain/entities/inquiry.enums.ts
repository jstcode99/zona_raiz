export enum InquirySource {
  WEB = "web",
  WHATSAPP = "whatsapp",
  PHONE = "phone",
  EMAIL = "email",
  REFERRAL = "referral",
}

export enum InquiryStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  CONVERTED = "converted",
  LOST = "lost",
}

export const inquirySourceValues: string[] = Object.values(InquirySource);
export const inquiryStatusValues: string[] = Object.values(InquiryStatus);
