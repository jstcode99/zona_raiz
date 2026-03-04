"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { createAgentModule } from "../containers/agent.container"
import { agentToggleSchema } from "../validation/agent.validation"
import { revalidatePath } from "next/cache"

export const addAgentAction = withServerAction(
    async (formData: FormData) => {
        const { useCases } = await createAgentModule()

        const { real_estate_id, profile_id } = 
        await agentToggleSchema.validate(Object.fromEntries(formData), { abortEarly: false })

        await useCases.addAgent(real_estate_id, profile_id)

        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${real_estate_id}`);
    }   
)

export const removeAgentAction = withServerAction(
    async (formData: FormData) => {
        const { useCases } = await createAgentModule()

        const { real_estate_id, profile_id } = 
        await agentToggleSchema.validate(Object.fromEntries(formData), { abortEarly: false })

        await useCases.removeAgent(real_estate_id, profile_id)

        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${real_estate_id}`);
    }
)