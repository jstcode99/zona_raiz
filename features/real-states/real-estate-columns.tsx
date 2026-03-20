"use client"

import { BaseRow } from "@/components/ui/data-table"
import { RealEstateEntity } from "@/domain/entities/real-estate.entity"
import { type ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  IconBrandWhatsapp,
  IconDotsVertical,
  IconBuilding,
} from "@tabler/icons-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useRoutes } from "@/i18n/client-router"


export type RealEstateRow = BaseRow & {
  created_at: string
} & RealEstateEntity

export const RealEstateColumns: ColumnDef<RealEstateRow>[] = [
  {
    id: "logo",
    header: "",
    cell: ({ row }) => {
      const logo = row.original.logo_url
      if (!logo) {
        return (
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
            <IconBuilding size={18} />
          </div>
        )
      }

      return (
        <img
          src={logo}
          alt={row.original.name}
          className="size-10 rounded-lg object-cover border"
        />
      )
    },
  },

  {
    accessorKey: "name",
    header: () => {
      const { t } = useTranslation("real-estates")
      return t("real-estates:columns.headers.name")
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.name}
        </span>
      </div>
    ),
  },

  {
    id: "location",
    header: () => {
      const { t } = useTranslation("real-estates")
      return t("real-estates:columns.headers.location")
    },
    cell: ({ row }) => {
      const r = row.original
      if (!r.city && !r.country) return "—"

      return (
        <div className="flex flex-col text-sm">
          <span className="font-medium">
            {r.city || "—"}, {r.state || "—"}
          </span>
          <span className="text-muted-foreground text-xs">
            {r.country || "—"}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "address",
    header: () => {
      const { t } = useTranslation("real-estates")
      return t("real-estates:columns.headers.address")
    },
    cell: ({ row }) => row.original.city || "—",
  },

  {
    id: "contact",
    header: () => {
      const { t } = useTranslation("real-estates")
      return t("real-estates:columns.headers.contact")
    },
    cell: ({ row }) => {
      const r = row.original

      return (
        <div className="flex items-center gap-3">
          {r.whatsapp && (
            <a
              href={`https://wa.me/${r.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              <IconBrandWhatsapp size={16} />
            </a>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: () => {
      const { t } = useTranslation("real-estates")
      return t("real-estates:columns.headers.created_at")
    },
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString(),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { t } = useTranslation("real-estates")
      const routes = useRoutes()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">{t("real-estates:columns.actions.open_menu")}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36">
            <Link href={routes.realEstate(row.original.id)}>
              <DropdownMenuItem>{t("real-estates:columns.actions.edit")}</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
