export class ApiError extends Error {
  code: number | string
  fields?: Record<string, string[]>

  constructor(
    code: number | string,
    message: string,
    fields?: Record<string, string[]>,
  ) {
    super(message)
    this.code = code
    this.fields = fields
  }
}
