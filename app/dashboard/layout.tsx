import { AppSidebar } from "@/app/components/navigation/app-sidebar"
import { SiteHeader } from "@/app/components/navigation/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/app/components/ui/sidebar"
import { CSSProperties, ReactNode } from "react"

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "20rem",
                    "--sidebar-width-mobile": "20rem",
                } as CSSProperties
            }
        >
            <AppSidebar variant="sidebar" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

