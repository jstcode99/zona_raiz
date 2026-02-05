import { SupabaseAccountRepository } from "../repositories/supabase-account.repository"
import { AccountService } from "../services/account.service"
import { ok, fail } from "@/shared/actions/action-helpers"
import { AccountAvatarUpdateDTO, AccountProfileUpdateDTO } from "../types/account.types"

const service = new AccountService(new SupabaseAccountRepository())

export async function getAccountProfileController() {
  try {
     const result = await service.getAccountProfile()
    return ok(result)
  } catch (e: any) {
    return fail({
      code: "AUTH_ERROR",
      message: e.message,
    })
  }
}

export async function updateAccountProfileController(data: AccountProfileUpdateDTO) {
  try {
    await service.updateAccountProfile(data)
    return ok()
  } catch (e: any) {
    return fail({
      code: "ACCOUNT_UPDATE_ERROR",
      message: e.message,
    })
  }
}

export async function updateAccountAvatarController(data: AccountAvatarUpdateDTO) {
  try {
    await service.updateAccountAvatar(data)
    return ok()
  } catch (e: any) {
    return fail({
      code: "ACCOUNT_AVATAR_UPDATE_ERROR",
      message: e.message,
    })
  }
}