"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { use } from "react"
import { RealEstateRow } from "./real-estate-columns"

interface Props {
  realEstates: Promise<RealEstateRow[]>
  columns: ColumnDef<RealEstateRow>[]
}

export default function RealEstatesTable({
  realEstates,
  columns,
}: Props) {
  const allRealEstates = use(realEstates)

  return (
    <DataTable<RealEstateRow>
      data={allRealEstates}
      columns={columns}
      enableRowSelection={true}
      enableDrag={true}
      onReorder={(rows) => {
        console.log(rows)
      }}
    />
  )
}
