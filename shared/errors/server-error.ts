export type FieldErrors = Record<string, string[]>

export interface ServerError {
  code: string
  message: string
  fieldErrors?: FieldErrors
}
