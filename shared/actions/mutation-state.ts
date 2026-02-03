import { ServerError } from "../errors/server-error"

export type MutationStatus = "idle" | "pending" | "success" | "error"

export interface MutationState<T> {
  status: MutationStatus
  data?: T
  error?: ServerError
}
