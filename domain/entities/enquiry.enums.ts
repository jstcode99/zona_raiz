export enum EnquirySource {
  WEB = "web",
  WHATSAPP = "whatsapp",
  PHONE = "phone",
  EMAIL = "email",
  REFERRAL = "referral",
}

export enum EnquiryStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  CONVERTED = "converted",
  LOST = "lost",
}

export const enquirySourceValues: string[] = Object.values(EnquirySource);
export const enquiryStatusValues: string[] = Object.values(EnquiryStatus);
