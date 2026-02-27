export type FieldIssue = {
  field?: string
  message: string
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400,
    public readonly issues?: FieldIssue[]
  ) {
    super(message)
  }
}