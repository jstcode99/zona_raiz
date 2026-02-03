import { ActionResult } from "./action-result"
import { ServerError } from "../errors/server-error"

export const ok = <T>(data?: T): ActionResult<T> => ({
  ok: true,
  data,
})

export const fail = (error: ServerError): ActionResult<never> => ({
  ok: false,
  error,
})