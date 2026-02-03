export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface CreateUserDTO {
  email: string
  name: string
}
