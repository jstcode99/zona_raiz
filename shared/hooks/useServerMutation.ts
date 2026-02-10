"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { UseFormSetError } from "react-hook-form"

export type FieldError = {
  field?: string
  message: string
}

export type ActionResult =
  | { success: true }
  | { success: false; error?: FieldError }

type Status = "idle" | "pending" | "success" | "error"

type ServerAction<TState> = (
  prevState: TState,
  formData: FormData
) => Promise<TState>

type Options<TState extends ActionResult> = {
  action: ServerAction<TState>
  initialState: TState
  setError?: UseFormSetError<any>
  onSuccess?: () => void
}

export function useServerMutation<TState extends ActionResult>({
  action,
  initialState,
  setError,
  onSuccess,
}: Options<TState>) {
  const [state, formAction] = useActionState<TState, FormData>(
    action,
    initialState
  )

  const [status, setStatus] = useState<Status>("idle")
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (!hasSubmitted.current) return

    if (state.success) {
      setStatus("success")
      onSuccess?.()
      return
    }

    if (!state.success && state.error) {
      setStatus("error")

      if (setError) {
        const { field, message } = state.error
        setError(field ?? "root", {
          type: "server",
          message,
        })
      }
    }
  }, [state, setError, onSuccess])

  const actionWithStatus = async (formData: FormData) => {
    hasSubmitted.current = true
    setStatus("pending")
    return formAction(formData)
  }

  return {
    action: actionWithStatus,
    status,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  }
}
