import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// 1. Mock dependencies FIRST
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({})),
}));

vi.mock("@/shared/hooks/with-server-action", () => ({
  withServerAction: (fn: Function) => fn,
}));

vi.mock("@/shared/utils/lang", () => ({
  getLangServerSide: vi.fn(() => Promise.resolve("es")),
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
  importAdapter: {
    uploadFile: vi.fn(),
    parseFile: vi.fn(),
  },
  importJobService: {
    createJob: vi.fn(),
  },
};

// 3. Import the module to test
let uploadAndParseImportAction: any;

beforeAll(async () => {
  vi.doMock("@/application/modules/app.module", () => ({
    appModule: vi.fn().mockResolvedValue({
      sessionService: mocks.sessionService,
      cookiesService: mocks.cookiesService,
      importAdapter: mocks.importAdapter,
      importJobService: mocks.importJobService,
    }),
  }));

  const module = await import("@/application/actions/import/upload-and-parse.action");
  uploadAndParseImportAction = module.uploadAndParseImportAction;
});

describe("uploadAndParseImportAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessionService.getCurrentUserId.mockReset();
    mocks.cookiesService.getRealEstateId.mockReset();
    mocks.importAdapter.uploadFile.mockReset();
    mocks.importAdapter.parseFile.mockReset();
    mocks.importJobService.createJob.mockReset();
  });

  describe("authentication", () => {
    it("should throw error if user is not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      const formData = new FormData();
      const file = new File(["test content"], "test.csv", { type: "text/csv" });
      formData.append("file", file);
      formData.append("tableName", "properties");

      await expect(uploadAndParseImportAction(formData)).rejects.toThrow("exceptions.unauthorized");
    });

    it("should throw error if real estate not found", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue(null);

      const formData = new FormData();
      const file = new File(["test content"], "test.csv", { type: "text/csv" });
      formData.append("file", file);
      formData.append("tableName", "properties");

      await expect(uploadAndParseImportAction(formData)).rejects.toThrow(
        "exceptions.real-estate-not-found",
      );
    });
  });

  describe("file processing", () => {
    it("should upload file and create job with parsed data", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importAdapter.uploadFile.mockResolvedValue({
        fileId: "file-123",
        url: "https://storage.example.com/file.csv",
      });
      mocks.importAdapter.parseFile.mockResolvedValue({
        headers: ["title", "city"],
        rows: [["Casa", "Bogotá"]],
      });
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });

      const formData = new FormData();
      const file = new File(["title,city\nCasa,Bogotá"], "test.csv", { type: "text/csv" });
      formData.append("file", file);
      formData.append("tableName", "properties");

      await uploadAndParseImportAction(formData);

      expect(mocks.importAdapter.uploadFile).toHaveBeenCalled();
      expect(mocks.importAdapter.parseFile).toHaveBeenCalledWith("file-123");
      expect(mocks.importJobService.createJob).toHaveBeenCalledWith({
        userId: "user-123",
        realEstateId: "re-789",
        tableName: "properties",
        totalRows: 1,
        batchSize: 100,
        fileUrl: "https://storage.example.com/file.csv",
        originalFilename: "test.csv",
      });
    });

    it("should use default table name if not provided", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.cookiesService.getRealEstateId.mockResolvedValue("re-789");
      mocks.importAdapter.uploadFile.mockResolvedValue({
        fileId: "file-123",
        url: "https://storage.example.com/file.csv",
      });
      mocks.importAdapter.parseFile.mockResolvedValue({
        headers: ["title", "city"],
        rows: [["Casa", "Bogotá"]],
      });
      mocks.importJobService.createJob.mockResolvedValue({ id: "job-123" });

      const formData = new FormData();
      const file = new File(["test"], "test.csv", { type: "text/csv" });
      formData.append("file", file);
      // No tableName

      await uploadAndParseImportAction(formData);

      expect(mocks.importJobService.createJob).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: "properties",
        }),
      );
    });
  });
});
