export interface ProfileEntity {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone?: string;
  role: EUserRole;
  created_at: string;
}

export enum EUserRole {
  Admin = "admin",
  Client = "client",
  RealEstate = "real-estate",
}
