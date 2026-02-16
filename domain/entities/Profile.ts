export type ProfileBasic = {
  name: string
  last_name?: string | null
  phone?: string | null
}

export type Profile = ProfileBasic & {
  role: UserRole
  avatar_url?: string | null
  real_estate_id?: string | null
  real_estate?: {
    id: string
    name: string
    slug: string
  } | null
}

export enum UserRole {
  Admin = "PLATFORM_ADMIN",
  Agent = "AGENT",
  Client = "CLIENT",
};
