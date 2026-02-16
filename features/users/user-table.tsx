"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { use, useState } from "react"
import { UserRow } from "./user-columns"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userRoleOptions } from "@/domain/entities/schemas/userProfileAdmin"

interface Props {
  users: Promise<UserRow[]>
  columns: ColumnDef<UserRow>[]
}

export default function UsersTable({ users, columns }: Props) {
  const allUsers = use(users)
  const [roleFilter, setRoleFilter] = useState<string>("ALL")

  const filtered =
    roleFilter === "ALL"
      ? allUsers
      : allUsers.filter(
        (u) => u.profile?.role === roleFilter
      )

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3">
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {userRoleOptions.map(opt => <SelectItem value={opt.value}>{opt.value}</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DataTable<UserRow>
        data={filtered}
        columns={columns}
        enableRowSelection
        enableDrag={false}
      />
    </div>
  )
}
