"use server";

import { SupabaseAuthAdapter } from "../supabase/supabase-auth.adapter";
import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { otpSchema } from "@/domain/entities/schemas/email-otp.schema";
import { OTP } from "@/domain/use-cases/otp.case";

export async function otpAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const { email } = await otpSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new OTP(
            new SupabaseAuthAdapter(),
        );

        await useCase.execute(email);

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "ValidationError") {
            return {
                success: false,
                error: {
                    field: "email",
                    message: error.message,
                },
            }
        }
        return { success: false }
    }
}