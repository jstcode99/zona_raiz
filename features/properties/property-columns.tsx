"use client"

import { BaseRow } from "@/components/ui/data-table"
import { PropertyEntity } from "@/domain/entities/property.entity"
import { type ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical, IconMapPin } from "@tabler/icons-react"
import Link from "next/link"

export type PropertyRow = BaseRow & {
  created_at: string
} & PropertyEntity

export const PropertyColumns: ColumnDef<PropertyRow>[] = [
  {
    id: "location",
    header: "Ubicación",
    cell: ({ row }) => {
      const p = row.original
      return (
        <div className="flex flex-col text-sm">
          <span className="font-medium">
            {p.city}, {p.state}
          </span>
          <span className="text-muted-foreground text-xs">{p.country}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => row.original.address || "—",
  },

  {
    id: "details",
    header: "Detalles",
    cell: ({ row }) => {
      const p = row.original
      return (
        <div className="flex gap-3 text-sm">
          <span>{p.bedrooms ?? "—"} 🛏</span>
          <span>{p.bathrooms ?? "—"} 🛁</span>
          <span>{p.area_m2 ? `${p.area_m2} m²` : "—"}</span>
        </div>
      )
    },
  },

  {
    id: "map",
    header: "Mapa",
    cell: ({ row }) => {
      const url = row.original.google_maps_url
      if (!url) return "—"

      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <IconMapPin size={16} />
          Ver
        </a>
      )
    },
  },

  {
    id: "coords",
    header: "Coords",
    cell: ({ row }) => {
      const { latitude, longitude } = row.original
      if (!latitude || !longitude) return "—"
      return (
        <span className="text-xs text-muted-foreground">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
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

          <DropdownMenuContent align="end" className="w-32">
            <Link href={`/dashboard/properties/${row.original.id}`}>
              <DropdownMenuItem>Editar</DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
