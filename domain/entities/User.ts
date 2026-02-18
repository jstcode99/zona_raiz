import { Profile } from "./Profile"

export type User = {
  id: string
  email: string
}


export type UserWithProfile = {
  user: User
  profile: Profile
}
