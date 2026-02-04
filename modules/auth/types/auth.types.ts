export type IRole = "admin" | "agent" | "super-agent"

export interface AuthUser {
  id: string
  email: string
  role: IRole
}

export interface SignInDTO {
  email: string
  password: string
}

export interface SignUpDTO {
  email: string
  password: string
  name: string
  last_name?: string
  phone?: string
  captchaToken?: string
}