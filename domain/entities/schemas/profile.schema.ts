import * as yup from 'yup'
import YupPassword from 'yup-password'
import { nameSchema } from './base/name.schema'
import { phoneSchema } from './base/phone.schema'
import { avatarSchema } from './base/avatar.schema'
import i18next from 'i18next'
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
  avatar: avatarSchema.
    required(i18next.t('validations.required', {
      attribute: 'avatar'
    })),
})

export type AvatarFormValues = yup.InferType<typeof profileAvatarSchema>

