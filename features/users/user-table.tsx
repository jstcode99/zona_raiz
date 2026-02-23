"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { use } from "react"
import { UserColumns, UserRow } from "./user-columns"

interface Props {
  users: Promise<UserRow[]>
  columns: ColumnDef<UserRow>[]
}

export default function UsersTable({ users, columns }: Props) {
  const allUsers = use(users)

  return (
    <div className="space-y-4">
      <DataTable<UserRow>
        data={allUsers}
        columns={columns ?? UserColumns}
        enableRowSelection
        enableDrag={false}
      />
    </div>
  )
}
