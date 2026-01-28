export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'UNKNOWN'

export interface ApiError {
  code: number | ApiErrorCode
  status: number
  message: string
  fields?: Record<string, string[]>
}
