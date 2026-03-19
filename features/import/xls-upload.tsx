import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { UploadCloud } from "lucide-react"

interface XlsUploadProps {
  onDataLoaded: (data: any) => void;
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
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const file = fileRejections[0];
      if (file.size > maxSize) {
        onError(t('import:errors.fileTooLarge', { size: `${maxSize / (1024*1024)}MB` }));
      } else {
        onError(t('import:errors.invalidFileType'));
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      try {
        const file = acceptedFiles[0];
        
        // Por ahora simulamos datos de prueba
        // En producción, aquí iría la llamada al servidor para subir y parsear el archivo
        const mockData = {
          headers: ['Name', 'Email', 'Phone', 'Company'],
          rows: [
            ['John Doe', 'john@example.com', '123-456-7890', 'Acme Corp'],
            ['Jane Smith', 'jane@example.com', '098-765-4321', 'Beta Inc'],
            ['Bob Johnson', 'bob@example.com', '555-123-4567', 'Test LLC']
          ]
        };
        
        onDataLoaded(mockData);
      } catch (error) {
        console.error('Upload error:', error);
        onError(t('import:errors.uploadFailed'));
      } finally {
        setIsUploading(false);
      }
    }, 1000); // Simulate network delay
  }, [onDataLoaded, onError, acceptedTypes, maxSize, t]);

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
            <span className="ml-2">{t('import:upload.uploading')}</span>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t('import:upload.clickOrDrag')} 
            <span className="font-medium">{t('import:upload.browseFiles')}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('import:upload.supportedFormats')}: 
            {acceptedTypes.join(', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('import:upload.maxSize')}: {maxSize / (1024*1024)}MB
          </p>
          {!isDragActive && (
            <Button variant="outline" size="sm" className="mt-3">
              {t('import:upload.browseFiles')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}