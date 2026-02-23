export interface ProfileEntity {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: EUserRole;
  created_at: string;
}

export enum EUserRole {
  Admin = "admin",
  Agent = "agent",
  Client = "client",
  Coordinator = "coordinator",
};
