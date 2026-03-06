import { cached } from "@/infrastructure/cache/cache"
import { createUserModule } from "@/application/containers/user.container"
import { ListUsersFilters } from "@/domain/user.port"

export const getUserById = cached(
  async function (id: string) {
    const { useCases } = await createUserModule()
    return useCases.getUserById(id)
  }
)

export const listUsers = cached(
  async function (filters?: ListUsersFilters) {
    const { useCases } = await createUserModule()
    return useCases.listUsers(filters)
  }
)

