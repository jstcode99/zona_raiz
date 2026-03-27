// ==========================================
// Properties Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedUser } from "../../types";
import { EUserRole } from "@/domain/entities/profile.entity";
import { raw } from "../sql-generator/sql-builder";

export function generateFakeUsers(count: number, role: EUserRole): SeedUser[] {
  return Array.from({ length: count }, (_, i) => ({
    instance_id: "00000000-0000-0000-0000-000000000000",
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    encrypted_password: raw("crypt('password123', gen_salt('bf'))"),
    email_confirmed_at: raw("current_timestamp"),
    recovery_sent_at: raw("current_timestamp"),
    last_sign_in_at: raw("current_timestamp"),
    raw_app_meta_data: { provider: "email", providers: ["email"] },
    raw_user_meta_data: {},
    created_at: raw("current_timestamp"),
    updated_at: raw("current_timestamp"),
    confirmation_token: "",
    email_change: "",
    email_change_token_new: "",
    recovery_token: "",
    role,
  }));
}
