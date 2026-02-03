"use client"

import { useState, useCallback } from "react"
import { ActionResult } from "./action-result"
import { ServerError } from "../errors/server-error"
import { handleActionResult } from "../forms/handle-action-result"
import { UseFormSetError } from "react-hook-form"

export function useActionMutation<TInput, TData>(
  action: (input: TInput) => Promise<ActionResult<TData>>
) {
  const [status, setStatus] =
    useState<"idle" | "pending" | "success" | "error">("idle")

  const [data, setData] = useState<TData>()
  const [error, setError] = useState<ServerError>()

  const execute = useCallback(async (input: TInput) => {
    setStatus("pending")
    setError(undefined)

    const result = await action(input)

    if (result.ok) {
      setData(result.data)
      setStatus("success")
    } else {
      setError(result.error)
      setStatus("error")
    }

    return result
  }, [action])

  const submit = async (
    input: TInput,
    form?: { setError: UseFormSetError<any> }
  ) => {
    const result = await execute(input)
    handleActionResult(result, { setError: form?.setError })
  }

  return {
    execute,
    submit,
    status,
    data,
    error,
    isPending: status === "pending",
    isError: status === "error",
    isSuccess: status === "success",
  }
}
