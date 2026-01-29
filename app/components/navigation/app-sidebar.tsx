"use client"

import * as React from "react"

import { NavMain } from "@/app/components/navigation/nav-main"
import { NavUser } from "@/app/components/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { Home, HomeIcon, LayoutDashboardIcon, Podcast, User } from "lucide-react"
import i18next from "i18next"
import { Separator } from "../ui/separator"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Publicaciones",
      url: "#",
      icon: <Podcast />,
    },
    {
      title: "Propiedades",
      url: "#",
      icon: <Home />,
    },
    {
      title: "Usuarios",
      url: "#",
      icon: <User />,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
            >
              <a href="#" className="text-xl text-center font-semibold">
                <HomeIcon />
                {i18next.t('app.name')}
              </a>
            </SidebarMenuButton>
            <Separator className="mt-2"/>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
