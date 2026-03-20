/**
 * Tipos para la importación de datos desde archivos XLS/CSV
 */

/** Una fila de datos de importación (array de celdas) */
export type ImportRow = (string | number | boolean | null | undefined)[]

/** Datos completos de importación incluyendo headers y filas */
export interface ImportData {
  headers: string[]
  rows: ImportRow[]
}

/** Datos transformados como objetos clave-valor */
export type ImportRecord = Record<string, unknown>