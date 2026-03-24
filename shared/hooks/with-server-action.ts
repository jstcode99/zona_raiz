import { ActionResult } from "./action-result";
import { toActionResult } from "./to-action-result";

export function withServerAction<T extends any[], D = void>(
  fn: (...args: T) => Promise<D>,
) {
  return async (...args: T): Promise<ActionResult<D>> => {
    try {
      const data = await fn(...args);

      // Si la función ya retornó un ActionResult (success: false), pasarlo directo
      if (data !== null && typeof data === "object" && "success" in data) {
        return data as unknown as ActionResult<D>;
      }

      return data === undefined
        ? ({ success: true } as ActionResult<D>)
        : ({ success: true, data } as ActionResult<D>);
    } catch (error) {
      return toActionResult(error) as ActionResult<D>;
    }
  };
}
