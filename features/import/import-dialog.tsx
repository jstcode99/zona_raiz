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
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { ImportData, ImportRecord } from "./import.types"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { t } = useTranslation("import")
  const [previewData, setPreviewData] = useState<ImportData | null>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload')

  const handleDataLoaded = (data: ImportData) => {
    setPreviewData(data)
    setStep('preview')
  }

  const handleError = (error: string) => {
    // TODO: Show error toast
    console.error('Import error:', error)
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
      }, 1500)
    }
  }

  const handlePreviewCancel = () => {
    setStep('upload')
    setPreviewData(null)
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
          <ImportPreview
            data={previewData}
            onConfirm={handlePreviewConfirm}
            onCancel={handlePreviewCancel}
          />
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