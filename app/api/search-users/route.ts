import { searchProfilesByEmail } from "@/services/profile.services"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  const profile = searchProfilesByEmail(email?.toString().trim() as string)
  return Response.json(profile ?? [])
}