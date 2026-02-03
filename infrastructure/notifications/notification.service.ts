export class NotificationService {
  async userCreated(user: any) {
    // email, webhook, slack, etc
  }
}

export const notificationService = new NotificationService()
