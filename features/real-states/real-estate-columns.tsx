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
    header: "Nombre",
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
    header: "Ubicación",
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
    header: "Dirección",
    cell: ({ row }) => row.original.city || "—",
  },

  {
    id: "contact",
    header: "Contacto",
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
    header: "Creado",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString(),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36">
            <Link href={`/dashboard/real-estates/${row.original.id}`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
