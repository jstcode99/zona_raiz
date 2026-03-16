"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { use } from "react"
import { ListingRow } from "./listing-columns"
import { getListingColumns } from "@/features/listing/listing-columns";

interface Props {
    listing: Promise<ListingRow[]>
    columns?: ColumnDef<ListingRow>[]
}

export default function ListingTable({
    listing,
    columns
}: Props) {
    const allListing = use(listing)
    const cols = columns ?? getListingColumns()
    return (
        <DataTable<ListingRow>
            data={allListing}
            columns={cols}
            enableRowSelection={true}
            enableDrag={true}
            onReorder={(rows) => {
                console.log(rows)
            }}
        />
    )
}
