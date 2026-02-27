export type SignUpData = {
  email: string
  password: string
  full_name: string
  phone: string
  type_register?: boolean
}

export interface AuthPort {
  signIn(email: string, password: string): Promise<{ userId: string }>
  signUp(data: SignUpData): Promise<void>
  sendOtp(email: string): Promise<void>
  exchangeCodeForSession(token: string): Promise<{ userId: string }>
  verifyOtp(token: string, type: string): Promise<{ userId: string }>
  signOut(): Promise<void>
}