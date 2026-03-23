"use client";

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { confirmImportAction } from "@/application/actions/import.actions"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { ImportData, ImportRow, ImportRecord, ImportError } from "./import.types"
import { ImportTableName } from "@/domain/entities/import-job.entity"

interface ImportPreviewProps {
  data: ImportData | null
  onConfirm: (data: ImportRecord[]) => void
  onCancel: () => void
  detectedTable: ImportTableName | null
  selectedTable: ImportTableName | null
  onTableSelect: (table: ImportTableName) => void
  fileUrl?: string | null
  fileName?: string | null
  errors?: ImportError[]
}

// Tipo para las filas de la tabla de preview
type TableRow = { id: string; hasError?: boolean } & Record<string, string | number | boolean | null | undefined>

export function ImportPreview({
  data,
  onConfirm,
  onCancel,
  detectedTable,
  selectedTable,
  onTableSelect,
  fileUrl,
  fileName,
  errors = [],
}: ImportPreviewProps) {
  const { t } = useTranslation("import")
  const [table, setTable] = useState<ImportTableName | null>(
    selectedTable || detectedTable
  )

  // Always initialize hooks at the top level — never conditionally
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editedData, setEditedData] = useState<ImportRow[]>(data?.rows ?? [])

  const { action: confirmAction, isPending: isConfirming } = useServerMutation({
    action: confirmImportAction,
    onSuccess: (result) => {
      if (result && "success" in result && !result.success) {
        // Validation errors
        if (result.errors) {
          toast.error(t("validation.errors_found", { count: result.errors.length }))
        }
        return
      }
      toast.success(t("messages.import-success"))
      if (!data) return
      // Convert rows to objects using headers
      const resultData: Record<string, unknown>[] = editedData.map((row) => {
        const obj: Record<string, unknown> = {}
        data.headers.forEach((header, colIndex) => {
          obj[header] = row[colIndex] !== undefined && row[colIndex] !== null ? row[colIndex] : ''
        })
        return obj
      })
      onConfirm(resultData)
    },
    onError: (error) => {
      toast.error(error.message || t("exceptions.import-failed"))
    },
  })

  const handleTableChange = (newTable: ImportTableName) => {
    setTable(newTable)
    onTableSelect(newTable)
  }

  const handleConfirm = () => {
    if (!data || !table) return
    const formData = new FormData()
    formData.append('headers', JSON.stringify(data.headers))
    formData.append('rows', JSON.stringify(editedData))
    formData.append('tableName', table)
    if (fileUrl) formData.append('fileUrl', fileUrl)
    if (fileName) formData.append('originalFilename', fileName)
    confirmAction(formData)
  }

  // Check if there's errors for a cell
  const hasCellError = (rowIndex: number, column: string): boolean => {
    return errors.some(e => e.row === rowIndex + 1 && e.column === column)
  }

  // Get error message for a cell
  const getCellError = (rowIndex: number, column: string): string | null => {
    const error = errors.find(e => e.row === rowIndex + 1 && e.column === column)
    return error?.message || null
  }

  // Handle null data gracefully — after all hooks
  if (!data || !data.headers || data.headers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("messages.no-data")}
      </div>
    )
  }

  // Create columns for DataTable with error highlighting
  const columns: ColumnDef<TableRow, unknown>[] = (data.headers || []).map((header, colIndex) => ({
    accessorKey: `col${colIndex}`,
    header: header,
    cell: ({ row }: { row: { original: TableRow } }) => {
      const rowIndex = parseInt(row.original.id.replace('row-', ''))
      const hasError = hasCellError(rowIndex, header)
      const errorMessage = getCellError(rowIndex, header)
      
      return (
        <div className="relative">
          {row.original[`col${colIndex}`]}
          {hasError && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" title={errorMessage || ''} />
          )}
        </div>
      )
    },
  }))

  // Prepare data for DataTable with error flags
  const prepareDataForTable = (rows: ImportRow[]): TableRow[] => {
    return rows.map((row, rowIndex) => {
      const hasRowError = errors.some(e => e.row === rowIndex + 1)
      return {
        id: `row-${rowIndex}`,
        hasError: hasRowError,
        ...row.reduce<Record<string, string | number | boolean | null | undefined>>((acc, cell, colIndex) => {
          acc[`col${colIndex}`] = cell
          return acc
        }, {})
      }
    })
  }

  // Get table options from detected or selected
  const tableOptions = [
    { label: t("tables.properties"), value: ImportTableName.PROPERTIES },
    { label: t("tables.listings"), value: ImportTableName.LISTINGS },
    { label: t("tables.real-estates"), value: ImportTableName.REAL_ESTATES },
  ]

  return (
    <div className="space-y-4">
      {/* Table selector */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <label className="text-sm font-medium">{t("fields.table")}:</label>
        <select
          value={table || ''}
          onChange={(e) => handleTableChange(e.target.value as ImportTableName)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">{t("placeholders.select-table")}</option>
          {tableOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {detectedTable && detectedTable === table && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            {t("detection.auto_detected")}
          </span>
        )}
      </div>

      {/* Errors summary */}
      {errors.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">
            {t("validation.errors_found", { count: errors.length })}
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={prepareDataForTable(editedData)}
          pageSize={25}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isConfirming}
        >
          {t("actions.cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isConfirming || editedData.length === 0 || !table}
          className={isConfirming ? "opacity-70" : ""}
        >
          {isConfirming ? t("actions.confirming") : t("actions.confirm")}
        </Button>
      </div>
    </div>
  )
}
