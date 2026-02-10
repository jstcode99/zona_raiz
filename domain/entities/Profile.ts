export type Profile = {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  last_name: string | null
  phone?: string
  avatar_url: string | null
}
