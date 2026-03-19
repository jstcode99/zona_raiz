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

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { t } = useTranslation("import")
  const [importData, setImportData] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload')

  const handleDataLoaded = (data: any) => {
    setImportData(data)
    setPreviewData(data)
    setStep('preview')
  }

  const handleError = (error: string) => {
    // TODO: Show error toast
    console.error('Import error:', error)
  }

  const handlePreviewConfirm = (data: any[]) => {
    // TODO: Send data to parent or process further
    console.log('Confirmed data:', data)
    setStep('confirm')
    // After a brief delay, close dialog
    setTimeout(() => {
      onOpenChange(false)
      // Reset state
      setStep('upload')
      setImportData(null)
      setPreviewData(null)
    }, 1500)
  }

  const handleConfirmClick = () => {
    if (previewData) {
      handlePreviewConfirm(previewData.rows || [])
    }
  }

  const handlePreviewCancel = () => {
    setStep('upload')
    setImportData(null)
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
              <button 
                onClick={handlePreviewCancel}
                className="btn-ghost"
              >
                {t("actions.cancel")}
              </button>
              <button 
                onClick={handleConfirmClick}
                className="btn-primary"
              >
                {t("actions.confirm")}
              </button>
            </>
          )}
          {step === 'confirm' && (
            <button 
              onClick={() => onOpenChange(false)}
              className="btn-primary"
            >
              {t("actions.close")}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}