export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found for id ${userId}`)
    this.name = "UserNotFoundError"
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User already exists for email ${email}`)
    this.name = "UserAlreadyExistsError"
  }
}

