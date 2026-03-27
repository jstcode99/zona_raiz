import * as yup from "yup";
import i18next from "i18next";
import { ImportJobPort } from "@/domain/ports/import-job.port";
import type {
  ImportJobEntity,
  ImportError,
  ImportResultSummary,
} from "@/domain/entities/import-job.entity";
import {
  ImportJobStatus,
  ImportTableName,
} from "@/domain/entities/import-job.entity";
import {
  DEFAULT_BATCH_SIZE,
  MAX_ROWS_PER_FILE,
} from "@/domain/entities/import-job.entity";
import { Lang } from "@/i18n/settings";
import {
  propertyImportSchema,
  listingImportSchema,
  realEstateImportSchema,
} from "@/application/validation/import";

export interface ValidationResult {
  isValid: boolean;
  errors: ImportError[];
  validatedData: Record<string, unknown>[];
}

const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, { ns: "import", ...options });

export class ImportJobService {
  constructor(
    private port: ImportJobPort,
    private lang: Lang = "es",
  ) {}

  /**
   * Crea un nuevo job de importación
   */
  async createJob(params: {
    userId: string;
    realEstateId: string;
    tableName: ImportTableName;
    totalRows: number;
    batchSize?: number;
  }): Promise<ImportJobEntity> {
    // Validar límite de filas
    if (params.totalRows > MAX_ROWS_PER_FILE) {
      throw new Error(
        t("exceptions.max_rows_exceeded", { max: MAX_ROWS_PER_FILE }),
      );
    }

    // Verificar acceso a la inmobiliaria
    const hasAccess = await this.port.verifyRealEstateAccess(
      params.userId,
      params.realEstateId,
    );

    if (!hasAccess) {
      throw new Error(t("exceptions.no_real_estate_access"));
    }

    const batchSize = params.batchSize ?? DEFAULT_BATCH_SIZE;

    return this.port.createJob({
      userId: params.userId,
      realEstateId: params.realEstateId,
      tableName: params.tableName,
      totalRows: params.totalRows,
      batchSize,
    });
  }

  /**
   * Obtiene un job por ID
   */
  async getJob(id: string): Promise<ImportJobEntity | null> {
    return this.port.getJobById(id);
  }

  /**
   * Obtiene los jobs del usuario
   */
  async getUserJobs(
    userId: string,
    limit?: number,
  ): Promise<ImportJobEntity[]> {
    return this.port.getJobsByUserId(userId, limit);
  }

  /**
   * Valida todas las filas antes de importar
   */
  async validateAllRows(
    rows: Record<string, unknown>[],
    tableName: ImportTableName,
    headers: string[],
  ): Promise<ValidationResult> {
    const errors: ImportError[] = [];
    const validatedData: Record<string, unknown>[] = [];

    // Obtener el schema apropiado según la tabla
    const schema = this.getValidationSchema(tableName);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const validated = await schema.validate(row, {
          abortEarly: false,
          stripUnknown: false,
        });
        console.log(validated);
        validatedData.push(validated as Record<string, unknown>);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          err.inner.forEach((e) => {
            const field = e.path || "unknown";
            const headerIndex = headers.indexOf(field);
            errors.push({
              row: i + 1, // 1-indexed para el usuario
              column: headerIndex >= 0 ? headers[headerIndex] : field,
              value: (row[field] as string | number | null) ?? null,
              message: e.message,
            });
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedData,
    };
  }

  /**
   * Procesa la importación en lotes
   */
  async processImport(
    jobId: string,
    validatedData: Record<string, unknown>[],
    tableName: ImportTableName,
    realEstateId: string,
    userId: string,
  ): Promise<ImportResultSummary> {
    const startTime = Date.now();
    const job = await this.port.getJobById(jobId);

    if (!job) {
      throw new Error(t("exceptions.job_not_found"));
    }

    if (job.status !== ImportJobStatus.PENDING) {
      throw new Error(t("exceptions.job_not_pending"));
    }

    // Marcar como procesando
    await this.port.updateJobStatus(jobId, ImportJobStatus.PROCESSING);

    const batchSize = job.batchSize;
    const totalRows = validatedData.length;
    let processedRows = 0;
    let importedRows = 0;
    const allErrors: ImportError[] = [];
    const createdIds: string[] = [];

    // Procesar en lotes
    for (let i = 0; i < validatedData.length; i += batchSize) {
      // Verificar si fue cancelado
      const currentJob = await this.port.getJobById(jobId);
      if (currentJob?.status === ImportJobStatus.CANCELLED) {
        break;
      }

      const batch = validatedData.slice(i, i + batchSize);
      let result: { insertedIds: string[]; errors: ImportError[] } | undefined;

      try {
        switch (tableName) {
          case ImportTableName.PROPERTIES:
            result = await this.port.bulkInsertProperties(
              batch,
              realEstateId,
              userId,
            );
            break;
          case ImportTableName.LISTINGS:
            result = await this.port.bulkInsertListings(
              batch,
              realEstateId,
              userId,
            );
            break;
          case ImportTableName.REAL_ESTATES:
            result = await this.port.bulkInsertRealEstates(batch);
            break;
        }
      } catch (err) {
        // Convertir excepción en errores de importación para cada fila del batch
        const batchErrors: ImportError[] = batch.map((_, idx) => {
          const rowNumber = i + idx + 1; // 1-indexed
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error during import";

          return {
            row: rowNumber,
            column: "general",
            value: null,
            message: errorMessage,
          };
        });

        // Agregar estos errores a allErrors
        allErrors.push(...batchErrors);

        // Actualizar progreso con los errores
        processedRows += batch.length;
        await this.port.updateJobProgress(jobId, processedRows, allErrors);

        // Continuar con el siguiente batch
        continue;
      }

      if (result) {
        importedRows += result.insertedIds.length;
        createdIds.push(...result.insertedIds);
        allErrors.push(...result.errors);

        processedRows += batch.length;
        await this.port.updateJobProgress(jobId, processedRows, allErrors);
      }
    }

    const duration = (Date.now() - startTime) / 1000;

    const summary: ImportResultSummary = {
      totalRows,
      importedRows,
      failedRows: totalRows - importedRows,
      duration,
      createdIds,
    };

    // Completar el job
    await this.port.completeJob(jobId, summary, allErrors);

    return summary;
  }

  /**
   * Cancela un job
   */
  async cancelJob(jobId: string): Promise<ImportJobEntity> {
    return this.port.cancelJob(jobId);
  }

  /**
   * Obtiene el schema de validación según la tabla
   */
  private getValidationSchema(
    tableName: ImportTableName,
  ): yup.ObjectSchema<yup.AnyObject> {
    switch (tableName) {
      case ImportTableName.PROPERTIES:
        return propertyImportSchema as yup.ObjectSchema<yup.AnyObject>;
      case ImportTableName.LISTINGS:
        return listingImportSchema as yup.ObjectSchema<yup.AnyObject>;
      case ImportTableName.REAL_ESTATES:
        return realEstateImportSchema as yup.ObjectSchema<yup.AnyObject>;
      default:
        throw new Error(t("exceptions.unknown_table", { table: tableName }));
    }
  }
}
