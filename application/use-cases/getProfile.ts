import { Profile } from "@/domain/entities/Profile"

export async function getProfile(
  repo: { getCurrentProfile(): Promise<Profile> }
): Promise<Profile> {
  return repo.getCurrentProfile()
}
