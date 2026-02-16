"use client"

import { BaseRow } from "@/components/ui/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  IconDotsVertical,
  IconUser,
  IconBuilding,
  IconMail,
} from "@tabler/icons-react"
import Link from "next/link"
import { UserWithProfile } from "@/domain/entities/User"
import { UserRole } from "@/domain/entities/Profile"

export type UserRow = BaseRow & UserWithProfile

const roleVariant = (role?: UserRole) => {
  if (role === UserRole.Admin) return "destructive"
  if (role === UserRole.Agent) return "secondary"
  return "outline"
}

export const UserColumns: ColumnDef<UserRow>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      const avatar = row.original.profile?.avatar_url

      if (!avatar) {
        return (
          <div className="size-10 rounded-full bg-muted flex items-center justify-center">
            <IconUser size={18} />
          </div>
        )
      }

      return (
        <img
          src={avatar}
          alt="avatar"
          className="size-10 rounded-full object-cover border"
        />
      )
    },
  },

  {
    id: "user",
    header: "Usuario",
    cell: ({ row }) => {
      const p = row.original.profile

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {p?.name} {p?.last_name ?? ""}
          </span>

          {row.original.user.email && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <IconMail size={12} />
              {row.original.user.email}
            </span>
          )}
        </div>
      )
    },
  },

  {
    id: "role",
    header: "Rol",
    cell: ({ row }) => (
      <Badge variant={roleVariant(row.original.profile?.role)}>
        {row.original.profile?.role ?? "—"}
      </Badge>
    ),
  },

  {
    id: "realEstate",
    header: "Inmobiliaria",
    cell: ({ row }) => {
      const r = row.original.profile?.real_estate
      if (!r) return "—"

      return (
        <div className="flex items-center gap-2 text-sm">
          <IconBuilding size={14} />
          {r.name}
        </div>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          <Link href={`/dashboard/users/${row.original.user.id}`}>
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
