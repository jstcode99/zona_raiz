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
import { deleteUserAction } from "@/application/actions/user.actions"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { useRoutes } from "@/i18n/client-router"

export interface UserRow extends UserEntity {}

function roleVariant(role: EUserRole) {
  if (role === EUserRole.Admin) return "destructive"
  if (role === EUserRole.RealEstate) return "secondary"
  return "outline"
}

function UserRowActions({ userId }: { userId: string }) {
  const { t } = useTranslation('common')
  const routes = useRoutes()

  const mutation = useServerMutation({
    action: deleteUserAction,
    onSuccess: () => {
      toast.success(t("common:columns.words.deleted"))
    },
    onError: (error) => {
      toast.error(error.message || t("common:columns.words.error"))
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
        <Link href={routes.user(userId)}>
          <DropdownMenuItem>{t("common:columns.words.edit")}</DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={() => {
            const confirmed =
              typeof window !== "undefined"
                ? window.confirm(t("common:columns.words.confirm"))
                : true

            if (!confirmed) return

            const data = new FormData()
            data.append("id", userId)
            mutation.action(data)
          }}
        >
          {t("common:columns.words.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const UserColumns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "full_name",
    header: () => {
      const { t } = useTranslation("common")
      return t("common:columns.headers.full_name")
    },
    cell: ({ row }) => <span className="font-medium">{row.original.full_name ?? "—"}</span>,
  },
  {
    accessorKey: "email",
    header: () => {
      const { t } = useTranslation("common")
      return t("common:columns.headers.email")
    },
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: () => {
      const { t } = useTranslation("common")
      return t("common:columns.headers.role")
    },
    cell: ({ row }) => (
      <Badge variant={roleVariant(row.original.role)}>{row.original.role}</Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => {
      const { t } = useTranslation("common")
      return t("common:columns.headers.created_at")
    },
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

