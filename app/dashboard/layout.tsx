import { SiteHeader } from "@/features/navigation/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { CSSProperties, ReactNode, Suspense } from "react"
import { AppSidebar } from "@/features/navigation/app-sidebar"
import { PageLoader } from "@/features/loader/page-loader"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"
import { encodedRedirect } from "@/shared/redirect"
import { EUserRole } from "@/domain/entities/Profile"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {

  const supabase = new SupabaseProfileRepository()
  const profile = await supabase.getCurrentProfile()

  if (!profile || !profile.profile) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  const getMenuByRole = (role: string) => {
    switch (role) {
      case EUserRole.Admin:
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: 'layout-dashboard',
          },
          {
            title: "Inmobiliarias",
            url: "/dashboard/real-states",
            icon: 'map-pin-house',
          },
          {
            title: "Propiedades",
            url: "/dashboard/properties",
            icon: 'building-2',
          },
          {
            title: "Usuarios",
            url: "/dashboard/users",
            icon: 'users-round',
          },
        ]
      default:
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: 'layout-dashboard',
          },
          {
            title: "Propiedades",
            url: "/dashboard/properties",
            icon: 'building-2',
          },
        ]
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        menu={getMenuByRole(profile.profile?.role || "")}
        user={{
          user: {
            id: profile.user.id,
            email: profile.user.email,
          },
          profile: profile.profile
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Suspense fallback={<PageLoader />}>
                {children}
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
