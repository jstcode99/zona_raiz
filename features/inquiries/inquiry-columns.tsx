"use client"

import { InquiryEntity, inquirySourceLabels, inquiryStatusLabels } from "@/domain/entities/inquiry.entity"
import { InquiryStatus } from "@/domain/entities/inquiry.enums"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { InquiryRowActions } from "./inquiry-row-actions"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRoutes } from "@/i18n/client-router"

export type InquiryRow = InquiryEntity

function statusVariant(status: InquiryStatus) {
  switch (status) {
    case InquiryStatus.NEW:
      return "outline"
    case InquiryStatus.CONTACTED:
      return "secondary"
    case InquiryStatus.QUALIFIED:
      return "default"
    case InquiryStatus.CONVERTED:
      return "default"
    case InquiryStatus.LOST:
      return "destructive"
    default:
      return "outline"
  }
}

export function getInquiryColumns(realEstateId: string): ColumnDef<InquiryRow>[] {
  const routes = useRoutes()

  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.original.name || "—"}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email || "—"}</span>,
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone || "—"}</span>,
    },
    {
      accessorKey: "source",
      header: "Fuente",
      cell: ({ row }) => {
        const label = inquirySourceLabels[row.original.source] || row.original.source
        return <Badge variant="secondary">{label}</Badge>
      },
    },
    {
      accessorKey: "listing",
      header: "Publicación",
      cell: ({ row }) => {
        const prop = row.original.listing
        
        if (!prop) {
          return <span className="text-sm text-muted-foreground italic">Sin propiedad</span>
        }
        return (
          <Link href={routes.listing(prop.id)} className="text-sm hover:underline">
            {prop.title || "Sin título"}
          </Link>
        )
      },
    },
    {
      accessorKey: "assigned_to_profile",
      header: "Asignado a",
      cell: ({ row }) => {
        const agent = row.original.assigned_to_profile
        if (!agent) {
          return <span className="text-sm text-muted-foreground italic">No asignado</span>
        }
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={agent.avatar_url || ""} alt={agent.full_name || "Agent"} />
              <AvatarFallback>{agent.full_name?.substring(0, 2).toUpperCase() || "AG"}</AvatarFallback>
            </Avatar>
            <span className="text-sm truncate max-w-24">{agent.full_name || "Agente"}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const label = inquiryStatusLabels[row.original.status] || row.original.status
        return <Badge variant={statusVariant(row.original.status)}>{label}</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at)
        return <span className="text-xs text-muted-foreground">{date.toLocaleDateString("es-ES")}</span>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <InquiryRowActions inquiryId={row.original.id} realEstateId={realEstateId} />,
    },
  ]
}
