import { UserRepository } from "@/modules/user/user.repository"
import { createSupabaseServerClient } from "../db/supabase.server"

export class SupabaseUserRepository implements UserRepository {

    async findByEmail(email: string) {
        const supabase = createSupabaseServerClient()

        const { data } = await (await supabase)
            .from("users")
            .select("*")
            .eq("email", email)
            .single()

        return data
    }

    async create(data: any) {
        const supabase = createSupabaseServerClient()

        const { data: user } = await (await supabase)
            .from("users")
            .insert(data)
            .select()
            .single()

        return user
    }
}
