"use server"

import { handleError } from "@/application/errors/handle-error"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { profileAvatarSchema, profileSchema } from "../validation/profile.validation"
import { AppError } from "../errors/app.error"
import { revalidatePath } from "next/cache"
import { profileModule } from "../modules/profile.module"
import { sessionModule } from "../modules/session.module"

export const updateProfileAction = withServerAction(
    async (formData: FormData) => {
        try {
            const raw = Object.fromEntries(formData)

            const { full_name, phone } = await profileSchema.validate(raw, {
                abortEarly: false,
                stripUnknown: true,
            })

            const { profileService } = await profileModule()
            const { sessionService } = await sessionModule()

            const id = await sessionService.getCurrentUserId()

            if (!id) {
                throw new AppError("No autorizado", "RLS", 403)
            }

            await profileService.updateProfile(id, {
                full_name,
                phone,
            })

            revalidatePath("/dashboard/account")


        } catch (error) {
            handleError(error)
        }
    }
)

export const uploadAvatarAction = withServerAction(
    async (formData: FormData) => {
        try {
            const raw = Object.fromEntries(formData)

            const { avatar } = await profileAvatarSchema.validate(raw, {
                abortEarly: false,
                stripUnknown: true,
            })

            const { profileService } = await profileModule()
            const { sessionService } = await sessionModule()

            const id = await sessionService.getCurrentUserId()

            if (!id) {
                throw new AppError("No autorizado", "RLS", 403)
            }
            const url = await profileService.uploadAvatar(id, avatar)
            await profileService.updatePathAvatarProfile(id, url)

            revalidatePath("/dashboard/account")

        } catch (error) {
            handleError(error)
        }
    }
)