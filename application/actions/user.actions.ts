"use server"

import { revalidatePath } from "next/cache"
import { ROUTES } from "@/infrastructure/config/constants"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { createUserModule } from "@/application/containers/user.container"
import { userSchema } from "@/application/validation/user.validation"
import { idSchema } from "@/application/validation/base/id.schema"

export const createUserAction = withServerAction(async (formData: FormData) => {
  const { useCases } = await createUserModule()

  const raw = Object.fromEntries(formData)

  const input = await userSchema.validate(raw, {
    abortEarly: false,
    stripUnknown: true,
  })

  await useCases.createUser({
    email: input.email,
    full_name: input.full_name as string,
    role: input.role,
  })

  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}`)
})

export const updateUserAction = withServerAction(async (formData: FormData) => {
  const { useCases } = await createUserModule()

  const id = await idSchema.validate(formData.get("id") ?? "", {
    abortEarly: false,
  })

  const raw = Object.fromEntries(formData)

  const input = await userSchema.validate(raw, {
    abortEarly: false,
    stripUnknown: true,
  })

  await useCases.updateUser(id, {
    email: input.email,
    full_name: input.full_name,
    role: input.role,
  })

  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}`)
  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}/${id}`)
})

export const deleteUserAction = withServerAction(async (formData: FormData) => {
  const { useCases } = await createUserModule()

  const id = await idSchema.validate(formData.get("id") ?? "", {
    abortEarly: false,
  })

  await useCases.deleteUser(id)

  revalidatePath(`${ROUTES.DASHBOARD}${ROUTES.USERS}`)
})

