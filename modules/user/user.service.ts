import { UserRepository } from "./user.repository"
import { CacheService } from "@/infrastructure/cache/cache.service"
import { NotificationService } from "@/infrastructure/notifications/notification.service"
import { CreateUserDTO } from "./user.types"

export class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly cache: CacheService,
        private readonly notifications: NotificationService
    ) { }

    async createUser(data: CreateUserDTO) {
        const exists = await this.repository.findByEmail(data.email)
        if (exists) throw new Error("User already exists")

        const user = await this.repository.create(data)

        await this.cache.invalidate("users")
        await this.notifications.userCreated(user)

        return user
    }
}
