import { nameSchema } from '@/domain/entities/fields/nameSchema'
import { phoneSchema } from '@/domain/entities/fields/phoneSchema'
import * as yup from 'yup'
import YupPassword from 'yup-password'
import { avatarSchema } from '../fields/avatarSchema'
YupPassword(yup)


export const profileSchema = yup.object({
  full_name: nameSchema,
  phone: phoneSchema,
})

export type ProfileFormValues = yup.InferType<typeof profileSchema>

export const defaultUserProfileValues = {
  full_name: "",
  phone: "",
}


export const profileAvatarSchema = yup.object({
  avatar: avatarSchema,
})
export type AvatarFormValues = yup.InferType<typeof profileAvatarSchema>

