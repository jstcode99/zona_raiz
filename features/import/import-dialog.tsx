"use client"

import { useState } from "react"

import { ImportPreview } from "./import-preview"
import { XlsUpload, type ImportData, type ImportRow } from "./xls-upload"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: ImportRow[]) => Promise<void>
}

export function ImportDialog({
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [uploadedData, setUploadedData] = useState<ImportData | null>(null)

  const handleDataLoaded = (data: ImportData) => {
    setUploadedData(data)
  }

  const handleConfirm = async (data: ImportRow[]) => {
    await onImport(data)
    setUploadedData(null)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setUploadedData(null)
    onOpenChange(false)
  }

  return (
    <>
      <XlsUpload
        onDataLoaded={handleDataLoaded}
        onError={(msg) => console.error(msg)}
        disabled={false}
      />

      <ImportPreview
        data={uploadedData}
        open={uploadedData !== null}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        editable={true}
        maxPreviewRows={100}
      />
    </>
  )
}

export { type ImportData, type ImportRow }
