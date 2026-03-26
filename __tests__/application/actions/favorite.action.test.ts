import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// 1. Mock dependencies FIRST (these are hoisted)
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({})),
}));

vi.mock("@/shared/hooks/with-server-action", () => ({
  withServerAction: (fn: Function) => fn,
}));

vi.mock("@/infrastructure/shared/utils/lang", () => ({
  getLangServerSide: vi.fn(() => Promise.resolve("es")),
}));

vi.mock("@/i18n/router", () => ({
  createRouter: vi.fn(() => ({
    listings: () => "/listings",
    dashboard: () => "/dashboard",
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
  favoriteService: {
    toggle: vi.fn(),
    exists: vi.fn(),
    findByProfileId: vi.fn(),
  },
  listingService: {
    findById: vi.fn(),
  },
};

// 3. Import the module to test
// This will fail if appModule is not mocked, but we'll mock it in beforeAll
let toggleFavoriteAction: any;
let checkFavoriteAction: any;
let getUserFavoritesAction: any;

beforeAll(async () => {
  // Mock appModule before importing favorite.action.ts
  vi.doMock("@/application/modules/app.module", () => ({
    appModule: vi.fn().mockResolvedValue({
      sessionService: mocks.sessionService,
      favoriteService: mocks.favoriteService,
      listingService: mocks.listingService,
    }),
  }));

  // Mock favorite.action.ts to get the actual implementation (overrides components.tsx mock)
  vi.doMock("@/application/actions/favorite.action", async (importOriginal) => {
    const actual = await importOriginal();
    return actual;
  });

  // Now import the module
  const module = await import("../../../application/actions/favorite.action");
  toggleFavoriteAction = module.toggleFavoriteAction;
  checkFavoriteAction = module.checkFavoriteAction;
  getUserFavoritesAction = module.getUserFavoritesAction;
});

// 4. Import is done in beforeAll

describe("Favorite Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations if needed
    mocks.sessionService.getCurrentUserId.mockReset();
    mocks.favoriteService.toggle.mockReset();
    mocks.favoriteService.exists.mockReset();
    mocks.favoriteService.findByProfileId.mockReset();
    mocks.listingService.findById.mockReset();
  });

  describe("toggleFavoriteAction", () => {
    it("should toggle favorite successfully", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.listingService.findById.mockResolvedValue({ id: "listing-456" });
      mocks.favoriteService.toggle.mockResolvedValue(true);

      await toggleFavoriteAction("listing-456");

      expect(mocks.sessionService.getCurrentUserId).toHaveBeenCalled();
      expect(mocks.listingService.findById).toHaveBeenCalledWith("listing-456");
      expect(mocks.favoriteService.toggle).toHaveBeenCalledWith(
        "user-123",
        "listing-456",
      );
    });

    it("should throw error if user not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(toggleFavoriteAction("listing-456")).rejects.toThrow(
        "common:exceptions.unauthorized",
      );
    });

    it("should throw error if listing not found", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.listingService.findById.mockResolvedValue(null);

      await expect(toggleFavoriteAction("listing-456")).rejects.toThrow(
        "common:exceptions.data_not_found",
      );
    });
  });

  describe("checkFavoriteAction", () => {
    it("should return true if favorited", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.favoriteService.exists.mockResolvedValue(true);

      const result = await checkFavoriteAction("listing-456");

      expect(result).toEqual({ isFavorited: true });
      expect(mocks.favoriteService.exists).toHaveBeenCalledWith(
        "user-123",
        "listing-456",
      );
    });

    it("should return false if user not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      const result = await checkFavoriteAction("listing-456");

      expect(result).toEqual({ isFavorited: false });
    });
  });

  describe("getUserFavoritesAction", () => {
    it("should return user favorites", async () => {
      const favorites = [{ id: "1", listing_id: "listing-1" }];
      mocks.sessionService.getCurrentUserId.mockResolvedValue("user-123");
      mocks.favoriteService.findByProfileId.mockResolvedValue(favorites);

      const result = await getUserFavoritesAction();

      expect(result).toEqual({
        favorites,
        listingIds: ["listing-1"],
      });
      expect(mocks.favoriteService.findByProfileId).toHaveBeenCalledWith(
        "user-123",
      );
    });

    it("should throw error if user not authenticated", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(getUserFavoritesAction()).rejects.toThrow(
        "common:exceptions.unauthorized",
      );
    });
  });
});
