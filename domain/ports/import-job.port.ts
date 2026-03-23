import type {
  ImportJobEntity,
  ImportJobStatus,
  ImportTableName,
  ImportError,
  ImportResultSummary,
} from "@/domain/entities/import-job.entity";

export interface ImportJobPort {
  /**
   * Crea un nuevo job de importación
   */
  createJob(params: {
    userId: string;
    realEstateId: string;
    tableName: ImportTableName;
    totalRows: number;
    batchSize: number;
  }): Promise<ImportJobEntity>;

  /**
   * Obtiene un job por ID
   */
  getJobById(id: string): Promise<ImportJobEntity | null>;

  /**
   * Obtiene los jobs de un usuario
   */
  getJobsByUserId(userId: string, limit?: number): Promise<ImportJobEntity[]>;

  /**
   * Actualiza el estado de un job
   */
  updateJobStatus(
    id: string,
    status: ImportJobStatus,
  ): Promise<ImportJobEntity>;

  /**
   * Actualiza el progreso de un job
   */
  updateJobProgress(
    id: string,
    processedRows: number,
    errors?: ImportError[],
  ): Promise<ImportJobEntity>;

  /**
   * Completa un job con el resumen
   */
  completeJob(
    id: string,
    summary: ImportResultSummary,
    errors?: ImportError[],
  ): Promise<ImportJobEntity>;

  /**
   * Cancela un job
   */
  cancelJob(id: string): Promise<ImportJobEntity>;

  /**
   * Agrega errores a un job
   */
  addJobErrors(id: string, errors: ImportError[]): Promise<ImportJobEntity>;

  /**
   * Inserta propiedades en lote
   */
  bulkInsertProperties(
    rows: Record<string, unknown>[],
    realEstateId: string,
    userId: string,
  ): Promise<{ insertedIds: string[]; errors: ImportError[] }>;

  /**
   * Inserta listings en lote
   */
  bulkInsertListings(
    rows: Record<string, unknown>[],
    realEstateId: string,
    userId: string,
  ): Promise<{ insertedIds: string[]; errors: ImportError[] }>;

  /**
   * Inserta real-estates en lote
   */
  bulkInsertRealEstates(
    rows: Record<string, unknown>[],
    userId: string,
  ): Promise<{ insertedIds: string[]; errors: ImportError[] }>;

  /**
   * Verifica si el usuario tiene acceso a la real_estate_id
   */
  verifyRealEstateAccess(
    userId: string,
    realEstateId: string,
  ): Promise<boolean>;
}
