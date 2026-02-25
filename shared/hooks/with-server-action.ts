import { ActionResult } from "./use-server-mutation.hook"
import { toActionResult } from "./to-action-result"

export function withServerAction<T extends any[]>(
  fn: (...args: T) => Promise<void>
) {
  return async (...args: T): Promise<ActionResult> => {
    try {
      await fn(...args)
      return { success: true }
    } catch (error) {
      return toActionResult(error)
    }
  }
}