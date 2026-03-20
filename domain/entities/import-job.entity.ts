// domain/entities/import-job.entity.ts

export enum ImportJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum ImportTableName {
  PROPERTIES = "properties",
  LISTINGS = "listings",
  REAL_ESTATES = "real-estates",
}

export interface ImportError {
  row: number;
  column: string;
  value: string | number | null;
  message: string;
}

export interface ImportResultSummary {
  totalRows: number;
  importedRows: number;
  failedRows: number;
  duration: number; // en segundos
  createdIds: string[];
}

export interface ImportJobEntity {
  id: string;
  userId: string;
  realEstateId: string;
  tableName: ImportTableName;
  status: ImportJobStatus;
  totalRows: number;
  processedRows: number;
  batchSize: number;
  errors: ImportError[];
  resultSummary: ImportResultSummary | null;
  fileUrl: string | null;
  originalFilename: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export const IMPORT_TABLE_OPTIONS = [
  { label: "Properties", value: ImportTableName.PROPERTIES },
  { label: "Listings", value: ImportTableName.LISTINGS },
  { label: "Real Estates", value: ImportTableName.REAL_ESTATES },
] as const;

export const DEFAULT_BATCH_SIZE = 100;
export const MAX_ROWS_PER_FILE = 10000;
export const MAX_BATCH_SIZE = 500;
export const MIN_BATCH_SIZE = 50;
