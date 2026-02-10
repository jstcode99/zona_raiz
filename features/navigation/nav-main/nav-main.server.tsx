import { NavMainClient } from "./nav-main.client"
import { LayoutDashboardIcon, User } from "lucide-react"

type MenuItem = {
  label: string
  href: string
  icon?: React.ReactNode
}

export async function NavMainServer() {

  const menu: MenuItem[] = getMenuByRole('')

  return <NavMainClient menu={menu} />
}

function getMenuByRole(role: string): MenuItem[] {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
        { label: "Users", href: "/dashboard/users", icon: <User /> },
        { label: "Settings", href: "/dashboard/settings", icon: <LayoutDashboardIcon /> },
      ]

    case "user":
      return [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
        { label: "Account", href: "/dashboard/account", icon: <User /> },
      ]

    default:
      return [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
        { label: "Account", href: "/dashboard/account", icon: <User /> },
      ]
  }
}