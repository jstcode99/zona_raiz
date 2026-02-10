"use client"

import { ReactNode, ComponentProps } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HomeIcon } from "lucide-react"
import i18next from "i18next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

interface AppSidebarClientProps extends ComponentProps<typeof Sidebar> {
  nav?: ReactNode,
  footer?: ReactNode,
}

export function AppSidebarClient({ nav, footer, ...props }:
  AppSidebarClientProps &
  ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
            >
              <Link href="/dashboard">
                <HomeIcon className="h-4 w-4" />
                <span className="text-xl text-center font-semibold">
                  {i18next.t('app.name')}
                </span>
              </Link>
            </SidebarMenuButton>
            <Separator className="mt-2" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {nav}
      </SidebarContent>
      <SidebarFooter>
        {footer}
      </SidebarFooter>
    </Sidebar>
  )
}
