"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/dist/client/link"

type MenuItem = {
    label: string
    href: string
    icon?: React.ReactNode
}

export function NavMainClient({ menu }: { menu: MenuItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {menu.map((item) => (
                        <Link href={item.href} key={item.label}>
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton tooltip={item.label}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Link>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
