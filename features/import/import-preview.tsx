"use client";

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { confirmImportAction } from "@/application/actions/import.actions"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import type { ImportData, ImportRow, ImportRecord } from "./import.types"

interface ImportPreviewProps {
  data: ImportData | null
  onConfirm: (data: ImportRecord[]) => void
  onCancel: () => void
  editable?: boolean
}

// Tipo para las filas de la tabla de预览
type TableRow = { id: string } & Record<string, string | number | boolean | null | undefined>

export function ImportPreview({ 
  data, 
  onConfirm, 
  onCancel, 
  editable = false 
}: ImportPreviewProps) {
  const { t } = useTranslation("import")
  
  // Handle null data gracefully
  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("messages.no-data")}
      </div>
    )
  }

  const [editedData, setEditedData] = useState<ImportRow[]>(data.rows)

  const { action: confirmAction, isPending: isConfirming } = useServerMutation({
    action: confirmImportAction,
    onSuccess: () => {
      toast.success(t("messages.import-success"))
      // Convert rows to objects using headers
      const result: Record<string, unknown>[] = editedData.map((row) => {
        const obj: Record<string, unknown> = {}
        data.headers.forEach((header, colIndex) => {
          obj[header] = row[colIndex] !== undefined && row[colIndex] !== null ? row[colIndex] : ''
        })
        return obj
      })
      onConfirm(result)
    },
    onError: (error) => {
      toast.error(error.message || t("exceptions.import-failed"))
    },
  })

  const handleCellChange = (rowIndex: number, colIndex: number, value: string | number | boolean | null | undefined) => {
    setEditedData(prev => {
      const newData = [...prev]
      if (!newData[rowIndex]) newData[rowIndex] = []
      newData[rowIndex][colIndex] = value
      return newData
    })
  }

  const handleConfirm = () => {
    const formData = new FormData()
    formData.append('headers', JSON.stringify(data.headers))
    formData.append('rows', JSON.stringify(editedData))
    confirmAction(formData)
  }

  // Create columns for DataTable
  const columns: ColumnDef<TableRow, unknown>[] = data.headers.map((header, colIndex) => ({
    accessorKey: `col${colIndex}`,
    header: header,
  }))

  // Prepare data for DataTable with required id field
  const prepareDataForTable = (rows: ImportRow[]): TableRow[] => {
    return rows.map((row, rowIndex) => ({
      id: `row-${rowIndex}`,
      ...row.reduce<Record<string, string | number | boolean | null | undefined>>((acc, cell, colIndex) => {
        acc[`col${colIndex}`] = cell
        return acc
      }, {})
    }))
  }

  return (
    <div className="space-y-4">
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
          disabled={isConfirming || editedData.length === 0}
          className={isConfirming ? "opacity-70" : ""}
        >
          {isConfirming ? t("actions.confirming") : t("actions.confirm")}
        </Button>
      </div>
    </div>
  )
}