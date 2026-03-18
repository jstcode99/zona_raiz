import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies BEFORE importing the action
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
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

// Mock appModule - this is the tricky part
const mockAppModule = vi.fn();
vi.mock("@/application/modules/app.module", () => ({
  appModule: mockAppModule,
}));

// Now import the action AFTER mocking
import {
  toggleFavoriteAction,
  checkFavoriteAction,
  getUserFavoritesAction,
} from "../../../application/actions/favorite.action";

describe("Favorite Actions", () => {
  const mockSessionService = {
    getCurrentUserId: vi.fn(),
  };

  const mockFavoriteService = {
    toggle: vi.fn(),
    exists: vi.fn(),
    findByProfileId: vi.fn(),
  };

  const mockListingService = {
    findById: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppModule.mockResolvedValue({
      sessionService: mockSessionService,
      favoriteService: mockFavoriteService,
      listingService: mockListingService,
    });
  });

  describe("toggleFavoriteAction", () => {
    it("should toggle favorite successfully", async () => {
      mockSessionService.getCurrentUserId.mockResolvedValue("user-123");
      mockListingService.findById.mockResolvedValue({ id: "listing-456" });
      mockFavoriteService.toggle.mockResolvedValue(true);

      await toggleFavoriteAction("listing-456");

      expect(mockSessionService.getCurrentUserId).toHaveBeenCalled();
      expect(mockListingService.findById).toHaveBeenCalledWith("listing-456");
      expect(mockFavoriteService.toggle).toHaveBeenCalledWith(
        "user-123",
        "listing-456",
      );
    });

    it("should throw error if user not authenticated", async () => {
      mockSessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(toggleFavoriteAction("listing-456")).rejects.toThrow(
        "exceptions:unauthorized",
      );
    });

    it("should throw error if listing not found", async () => {
      mockSessionService.getCurrentUserId.mockResolvedValue("user-123");
      mockListingService.findById.mockResolvedValue(null);

      await expect(toggleFavoriteAction("listing-456")).rejects.toThrow(
        "exceptions:data_not_found",
      );
    });
  });

  describe("checkFavoriteAction", () => {
    it("should return true if favorited", async () => {
      mockSessionService.getCurrentUserId.mockResolvedValue("user-123");
      mockFavoriteService.exists.mockResolvedValue(true);

      const result = await checkFavoriteAction("listing-456");

      expect(result).toEqual({ isFavorited: true });
      expect(mockFavoriteService.exists).toHaveBeenCalledWith(
        "user-123",
        "listing-456",
      );
    });

    it("should return false if user not authenticated", async () => {
      mockSessionService.getCurrentUserId.mockResolvedValue(null);

      const result = await checkFavoriteAction("listing-456");

      expect(result).toEqual({ isFavorited: false });
    });
  });

  describe("getUserFavoritesAction", () => {
    it("should return user favorites", async () => {
      const favorites = [{ id: "1", listing_id: "listing-1" }];
      mockSessionService.getCurrentUserId.mockResolvedValue("user-123");
      mockFavoriteService.findByProfileId.mockResolvedValue(favorites);

      const result = await getUserFavoritesAction();

      expect(result).toEqual({
        favorites,
        listingIds: ["listing-1"],
      });
      expect(mockFavoriteService.findByProfileId).toHaveBeenCalledWith(
        "user-123",
      );
    });

    it("should throw error if user not authenticated", async () => {
      mockSessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(getUserFavoritesAction()).rejects.toThrow(
        "exceptions:unauthorized",
      );
    });
  });
});
