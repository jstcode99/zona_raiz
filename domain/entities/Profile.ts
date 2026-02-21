export type UserRole = "admin" |"agent" | "client" |"coordinator"

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export enum EUserRole {
  Admin = "admin",
  Agent = "agent",
  Client = "client",
  Coordinator = "coordinator",
};
