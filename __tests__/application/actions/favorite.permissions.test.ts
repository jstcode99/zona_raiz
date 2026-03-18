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

vi.mock("@/shared/utils/lang", () => ({
  getLangServerSide: vi.fn(() => Promise.resolve("es")),
}));

vi.mock("@/i18n/router", () => ({
  createRouter: vi.fn(() => ({
    listings: () => "/es/listings",
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
  favoriteService: {
    toggle: vi.fn(),
    exists: vi.fn(),
    findByProfileId: vi.fn(),
    deleteByProfileAndListing: vi.fn(),
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

describe("Favorite Permissions (KRO-90)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessionService.getCurrentUserId.mockReset();
    mocks.favoriteService.toggle.mockReset();
    mocks.favoriteService.exists.mockReset();
    mocks.favoriteService.findByProfileId.mockReset();
    mocks.favoriteService.deleteByProfileAndListing.mockReset();
    mocks.listingService.findById.mockReset();
  });

  describe("Authenticated users can add favorites", () => {
    it("should allow authenticated user to toggle favorite (add)", async () => {
      const authenticatedUserId = "user-123";
      const listingId = "listing-456";

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.listingService.findById.mockResolvedValue({ id: listingId });
      mocks.favoriteService.toggle.mockResolvedValue(true); // true = added

      await toggleFavoriteAction(listingId);

      expect(mocks.favoriteService.toggle).toHaveBeenCalledWith(
        authenticatedUserId,
        listingId,
      );
    });

    it("should allow authenticated user to toggle favorite (remove)", async () => {
      const authenticatedUserId = "user-123";
      const listingId = "listing-456";

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.listingService.findById.mockResolvedValue({ id: listingId });
      mocks.favoriteService.toggle.mockResolvedValue(false); // false = removed

      await toggleFavoriteAction(listingId);

      expect(mocks.favoriteService.toggle).toHaveBeenCalledWith(
        authenticatedUserId,
        listingId,
      );
    });

    it("should reject unauthenticated user from adding favorites", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(toggleFavoriteAction("listing-456")).rejects.toThrow(
        "exceptions:unauthorized",
      );

      expect(mocks.favoriteService.toggle).not.toHaveBeenCalled();
    });
  });

  describe("Users can delete their favorites", () => {
    it("should allow authenticated user to delete their favorite", async () => {
      const authenticatedUserId = "user-123";
      const listingId = "listing-456";

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.listingService.findById.mockResolvedValue({ id: listingId }); // Add this line
      mocks.favoriteService.toggle.mockResolvedValue(false); // false = removed

      await toggleFavoriteAction(listingId);

      expect(mocks.favoriteService.toggle).toHaveBeenCalledWith(
        authenticatedUserId,
        listingId,
      );
    });

    it("should not allow deletion without authentication", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(toggleFavoriteAction("listing-456")).rejects.toThrow(
        "exceptions:unauthorized",
      );

      expect(
        mocks.favoriteService.deleteByProfileAndListing,
      ).not.toHaveBeenCalled();
    });
  });

  describe("Users cannot see other users favorites (RLS)", () => {
    it("should only return favorites for the authenticated user", async () => {
      const authenticatedUserId = "user-123";
      const userFavorites = [
        {
          id: "fav-1",
          listing_id: "listing-1",
          profile_id: authenticatedUserId,
        },
        {
          id: "fav-2",
          listing_id: "listing-2",
          profile_id: authenticatedUserId,
        },
      ];

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.favoriteService.findByProfileId.mockResolvedValue(userFavorites);

      const result = await getUserFavoritesAction();

      expect(result.favorites).toEqual(userFavorites);
      expect(result.listingIds).toEqual(["listing-1", "listing-2"]);
      expect(mocks.favoriteService.findByProfileId).toHaveBeenCalledWith(
        authenticatedUserId,
      );
    });

    it("should reject unauthenticated user from viewing favorites", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      await expect(getUserFavoritesAction()).rejects.toThrow(
        "exceptions:unauthorized",
      );

      expect(mocks.favoriteService.findByProfileId).not.toHaveBeenCalled();
    });

    it("should only check favorites for the authenticated user", async () => {
      const authenticatedUserId = "user-123";
      const listingId = "listing-456";

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.favoriteService.exists.mockResolvedValue(true);

      const result = await checkFavoriteAction(listingId);

      expect(result).toEqual({ isFavorited: true });
      expect(mocks.favoriteService.exists).toHaveBeenCalledWith(
        authenticatedUserId,
        listingId,
      );
    });

    it("should return false for unauthenticated user checking favorites", async () => {
      mocks.sessionService.getCurrentUserId.mockResolvedValue(null);

      const result = await checkFavoriteAction("listing-456");

      expect(result).toEqual({ isFavorited: false });
      expect(mocks.favoriteService.exists).not.toHaveBeenCalled();
    });
  });

  describe("RLS Policy Enforcement", () => {
    it("should pass correct user ID to favorite service (enforcing RLS)", async () => {
      const authenticatedUserId = "user-123";
      const listingId = "listing-456";

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.listingService.findById.mockResolvedValue({ id: listingId });
      mocks.favoriteService.toggle.mockResolvedValue(true);

      await toggleFavoriteAction(listingId);

      // The service should be called with the authenticated user's ID
      // Supabase RLS will enforce that this user can only access their own favorites
      expect(mocks.favoriteService.toggle).toHaveBeenCalledWith(
        authenticatedUserId,
        listingId,
      );
    });

    it("should verify user ownership before deletion", async () => {
      const authenticatedUserId = "user-123";
      const listingId = "listing-456";

      mocks.sessionService.getCurrentUserId.mockResolvedValue(
        authenticatedUserId,
      );
      mocks.listingService.findById.mockResolvedValue({ id: listingId });
      mocks.favoriteService.toggle.mockResolvedValue(false); // removal

      await toggleFavoriteAction(listingId);

      // The service should be called with the authenticated user's ID
      // Supabase RLS will enforce that the user can only delete their own favorites
      expect(mocks.favoriteService.toggle).toHaveBeenCalledWith(
        authenticatedUserId,
        listingId,
      );
    });
  });
});
