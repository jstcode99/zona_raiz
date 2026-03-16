import { ProfilePort } from "@/domain/ports/profile.port";
import { EUserRole, ProfileEntity } from "@/domain/entities/profile.entity";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";

export class ProfileService {
  constructor(private profilePort: ProfilePort, private lang: Lang = "es") { }

  searchProfilesByEmail(email: string) {
    return this.profilePort.searchProfilesByEmail(email);
  }

  getCachedSearchProfilesByEmail(email: string) {
    return unstable_cache(
      async () => this.profilePort.searchProfilesByEmail(email),
      [`profile:search:${email}`],
      {
        revalidate: 300,
        tags: ["profiles", "profile:search"],
      }
    )();
  }

  getRoleByUserId(userId: string) {
    return this.profilePort.getRoleByUserId(userId);
  }

  getCachedRoleByUserId(userId: string) {
    return unstable_cache(
      async () => this.profilePort.getRoleByUserId(userId),
      [`profile:role:${userId}`],
      {
        revalidate: 300,
        tags: ["profiles", `profile:${userId}`],
      }
    )();
  }

  getProfileByUserId(userId: string) {
    return this.profilePort.getProfileByUserId(userId);
  }

  getCachedProfileByUserId(userId: string) {
    return unstable_cache(
      async () => this.profilePort.getProfileByUserId(userId),
      [`profile:user:${userId}`],
      {
        revalidate: 300,
        tags: ["profiles", `profile:${userId}`],
      }
    )();
  }

  updateProfile(userId: string, data: Partial<ProfileEntity>) {
    return this.profilePort.updateProfile(userId, data);
  }

  updatePathAvatarProfile(userId: string, avatarUrl: string) {
    return this.profilePort.updatePathAvatarProfile(userId, avatarUrl);
  }

  uploadAvatar(userId: string, file: File) {
    return this.profilePort.uploadAvatar(userId, file);
  }

  updateRole(userId: string, role: EUserRole) {
    return this.profilePort.updateRole(userId, role);
  }

  count(filters?: { start_date?: string; end_date?: string; real_estate_id?: string }) {
    return this.profilePort.count(filters);
  }

  getAgentRoleInRealEstate(userId: string, realEstateId: string): Promise<{ role: string } | null> {
    return this.profilePort.getAgentRoleInRealEstate(userId, realEstateId);
  }

  getCachedCount(filters?: { start_date?: string; end_date?: string; real_estate_id?: string }) {
    const cacheKey = filters ? `profile:count:${JSON.stringify(filters)}` : "profile:count";

    return unstable_cache(
      async () => this.profilePort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["profiles", "profile-count"],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string) {
    const cacheKey = `profile:count:date-range:${startDate}:${endDate}`;

    return unstable_cache(
      async () => this.profilePort.count({ start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["profiles", "profile-count"],
      }
    )();
  }
}
