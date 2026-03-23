/**
 * Tipos para la importación de datos desde archivos XLS/CSV
 */

import { ImportTableName } from "@/domain/entities/import-job.entity";

/** Una fila de datos de importación (array de celdas) */
export type ImportRow = (string | number | boolean | null | undefined)[]

/** Datos completos de importación incluyendo headers y filas */
export interface ImportData {
  headers: string[]
  rows: ImportRow[]
}

/** Datos transformados como objetos clave-valor */
export type ImportRecord = Record<string, unknown>

/** Resultado de la detección de tabla */
export interface TableDetection {
  table: ImportTableName | null
  confidence: number
  showTableSelector: boolean
}

/** Estado del proceso de importación */
export interface ImportState {
  step: 'upload' | 'preview' | 'confirm'
  fileId: string | null
  fileUrl: string | null
  fileName: string | null
  headers: string[]
  rows: string[][]
  detectedTable: ImportTableName | null
  confidence: number
  selectedTable: ImportTableName | null
  showTableSelector: boolean
  errors: ImportError[]
  isValidating: boolean
  isConfirming: boolean
}

/** Error de validación de una celda */
export interface ImportError {
  row: number
  column: string
  value: string | number | null
  message: string
}

/** Resultado del mapeo de datos a una tabla */
export interface TableMappingResult {
  headers: string[]           // headers de la tabla seleccionada
  rows: (string | null)[][]   // filas transformadas según mapeo
  originalHeaders: string[]   // headers originales del archivo (para referencia)
  unmappedColumns: string[]   // columnas del archivo sin mapeo
}