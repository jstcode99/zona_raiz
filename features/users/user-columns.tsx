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
  IconMail,
} from "@tabler/icons-react"
import Link from "next/link"
import { UserWithProfileEntity } from "@/domain/entities/user.entity"
import { EUserRole } from "@/domain/entities/profile.entity"

export type UserRow = BaseRow & UserWithProfileEntity

const roleVariant = (role?: EUserRole) => {
  if (role === EUserRole.Admin) return "destructive"
  if (role === EUserRole.Agent) return "secondary"
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
            {p?.full_name ?? ""}
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
