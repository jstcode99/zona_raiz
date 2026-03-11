"use client"

import * as React from "react"
import { NavMain } from "@/features/navigation/nav-main"
import { NavUser } from "@/features/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { IconName } from "lucide-react/dynamic"
import i18next from "i18next"
import { ProfileEntity } from "@/domain/entities/profile.entity"
import { Building2Icon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  profile: ProfileEntity
  menu: {
    title: string
    url: string
    icon?: IconName | string
  }[]
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { t } = useTranslation()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Building2Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">
                <span className="text-base font-semibold">{i18next.t("app.name")}</span>
              </h1>
              <p className="text-xs text-muted-foreground">{t('words.dashboard')}</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={props.menu} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser profile={props.profile} />
      </SidebarFooter>
    </Sidebar>
  )
}
