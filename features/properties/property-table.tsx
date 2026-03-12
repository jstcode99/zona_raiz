"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { PropertyRow } from "./property-columns"
import { use } from "react"

interface Props {
    properties: Promise<PropertyRow[]>
    columns: ColumnDef<PropertyRow>[]
}

export default function PropertiesTable({
    properties,
    columns
}: Props) {
    const allProperties = use(properties)
    return (
        <DataTable<PropertyRow>
            data={allProperties}
            columns={columns}
            enableRowSelection={true}
            enableDrag={true}
            onReorder={(rows) => {
                console.log(rows)
            }}
        />
    )
}
