"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import { FileSpreadsheet, UploadCloud } from "lucide-react"
import * as XLSX from "xlsx"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface ImportData {
  headers: string[]
  rows: Record<string, unknown>[]
  fileName: string
  sheetName?: string
}

export interface ImportRow extends Record<string, unknown> {
  id: string
  validation_status?: "valid" | "error"
  validation_errors?: string[]
}

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface XlsUploadProps {
  onDataLoaded: (data: ImportData) => void
  onError: (error: string) => void
  acceptedTypes?: string[]
  maxSize?: number
  disabled?: boolean
}

const DEFAULT_ACCEPTED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
]

const MIME_TO_EXTENSIONS: Record<string, string[]> = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "text/csv": [".csv"],
}

export function XlsUpload({
  onDataLoaded,
  onError,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxSize = 10 * 1024 * 1024,
  disabled,
}: XlsUploadProps) {
  const { t } = useTranslation("components")
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const parseFile = useCallback(
    async (file: File): Promise<ImportData> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const data = e.target?.result
            const workbook = XLSX.read(data, { type: "array" })
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
              firstSheet,
              { defval: "" }
            )

            if (jsonData.length === 0) {
              reject(new Error(t("components.import.empty_file")))
              return
            }

            const headers = Object.keys(jsonData[0])

            const rowsWithValidation: ImportRow[] = jsonData.map((row, index) => ({
              id: `import-row-${index}`,
              ...row,
              _rowIndex: index + 2,
              validation_status: "valid" as const,
              validation_errors: [],
            }))

            resolve({
              headers,
              rows: rowsWithValidation,
              fileName: file.name,
              sheetName: workbook.SheetNames[0],
            })
      } catch {
            reject(new Error(t("components.import.parse_error")))
          }
        }

        reader.onerror = () => reject(new Error(t("components.import.read_error")))
        reader.readAsArrayBuffer(file)
      })
    },
    [t]
  )

  const handleUpload = useCallback(
    async (file: File) => {
      setStatus("uploading")
      setProgress(0)
      setErrorMessage(null)
      setFileName(file.name)

      const progressInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) {
            clearInterval(progressInterval)
            return p
          }
          return p + 15
        })
      }, 100)

      try {
        const data = await parseFile(file)
        clearInterval(progressInterval)
        setProgress(100)
        setStatus("success")
        onDataLoaded(data)
      } catch (err) {
        clearInterval(progressInterval)
        setStatus("error")
        const message = err instanceof Error ? err.message : t("components.import.upload_failed")
        setErrorMessage(message)
        onError(message)
      }
    },
    [parseFile, onDataLoaded, onError, t]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return
      handleUpload(acceptedFiles[0])
    },
    [handleUpload]
  )

  const acceptConfig: Record<string, string[]> = {}
  acceptedTypes.forEach((type) => {
    if (MIME_TO_EXTENSIONS[type]) {
      acceptConfig[type] = MIME_TO_EXTENSIONS[type]
    }
  })

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptConfig,
    multiple: false,
    disabled: disabled || status === "uploading",
    maxSize,
    onDrop,
    onDropRejected: () => {
      setStatus("error")
      setErrorMessage(t("components.import.invalid_file"))
    },
  })

  const reset = useCallback(() => {
    setStatus("idle")
    setProgress(0)
    setErrorMessage(null)
    setFileName(null)
  }, [])

  if (status === "uploading" || status === "success") {
    return (
      <div className="border rounded-2xl p-8 text-center space-y-4">
        <FileSpreadsheet className="mx-auto size-10 text-primary" />
        <div>
          <p className="font-medium">{fileName}</p>
          {status === "uploading" && (
            <p className="text-sm text-muted-foreground">
              {t("components.import.uploading")}
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-600 dark:text-green-500">
              {t("components.import.upload_success")}
            </p>
          )}
        </div>
        <Progress value={progress} />
        {status === "uploading" && (
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("components.import.cancel_upload")}
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition",
        "hover:bg-muted/40",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        isDragActive ? "border-primary bg-muted/40" : "",
        isDragReject || status === "error" ? "border-destructive bg-destructive/5" : ""
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto mb-2 size-10 text-muted-foreground" />

      {isDragActive ? (
        <p className="text-primary font-medium">{t("components.import.drop_here")}</p>
      ) : isDragReject ? (
        <p className="text-destructive">{t("components.import.invalid_file")}</p>
      ) : status === "error" ? (
        <div className="space-y-2">
          <p className="text-destructive">{errorMessage}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              reset()
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("components.import.try_again")}
          </button>
        </div>
      ) : (
        <p className="text-muted-foreground">{t("components.import.drag_drop")}</p>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        {t("components.import.file_types")}
      </p>
    </div>
  )
}
