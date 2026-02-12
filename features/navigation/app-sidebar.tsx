"use client"

import * as React from "react"
import {
  type Icon,
  IconInnerShadowTop
} from "@tabler/icons-react"

import { NavMain } from "@/features/navigation/nav-main"
import { NavUser } from "@/features/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserWithProfile } from "@/domain/entities/User"
import { IconName } from "lucide-react/dynamic"
import i18next from "i18next"


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserWithProfile
  menu: {
    title: string
    url: string
    icon?: IconName | string
  }[]
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{i18next.t("app.name")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={props.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
