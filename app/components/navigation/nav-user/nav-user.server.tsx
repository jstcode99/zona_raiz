import { redirect } from "next/navigation"
import { getAccountProfileController } from "@/modules/account/controllers/account.controller"
import { NavUser } from "./nav-user"

export async function NavUserServer() {
  const response = await getAccountProfileController()

  if (!response.ok || !response.data) {
    redirect("/auth/sign-in")
  }

  const profile = response.data

  return (
    <NavUser
      user={{
        ...profile
      }}
    />
  )
}
