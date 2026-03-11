"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { type ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EUserRole } from "@/domain/entities/profile.entity"
import { UserEntity } from "@/domain/entities/user.entity"
import { ROUTES } from "@/infrastructure/config/constants"
import { deleteUserAction } from "@/application/actions/user.actions"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"

export interface UserRow extends UserEntity {}

function roleVariant(role: EUserRole) {
  if (role === EUserRole.Admin) return "destructive"
  if (role === EUserRole.RealEstate) return "secondary"
  return "outline"
}

function UserRowActions({ userId }: { userId: string }) {
  const { t } = useTranslation('common')

  const mutation = useServerMutation({
    action: deleteUserAction,
    onSuccess: () => {
      toast.success(t("words.deleted") || "Deleted")
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error")
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={mutation.isPending}
        >
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <Link href={`${ROUTES.DASHBOARD}${ROUTES.USERS}/${userId}`}>
          <DropdownMenuItem>{t("words.edit") || "Edit"}</DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={() => {
            const confirmed =
              typeof window !== "undefined"
                ? window.confirm(t("words.confirm") || "Confirm?")
                : true

            if (!confirmed) return

            const data = new FormData()
            data.append("id", userId)
            mutation.action(data)
          }}
        >
          {t("words.delete") || "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const UserColumns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "full_name",
    header: "Nombre",
    cell: ({ row }) => <span className="font-medium">{row.original.full_name ?? "—"}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <Badge variant={roleVariant(row.original.role)}>{row.original.role}</Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Creado",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UserRowActions userId={row.original.id} />,
  },
]

