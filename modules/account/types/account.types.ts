export interface AccountProfileDTO {
  ok: any
  name: string
  last_name?: string
  phone?: string
  avatar_url?: string | null
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

export interface AccountAvatarUpdateDTO {
  avatar: FileList | null
}