"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XlsUpload } from "./xls-upload";
import { ImportPreview } from "./import-preview";
import { ImportTableSelector } from "./import-table-selector";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { processImportAction } from "@/application/actions/import.actions";
import { toast } from "sonner";
import type { ImportData, ImportError, TableDetection } from "./import.types";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import { isConfidenceSufficient } from "@/domain/utils/table-detector";
import {
  getTableHeaders,
  transformDataToTable,
} from "@/domain/utils/table-mapper";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { t } = useTranslation("import");
  const [previewData, setPreviewData] = useState<ImportData | null>(null);
  const [step, setStep] = useState<"upload" | "preview" | "confirm">("upload");

  // Estado para detección y selección de tabla
  const [detection, setDetection] = useState<TableDetection>({
    table: null,
    confidence: 0,
    showTableSelector: false,
  });
  const [selectedTable, setSelectedTable] = useState<ImportTableName | null>(
    null,
  );
  const [errors, setErrors] = useState<ImportError[]>([]);

  // Estado para datos originales del archivo (sin mapear)
  const [originalData, setOriginalData] = useState<ImportData | null>(null);

  // Server action para procesar la importación
  const { action: processAction, isPending: isProcessing } = useServerMutation({
    action: processImportAction,
    onSuccess: () => {
      toast.success(t("messages.import-success"));
      setStep("confirm");
      // After a brief delay, close dialog
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 2000);
    },
    onError: (error) => {
      // Verificar si hay errores de validación en el error
      const validationErrors = (error as any).validationErrors;
      if (validationErrors && validationErrors.length > 0) {
        // Actualizar el estado de errores para mostrarlos en la tabla
        setErrors(validationErrors);
        toast.error(t("validation.errors_found", { count: validationErrors.length }));
      } else {
        toast.error(error.message || t("exceptions.import-failed"));
      }
    },
  });

  const resetState = useCallback(() => {
    setStep("upload");
    setPreviewData(null);
    setDetection({ table: null, confidence: 0, showTableSelector: false });
    setSelectedTable(null);
    setErrors([]);
    setOriginalData(null);
  }, []);

  const handleDataLoaded = useCallback(
    (
      data: ImportData,
      detected: ImportTableName | null,
      confidence: number,
    ) => {
      // Guardar datos originales sin transformar
      setOriginalData(data);
      setPreviewData(data);

      // Configurar detección
      const showSelector = !isConfidenceSufficient(confidence);
      setDetection({
        table: detected,
        confidence,
        showTableSelector: showSelector,
      });

      // Si no hay selector, usar la tabla detectada
      if (!showSelector && detected) {
        setSelectedTable(detected);
      }

      setStep("preview");
    },
    [],
  );

  const handleError = (error: string) => {
    toast.error(error);
    console.error("Import error:", error);
  };

  const handleTableSelect = (table: ImportTableName) => {
    setSelectedTable(table);

    // Si hay datos originales, re-mapear según la nueva tabla
    if (originalData && originalData.headers && originalData.rows) {
      const targetHeaders = getTableHeaders(table);

      // Transformar datos según mapeo (usando datos originales)
      const sourceRows: (string | null)[][] = originalData.rows.map((row) =>
        row.map((cell) => {
          if (cell === null || cell === undefined) return null;
          return String(cell);
        }),
      );

      // Transformar datos según mapeo
      const result = transformDataToTable(
        originalData.headers,
        sourceRows,
        targetHeaders,
        table,
      );

      // Actualizar preview con headers de la tabla y rows transformados
      setPreviewData({
        headers: result.headers,
        rows: result.rows,
      });

      // Limpiar errores de validación anteriores
      setErrors([]);
    }
  };

  const handleConfirmClick = () => {
    if (!previewData || !selectedTable) return;

    // Llamar a la server action con los datos
    const formData = new FormData();
    formData.append("headers", JSON.stringify(previewData.headers));
    formData.append("rows", JSON.stringify(previewData.rows));
    formData.append("tableName", selectedTable);

    processAction(formData);
  };

  const handleCancelPreview = () => {
    // Resetear todo el estado al paso de upload
    setStep("upload");
    setPreviewData(null);
    setDetection({ table: null, confidence: 0, showTableSelector: false });
    setSelectedTable(null);
    setErrors([]);
    setOriginalData(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Trigger would be handled by parent component */}
      </DialogTrigger>
      <DialogContent className="w-225 max-w-full max-h-[80vh] overflow-hidden">
        <div className="flex flex-col max-h-full">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>

          {step === "upload" && (
            <XlsUpload onDataLoaded={handleDataLoaded} onError={handleError} />
          )}

          {step === "preview" && (
            <div className="flex-1 pr-1 space-y-2 p-2">
              {/* Table selector if confidence is low - showing in dialog, not in preview */}
              {detection.showTableSelector && (
                <ImportTableSelector
                  detectedTable={detection.table}
                  confidence={detection.confidence}
                  onSelect={handleTableSelect}
                />
              )}

              <ImportPreview
                data={previewData}
                selectedTable={selectedTable}
                errors={errors}
              />
            </div>
          )}

          {step === "confirm" && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("messages.import-success")}
              </h3>
            </div>
          )}

          <DialogFooter>
            {step === "upload" && <>{/* No buttons in upload step */}</>}
            {step === "preview" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelPreview}
                  disabled={isProcessing}
                >
                  {t("actions.cancel")}
                </Button>
                <Button
                  onClick={handleConfirmClick}
                  disabled={isProcessing || !previewData || !selectedTable}
                >
                  {isProcessing
                    ? t("actions.confirming")
                    : t("actions.confirm")}
                </Button>
              </>
            )}
            {step === "confirm" && (
              <Button onClick={() => onOpenChange(false)}>
                {t("actions.close")}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
