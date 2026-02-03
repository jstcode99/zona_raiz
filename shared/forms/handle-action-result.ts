import { ActionResult } from "../actions/action-result"
import { UseFormSetError } from "react-hook-form"

export function handleActionResult<T>(
  result: ActionResult<T>,
  options: { setError?: UseFormSetError<any> }
) {
  if (result.ok) return

  if (result.error.fieldErrors && options.setError) {
    Object.entries(result.error.fieldErrors).forEach(([field, messages]) => {
      options.setError(field as any, {
        message: messages[0],
      })
    })
  }
}
