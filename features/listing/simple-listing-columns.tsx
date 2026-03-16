"use client"

import { BaseRow } from "@/components/ui/data-table"
import { ListingEntity } from "@/domain/entities/listing.entity"
import { type ColumnDef } from "@tanstack/react-table"
import { 
  IconHome,
  IconCurrencyDollar,
  IconEye,
  IconMessage,
  IconBrandWhatsapp,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { listingStatusLabels, listingTypeLabels } from "@/domain/entities/listing.entity"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type SimpleListingRow = BaseRow & {
  created_at: string
} & ListingEntity

export const SimpleListingColumns: ColumnDef<SimpleListingRow>[] = [
  {
    id: "property",
    header: "Propiedad",
    cell: ({ row }) => {
      const property = row.original.property

      return (
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
      )
    },
  },

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

  {
    id: "status",
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
        <div className="flex flex-wrap gap-2">
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

  {
    id: "agent",
    header: "Agente",
    cell: ({ row }) => {
      const agent = row.original.agent

      if (!agent) {
        return <span className="text-xs text-muted-foreground italic">Sin agente</span>
      }

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={agent.avatar_url || undefined} alt={agent.full_name || ""} />
            <AvatarFallback className="text-xs">
              {agent.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium truncate">
              {agent.full_name || "Sin nombre"}
            </span>
            {agent.phone && (
              <span className="text-[10px] text-muted-foreground truncate">
                {agent.phone}
              </span>
            )}
          </div>
        </div>
      )
    },
  },

  {
    id: "dates",
    header: "Registro",
    cell: ({ row }) => {
      const { created_at } = row.original

      return (
        <div className="flex flex-col text-xs">
          <span>{new Date(created_at).toLocaleDateString("es-ES")}</span>
        </div>
      )
    },
  },
]
