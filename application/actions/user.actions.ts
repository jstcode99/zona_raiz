"use server"

import { revalidatePath } from "next/cache"
import { ROUTES } from "@/infrastructure/config/constants"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { userModule } from "../modules/user.module"
import { userSchema } from "../validation/user.validation"
import { idSchema } from "../validation/base/id.schema"

export const createUserAction = withServerAction(async (formData: FormData) => {
  const { userService } = await userModule()

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

  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}`)
})

export const updateUserAction = withServerAction(async (formData: FormData) => {
  const { userService } = await userModule()

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

  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}`)
  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}/${id}`)
})

export const deleteUserAction = withServerAction(async (formData: FormData) => {
  const { userService } = await userModule()

  const id = await idSchema.validate(formData.get("id") ?? "", {
    abortEarly: false,
  })

  await userService.deleteUser(id)

  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}`)
})

