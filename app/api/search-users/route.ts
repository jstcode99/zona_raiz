import { createProfileService } from "@/application/containers/profile-service.container"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  const profileService = await ProfileService()
  const profiles = await profileService.searchProfilesByEmail(email?.toString().trim() as string)
  return Response.json(profiles ?? [])
}