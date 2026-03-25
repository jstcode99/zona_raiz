import { EUserRole } from "./profile.entity";

export interface UserEntity {
  id: string;
  email: string;
  full_name: string | null;
  role: EUserRole;
  created_at: string;
  phone?: string;
  updated_at: string;
}
