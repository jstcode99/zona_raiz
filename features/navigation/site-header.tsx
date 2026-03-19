"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRoutes } from "@/i18n/client-router"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Breadcrumbs } from "./breadcrumbs"

export function SiteHeader() {
  const { t } = useTranslation()
  const routes = useRoutes()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link href={routes.currentRealEstate()} className="capitalize">
              { t('words:real_estate') }
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
