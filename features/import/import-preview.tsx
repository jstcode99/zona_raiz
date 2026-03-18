"use client"

import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { type ColumnDef } from "@tanstack/react-table"
import { AlertCircle, CheckCircle2, Pencil, PencilOff, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ImportData, ImportRow } from "./xls-upload"

interface ImportPreviewProps {
  data: ImportData | null
  open: boolean
  onConfirm: (data: ImportRow[]) => void
  onCancel: () => void
  editable?: boolean
  maxPreviewRows?: number
}

type PreviewStatus = "preview" | "editing" | "confirmed" | "error"

export function ImportPreview({
  data,
  open,
  onConfirm,
  onCancel,
  editable = true,
  maxPreviewRows = 100,
}: ImportPreviewProps) {
  const { t } = useTranslation("components")
  const [status, setStatus] = useState<PreviewStatus>("preview")
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null)
  const [editColumn, setEditColumn] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [localData, setLocalData] = useState<ImportRow[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const getRows = useCallback((): ImportRow[] => {
    if (localData.length > 0) return localData
    if (!data) return []
    return data.rows as ImportRow[]
  }, [data, localData])

  const displayData = useMemo(() => {
    return getRows().slice(0, maxPreviewRows)
  }, [getRows, maxPreviewRows])

  const hasErrors = useMemo(() => {
    return displayData.some((row) => row.validation_status === "error")
  }, [displayData])

  const validCount = useMemo(() => {
    return displayData.filter((row) => row.validation_status !== "error").length
  }, [displayData])

  const errorCount = useMemo(() => {
    return displayData.filter((row) => row.validation_status === "error").length
  }, [displayData])

  const totalRows = useMemo(() => {
    return data?.rows?.length ?? 0
  }, [data])

  const handleCellSave = useCallback(
    (rowIndex: number, column: string) => {
      const rows = getRows()
      const newData: ImportRow[] = rows.map((row) => {
        if ((row._rowIndex as number) === rowIndex) {
          return { ...row, [column]: editValue }
        }
        return row
      })
      setLocalData(newData)
      setEditRowIndex(null)
      setEditColumn(null)
      setEditValue("")
    },
    [editValue, getRows]
  )

  const handleConfirm = useCallback(() => {
    const dataToConfirm = getRows()
    if (hasErrors) {
      setStatus("error")
      setErrorMessage(t("components.import.has_validation_errors"))
      return
    }
    setStatus("confirmed")
    onConfirm(dataToConfirm)
  }, [getRows, hasErrors, onConfirm, t])

  const handleCancel = useCallback(() => {
    setStatus("preview")
    setLocalData([])
    setEditRowIndex(null)
    setEditColumn(null)
    setEditValue("")
    setErrorMessage(null)
    onCancel()
  }, [onCancel])

  const columns = useMemo<ColumnDef<ImportRow>[]>(() => {
    if (!data) return []

    return data.headers.map((header) => ({
      id: header,
      accessorKey: header,
      header: header,
      cell: ({ row }) => {
        const value = row.original[header]
        const isEditing =
          editable &&
          editRowIndex === row.original._rowIndex &&
          editColumn === header

        if (isEditing) {
          return (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleCellSave(row.original._rowIndex as number, header)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCellSave(row.original._rowIndex as number, header)
                } else if (e.key === "Escape") {
                  setEditRowIndex(null)
                  setEditColumn(null)
                  setEditValue("")
                }
              }}
              className="h-7 py-0 text-sm"
              autoFocus
            />
          )
        }

        const displayValue =
          value === null || value === undefined ? "" : String(value)

        return (
          <div
            className={cn(
              "cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1",
              editable && "group"
            )}
            onClick={() => {
              if (!editable) return
              setEditRowIndex(row.original._rowIndex as number)
              setEditColumn(header)
              setEditValue(displayValue)
            }}
          >
            <span className={cn(!editable && "block w-full")}>
              {displayValue}
            </span>
            {editable && (
              <Pencil className="inline-block ml-1 size-3 opacity-0 group-hover:opacity-50" />
            )}
          </div>
        )
      },
    }))
  }, [data, editable, editColumn, editRowIndex, editValue, handleCellSave])

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("components.import.preview_title")}</DialogTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {data.fileName}
              {data.sheetName && ` - ${data.sheetName}`}
            </span>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
              <CheckCircle2 className="size-4" />
              {validCount} {t("components.import.valid_rows")}
            </span>
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="size-4" />
                {errorCount} {t("components.import.error_rows")}
              </span>
            )}
          </div>
        </DialogHeader>

        {status === "editing" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Pencil className="size-4" />
            {t("components.import.editing_mode")}
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <DataTable
            data={displayData}
            columns={columns}
            pageSize={20}
            enableRowSelection={false}
          />
        </div>

        {totalRows > maxPreviewRows && (
          <p className="text-xs text-muted-foreground text-center py-2">
            {t("components.import.truncated_preview", {
              shown: maxPreviewRows,
              total: totalRows,
            })}
          </p>
        )}

        <DialogFooter>
          {editable && editRowIndex !== null && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditRowIndex(null)
                setEditColumn(null)
                setEditValue("")
                setStatus("preview")
              }}
            >
              <PencilOff className="size-4 mr-1" />
              {t("components.import.exit_edit")}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="size-4 mr-1" />
            {t("components.import.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={hasErrors && status !== "error"}
          >
            {t("components.import.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
