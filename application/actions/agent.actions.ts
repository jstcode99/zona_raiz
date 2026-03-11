"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { agentModule } from "../modules/agent.module"
import { agentToggleSchema } from "../validation/agent.validation"
import { revalidatePath } from "next/cache"

export const addAgentAction = withServerAction(
    async (formData: FormData) => {
        const { agentService } = await agentModule()

        const { real_estate_id, profile_id } = 
        await agentToggleSchema.validate(Object.fromEntries(formData), { abortEarly: false })

        await agentService.addAgent (real_estate_id, profile_id)

        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${real_estate_id}`);
    }   
)

export const removeAgentAction = withServerAction(
    async (formData: FormData) => {
        const { agentService } = await agentModule()

        const { real_estate_id, profile_id } = 
        await agentToggleSchema.validate(Object.fromEntries(formData), { abortEarly: false })

        await agentService.removeAgent(real_estate_id, profile_id)

        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${real_estate_id}`);
    }
)