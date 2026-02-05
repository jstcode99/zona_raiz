"use server"

import { withValidation } from "@/shared/actions/with-validations"
import { AccountAvatarUpdateDTO, AccountProfileUpdateDTO } from "@/modules/account/types/account.types"
import { updateAccountAvatarController, updateAccountProfileController } from "@/modules/account/controllers/account.controller"
import { accountAvatarSchema, accountSchema } from "@/types/schemas/account"
import { revalidatePath } from "next/cache"

export const updateAccountAction = withValidation<AccountProfileUpdateDTO, any>(
  accountSchema,
  async (input) => {
    const result = await updateAccountProfileController(input)
    if (!result.ok) {
      return result
    }
    return result
  }
)

export const updateAccountAvatarAction = withValidation<
  AccountAvatarUpdateDTO,
  any
>(
  accountAvatarSchema,
  async (input) => {
    const result = await updateAccountAvatarController(input)
    if (result.ok) {
      revalidatePath("/(dashboard)", "layout")
    }

    return result
  }
)