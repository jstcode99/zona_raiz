"use client"

import { use } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { UserColumns, UserRow } from "@/features/user/user-colums"

interface UsersTableProps {
  users: Promise<UserRow[]>
  columns?: ColumnDef<UserRow>[]
}

export default function UsersTable({ users, columns }: UsersTableProps) {
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

