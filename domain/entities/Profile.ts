export type Profile = {
  name: string
  role: UserRole
  last_name: string | null
  phone?: string
  avatar_url?: string | null
}

export enum UserRole {
  Admin = "PLATFORM_ADMIN",
  Agent = "AGENT",
  Client = "CLIENT",
};   