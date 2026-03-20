import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImportJobService } from "../../../domain/services/import-job.service";
import { ImportJobPort } from "../../../domain/ports/import-job.port";
import {
  ImportJobEntity,
  ImportJobStatus,
  ImportTableName,
} from "../../../domain/entities/import-job.entity";

describe("ImportJobService", () => {
  let service: ImportJobService;
  let mockPort: ImportJobPort;

  const mockJob: ImportJobEntity = {
    id: "job-123",
    userId: "user-456",
    realEstateId: "re-789",
    tableName: ImportTableName.PROPERTIES,
    status: ImportJobStatus.PENDING,
    totalRows: 100,
    processedRows: 0,
    batchSize: 100,
    errors: [],
    resultSummary: null,
    fileUrl: "https://storage.example.com/file.xlsx",
    originalFilename: "properties.xlsx",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  };

  beforeEach(() => {
    mockPort = {
      createJob: vi.fn().mockResolvedValue(mockJob),
      getJobById: vi.fn().mockResolvedValue(mockJob),
      getJobsByUserId: vi.fn().mockResolvedValue([mockJob]),
      updateJobStatus: vi.fn().mockResolvedValue(mockJob),
      updateJobProgress: vi.fn().mockResolvedValue(mockJob),
      completeJob: vi.fn().mockResolvedValue(mockJob),
      cancelJob: vi.fn().mockResolvedValue({ ...mockJob, status: ImportJobStatus.CANCELLED }),
      addJobErrors: vi.fn().mockResolvedValue(mockJob),
      bulkInsertProperties: vi.fn().mockResolvedValue({ insertedIds: ["p1", "p2"], errors: [] }),
      bulkInsertListings: vi.fn().mockResolvedValue({ insertedIds: ["l1"], errors: [] }),
      bulkInsertRealEstates: vi.fn().mockResolvedValue({ insertedIds: ["r1"], errors: [] }),
      verifyRealEstateAccess: vi.fn().mockResolvedValue(true),
    };
    service = new ImportJobService(mockPort);
  });

  describe("createJob", () => {
    it("should create a job with valid parameters", async () => {
      const params = {
        userId: "user-456",
        realEstateId: "re-789",
        tableName: ImportTableName.PROPERTIES,
        totalRows: 100,
        batchSize: 100,
      };

      const result = await service.createJob(params);

      expect(mockPort.verifyRealEstateAccess).toHaveBeenCalledWith("user-456", "re-789");
      expect(mockPort.createJob).toHaveBeenCalledWith({
        userId: "user-456",
        realEstateId: "re-789",
        tableName: ImportTableName.PROPERTIES,
        totalRows: 100,
        batchSize: 100,
        fileUrl: undefined,
        originalFilename: undefined,
      });
      expect(result).toEqual(mockJob);
    });

    it("should use default batch size if not provided", async () => {
      const params = {
        userId: "user-456",
        realEstateId: "re-789",
        tableName: ImportTableName.PROPERTIES,
        totalRows: 50,
      };

      await service.createJob(params);

      expect(mockPort.createJob).toHaveBeenCalledWith(
        expect.objectContaining({ batchSize: 100 }),
      );
    });

    it("should throw error if user does not have access to real estate", async () => {
      vi.mocked(mockPort.verifyRealEstateAccess).mockResolvedValue(false);

      const params = {
        userId: "user-456",
        realEstateId: "re-789",
        tableName: ImportTableName.PROPERTIES,
        totalRows: 100,
      };

      await expect(service.createJob(params)).rejects.toThrow("No tienes acceso a esta inmobiliaria");
    });

    it("should throw error if total rows exceed limit", async () => {
      const params = {
        userId: "user-456",
        realEstateId: "re-789",
        tableName: ImportTableName.PROPERTIES,
        totalRows: 15000, // Exceeds MAX_ROWS_PER_FILE = 10000
      };

      await expect(service.createJob(params)).rejects.toThrow("excede el límite de 10000 filas");
    });
  });

  describe("getJob", () => {
    it("should return job by ID", async () => {
      const result = await service.getJob("job-123");

      expect(mockPort.getJobById).toHaveBeenCalledWith("job-123");
      expect(result).toEqual(mockJob);
    });

    it("should return null if job not found", async () => {
      vi.mocked(mockPort.getJobById).mockResolvedValue(null);

      const result = await service.getJob("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("getUserJobs", () => {
    it("should return jobs for user with default limit", async () => {
      const result = await service.getUserJobs("user-456");

      expect(mockPort.getJobsByUserId).toHaveBeenCalledWith("user-456", undefined);
      expect(result).toEqual([mockJob]);
    });

    it("should return jobs with custom limit", async () => {
      const result = await service.getUserJobs("user-456", 5);

      expect(mockPort.getJobsByUserId).toHaveBeenCalledWith("user-456", 5);
      expect(result).toEqual([mockJob]);
    });
  });

  describe("validateAllRows", () => {
    it("should validate valid property data", async () => {
      const rows = [
        {
          title: "Casa en Bogotá",
          property_type: "house",
          city: "Bogotá",
          state: "Cundinamarca",
        },
      ];

      const result = await service.validateAllRows(
        rows,
        ImportTableName.PROPERTIES,
        ["title", "property_type", "city", "state"],
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.validatedData).toHaveLength(1);
    });

    it("should collect validation errors with row and column info", async () => {
      const rows = [
        {
          title: "AB", // Too short (< 3 chars)
          property_type: "house",
          city: "", // Required but empty
          state: "Cundinamarca",
        },
        {
          title: "Another Invalid", // Too short
          property_type: "house",
          city: "", // Required but empty
          state: "Cundinamarca",
        },
      ];

      const result = await service.validateAllRows(
        rows,
        ImportTableName.PROPERTIES,
        ["title", "property_type", "city", "state"],
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toHaveProperty("row");
      expect(result.errors[0]).toHaveProperty("column");
      expect(result.errors[0]).toHaveProperty("message");
      expect(result.validatedData).toHaveLength(0);
    });

    it("should validate listing data correctly", async () => {
      const rows = [
        {
          listing_type: "sale",
          price: 100000000,
          whatsapp_contact: "3001234567",
        },
      ];

      const result = await service.validateAllRows(
        rows,
        ImportTableName.LISTINGS,
        ["listing_type", "price", "whatsapp_contact"],
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate real estate data correctly", async () => {
      const rows = [
        {
          name: "Inmobiliaria ABC",
          whatsapp: "3001234567",
          city: "Bogotá",
          state: "Cundinamarca",
        },
      ];

      const result = await service.validateAllRows(
        rows,
        ImportTableName.REAL_ESTATES,
        ["name", "whatsapp", "city", "state"],
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("processImport", () => {
    it("should process all rows in batches", async () => {
      const processingJob = { ...mockJob, status: ImportJobStatus.PENDING };
      vi.mocked(mockPort.getJobById)
        .mockResolvedValueOnce(processingJob) // Initial check
        .mockResolvedValueOnce(processingJob); // Cancel check

      const rows = Array.from({ length: 250 }, (_, i) => ({
        title: `Property ${i}`,
        property_type: "house",
        city: "Bogotá",
        state: "Cundinamarca",
      }));

      const result = await service.processImport(
        "job-123",
        rows,
        ImportTableName.PROPERTIES,
        "re-789",
        "user-456",
      );

      expect(mockPort.updateJobStatus).toHaveBeenCalledWith("job-123", ImportJobStatus.PROCESSING);
      expect(mockPort.completeJob).toHaveBeenCalled();
      expect(result.totalRows).toBe(250);
    });

    it("should throw error if job not found", async () => {
      vi.mocked(mockPort.getJobById).mockResolvedValue(null);

      const rows = [{ title: "Test", property_type: "house", city: "Bogotá", state: "Cund" }];

      await expect(
        service.processImport("non-existent", rows, ImportTableName.PROPERTIES, "re-789", "user-456"),
      ).rejects.toThrow("Job no encontrado");
    });

    it("should throw error if job is not pending", async () => {
      const completedJob = { ...mockJob, status: ImportJobStatus.COMPLETED };
      vi.mocked(mockPort.getJobById).mockResolvedValue(completedJob);

      const rows = [{ title: "Test", property_type: "house", city: "Bogotá", state: "Cund" }];

      await expect(
        service.processImport("job-123", rows, ImportTableName.PROPERTIES, "re-789", "user-456"),
      ).rejects.toThrow("El job no está en estado pendiente");
    });

    it("should stop processing if job is cancelled", async () => {
      const processingJob = { ...mockJob, status: ImportJobStatus.PENDING };
      const cancelledJob = { ...mockJob, status: ImportJobStatus.CANCELLED };
      
      // Mock getJobById to return processingJob first, then cancelledJob during batch processing
      vi.mocked(mockPort.getJobById)
        .mockResolvedValueOnce(processingJob) // Initial check in processImport
        .mockResolvedValueOnce(processingJob) // Start of batch iteration
        .mockResolvedValueOnce(cancelledJob); // Cancel check during batch

      const rows = Array.from({ length: 150 }, (_, i) => ({
        title: `Property ${i}`,
        property_type: "house",
        city: "Bogotá",
        state: "Cundinamarca",
      }));

      const result = await service.processImport(
        "job-123",
        rows,
        ImportTableName.PROPERTIES,
        "re-789",
        "user-456",
      );

      // Should have partial results since it stopped early
      expect(result.totalRows).toBe(150);
      expect(result.importedRows).toBeLessThan(150);
    });

    it("should process properties correctly", async () => {
      const processingJob = { ...mockJob, status: ImportJobStatus.PENDING };
      vi.mocked(mockPort.getJobById).mockResolvedValue(processingJob);

      const rows = [
        { title: "Casa 1", property_type: "house", city: "Bogotá", state: "Cundinamarca" },
        { title: "Casa 2", property_type: "apartment", city: "Medellín", state: "Antioquia" },
      ];

      await service.processImport(
        "job-123",
        rows,
        ImportTableName.PROPERTIES,
        "re-789",
        "user-456",
      );

      expect(mockPort.bulkInsertProperties).toHaveBeenCalled();
    });

    it("should process listings correctly", async () => {
      const processingJob = { ...mockJob, status: ImportJobStatus.PENDING, tableName: ImportTableName.LISTINGS };
      vi.mocked(mockPort.getJobById).mockResolvedValue(processingJob);

      const rows = [
        { listing_type: "sale", price: 100000000, whatsapp_contact: "3001234567" },
      ];

      await service.processImport(
        "job-123",
        rows,
        ImportTableName.LISTINGS,
        "re-789",
        "user-456",
      );

      expect(mockPort.bulkInsertListings).toHaveBeenCalled();
    });

    it("should process real estates correctly", async () => {
      const processingJob = { ...mockJob, status: ImportJobStatus.PENDING, tableName: ImportTableName.REAL_ESTATES };
      vi.mocked(mockPort.getJobById).mockResolvedValue(processingJob);

      const rows = [
        { name: "Inmobiliaria ABC", whatsapp: "3001234567", city: "Bogotá", state: "Cundinamarca" },
      ];

      await service.processImport(
        "job-123",
        rows,
        ImportTableName.REAL_ESTATES,
        "re-789",
        "user-456",
      );

      expect(mockPort.bulkInsertRealEstates).toHaveBeenCalled();
    });

    it("should track errors from bulk inserts", async () => {
      const processingJob = { ...mockJob, status: ImportJobStatus.PENDING };
      vi.mocked(mockPort.getJobById).mockResolvedValue(processingJob);
      vi.mocked(mockPort.bulkInsertProperties).mockResolvedValue({
        insertedIds: ["p1"],
        errors: [{ row: 2, column: "all", value: null, message: "DB error" }],
      });

      const rows = [
        { title: "Casa 1", property_type: "house", city: "Bogotá", state: "Cundinamarca" },
        { title: "Casa 2", property_type: "house", city: "Bogotá", state: "Cundinamarca" },
      ];

      const result = await service.processImport(
        "job-123",
        rows,
        ImportTableName.PROPERTIES,
        "re-789",
        "user-456",
      );

      expect(result.importedRows).toBe(1);
      expect(result.failedRows).toBe(1);
      expect(mockPort.completeJob).toHaveBeenCalledWith(
        "job-123",
        expect.objectContaining({ importedRows: 1, failedRows: 1 }),
        expect.any(Array),
      );
    });
  });

  describe("cancelJob", () => {
    it("should cancel a job successfully", async () => {
      const cancelledJob = { ...mockJob, status: ImportJobStatus.CANCELLED };
      vi.mocked(mockPort.cancelJob).mockResolvedValue(cancelledJob);

      const result = await service.cancelJob("job-123");

      expect(mockPort.cancelJob).toHaveBeenCalledWith("job-123");
      expect(result.status).toBe(ImportJobStatus.CANCELLED);
    });
  });
});
