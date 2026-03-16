"use server"

import { revalidatePath } from "next/cache"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { userSchema } from "../validation/user.validation"
import { idSchema } from "../validation/base/id.schema"
import { getLangServerSide } from "@/shared/utils/lang"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { appModule } from "../modules/app.module"

export const createUserAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide()
  const cookieStore = await cookies()
  const routes = createRouter(lang)

  const { userService } = await appModule(lang, { cookies: cookieStore })
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

  revalidatePath(routes.dashboard())
  revalidatePath(routes.users())
})

export const updateUserAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide()
  const cookieStore = await cookies()
  const routes = createRouter(lang)

  const { userService } = await appModule(lang, { cookies: cookieStore })

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

  revalidatePath(routes.users())
  revalidatePath(routes.user(id))
})

export const deleteUserAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide()
  const cookieStore = await cookies()
  const routes = createRouter(lang)

  const { userService } = await appModule(lang, { cookies: cookieStore })

  const id = await idSchema.validate(formData.get("id") ?? "", {
    abortEarly: false,
  })

  await userService.deleteUser(id)

  revalidatePath(routes.dashboard())
  revalidatePath(routes.users())
})

