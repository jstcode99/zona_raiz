"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XlsUpload } from "./xls-upload"
import { ImportPreview } from "./import-preview"
import { ImportTableSelector } from "./import-table-selector"
import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import type { ImportData, ImportRecord, ImportError, TableDetection } from "./import.types"
import { ImportTableName } from "@/domain/entities/import-job.entity"
import { isConfidenceSufficient } from "@/domain/utils/table-detector"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { t } = useTranslation("import")
  const [previewData, setPreviewData] = useState<ImportData | null>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload')
  
  // Estado para detección y selección de tabla
  const [detection, setDetection] = useState<TableDetection>({
    table: null,
    confidence: 0,
    showTableSelector: false,
  })
  const [selectedTable, setSelectedTable] = useState<ImportTableName | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [errors, setErrors] = useState<ImportError[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const handleDataLoaded = useCallback((data: ImportData, detected: ImportTableName | null, confidence: number, url: string, name: string) => {
    setPreviewData(data)
    setFileUrl(url)
    setFileName(name)
    
    // Configurar detección
    const showSelector = !isConfidenceSufficient(confidence)
    setDetection({
      table: detected,
      confidence,
      showTableSelector: showSelector,
    })
    
    // Si no hay selector, usar la tabla detectada
    if (!showSelector && detected) {
      setSelectedTable(detected)
    }
    
    setStep('preview')
  }, [])

  const handleError = (error: string) => {
    // TODO: Show error toast
    console.error('Import error:', error)
  }

  const handleTableSelect = (table: ImportTableName) => {
    setSelectedTable(table)
  }

  const handlePreviewConfirm = (data: ImportRecord[]) => {
    // TODO: Send data to parent or process further
    console.log('Confirmed data:', data)
    setStep('confirm')
    // After a brief delay, close dialog
    setTimeout(() => {
      onOpenChange(false)
      // Reset state
      setStep('upload')
      setPreviewData(null)
      setDetection({ table: null, confidence: 0, showTableSelector: false })
      setSelectedTable(null)
      setFileUrl(null)
      setFileName(null)
      setErrors([])
    }, 1500)
  }

  const handleConfirmClick = () => {
    // The actual confirmation is handled by ImportPreview component
    // This just triggers the visual confirm state in the dialog
    if (previewData) {
      setStep('confirm')
      // After a brief delay, close dialog
      setTimeout(() => {
        onOpenChange(false)
        // Reset state
        setStep('upload')
        setPreviewData(null)
        setDetection({ table: null, confidence: 0, showTableSelector: false })
        setSelectedTable(null)
        setFileUrl(null)
        setFileName(null)
        setErrors([])
      }, 1500)
    }
  }

  const handlePreviewCancel = () => {
    setStep('upload')
    setPreviewData(null)
    setDetection({ table: null, confidence: 0, showTableSelector: false })
    setSelectedTable(null)
    setFileUrl(null)
    setFileName(null)
    setErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Trigger would be handled by parent component */}
      </DialogTrigger>
      <DialogContent className="w-[900px] max-w-full">
        <DialogHeader>
          <DialogTitle>
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'upload' && (
          <XlsUpload
            onDataLoaded={handleDataLoaded}
            onError={handleError}
          />
        )}
        
        {step === 'preview' && (
          <>
            {/* Table selector if confidence is low */}
            {detection.showTableSelector && (
              <ImportTableSelector
                detectedTable={detection.table}
                confidence={detection.confidence}
                onSelect={handleTableSelect}
              />
            )}
            
            <ImportPreview
              data={previewData}
              onConfirm={handlePreviewConfirm}
              onCancel={handlePreviewCancel}
              detectedTable={detection.table}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
              fileUrl={fileUrl}
              fileName={fileName}
              errors={errors}
            />
          </>
        )}
        
        {step === 'confirm' && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("messages.import-success")}
            </h3>
            <p className="text-muted-foreground">
              {t("messages.import-success")}
            </p>
          </div>
        )}
        
        <DialogFooter>
          {step === 'upload' && (
            <>
              {/* No buttons in upload step - handled by dropzone */}
            </>
          )}
          {step === 'preview' && (
            <>
              <Button 
                variant="outline"
                onClick={handlePreviewCancel}
              >
                {t("actions.cancel")}
              </Button>
              <Button 
                onClick={handleConfirmClick}
              >
                {t("actions.confirm")}
              </Button>
            </>
          )}
          {step === 'confirm' && (
            <Button 
              onClick={() => onOpenChange(false)}
            >
              {t("actions.close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
