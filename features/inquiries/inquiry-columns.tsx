"use client"

import { InquiryEntity, inquirySourceLabels, inquiryStatusLabels } from "@/domain/entities/inquiry.entity"
import { InquiryStatus } from "@/domain/entities/inquiry.enums"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { InquiryRowActions } from "./inquiry-row-actions"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRoutes } from "@/i18n/client-router"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation("inquiries")

  return [
    {
      accessorKey: "name",
      header: () => t("inquiries:columns.headers.name"),
      cell: ({ row }) => <span className="font-medium">{row.original.name || "—"}</span>,
    },
    {
      accessorKey: "email",
      header: () => t("inquiries:columns.headers.email"),
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email || "—"}</span>,
    },
    {
      accessorKey: "phone",
      header: () => t("inquiries:columns.headers.phone"),
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone || "—"}</span>,
    },
    {
      accessorKey: "source",
      header: () => t("inquiries:columns.headers.source"),
      cell: ({ row }) => {
        const label = inquirySourceLabels[row.original.source] || row.original.source
        return <Badge variant="secondary">{label}</Badge>
      },
    },
    {
      accessorKey: "listing",
      header: () => t("inquiries:columns.headers.listing"),
      cell: ({ row }) => {
        const prop = row.original.listing

        if (!prop) {
          return <span className="text-sm text-muted-foreground italic">{t("inquiries:columns.labels.no_property")}</span>
        }
        return (
          <Link href={routes.listing(prop.id)} className="text-sm hover:underline">
            {prop.title || t("inquiries:columns.labels.no_title")}
          </Link>
        )
      },
    },
    {
      accessorKey: "assigned_to_profile",
      header: () => t("inquiries:columns.headers.assigned_to"),
      cell: ({ row }) => {
        const agent = row.original.assigned_to_profile
        if (!agent) {
          return <span className="text-sm text-muted-foreground italic">{t("inquiries:columns.labels.unassigned")}</span>
        }
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={agent.avatar_url || ""} alt={agent.full_name || "Agent"} />
              <AvatarFallback>{agent.full_name?.substring(0, 2).toUpperCase() || "AG"}</AvatarFallback>
            </Avatar>
            <span className="text-sm truncate max-w-24">{agent.full_name || t("inquiries:columns.labels.agent")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: () => t("inquiries:columns.headers.status"),
      cell: ({ row }) => {
        const label = inquiryStatusLabels[row.original.status] || row.original.status
        return <Badge variant={statusVariant(row.original.status)}>{label}</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: () => t("inquiries:columns.headers.created_at"),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at)
        return <span className="text-xs text-muted-foreground">{date.toLocaleDateString()}</span>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <InquiryRowActions inquiryId={row.original.id} realEstateId={realEstateId} />,
    },
  ]
}
