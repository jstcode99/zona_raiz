"use server"

import { handleError } from "@/application/errors/handle-error"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { createProfileModule } from "../containers/profile.container"
import { profileAvatarSchema, profileSchema } from "../validation/profile.validation"
import { createSessionModule } from "../containers/session.container"
import { AppError } from "../errors/app.error"
import { revalidatePath } from "next/cache"

export const updateProfileAction = withServerAction(
    async (formData: FormData) => {
        try {
            const raw = Object.fromEntries(formData)

            const { full_name, phone } = await profileSchema.validate(raw, {
                abortEarly: false,
                stripUnknown: true,
            })

            const profileModule = await createProfileModule()
            const sessionModule = await createSessionModule()

            const id = await sessionModule.useCases.getCurrentUserId()

            if (!id) {
                throw new AppError("No autorizado", "RLS", 403)
            }

            await profileModule.useCases.updateProfile(id, {
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

            const profileModule = await createProfileModule()
            const sessionModule = await createSessionModule()

            const id = await sessionModule.useCases.getCurrentUserId()

            if (!id) {
                throw new AppError("No autorizado", "RLS", 403)
            }
            const url = await profileModule.useCases.uploadAvatar(id, avatar)
            await profileModule.useCases.updatePathAvatarProfile(id, url)

            revalidatePath("/dashboard/account")

        } catch (error) {
            handleError(error)
        }
    }
)