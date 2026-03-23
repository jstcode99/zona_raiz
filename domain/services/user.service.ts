import { UserPort, ListUsersFilters } from "@/domain/ports/user.port";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export class UserService {
  constructor(
    private userPort: UserPort,
    private lang: Lang = "es",
  ) {}

  getUserById(userId: string) {
    return this.userPort.getUserById(userId);
  }

  getCachedUserById(userId: string) {
    return unstable_cache(
      async () => this.userPort.getUserById(userId),
      [CACHE_TAGS.USER.KEYS.BY_USER(userId)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.DETAIL(userId)],
      },
    )();
  }

  getUserByEmail(email: string) {
    return this.userPort.getUserByEmail(email);
  }

  getCachedUserByEmail(email: string) {
    return unstable_cache(
      async () => this.userPort.getUserByEmail(email),
      [CACHE_TAGS.USER.KEYS.USER_BY_EMAIL(email)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.EMAIL(email)],
      },
    )();
  }

  listUsers(filters?: ListUsersFilters) {
    return this.userPort.listUsers(filters);
  }

  getCachedListUsers(filters?: ListUsersFilters) {
    return unstable_cache(
      async () => this.userPort.listUsers(filters),
      [CACHE_TAGS.USER.KEYS.LIST(filters)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.USER.PRINCIPAL, CACHE_TAGS.USER.LIST],
      },
    )();
  }

  createUser(data: Parameters<UserPort["createUser"]>[0]) {
    return this.userPort.createUser(data);
  }

  updateUser(userId: string, data: Parameters<UserPort["updateUser"]>[1]) {
    return this.userPort.updateUser(userId, data);
  }

  updateUserRole(
    userId: string,
    role: Parameters<UserPort["updateUserRole"]>[1],
  ) {
    return this.userPort.updateUserRole(userId, role);
  }

  deleteUser(userId: string) {
    return this.userPort.deleteUser(userId);
  }
}
