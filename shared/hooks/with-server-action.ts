import { ActionResult } from "./use-server-mutation.hook";
import { toActionResult } from "./to-action-result";

export function withServerAction<T extends any[], D = void>(
  fn: (...args: T) => Promise<D>,
) {
  return async (...args: T): Promise<ActionResult<D>> => {
    try {
      const data = await fn(...args);
      return data === undefined
        ? ({ success: true } as ActionResult<D>)
        : ({ success: true, data } as ActionResult<D>);
    } catch (error) {
      return toActionResult(error);
    }
  };
}
