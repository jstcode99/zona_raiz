import { AppSidebarClient } from "./app-sidebar.client"
import { NavUserServer } from "../nav-user/nav-user.server"
import { NavMainServer } from "../nav-main/nav-main.server"

export function AppSidebarServer({
  variant,
}: {
  variant?: "sidebar" | "inset"
}) {
  return (
    <AppSidebarClient
      variant={variant}
      nav={<NavMainServer />}
      footer={<NavUserServer />}
    />
  )
}
