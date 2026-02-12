"use client"

import { BaseRow } from "@/components/ui/data-table"
import { Property } from "@/domain/entities/Property"
import { type ColumnDef } from "@tanstack/react-table"

export type PropertyRow = BaseRow & {
  created_at: string
} & Property

export const PropertyColumns: ColumnDef<PropertyRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price}`,
  },
  {
    accessorKey: "created_at",
    header: "Created",
  },
]
