"use client";

import { useCallback, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FileSpreadsheet } from "lucide-react";
import type { ImportData } from "./import.types";
import { ImportTableName } from "@/domain/entities/import-job.entity";

interface XlsUploadProps {
  onDataLoaded: (
    data: ImportData,
    detectedTable: ImportTableName | null,
    confidence: number,
    url: string,
    fileName: string,
  ) => void;
  onError: (error: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

interface UploadResult {
  fileId: string;
  url: string;
  headers: string[];
  rows: string[][];
  detectedTable: ImportTableName | null;
  confidence: number;
}

export function XlsUpload({
  onDataLoaded,
  onError,
  acceptedTypes = [".xlsx", ".xls", ".csv"],
  maxSize = 10 * 1024 * 1024, // 10MB
}: XlsUploadProps) {
  const { t } = useTranslation("import");
  const fileRef = useRef<File | null>(null);

  const { action: uploadAction, isPending: isUploading } = useServerMutation({
    action: uploadAndParseImportAction,
    onSuccess: (result) => {
      if (!result) {
        onError(t("exceptions.upload-failed"));
        return;
      }

      const uploadResult = result?.data as unknown as UploadResult;
      // Convertir el resultado de vuelta al formato ImportData
      const importData: ImportData = {
        headers: uploadResult.headers,
        rows: uploadResult.rows,
      };

      // Llamar al callback con los datos completos
      onDataLoaded(
        importData,
        uploadResult.detectedTable,
        uploadResult.confidence,
        uploadResult.url,
        fileRef.current?.name || "unknown",
      );
    },
    onError: (error) => {
      onError(error.message || t("exceptions.upload-failed"));
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const file = fileRejections[0];
        if (file.file.size > maxSize) {
          onError(
            t("exceptions.file-too-large", {
              size: `${maxSize / (1024 * 1024)}MB`,
            }),
          );
        } else {
          onError(t("exceptions.invalid-format"));
        }
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      fileRef.current = file;

      // Primero leer el archivo y parsearlo en el cliente para preview rápido
      try {
        const arrayBuffer = await file.arrayBuffer();

        // Import dinámico de xlsx para parsing en cliente
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const XLSX = require("xlsx");
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        }) as (string | number | null | undefined)[][];

        if (jsonData.length === 0) {
          onError(t("exceptions.parse-failed"));
          return;
        }

        // 1. Filtrar columnas vacías (headers vacíos o solo espacios)
        const rawHeaders = jsonData[0].map((h) => String(h).trim());
        const nonEmptyHeaderIndices = rawHeaders
          .map((header, index) => (header ? index : -1))
          .filter((index) => index >= 0);

        // Si no hay headers válidos, error
        if (nonEmptyHeaderIndices.length === 0) {
          onError(t("exceptions.parse-failed"));
          return;
        }

        const headers = nonEmptyHeaderIndices.map((i) => rawHeaders[i]);

        // 2. Filtrar filas vacías y limpiar celdas
        const rows = jsonData
          .slice(1)
          .map((row) =>
            nonEmptyHeaderIndices.map((i) => {
              const cell = row[i];
              if (cell === null || cell === undefined) return "";
              return typeof cell === "number" ? cell : String(cell);
            }),
          )
          .filter((row) => row.some((cell) => cell !== "")); // eliminar filas completamente vacías

        // Crear datos para preview
        const previewData: ImportData = { headers, rows };

        // Enviar al servidor para upload + detección
        const formData = new FormData();
        formData.append("file", file);

        uploadAction(formData);
      } catch (err) {
        console.error("Parse error:", err);
        onError(t("exceptions.parse-failed"));
      }
    },
    [onError, uploadAction, maxSize, t],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
        "application/vnd.ms-excel": [],
        "text/csv": [],
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
      <FileSpreadsheet className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />

      {isUploading ? (
        <>
          <div className="flex items-center justify-center mb-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">{t("actions.uploading")}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("messages.processing-file")}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t("placeholders.drag-drop")}
            <span className="font-medium">{t("placeholders.or-click")}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("placeholders.supported-formats")}:{acceptedTypes.join(", ")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("placeholders.max-size")}: {maxSize / (1024 * 1024)}MB
          </p>
          {!isDragActive && (
            <Button variant="outline" size="sm" className="mt-3">
              {t("actions.upload")}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
