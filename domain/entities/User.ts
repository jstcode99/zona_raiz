import { Profile } from "./Profile"

export type User = {
  id: string
  email?: string | null
}


export type UserWithProfile = {
  user: User
  profile?: Profile | null
}
