"use client"

import { useState, useRef, useCallback, startTransition } from "react"
import { UseFormSetError } from "react-hook-form"

export type FieldError = {
  field?: string
  message: string
}

export type ActionResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error?: FieldError; errors?: FieldError[] }

type Status = "idle" | "pending" | "success" | "error"

type ServerAction<T> = (formData: FormData) => Promise<ActionResult<T>>

type Options<T> = {
  action: ServerAction<T>
  setError?: UseFormSetError<any>
  onSuccess?: (state: ActionResult<T>) => void
  onError?: (error: FieldError) => void
}

export function useServerMutation<T>({
  action,
  setError,
  onSuccess,
  onError,
}: Options<T>) {
  const [state, setState] = useState<ActionResult<T> | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [isPending, setIsPending] = useState(false)
  const hasSubmitted = useRef(false)

  const executeAction = useCallback((formData: FormData) => {
    hasSubmitted.current = true
    setStatus("pending")
    setIsPending(true)

    startTransition(() => {
      action(formData)
        .then(result => {
          setState(result)
          setIsPending(false)

          if (result.success) {
            setStatus("success")
            onSuccess?.(result)
            return
          }

          setStatus("error")

          const errors =
            result.errors ??
            (result.error ? [result.error] : [])

          errors.forEach(err => {
            onError?.(err)

            if (setError && err.field) {
              setError(err.field, {
                type: "server",
                message: err.message,
              })
            }
          })
        })
        .catch((error: any) => {
          setIsPending(false)
          setStatus("error")

          const fieldError: FieldError = {
            field: "root",
            message: error?.message || "Unexpected error occurred",
          }

          onError?.(fieldError)

          if (setError) {
            setError("root", {
              type: "server",
              message: fieldError.message,
            })
          }
        })
    })
  }, [action, setError, onSuccess, onError])

  const reset = useCallback(() => {
    setStatus("idle")
    setState(null)
    hasSubmitted.current = false
  }, [])

  return {
    action: executeAction,
    state,
    status,
    isIdle: status === "idle",
    isPending,
    isSuccess: status === "success",
    isError: status === "error",
    reset,
  }
}