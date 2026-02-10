import { redirect } from "next/navigation"
import { NavUser } from "./nav-user"
import { getCurrentProfile } from "@/shared/auth/getCurrentProfile"

export async function NavUserServer() {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect("/auth/sign-in")
  }

  return (
    <NavUser
      user={profile}
    />
  )
}
