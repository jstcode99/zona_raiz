"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { InquiryRow, InquiryColumns } from "./inquiry-columns"
import { use } from "react"

interface InquiryTableProps {
  inquiries: Promise<InquiryRow[]>
  columns?: ColumnDef<InquiryRow>[]
}

export default function InquiryTable({ inquiries, columns }: InquiryTableProps) {
  const data = use(inquiries)
  return (
    <DataTable
      data={data}
      columns={columns ?? InquiryColumns}
      enableRowSelection={false}
      enableDrag={false}
    />
  )
}
