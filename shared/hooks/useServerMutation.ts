"use client"

import { useActionState, useEffect, useRef, useState, useCallback } from "react"
import { UseFormSetError } from "react-hook-form"

export type FieldError = {
  field?: string
  message: string
}

export type ActionResult =
  | { success: true; redirectUrl?: string }
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
  onSuccess?: (state: TState) => void
  onError?: (error: FieldError) => void
  redirectOnSuccess?: string
}

export function useServerMutation<TState extends ActionResult>({
  action,
  initialState,
  setError,
  onSuccess,
  onError,
  redirectOnSuccess,
}: Options<TState>) {
  const [state, formAction, isPending] = useActionState<TState, FormData>(
    action,
    initialState
  )

  const [status, setStatus] = useState<Status>("idle")
  const hasSubmitted = useRef(false)

  // Reset status cuando cambia el estado (nueva acción)
  useEffect(() => {
    if (isPending) {
      setStatus("pending")
    }
  }, [isPending])

  useEffect(() => {
    if (!hasSubmitted.current) return

    if (state.success) {
      setStatus("success")
      onSuccess?.(state)
      return
    }

    if (!state.success && state.error) {
      setStatus("error")
      onError?.(state.error)

      if (setError) {
        const { field, message } = state.error
        setError(field ?? "root", {
          type: "server",
          message,
        })
      }
    }
  }, [state, setError, onSuccess, onError])

  // Wrapper que maneja el estado de envío
  const executeAction = useCallback((formData: FormData) => {
    hasSubmitted.current = true
    setStatus("pending")
    return formAction(formData)
  }, [formAction])

  // Reset manual del estado
  const reset = useCallback(() => {
    setStatus("idle")
    hasSubmitted.current = false
  }, [])

  return {
    action: executeAction,
    state,
    status,
    isIdle: status === "idle",
    isPending: status === "pending" || isPending, // Combina ambos estados
    isSuccess: status === "success",
    isError: status === "error",
    reset,
  }
}