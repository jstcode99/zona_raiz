import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// 1. Mock dependencies FIRST
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({})),
}));

vi.mock("@/shared/utils/lang", () => ({
  getLangServerSide: vi.fn(() => Promise.resolve("es")),
}));

vi.mock("@/shared/hooks/to-action-result", () => ({
  toActionResult: vi.fn((error) => ({ success: false, error: error.message })),
}));

// 2. Define mock objects
const mocks = {
  sessionService: {
    getCurrentUserId: vi.fn(),
  },
  importJobService: {
    getJob: vi.fn(),
    getUserJobs: vi.fn(),
  },
};

// 3. Import the module to test
let getImportJobsAction: any;
let getImportJobByIdAction: any;

beforeAll(async () => {
  vi.doMock("@/application/modules/app.module", () => ({
    appModule: vi.fn().mockResolvedValue({
      sessionService: mocks.sessionService,
      importJobService: mocks.importJobService,
    }),
  }));

  const module = await import("@/application/actions/import/get-import-jobs.action");
  getImportJobsAction = module.getImportJobsAction;
  getImportJobByIdAction = module.getImportJobByIdAction;
});

describe("getImportJobsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessionService.getCurrentUserId.mockReset();
    mocks.importJobService.getUserJobs.mockReset();
  });

  describe("authentication", () => {
    it("should return error if user is not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      const result = await getImportJobsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Usuario no autenticado");
    });
  });

  describe("fetching jobs", () => {
    it("should return jobs for authenticated user", async () => {
      const mockJobs = [
        { id: "job-1", status: "completed" },
        { id: "job-2", status: "pending" },
      ];
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.importJobService.getUserJobs.mockResolvedValue(mockJobs);

      const result = await getImportJobsAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockJobs);
      expect(mocks.importJobService.getUserJobs).toHaveBeenCalledWith("user-123", 10);
    });

    it("should return empty array if no jobs exist", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.importJobService.getUserJobs.mockResolvedValue([]);

      const result = await getImportJobsAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });
});

describe("getImportJobByIdAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.importJobService.getJob.mockReset();
  });

  describe("fetching job by ID", () => {
    it("should return job if found", async () => {
      const mockJob = { id: "job-123", status: "processing" };
      mocks.importJobService.getJob.mockResolvedValue(mockJob);

      const result = await getImportJobByIdAction("job-123");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockJob);
      expect(mocks.importJobService.getJob).toHaveBeenCalledWith("job-123");
    });

    it("should return null if job not found", async () => {
      mocks.importJobService.getJob.mockResolvedValue(null);

      const result = await getImportJobByIdAction("non-existent");

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should return error result on exception", async () => {
      mocks.importJobService.getJob.mockRejectedValue(new Error("Database error"));

      const result = await getImportJobByIdAction("job-123");

      expect(result.success).toBe(false);
    });
  });
});
