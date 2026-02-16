import * as yup from "yup"
import { UserRole } from "../Profile"


export const userRealStateSchema = yup.object({
  real_state_id: yup.string().required(),
})

export const userRoleStateSchema = yup.object({
  role: yup.mixed<UserRole>().required(),
})

export const userProfileBasicAdminSchema = yup.object({
  name: yup.string().required(),
  last_name: yup.string().nullable(),
  phone: yup.string().nullable(),
})

export const userProfileAdminSchema = yup
  .object({
    id: yup.string().uuid().required(),
  })
  .concat(userProfileBasicAdminSchema);

export const userRealStateAdminSchema = yup
  .object({
    id: yup.string().uuid().required(),
  })
  .concat(userRealStateSchema);

export const userRoleStateAdminSchema = yup
  .object({
    id: yup.string().uuid().required(),
  })
  .concat(userRoleStateSchema);

export const defaultUserProfileAdminValues = {
  name: "",
  last_name: "",
  phone: "",
}


export const defaultUserRoleProfileAdminValues = {
  role: UserRole.Agent,
}

export type UserProfileAdminFormData =
  typeof defaultUserProfileAdminValues

export const userRoleOptions = [
  { label: "Administrador", value: UserRole.Admin },
  { label: "Agente", value: UserRole.Agent },
  { label: "Cliente", value: UserRole.Client },
]
