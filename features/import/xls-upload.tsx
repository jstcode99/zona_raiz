"use client";

import { useCallback, useState } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { UploadCloud } from "lucide-react"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { uploadAndParseImportAction } from "@/application/actions/import.actions"
import type { ImportData } from "./import.types"

interface XlsUploadProps {
  onDataLoaded: (data: ImportData) => void;
  onError: (error: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export function XlsUpload({ 
  onDataLoaded, 
  onError, 
  acceptedTypes = ['.xlsx', '.xls', '.csv'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: XlsUploadProps) {
  const { t } = useTranslation("import");

  const { action: uploadAction, isPending: isUploading } = useServerMutation({
    action: uploadAndParseImportAction,
    onSuccess: () => {
      // Mock data for now since the server action doesn't return parsed data
      const mockData = {
        headers: ['Name', 'Email', 'Phone', 'Company'],
        rows: [
          ['John Doe', 'john@example.com', '123-456-7890', 'Acme Corp'],
          ['Jane Smith', 'jane@example.com', '098-765-4321', 'Beta Inc'],
          ['Bob Johnson', 'bob@example.com', '555-123-4567', 'Test LLC']
        ]
      };
      onDataLoaded(mockData);
    },
    onError: (error) => {
      onError(error.message || t('exceptions.upload-failed'));
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const file = fileRejections[0];
      if (file.file.size > maxSize) {
        onError(t('exceptions.file-too-large', { size: `${maxSize / (1024*1024)}MB` }));
      } else {
        onError(t('exceptions.invalid-format'));
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    
    uploadAction(formData);
  }, [onDataLoaded, onError, uploadAction, maxSize, t]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
        'application/vnd.ms-excel': [],
        'text/csv': [],
      },
      multiple: false,
      onDrop,
    });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        duration-200 hover:border-primary/50
        ${isUploading ? "opacity-70" : ""}
        ${isDragActive ? "border-primary bg-primary/5" : ""}
        ${isDragReject ? "border-destructive" : ""}
      `}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto mb-4 h-6 w-6" />
      
      {isUploading ? (
        <>
          <div className="flex items-center justify-center mb-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">{t('actions.uploading')}</span>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t('placeholders.drag-drop')} 
            <span className="font-medium">{t('placeholders.or-click')}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('placeholders.supported-formats')}: 
            {acceptedTypes.join(', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('placeholders.max-size')}: {maxSize / (1024*1024)}MB
          </p>
          {!isDragActive && (
            <Button variant="outline" size="sm" className="mt-3">
              {t('actions.upload')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}