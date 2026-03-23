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
  importJobService: {
    cancelJob: vi.fn(),
  },
};

// 3. Import the module to test
let cancelImportAction: any;

beforeAll(async () => {
  vi.doMock("@/application/modules/app.module", () => ({
    appModule: vi.fn().mockResolvedValue({
      sessionService: mocks.sessionService,
      importJobService: mocks.importJobService,
    }),
  }));
});

describe("cancelImportAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessionService.getCurrentUserId.mockReset();
    mocks.importJobService.cancelJob.mockReset();
  });

  describe("authentication", () => {
    it("should throw error if user is not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(cancelImportAction("job-123")).rejects.toThrow(
        "import:exceptions.unauthorized",
      );
    });
  });

  describe("cancellation", () => {
    it("should cancel job successfully", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.importJobService.cancelJob.mockResolvedValue({
        id: "job-123",
        status: "cancelled",
      });

      const result = await cancelImportAction("job-123");

      expect(mocks.importJobService.cancelJob).toHaveBeenCalledWith("job-123");
    });

    it("should revalidate cache after cancellation", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.importJobService.cancelJob.mockResolvedValue({
        id: "job-123",
        status: "cancelled",
      });

      await cancelImportAction("job-123");

      const { revalidatePath, revalidateTag } = await import("next/cache");
      expect(revalidateTag).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalled();
    });
  });
});
