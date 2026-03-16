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
import {
  IconDotsVertical,
  IconHome,
  IconCurrencyDollar,
  IconStar,
  IconEye,
  IconMessage,
  IconBrandWhatsapp,
} from "@tabler/icons-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ListingEntity, listingStatusLabels, listingTypeLabels } from "@/domain/entities/listing.entity"
import { useRoutes } from "@/i18n/client-router"

export type ListingRow = BaseRow & {
  created_at: string
} & ListingEntity & {
  property: PropertyEntity
}

export const getListingColumns = (): ColumnDef<ListingRow>[] => {
  const routes = useRoutes()

  return [
    // =========================
    // PROPIEDAD
    // =========================
    {
      id: "property",
      header: "Propiedad",
      cell: ({ row }) => {
        const property = row.original.property

        return (
          <Link href={`/dashboard/properties/${property.id}`}>
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <IconHome className="size-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate max-w-50">
                  {property.title}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {property.city}, {property.state}
                </span>
              </div>
            </div>
          </Link>
        )
      },
    },

    // =========================
    // TIPO + PRECIO
    // =========================
    {
      id: "pricing",
      header: "Publicación",
      cell: ({ row }) => {
        const {
          listing_type,
          price,
          currency,
          price_negotiable,
          expenses_amount,
          expenses_included,
        } = row.original

        return (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {listingTypeLabels[listing_type]}
              </Badge>

              {price_negotiable && (
                <Badge variant="outline">Negociable</Badge>
              )}
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <IconCurrencyDollar className="size-3.5" />
              {currency} {price.toLocaleString()}
            </div>

            {expenses_amount && (
              <span className="text-muted-foreground">
                Expensas: {currency} {expenses_amount.toLocaleString()}{" "}
                {expenses_included ? "(incluidas)" : ""}
              </span>
            )}
          </div>
        )
      },
    },

    // =========================
    // ESTADO
    // =========================
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const { status, featured, featured_until } = row.original

        return (
          <div className="flex flex-col gap-1">
            <Badge>
              {listingStatusLabels[status]}
            </Badge>

            {featured && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <IconStar className="size-3" />
                Destacada
              </Badge>
            )}

            {featured && featured_until && (
              <span className="text-[11px] text-muted-foreground">
                Hasta {new Date(featured_until).toLocaleDateString("es-ES")}
              </span>
            )}
          </div>
        )
      },
    },

    // =========================
    // MÉTRICAS
    // =========================
    {
      id: "metrics",
      header: "Métricas",
      cell: ({ row }) => {
        const {
          views_count,
          inquiries_count,
          whatsapp_clicks,
        } = row.original

        return (
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <IconEye className="size-3.5" />
              {views_count}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <IconMessage className="size-3.5" />
              {inquiries_count}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <IconBrandWhatsapp className="size-3.5" />
              {whatsapp_clicks}
            </div>
          </div>
        )
      },
    },

    // =========================
    // FECHAS
    // =========================
    {
      id: "dates",
      header: "Fechas",
      cell: ({ row }) => {
        const {
          created_at,
          published_at,
          available_from,
        } = row.original

        return (
          <div className="flex flex-col text-xs">
            <span>
              Creado: {new Date(created_at).toLocaleDateString("es-ES")}
            </span>

            {published_at && (
              <span className="text-muted-foreground">
                Pub: {new Date(published_at).toLocaleDateString("es-ES")}
              </span>
            )}

            {available_from && (
              <span className="text-muted-foreground">
                Disponible: {new Date(available_from).toLocaleDateString("es-ES")}
              </span>
            )}
          </div>
        )
      },
    },

    // =========================
    // ACCIONES
    // =========================
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { id } = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <Link href={routes.listing(id)}>
                <DropdownMenuItem>Editar listing</DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                Ver público
              </DropdownMenuItem>

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
}