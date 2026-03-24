import { ProfilePort } from "@/domain/ports/profile.port";
import { EUserRole, ProfileEntity } from "@/domain/entities/profile.entity";
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export class ProfileService {
  constructor(
    private profilePort: ProfilePort,
    private lang: Lang = "es",
  ) {}

  searchProfilesByEmail(email: string) {
    return this.profilePort.searchProfilesByEmail(email);
  }

  getRoleByUserId(userId: string) {
    return this.profilePort.getRoleByUserId(userId);
  }

  getProfileByUserId(userId: string) {
    return this.profilePort.getProfileByUserId(userId);
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

  getAgentRoleInRealEstate(userId: string, realEstateId: string) {
    return this.profilePort.getAgentRoleInRealEstate(userId, realEstateId);
  }

  count(filters?: {
    start_date?: string;
    end_date?: string;
    real_estate_id?: string;
  }) {
    return this.profilePort.count(filters);
  }

  getCachedSearchProfilesByEmail(email: string) {
    return unstable_cache(
      async () => this.profilePort.searchProfilesByEmail(email),
      [CACHE_TAGS.USER.KEYS.SEARCH_BY_EMAIL(email)], // ← centralizado
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.EMAIL(email)],
      },
    )();
  }

  getCachedRoleByUserId(userId: string) {
    return unstable_cache(
      async () => this.profilePort.getRoleByUserId(userId),
      [CACHE_TAGS.USER.KEYS.ROLE_BY_USER(userId)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.USER.PRINCIPAL,
          CACHE_TAGS.USER.DETAIL(userId),
          CACHE_TAGS.USER.ROLE(userId),
        ],
      },
    )();
  }

  getCachedProfileByUserId(userId: string) {
    return unstable_cache(
      async () => this.profilePort.getProfileByUserId(userId),
      [CACHE_TAGS.USER.KEYS.BY_USER(userId)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.DETAIL(userId)],
      },
    )();
  }

  getCachedCount(filters?: {
    start_date?: string;
    end_date?: string;
    real_estate_id?: string;
  }) {
    return unstable_cache(
      async () => this.profilePort.count(filters),
      [CACHE_TAGS.USER.KEYS.COUNT(filters)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.COUNT],
      },
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string) {
    return unstable_cache(
      async () =>
        this.profilePort.count({ start_date: startDate, end_date: endDate }),
      [CACHE_TAGS.USER.KEYS.COUNT_DATE_RANGE(startDate, endDate)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.COUNT],
      },
    )();
  }
}
