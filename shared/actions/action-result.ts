import { ServerError } from "@/shared/errors/server-error"

export type ActionResult<T> =
  | { ok: true; data?: T }
  | { ok: false; error: ServerError }