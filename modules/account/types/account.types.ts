export interface AccountProfileDTO {
  name: string
  last_name?: string
  phone?: string
}

export interface AccountProfileUpdateDTO {
  name: string
  last_name?: string
  phone?: string
}

export interface AccountUpdatePasswordDTO {
  old_password: string
  new_password: string
  confirm_password: string
}