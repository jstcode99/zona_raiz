// domain/services/import-job.service.ts

import * as yup from "yup";
import { ImportJobPort } from "@/domain/ports/import-job.port";
import type { ImportJobEntity, ImportError, ImportResultSummary } from "@/domain/entities/import-job.entity";
import { ImportJobStatus, ImportTableName } from "@/domain/entities/import-job.entity";
import { DEFAULT_BATCH_SIZE, MAX_ROWS_PER_FILE } from "@/domain/entities/import-job.entity";
import { Lang } from "@/i18n/settings";

export interface ValidationResult {
  isValid: boolean;
  errors: ImportError[];
  validatedData: Record<string, unknown>[];
}

export class ImportJobService {
  constructor(
    private port: ImportJobPort,
    private lang: Lang = "es"
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
    fileUrl?: string;
    originalFilename?: string;
  }): Promise<ImportJobEntity> {
    // Validar límite de filas
    if (params.totalRows > MAX_ROWS_PER_FILE) {
      throw new Error(`El archivo excede el límite de ${MAX_ROWS_PER_FILE} filas`);
    }

    // Verificar acceso a la inmobiliaria
    const hasAccess = await this.port.verifyRealEstateAccess(
      params.userId,
      params.realEstateId
    );

    if (!hasAccess) {
      throw new Error("No tienes acceso a esta inmobiliaria");
    }

    const batchSize = params.batchSize ?? DEFAULT_BATCH_SIZE;

    return this.port.createJob({
      userId: params.userId,
      realEstateId: params.realEstateId,
      tableName: params.tableName,
      totalRows: params.totalRows,
      batchSize,
      fileUrl: params.fileUrl,
      originalFilename: params.originalFilename,
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
  async getUserJobs(userId: string, limit?: number): Promise<ImportJobEntity[]> {
    return this.port.getJobsByUserId(userId, limit);
  }

  /**
   * Valida todas las filas antes de importar
   */
  async validateAllRows(
    rows: Record<string, unknown>[],
    tableName: ImportTableName,
    headers: string[]
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
    userId: string
  ): Promise<ImportResultSummary> {
    const startTime = Date.now();
    const job = await this.port.getJobById(jobId);

    if (!job) {
      throw new Error("Job no encontrado");
    }

    if (job.status !== ImportJobStatus.PENDING) {
      throw new Error("El job no está en estado pendiente");
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

      let result;
      switch (tableName) {
        case ImportTableName.PROPERTIES:
          result = await this.port.bulkInsertProperties(batch, realEstateId, userId);
          break;
        case ImportTableName.LISTINGS:
          result = await this.port.bulkInsertListings(batch, realEstateId, userId);
          break;
        case ImportTableName.REAL_ESTATES:
          result = await this.port.bulkInsertRealEstates(batch, userId);
          break;
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
  private getValidationSchema(tableName: ImportTableName): yup.ObjectSchema<yup.AnyObject> {
    // Los schemas reales se importan desde application/validation/import/
    // Aquí devolvemos schemas básicos para la validación inicial
    switch (tableName) {
      case ImportTableName.PROPERTIES:
        return this.getPropertySchema();
      case ImportTableName.LISTINGS:
        return this.getListingSchema();
      case ImportTableName.REAL_ESTATES:
        return this.getRealEstateSchema();
      default:
        throw new Error(`Tabla desconocida: ${tableName}`);
    }
  }

  private getPropertySchema(): yup.ObjectSchema<yup.AnyObject> {
    return yup.object({
      title: yup.string().required("El título es requerido").min(3).max(200),
      slug: yup.string().optional().max(200),
      description: yup.string().optional().max(5000),
      property_type: yup.string().required("El tipo de propiedad es requerido"),
      street: yup.string().optional().max(200),
      city: yup.string().required("La ciudad es requerida").max(100),
      state: yup.string().required("El estado/departamento es requerido").max(100),
      country: yup.string().optional().max(100),
      postal_code: yup.string().optional().max(20),
      neighborhood: yup.string().optional().max(100),
      latitude: yup.number().optional().min(-90).max(90),
      longitude: yup.number().optional().min(-180).max(180),
      bedrooms: yup.number().optional().integer().min(0).max(100),
      bathrooms: yup.number().optional().integer().min(0).max(100),
      total_area: yup.number().optional().min(0),
      built_area: yup.number().optional().min(0),
      lot_area: yup.number().optional().min(0),
      floors: yup.number().optional().integer().min(0).max(200),
      year_built: yup.number().optional().integer().min(1800).max(new Date().getFullYear() + 5),
      parking_spots: yup.number().optional().integer().min(0).max(100),
      amenities: yup.string().optional(),
    }) as yup.ObjectSchema<yup.AnyObject>;
  }

  private getListingSchema(): yup.ObjectSchema<yup.AnyObject> {
    return yup.object({
      property_id: yup.string().optional(),
      listing_type: yup.string().required("El tipo de listing es requerido"),
      price: yup.number().required("El precio es requerido").min(0),
      currency: yup.string().optional().default("COP"),
      price_negotiable: yup.boolean().optional().default(false),
      status: yup.string().optional().default("draft"),
      meta_title: yup.string().optional().max(100),
      meta_description: yup.string().optional().max(500),
      keywords: yup.string().optional(),
      whatsapp_contact: yup.string().required("El WhatsApp es requerido"),
      expenses_amount: yup.number().optional().min(0),
      expenses_included: yup.boolean().optional().default(false),
      virtual_tour_url: yup.string().optional().url(),
      video_url: yup.string().optional().url(),
      available_from: yup.string().optional(),
      minimum_contract_duration: yup.number().optional().integer().min(1).max(120),
    }) as yup.ObjectSchema<yup.AnyObject>;
  }

  private getRealEstateSchema(): yup.ObjectSchema<yup.AnyObject> {
    return yup.object({
      name: yup.string().required("El nombre es requerido").min(2).max(200),
      description: yup.string().optional().max(5000),
      whatsapp: yup.string().required("El WhatsApp es requerido"),
      email: yup.string().optional().email(),
      phone: yup.string().optional(),
      street: yup.string().optional().max(200),
      city: yup.string().required("La ciudad es requerida").max(100),
      state: yup.string().required("El estado/departamento es requerido").max(100),
      country: yup.string().optional().max(100),
      postal_code: yup.string().optional().max(20),
    });
  }
}
