import { describe, it, expect, vi, beforeEach } from "vitest";
import { FavoriteService } from "../../../domain/services/favorite.service";
import { FavoritePort } from "../../../domain/ports/favorite.port";
import { FavoriteEntity } from "../../../domain/entities/favorite.entity";

describe("FavoriteService", () => {
  let service: FavoriteService;
  let mockRepo: FavoritePort;

  beforeEach(() => {
    mockRepo = {
      all: vi.fn(),
      findById: vi.fn(),
      findByProfileId: vi.fn(),
      findByListingId: vi.fn(),
      exists: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteByProfileAndListing: vi.fn(),
      count: vi.fn(),
    };
    service = new FavoriteService(mockRepo);
  });

  describe("toggle", () => {
    it("should remove favorite if it exists", async () => {
      const profileId = "user-123";
      const listingId = "listing-456";

      vi.mocked(mockRepo.exists).mockResolvedValue(true);
      vi.mocked(mockRepo.deleteByProfileAndListing).mockResolvedValue();

      const result = await service.toggle(profileId, listingId);

      expect(mockRepo.exists).toHaveBeenCalledWith(profileId, listingId);
      expect(mockRepo.deleteByProfileAndListing).toHaveBeenCalledWith(
        profileId,
        listingId,
      );
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should add favorite if it does not exist", async () => {
      const profileId = "user-123";
      const listingId = "listing-456";

      vi.mocked(mockRepo.exists).mockResolvedValue(false);
      vi.mocked(mockRepo.create).mockResolvedValue({
        id: "new-id",
        profile_id: profileId,
        listing_id: listingId,
        created_at: new Date().toISOString(),
      });

      const result = await service.toggle(profileId, listingId);

      expect(mockRepo.exists).toHaveBeenCalledWith(profileId, listingId);
      expect(mockRepo.deleteByProfileAndListing).not.toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalledWith({
        profile_id: profileId,
        listing_id: listingId,
      });
      expect(result).toBe(true);
    });
  });

  describe("exists", () => {
    it("should return the result from repo", async () => {
      vi.mocked(mockRepo.exists).mockResolvedValue(true);

      const result = await service.exists("user-123", "listing-456");

      expect(result).toBe(true);
      expect(mockRepo.exists).toHaveBeenCalledWith("user-123", "listing-456");
    });
  });

  describe("findByProfileId", () => {
    it("should return favorites for a profile", async () => {
      const favorites: FavoriteEntity[] = [
        {
          id: "1",
          profile_id: "user-1",
          listing_id: "listing-1",
          created_at: "2024-01-01",
        },
      ];
      vi.mocked(mockRepo.findByProfileId).mockResolvedValue(favorites);

      const result = await service.findByProfileId("user-1");

      expect(result).toEqual(favorites);
      expect(mockRepo.findByProfileId).toHaveBeenCalledWith("user-1");
    });
  });
});
