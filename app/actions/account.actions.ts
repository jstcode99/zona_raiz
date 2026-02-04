"use server"

import { withValidation } from "@/shared/actions/with-validations"
import { AccountProfileUpdateDTO } from "@/modules/account/types/account.types"
import { updateAccountProfileController } from "@/modules/account/controllers/account.controller"
import { accountSchema } from "@/types/schemas/account"

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

