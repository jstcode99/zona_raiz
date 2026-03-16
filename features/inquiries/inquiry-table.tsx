"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { InquiryRow } from "./inquiry-columns"
import { use } from "react"
import { getInquiryColumns } from "./inquiry-columns"

interface InquiryTableProps {
  inquiries: Promise<InquiryRow[]>
  realEstateId: string
  columns?: ColumnDef<InquiryRow>[]
}

export default function InquiryTable({ inquiries, realEstateId, columns }: InquiryTableProps) {
  const data = use(inquiries)
  const cols = columns ?? getInquiryColumns(realEstateId)
  return (
    <DataTable
      data={data}
      columns={cols}
      enableRowSelection={false}
      enableDrag={false}
    />
  )
}
