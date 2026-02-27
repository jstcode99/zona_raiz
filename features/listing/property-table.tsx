"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { PropertyRow } from "./property-columns"
import { use } from "react"

interface Props {
    listing: Promise<PropertyRow[]>
    columns: ColumnDef<PropertyRow>[]
}

export default function ListingTable({
    listing,
    columns
}: Props) {
    const allListing = use(listing)

    return (
        <DataTable<PropertyRow>
            data={allListing}
            columns={columns}
            enableRowSelection={true}
            enableDrag={true}
            onReorder={(rows) => {
                console.log(rows)
            }}
        />
    )
}
