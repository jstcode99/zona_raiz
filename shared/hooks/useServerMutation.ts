"use client"

import { useState, useRef, useCallback, startTransition } from "react"
import { UseFormSetError } from "react-hook-form"

export type FieldError = {
  field?: string
  message: string
}

export type ActionResult =
  | { success: true; redirectUrl?: string }
  | { success: false; error?: FieldError }

type Status = "idle" | "pending" | "success" | "error"

// ✅ Server action sin prevState
type ServerAction = (formData: FormData) => Promise<ActionResult>

type Options = {
  action: ServerAction
  setError?: UseFormSetError<any>
  onSuccess?: (state: ActionResult) => void
  onError?: (error: FieldError) => void
}

export function useServerMutation({
  action,
  setError,
  onSuccess,
  onError,
}: Options) {
  const [state, setState] = useState<ActionResult | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [isPending, setIsPending] = useState(false)
  const hasSubmitted = useRef(false)

  // ✅ Llamada directa con startTransition
  const executeAction = useCallback((formData: FormData) => {
    hasSubmitted.current = true
    setStatus("pending")
    setIsPending(true)

    startTransition(async () => {
      try {
        const result = await action(formData)
        setState(result)
        setIsPending(false)

        if (result.success) {
          setStatus("success")
          onSuccess?.(result)
        } else {
          setStatus("error")
          if (result.error) {
            onError?.(result.error)
            if (setError && result.error.field) {
              setError(result.error.field, {
                type: "server",
                message: result.error.message,
              })
            }
          }
        }
      } catch (error: any) {
        setIsPending(false)
        setStatus("error")
        const fieldError = { 
          field: "root",
          message: error.message || "Unexpected error occurred" 
        }
        onError?.(fieldError)
        if (setError) {
          setError("root", { type: "server", message: fieldError.message })
        }
      }
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