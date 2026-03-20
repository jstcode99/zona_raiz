import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// 1. Mock dependencies FIRST
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({})),
}));

vi.mock("@/shared/hooks/with-server-action", () => ({
  withServerAction: (fn: Function) => fn,
}));

vi.mock("@/shared/utils/lang", () => ({
  getLangServerSide: vi.fn(() => Promise.resolve("es")),
}));

vi.mock("@/i18n/router", () => ({
  createRouter: vi.fn(() => ({
    properties: () => "/es/dashboard/properties",
    listings: () => "/es/dashboard/listings",
    realEstates: () => "/es/dashboard/real-estates",
    dashboard: () => "/es/dashboard",
  })),
}));

vi.mock("@/i18n/server", () => ({
  initI18n: vi.fn(() =>
    Promise.resolve({
      getFixedT: () => (key: string) => key,
    }),
  ),
}));

// 2. Define mock objects
const mocks = {
  sessionService: {
    getCurrentUserId: vi.fn(),
  },
  cookiesService: {
    getRealEstateId: vi.fn(),
  },
  importJobService: {
    createJob: vi.fn(),
    processImport: vi.fn(),
    getJob: vi.fn(),
    getUserJobs: vi.fn(),
    cancelJob: vi.fn(),
  },
};

// 3. Import the module to test
let confirmImportAction: any;

beforeAll(async () => {
  vi.doMock("@/application/modules/app.module", () => ({
    appModule: vi.fn().mockResolvedValue({
      sessionService: mocks.sessionService,
      cookiesService: mocks.cookiesService,
      importJobService: mocks.importJobService,
    }),
  }));

  const module = await import("@/application/actions/import/confirm-import.action");
  confirmImportAction = module.confirmImportAction;
});

describe("confirmImportAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessionService.getCurrentUserId.mockReset();
    mocks.cookiesService.getRealEstateId.mockReset();
    mocks.importJobService.createJob.mockReset();
    mocks.importJobService.processImport.mockReset();
  });

  describe("authentication", () => {
    it("should throw error if user is not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "city"]));
      formData.append("rows", JSON.stringify([["Casa", "Bogotá"]]));
      formData.append("tableName", "properties");

      await expect(confirmImportAction(formData)).rejects.toThrow("exceptions.unauthorized");
    });

    it("should throw error if real estate not found", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "city"]));
      formData.append("rows", JSON.stringify([["Casa", "Bogotá"]]));
      formData.append("tableName", "properties");

      await expect(confirmImportAction(formData)).rejects.toThrow("exceptions.real-estate-not-found");
    });
  });

  describe("validation", () => {
    it("should validate and transform row data correctly", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });
      mocks.importJobService.processImport.mockResolvedValue({
        totalRows: 1,
        importedRows: 1,
        failedRows: 0,
        duration: 1,
        createdIds: ["prop-1"],
      });

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "property_type", "city", "state"]));
      formData.append(
        "rows",
        JSON.stringify([["Casa en Bogotá", "house", "Bogotá", "Cundinamarca"]]),
      );
      formData.append("tableName", "properties");
      formData.append("fileUrl", "https://storage.example.com/file.xlsx");
      formData.append("originalFilename", "properties.xlsx");

      await confirmImportAction(formData);

      expect(mocks.importJobService.createJob).toHaveBeenCalledWith({
        userId: "user-123",
        realEstateId: "re-789",
        tableName: "properties",
        totalRows: 1,
        batchSize: 100,
        fileUrl: "https://storage.example.com/file.xlsx",
        originalFilename: "properties.xlsx",
      });
    });

    it("should convert numeric strings to numbers", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });
      mocks.importJobService.processImport.mockResolvedValue({
        totalRows: 1,
        importedRows: 1,
        failedRows: 0,
        duration: 1,
        createdIds: ["prop-1"],
      });

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "property_type", "city", "state", "bedrooms", "latitude"]));
      formData.append("rows", JSON.stringify([["Casa Test", "house", "Bogotá", "Cundinamarca", "3", "4.6097"]]));
      formData.append("tableName", "properties");

      await confirmImportAction(formData);

      expect(mocks.importJobService.processImport).toHaveBeenCalledWith(
        "job-123",
        expect.arrayContaining([
          expect.objectContaining({
            bedrooms: 3,
            latitude: 4.6097,
          }),
        ]),
        "properties",
        "re-789",
        "user-123",
      );
    });

    it("should use default table name if not provided", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });
      mocks.importJobService.processImport.mockResolvedValue({
        totalRows: 1,
        importedRows: 1,
        failedRows: 0,
        duration: 1,
        createdIds: ["prop-1"],
      });

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "property_type", "city", "state"]));
      formData.append("rows", JSON.stringify([["Casa Test", "house", "Bogotá", "Cundinamarca"]]));
      // No tableName provided

      await confirmImportAction(formData);

      expect(mocks.importJobService.createJob).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: "properties",
        }),
      );
    });
  });

  describe("import processing", () => {
    it("should process import after creating job", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });
      mocks.importJobService.processImport.mockResolvedValue({
        totalRows: 2,
        importedRows: 2,
        failedRows: 0,
        duration: 2,
        createdIds: ["prop-1", "prop-2"],
      });

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "property_type", "city", "state"]));
      formData.append(
        "rows",
        JSON.stringify([
          ["Casa 1", "house", "Bogotá", "Cundinamarca"],
          ["Casa 2", "apartment", "Medellín", "Antioquia"],
        ]),
      );
      formData.append("tableName", "properties");

      await confirmImportAction(formData);

      expect(mocks.importJobService.processImport).toHaveBeenCalledWith(
        "job-123",
        expect.any(Array),
        "properties",
        "re-789",
        "user-123",
      );
    });

    it("should revalidate cache for properties", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });
      mocks.importJobService.processImport.mockResolvedValue({
        totalRows: 1,
        importedRows: 1,
        failedRows: 0,
        duration: 1,
        createdIds: ["prop-1"],
      });

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["title", "property_type", "city", "state"]));
      formData.append("rows", JSON.stringify([["Casa Test", "house", "Bogotá", "Cundinamarca"]]));
      formData.append("tableName", "properties");

      await confirmImportAction(formData);

      const { revalidatePath, revalidateTag } = await import("next/cache");
      expect(revalidatePath).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalled();
    });

    it("should revalidate cache for listings", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });
      mocks.importJobService.processImport.mockResolvedValue({
        totalRows: 1,
        importedRows: 1,
        failedRows: 0,
        duration: 1,
        createdIds: ["list-1"],
      });

      const formData = new FormData();
      formData.append("headers", JSON.stringify(["listing_type", "price", "whatsapp_contact", "city", "state"]));
      formData.append("rows", JSON.stringify([["sale", "100000000", "3001234567", "Bogotá", "Cundinamarca"]]));
      formData.append("tableName", "listings");

      await confirmImportAction(formData);

      expect(mocks.importJobService.processImport).toHaveBeenCalled();
    });
  });
});
