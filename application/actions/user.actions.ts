"use server"

import { revalidatePath } from "next/cache"
import { ROUTES } from "@/infrastructure/config/routes"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { userModule } from "../modules/user.module"
import { userSchema } from "../validation/user.validation"
import { idSchema } from "../validation/base/id.schema"
import { getLangServerSide } from "@/shared/utils/lang"

export const createUserAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide()
  const { userService } = await userModule(lang)

  const raw = Object.fromEntries(formData)

  const input = await userSchema.validate(raw, {
    abortEarly: false,
    stripUnknown: true,
  })

  await userService.createUser({
    email: input.email,
    full_name: input.full_name as string,
    role: input.role,
  })

  revalidatePath(`/dashboard/users`)
})

export const updateUserAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide()
  const { userService } = await userModule(lang)

  const id = await idSchema.validate(formData.get("id") ?? "", {
    abortEarly: false,
  })

  const raw = Object.fromEntries(formData)

  const input = await userSchema.validate(raw, {
    abortEarly: false,
    stripUnknown: true,
  })

  await userService.updateUser(id, {
    email: input.email,
    full_name: input.full_name,
    role: input.role,
  })

  revalidatePath(`/dashboard/users`)
  revalidatePath(`/dashboard/users/${id}`)
})

export const deleteUserAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide()
  const { userService } = await userModule(lang)

  const id = await idSchema.validate(formData.get("id") ?? "", {
    abortEarly: false,
  })

  await userService.deleteUser(id)

  revalidatePath(`/dashboard/users`)
})

