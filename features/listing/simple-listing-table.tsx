"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { use } from "react"
import { SimpleListingRow } from "./simple-listing-columns"

interface Props {
    listings: Promise<SimpleListingRow[]>
    columnsFactory: () => ColumnDef<SimpleListingRow>[]
}

export default function SimpleListingTable({
    listings,
    columnsFactory
}: Props) {
    const allListings = use(listings)
    const columns = columnsFactory()

    return (
        <DataTable<SimpleListingRow>
            data={allListings}
            columns={columns}
            enableRowSelection={false}
            enableDrag={false}
        />
    )
}
