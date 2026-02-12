"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type Row,
  type Table as ReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type BaseRow = { id: string | number }

interface DataTableProps<TData extends BaseRow> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  pageSize?: number
  enableRowSelection?: boolean
  enableDrag?: boolean
  onReorder?: (rows: TData[]) => void
}

function useDataTable<TData extends BaseRow>({
  data,
  columns,
  pageSize,
  enableRowSelection,
}: Omit<DataTableProps<TData>, "enableDrag" | "onReorder">) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize ?? 10,
  })

  return useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
}

function DataTableHeader<TData extends BaseRow>({
  table,
}: {
  table: ReactTable<TData>
}) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id} colSpan={header.colSpan}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}

function DataTableRow<TData extends BaseRow>({
  row,
}: {
  row: Row<TData>
}) {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

function DraggableRow<TData extends BaseRow>({
  row,
}: {
  row: Row<TData>
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="data-[dragging=true]:opacity-80"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

function DataTableBody<TData extends BaseRow>({
  table,
  enableDrag,
  data,
}: {
  table: ReactTable<TData>
  enableDrag?: boolean
  data: TData[]
}) {
  const rows = table.getRowModel().rows

  return (
    <TableBody>
      {rows.length ? (
        enableDrag ? (
          <SortableContext
            items={data.map((d) => d.id as UniqueIdentifier)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((row) => (
              <DraggableRow key={row.id} row={row} />
            ))}
          </SortableContext>
        ) : (
          rows.map((row) => (
            <DataTableRow key={row.id} row={row} />
          ))
        )
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}

export function DataTable<TData extends BaseRow>({
  data,
  columns,
  pageSize,
  enableRowSelection,
  enableDrag,
  onReorder,
}: DataTableProps<TData>) {
  const table = useDataTable({
    data,
    columns,
    pageSize,
    enableRowSelection,
  })

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDrag) return
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = data.findIndex((r) => r.id === active.id)
      const newIndex = data.findIndex((r) => r.id === over.id)
      const reordered = arrayMove(data, oldIndex, newIndex)
      onReorder?.(reordered)
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-hidden rounded-lg border">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody
            table={table}
            enableDrag={enableDrag}
            data={data}
          />
        </Table>
      </div>
    </DndContext>
  )
}
