"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { PropertyRow } from "./property-columns"

interface Props {
    properties: PropertyRow[]
    columns: ColumnDef<PropertyRow>[]
}

export default function PropertiesTable({
    properties,
    columns
}: Props) {
    return (
        <DataTable<PropertyRow>
            data={properties}
            columns={columns}
            enableRowSelection={true}
            enableDrag={true}
            onReorder={(rows) => {
                console.log(rows)
            }}
        />
    )
}
