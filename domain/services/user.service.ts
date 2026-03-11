import { UserPort, ListUsersFilters } from "@/domain/ports/user.port";
import { unstable_cache } from "next/cache";

export class UserService {
  constructor(private userPort: UserPort) {}

  getUserById(userId: string) {
    return this.userPort.getUserById(userId);
  }

  getCachedUserById(userId: string) {
    return unstable_cache(
      async () => this.userPort.getUserById(userId),
      [`user:${userId}`],
      {
        revalidate: 300,
        tags: ["users", `user:${userId}`],
      }
    )();
  }

  getUserByEmail(email: string) {
    return this.userPort.getUserByEmail(email);
  }

  getCachedUserByEmail(email: string) {
    return unstable_cache(
      async () => this.userPort.getUserByEmail(email),
      [`user:email:${email}`],
      {
        revalidate: 300,
        tags: ["users", "user:email"],
      }
    )();
  }

  listUsers(filters?: ListUsersFilters) {
    return this.userPort.listUsers(filters);
  }

  getCachedListUsers(filters?: ListUsersFilters) {
    const cacheKey = filters ? `user:list:${JSON.stringify(filters)}` : "user:list";
    
    return unstable_cache(
      async () => this.userPort.listUsers(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["users", "user:list"],
      }
    )();
  }

  createUser(data: Parameters<UserPort["createUser"]>[0]) {
    return this.userPort.createUser(data);
  }

  updateUser(userId: string, data: Parameters<UserPort["updateUser"]>[1]) {
    return this.userPort.updateUser(userId, data);
  }

  updateUserRole(userId: string, role: Parameters<UserPort["updateUserRole"]>[1]) {
    return this.userPort.updateUserRole(userId, role);
  }

  deleteUser(userId: string) {
    return this.userPort.deleteUser(userId);
  }
}
